/*
 * Copyright 2018-19 IBM Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import Debug from 'debug'
import {
  Abortable,
  Arguments,
  CodedError,
  Registrar,
  Tab,
  Table,
  Row,
  Cell,
  Watchable,
  Watcher,
  WatchPusher,
  i18n
} from '@kui-shell/core'

import { flags } from './flags'
import { fqnOfRef, ResourceRef, versionOf } from './fqn'
import { initialCapital } from '../../lib/view/formatTable'
import {
  KubeOptions as Options,
  fileOf,
  kustomizeOf,
  getNamespace,
  getContextForArgv,
  withKubeconfigFrom
} from './options'
import commandPrefix from '../command-prefix'
import { EventWatcher } from './watch/get-watch'
import KubeResource, { isJob } from '../../lib/model/resource'

import fetchFile, { fetchFileKustomize } from '../../lib/util/fetch-file'

import TrafficLight from '../../lib/model/traffic-light'
import { isDone, FinalState } from '../../lib/model/states'

const strings = i18n('plugin-kubectl')
const debug = Debug('plugin-kubectl/controller/kubectl/status')

/** administartive core controllers that we want to ignore */
// const adminCoreFilter = '-l provider!=kubernetes'

/** administrative CRDs that we want to ignore */
// const adminCRDFilter = '-l app!=mixer,app!=istio-pilot,app!=ibmcloud-image-enforcement,app!=ibm-cert-manager'

const usage = (command: string) => ({
  command,
  strict: command,
  docs: 'Check the deployment status of a set of resources',
  onlyEnforceOptions: true,
  optional: [
    {
      name: '--filename',
      alias: '-f',
      file: true,
      docs: 'A kubernetes resource file or kind'
    },
    {
      name: '--kustomize',
      alias: '-k',
      file: true,
      docs: 'A kustomize file or directory'
    },
    {
      name: 'resourceName',
      positional: true,
      docs: 'The name of a kubernetes resource of the given kind'
    },
    { name: '--final-state', hidden: true }, // when do we stop polling for status updates?
    { name: '--namespace', alias: '-n', docs: 'Inspect a specified namespace' },
    { name: '--all', alias: '-a', docs: 'Show status across all namespaces' },
    {
      name: '--multi',
      alias: '-m',
      docs: 'Display multi-cluster views as a multiple tables'
    },
    {
      name: '--response',
      docs: 'The initial response from the CRUD command'
    },
    {
      name: '--command',
      string: true,
      docs: 'The initial command from the CRUD command'
    },
    {
      name: '--watching',
      hidden: true,
      boolean: true,
      docs: 'internal use: called as part of the polling loop'
    },
    {
      name: '--watch',
      alias: '-w',
      boolean: true,
      docs: 'After listing/getting the requested object, watch for changes'
    }
  ],
  example: `kubectl ${command} @seed/cloud-functions/function/echo.yaml`
})

/**
 * @param file an argument to `-f` or `-k`; e.g. `kubectl -f <file>`
 *
 */
async function getResourcesReferencedByFile(file: string, args: Arguments<FinalStateOptions>): Promise<ResourceRef[]> {
  const [{ safeLoadAll }, raw] = await Promise.all([import('js-yaml'), fetchFile(args.REPL, file)])

  const namespaceFromCommandLine = await getNamespace(args)

  const models: KubeResource[] = safeLoadAll(raw)
  return models
    .filter(_ => _.metadata)
    .map(({ apiVersion, kind, metadata: { name, namespace = namespaceFromCommandLine } }) => {
      const { group, version } = versionOf(apiVersion)
      return {
        group,
        version,
        kind,
        name,
        namespace
      }
    })
}

/**
 * @param kusto a kustomize file spec
 *
 */
interface Kustomization {
  resources?: string[]
}
async function getResourcesReferencedByKustomize(
  kusto: string,
  args: Arguments<FinalStateOptions>
): Promise<ResourceRef[]> {
  const [{ safeLoad }, { join }, raw] = await Promise.all([
    import('js-yaml'),
    import('path'),
    fetchFileKustomize(args.REPL, kusto)
  ])

  const kustomization: Kustomization = safeLoad(raw.data)
  if (kustomization.resources) {
    const files = await Promise.all(
      kustomization.resources.map(resource => {
        return fetchFile(args.REPL, raw.dir ? join(raw.dir, resource) : resource)
      })
    )

    return await Promise.all(
      files
        .map(raw => safeLoad(raw[0]))
        .map(async resource => {
          const { apiVersion, kind, metadata } = resource
          const { group, version } = versionOf(apiVersion)
          return {
            group,
            version,
            kind,
            name: metadata.name,
            namespace: metadata.namespace || (await getNamespace(args))
          }
        })
    )
  }

  return []
}

/**
 * @param argvRest the argv after `kubectl status`, with options stripped off
 *
 */
async function getResourcesReferencedByCommandLine(
  argvRest: string[],
  args: Arguments<FinalStateOptions>
): Promise<ResourceRef[]> {
  // Notes: kubectl create secret <generic> <name> <-- the name is in a different slot :(
  const [kind, nameGroupVersion, nameAlt] = argvRest
  const namespace = await getNamespace(args)

  const isDelete = args.parsedOptions['final-state'] === FinalState.OfflineLike
  if (isDelete) {
    // kubectl delete (ns [m1 m2 m2 m3])
    //                ^ argvRest       ^
    //                    ^ slice(1)  ^
    return argvRest
      .slice(1)
      .map(nameGroupVersion => nameGroupVersion.split(/\./))
      .map(([name, group, version]) => ({
        group,
        version,
        kind,
        name,
        namespace
      }))
  }

  const isCreateSecret = !isDelete && /secret(s)?/i.test(kind)
  const [name, group, version] = isCreateSecret ? [nameAlt] : nameGroupVersion.split(/\./)

  return [{ group, version, kind, name, namespace }]
}

/**
 * Has the resource represented by the given table Row reached its
 * desired final state?
 *
 */
function isResourceReady(row: Row, finalState: FinalState) {
  const status = row.attributes.find(_ => _.key === 'STATUS')
  if (status !== undefined) {
    // primary plan: use the STATUS column
    return isDone(status.value, finalState)
  } else {
    // backup plan: use the READY column, of the form nReady/nTotal
    const ready = row.attributes.find(_ => _.key === 'READY')
    if (ready !== undefined) {
      const [nReady, nTotal] = ready.value.split(/\//)
      return nReady && nTotal && nReady === nTotal
    }
  }

  // heuristic: if we find neither a STATUS nor a READY column,
  // then assume it's ready; e.g. configmaps have this property
  return true
}

/**
 * The table push notification `update` routine assumes it has a copy of the rows.
 *
 */
function clone(row: Row): Row {
  const copy = Object.assign({}, row)
  copy.attributes = row.attributes.map(_ => Object.assign({}, _))
  return copy
}

class StatusPoller implements Abortable {
  private timer: NodeJS.Timeout

  public constructor(
    private readonly tab: Tab,
    private readonly ref: ResourceRef,
    private readonly row: Row,
    private readonly finalState: FinalState,
    private readonly done: () => void,
    private readonly pusher: WatchPusher,
    private readonly contextArgs: string,
    private readonly command: string,
    pollInterval = 1000,
    private readonly ladder = StatusPoller.calculateLadder(pollInterval)
  ) {
    this.pollOnce(0)
  }

  private async pollOnce(iter: number) {
    const sleepTime = iter < this.ladder.length ? this.ladder[iter] : this.ladder[this.ladder.length - 1]
    debug('pollOnce', this.ref, sleepTime, fqnOfRef(this.ref))

    try {
      const table = await this.tab.REPL.qexec<Table>(
        `${this.command} get ${fqnOfRef(this.ref)} ${this.contextArgs} -o wide`
      )
      debug('pollOnce table', table)
      if (table && table.body && table.body.length === 1) {
        const row = table.body[0]
        const isReady = isResourceReady(row, this.finalState)

        const newStatusAttr =
          row.attributes.find(_ => _.key === 'STATUS') || row.attributes.find(_ => _.key === 'READY')

        const rowForUpdate = clone(this.row)
        const statusAttr = rowForUpdate.attributes.find(({ key }) => key === 'STATUS')
        statusAttr.value = newStatusAttr ? newStatusAttr.value : 'Ready'

        if (isReady) {
          statusAttr.css = TrafficLight.Green
        }

        this.pusher.update(rowForUpdate)

        if (isReady) {
          debug('resource is ready', this.ref, this.row, newStatusAttr)
          this.done()
          return
        }
      } else {
        console.error('unexpected tabular response in poller', table)
      }
    } catch (error) {
      const err = error as CodedError
      if (err.code === 404 && this.finalState === FinalState.OfflineLike) {
        this.pusher.offline(this.ref.name)
        this.done()
        return
      }
    }

    this.timer = setTimeout(() => this.pollOnce(iter + 1), sleepTime)
  }

  /**
   * calculate the polling ladder
   *
   */
  private static calculateLadder(initial: number): number[] {
    // final polling rate (do not increase the interval beyond this!)
    let finalPolling = 5000
    try {
      finalPolling = require('@kui-shell/client/config.d/limits.json').tablePollingInterval
    } catch (err) {
      debug('using default tablePollingInterval', err)
    }

    const ladder = [initial]
    let current = initial

    // increment the polling interval
    while (current < finalPolling) {
      if (current < 1000) {
        current = current + 250 < 1000 ? current + 250 : 1000
        ladder.push(current)
      } else {
        ladder.push(current)
        current = current + 2000 < finalPolling ? current + 2000 : finalPolling
        ladder.push(current)
      }
    }

    // debug('ladder', ladder)
    return ladder
  }

  /**
   * Our impl of `Abortable`
   *
   */
  public abort() {
    if (this.timer) {
      clearTimeout(this.timer)
    }
  }
}

class StatusWatcher implements Abortable, Watcher {
  private readonly pollers: Abortable[] = []
  private ptyJob: Abortable[] = []
  private initialBody: Row[]

  // eslint-disable-next-line no-useless-constructor
  public constructor(
    private readonly args: Arguments<FinalStateOptions>,
    private readonly tab: Tab,
    private readonly resourcesToWaitFor: ResourceRef[],
    private readonly finalState: FinalState,
    private readonly contextArgs: string,
    private readonly command: string
  ) {}

  private abortEventWatchers() {
    if (this.ptyJob) {
      this.ptyJob.forEach(job => job.abort())
      this.ptyJob = []
    }
  }

  /**
   * Our impl of `Abortable` for use by the table view
   *
   */
  public abort() {
    this.pollers.forEach(poller => {
      if (poller) {
        // be careful: the done() method below may nullify
        // this.pollers[] entries
        poller.abort()
      }
    })

    if (this.ptyJob) {
      this.ptyJob.forEach(job => job.abort())
      this.ptyJob = []
    }
  }

  /**
   * Our impl of the `Watcher` API. This is the callback we will
   * receive from the table UI when it is ready for us to start
   * injecting updates to the table.
   *
   */
  public init(pusher: WatchPusher) {
    let countdown = this.resourcesToWaitFor.length
    const done = () => {
      if (--countdown === 0) {
        debug('all resources are ready')
        pusher.done()
        for (let idx = 0; idx < this.pollers.length; idx++) {
          this.pollers[idx] = undefined
        }

        if (this.ptyJob) {
          this.ptyJob.forEach(job => job.abort())
          this.ptyJob = []
        }
      }
    }

    this.resourcesToWaitFor
      .map((_, idx) => {
        const { kind, name, namespace } = _
        const eventWatcher = new EventWatcher(this.args, this.command, kind, [name], namespace, true, pusher)
        eventWatcher.init()
        this.ptyJob.push(eventWatcher)

        const row = this.initialBody[idx]
        return new StatusPoller(this.tab, _, row, this.finalState, done, pusher, this.contextArgs, this.command)
      })
      .forEach(_ => {
        this.pollers.push(_)
      })
  }

  /**
   * We only display a NAMESPACE column if at least one of the
   * resources as a non-default namespace.
   *
   */
  protected nsAttr(ns: string, anyNonDefaultNamespaces: boolean): Cell[] {
    return !anyNonDefaultNamespaces ? [] : [{ key: 'NAMESPACE', value: ns }]
  }

  /**
   * Formulate an initial response for the REPL
   *
   */
  public initialTable(): Table & Watchable {
    const anyNonDefaultNamespaces = this.resourcesToWaitFor.some(({ namespace }) => namespace !== 'default')

    this.initialBody = this.resourcesToWaitFor.map(ref => {
      const { group = '', version = '', kind, name, namespace } = ref

      return {
        name,
        onclick: `${this.command} get ${fqnOfRef(ref)} -o yaml`,
        onclickSilence: true,
        attributes: this.nsAttr(namespace, anyNonDefaultNamespaces).concat([
          {
            key: 'KIND',
            value: kind + (group.length > 0 ? `.${version}.${group}` : ''),
            outerCSS: '',
            css: ''
          },
          { key: 'STATUS', tag: 'badge', value: strings('Pending'), outerCSS: '', css: TrafficLight.Yellow }
          // { key: 'MESSAGE', value: '', outerCSS: 'hide-with-sidecar' }
        ])
      }
    })

    const initialHeader = {
      key: 'NAME',
      name: 'Name',
      attributes: this.initialBody[0].attributes.map(({ key, outerCSS }) => ({
        key,
        value: initialCapital(key),
        outerCSS
      }))
    }

    return {
      header: initialHeader,
      body: this.initialBody,
      watch: this
    }
  }
}

interface FinalStateOptions extends Options {
  command: string
  response?: string
  'final-state'?: FinalState
}

const doStatus = (command: string) => async (args: Arguments<FinalStateOptions>): Promise<string | Table> => {
  const rest = args.argvNoOptions.slice(args.argvNoOptions.indexOf('status') + 1)
  const commandArg = command || args.parsedOptions.command
  const file = fileOf(args)
  const kusto = kustomizeOf(args)
  const contextArgs = getContextForArgv(args)
  // const fileArgs = file ? `-f ${file}` : ''
  // const cmd = `${command} get ${rest} --watch ${fileArgs} ${contextArgs}`

  try {
    const resourcesToWaitFor = file
      ? await getResourcesReferencedByFile(file, args)
      : kusto
      ? await getResourcesReferencedByKustomize(kusto, args)
      : await getResourcesReferencedByCommandLine(rest, args)
    debug('resourcesToWaitFor', resourcesToWaitFor)

    if (resourcesToWaitFor.length === 1) {
      const { group, version, kind, name } = resourcesToWaitFor[0]
      if (isJob({ apiVersion: `${group}/${version}`, kind })) {
        const watchJobs = withKubeconfigFrom(
          args,
          `${command || 'kubectl'} get ${kind}.${version}.${group} ${name} --watch`
        )
        return args.REPL.qexec(watchJobs)
      }
    }

    /* if (nResourcesToWaitFor > 1) {
    // we don't yet support this; return whatever kubectl emitted from
    // the initial command
    return initialResponse
  } */

    // the desired final state of the specified resources
    const finalState = args.parsedOptions['final-state']

    return new StatusWatcher(args, args.tab, resourcesToWaitFor, finalState, contextArgs, commandArg).initialTable()
  } catch (err) {
    console.error('error constructing StatusWatcher', err)

    // the text that the create or delete emitted, i.e. the command that
    // initiated this status request
    const initialResponse = args.parsedOptions.response
    return initialResponse
  }
  /* return args.REPL.qexec(
    cmd,
    args.block,
    undefined,
    Object.assign({}, args.execOptions, {
      finalState,
      nResourcesToWaitFor,
      initialResponse
    })
  ) */
}

/**
 * Register the commands
 *
 */
export default (registrar: Registrar) => {
  const opts = Object.assign(
    {
      usage: usage('status')
    },
    flags(['watching'])
  )

  registrar.listen(`/${commandPrefix}/kubectl/status`, doStatus('kubectl'), opts)
  registrar.listen(`/${commandPrefix}/k/status`, doStatus('k'), opts)
  registrar.listen(`/${commandPrefix}/status`, doStatus(''), opts)
}
