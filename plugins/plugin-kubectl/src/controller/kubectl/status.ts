/*
 * Copyright 2018 The Kubernetes Authors
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
  Tab,
  Table,
  Row,
  Cell,
  Watchable,
  Watcher,
  WatchPusher,
  WithSourceReferences,
  isTable,
  i18n,
  Util
} from '@kui-shell/core'

import toSourceRefs from './source'
import { getKindAndVersion } from './explain'
import { fqnOfRef, ResourceRef, versionOf } from './fqn'
import { initialCapital } from '../../lib/view/formatTable'
import statusDirect from '../client/direct/status'
import { Group } from '../client/direct/group'
import KubeOptions, {
  KubeOptions as Options,
  fileOf,
  fileOfWithDetail,
  kustomizeOf,
  getNamespace,
  getContextForArgv,
  isDryRun,
  withKubeconfigFrom
} from './options'
import { EventWatcher } from './watch/get-watch'
import KubeResource, { isJob } from '../../lib/model/resource'

import { fetchKusto, fetchFilesVFS } from '../../lib/util/fetch-file'

import TrafficLight from '../../lib/model/traffic-light'
import { isDone, FinalState } from '../../lib/model/states'

const strings = i18n('plugin-kubectl')
const debug = Debug('plugin-kubectl/controller/kubectl/status')

/** administartive core controllers that we want to ignore */
// const adminCoreFilter = '-l provider!=kubernetes'

/** administrative CRDs that we want to ignore */
// const adminCRDFilter = '-l app!=mixer,app!=istio-pilot,app!=ibmcloud-image-enforcement,app!=ibm-cert-manager'

type Resources = { resourcesToWaitFor: ResourceRef[] } & Partial<Pick<WithSourceReferences, 'kuiSourceRef'>>

/**
 * @param file an argument to `-f` or `-k`; e.g. `kubectl -f <file>`
 *
 */
async function getResourcesReferencedByFile(
  file: string | string[],
  args: Arguments<Options>,
  namespaceFromCommandLine: string
): Promise<Resources> {
  const { isFor } = fileOfWithDetail(args)
  const [{ loadAll }, raw] = await Promise.all([import('js-yaml'), fetchFilesVFS(args, file, true)])

  const models = Util.flatten(raw.map(_ => loadAll(_.data) as KubeResource[]))
  const resourcesToWaitFor = models
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

  return {
    resourcesToWaitFor,
    kuiSourceRef: toSourceRefs(raw, isFor)
  }
}

async function getResourcesReferencedByKustomize(
  kusto: string,
  args: Arguments<Options>,
  namespace: string
): Promise<Resources> {
  const [kuiSourceRef, { load }] = await Promise.all([fetchKusto(args, kusto), import('js-yaml')])

  const resourcesToWaitFor = await Promise.all(
    kuiSourceRef.templates
      .map(raw => load(raw.data))
      .map(async (resource: KubeResource) => {
        const { apiVersion, kind, metadata } = resource
        const { group, version } = versionOf(apiVersion)
        return {
          group,
          version,
          kind,
          name: metadata.name,
          namespace: metadata.namespace || namespace
        }
      })
  )

  return {
    kuiSourceRef,
    resourcesToWaitFor
  }
}

/**
 * @param argvRest the argv after `kubectl status`, with options stripped off
 *
 */
async function getResourcesReferencedByCommandLine(
  verb: string,
  argvRest: string[],
  namespace: string,
  finalState?: FinalState
): Promise<Resources> {
  // Notes: kubectl create secret <generic> <name> <-- the name is in a different slot :(
  const [kind, nameGroupVersion, nameAlt] = argvRest

  const isDelete = finalState === FinalState.OfflineLike
  if (isDelete) {
    // kubectl delete (ns [m1 m2 m2 m3])
    //                ^ argvRest       ^
    //                    ^ slice(1)  ^
    return {
      resourcesToWaitFor: argvRest
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
  } else if (verb === 'create') {
    const isCreateSecret = /secret(s)?/i.test(kind)
    if (isCreateSecret) {
      // ugh, the phrasing is different for creating secrets,
      // e.g. "create <kind> default <name>", rather than the usual
      // "create <kind> <name>"
      return {
        resourcesToWaitFor: [{ name: nameAlt, kind, namespace }]
      }
    } else {
      return {
        resourcesToWaitFor: argvRest
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
    }
  }

  const [name, group, version] = nameGroupVersion.split(/\./)
  return {
    resourcesToWaitFor: [{ group, version, kind, name, namespace }]
  }
}

/**
 * Has the resource represented by the given table Row reached its
 * desired final state?
 *
 */
export function isResourceReady(row: Row, finalState: FinalState) {
  const status = row.attributes.find(_ => /STATUS/i.test(_.key))
  if (status !== undefined) {
    // primary plan: use the STATUS column
    return isDone(status.value, finalState)
  } else {
    // backup plan: use the READY column, of the form nReady/nTotal
    const ready = row.attributes.find(_ => /READY/i.test(_.key))
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
          row.attributes.find(_ => /STATUS/i.test(_.key)) || row.attributes.find(_ => /READY/i.test(_.key))

        const rowForUpdate = clone(this.row)
        const statusAttr = rowForUpdate.attributes.find(({ key }) => /STATUS/i.test(key))
        statusAttr.value = newStatusAttr ? newStatusAttr.value : 'Ready'

        if (isReady) {
          statusAttr.css = this.finalState === FinalState.OnlineLike ? TrafficLight.Green : TrafficLight.Red
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
    private readonly args: Arguments<KubeOptions>,
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
    const dryRun = isDryRun(this.args)
    const anyNonDefaultNamespaces = this.resourcesToWaitFor.some(({ namespace }) => namespace !== 'default')

    this.initialBody = this.resourcesToWaitFor.map(ref => {
      const { group = '', version = '', kind, name, namespace } = ref

      return {
        name,
        onclick: `${this.command} get ${fqnOfRef(ref)} -o yaml`,
        onclickIdempotent: true,
        attributes: this.nsAttr(namespace, anyNonDefaultNamespaces).concat([
          {
            key: 'KIND',
            value: kind + (group.length > 0 ? `.${version}.${group}` : ''),
            outerCSS: '',
            css: ''
          },
          {
            key: 'STATUS',
            tag: 'badge',
            value: dryRun ? strings('Dry Run') : strings('Pending'),
            outerCSS: '',
            css: TrafficLight.Yellow
          }
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
      watch: dryRun ? undefined : this
    }
  }
}

export const doStatus = async (
  args: Arguments<Options>,
  verb: string,
  command: string,
  initialCrudResponse?: string,
  finalState?: FinalState,
  statusArgs?: string[],
  isWatchRequest = true
): Promise<string | Table> => {
  const namespace = await getNamespace(args)
  const file = fileOf(args)
  const kusto = kustomizeOf(args)

  try {
    const { resourcesToWaitFor, kuiSourceRef } = file
      ? await getResourcesReferencedByFile(file, args, namespace)
      : kusto
      ? await getResourcesReferencedByKustomize(kusto, args, namespace)
      : await getResourcesReferencedByCommandLine(
          verb,
          statusArgs || args.argvNoOptions.slice(args.argvNoOptions.indexOf(verb) + 1),
          namespace,
          finalState
        )
    debug('resourcesToWaitFor', resourcesToWaitFor)

    if (resourcesToWaitFor.length === 1) {
      const { group, version, kind, name } = resourcesToWaitFor[0]
      if (isJob({ apiVersion: `${group}/${version}`, kind })) {
        const watchJobs = withKubeconfigFrom(
          args,
          `${command || 'kubectl'} get ${kind}.${version}.${group} ${name} ${isWatchRequest ? '--watch' : ''}`
        )
        return args.REPL.qexec(watchJobs)
      }
    }

    // try handing off to direct/status
    try {
      const explainedResources = await Promise.all(
        resourcesToWaitFor.map(async _ =>
          Object.assign(_, {
            explainedKind: await getKindAndVersion(command || 'kubectl', args, _.kind)
          })
        )
      )
      const groups = explainedResources.reduce((groups, resource) => {
        const group = groups.find(
          _ =>
            _.namespace === resource.namespace &&
            _.explainedKind.kind === resource.explainedKind.kind &&
            _.explainedKind.version === resource.explainedKind.version
        )
        if (!group) {
          groups.push({
            names: [resource.name],
            namespace: resource.namespace,
            explainedKind: resource.explainedKind
          })
        } else if (!group.names.includes(resource.name)) {
          // potentially inefficient
          group.names.push(resource.name)
        }
        return groups
      }, [] as Group[])

      const everyGroupHasKind = groups.every(({ explainedKind }) => explainedKind && explainedKind.kind)

      if (everyGroupHasKind) {
        const response = await statusDirect(args, groups, finalState, command, file, isWatchRequest)
        if (response) {
          // then direct/status obliged!
          debug('using direct/status response')
          if (isTable(response)) {
            if (verb !== 'delete') {
              return Object.assign(response, { kuiSourceRef })
            } else {
              // no source refs for deletes
              return response
            }
          } else {
            return response.join('\n')
          }
        }
      }
    } catch (err) {
      console.error('Error with direct/status. Falling back on polling implementation.', err)
    }

    // if we got here, then direct/status either failed, or refused to
    // handle this use case; fall back to the old polling impl
    debug('backup plan: using old status poller')
    if (isWatchRequest) {
      return Object.assign(
        new StatusWatcher(
          args,
          args.tab,
          resourcesToWaitFor,
          finalState,
          `-n ${namespace} ${getContextForArgv(args)}`,
          command
        ).initialTable(),
        { kuiSourceRef: verb !== 'delete' ? kuiSourceRef : undefined } // see: for now no source refs, above
      )
    }
  } catch (err) {
    console.error('error constructing StatusWatcher', err)

    // the text that the create or delete emitted, i.e. the command that
    // initiated this status request
    if (isWatchRequest) {
      return initialCrudResponse
    }
  }
}
