/*
 * Copyright 2019-2020 IBM Corporation
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

import { basename } from 'path'
import {
  Arguments,
  CodedError,
  KResponse,
  DiffState,
  MultiModalResponse,
  Registrar,
  Table,
  TableStyle,
  isHeadless,
  i18n
} from '@kui-shell/core'

import flags from './flags'
import { exec } from './exec'
import RawResponse from './response'
import commandPrefix from '../command-prefix'
import doGetWatchTable from './watch/get-watch'
import extractAppAndName from '../../lib/util/name'
import { kindAndNamespaceOf, kindPart } from './fqn'
import { Explained, getKindAndVersion } from './explain'
import { getCommandFromArgs, formDashFileCommandFromArgs, removeLastAppliedConfig } from '../../lib/util/util'
import {
  deployedMode,
  getSources,
  doDeployedMode,
  doDryRunMode,
  dryRunMode,
  KubeResourcesWithDiffState
} from '../../lib/util/tree'
import { isUsage, doHelp } from '../../lib/util/help'
import {
  KubeOptions,
  isEntityRequest,
  isTableRequest,
  isDiffRequest,
  fileOf,
  formatOf,
  isWatchRequest,
  getNamespace,
  isTreeReq,
  fileOfWithDetail,
  withKubeconfigFrom,
  getNamespaceAsExpressed,
  getResourceNamesForArgv
} from './options'
import { stringToTable, KubeTableResponse, isKubeTableResponse, computeDurations } from '../../lib/view/formatTable'
import {
  KubeResource,
  isKubeResource,
  isKubeItems,
  sameResourceVersion,
  hasResourceVersion
} from '../../lib/model/resource'

import getDirect from '../client/direct/get'

const strings = i18n('plugin-kubectl')

/**
 * For now, we handle watch ourselves, so strip these options off the command line
 *
 */
function prepareArgsForGet(args: Arguments<KubeOptions>) {
  const stripThese = ['-w=true', '--watch=true', '--watch-only=true', '-w', '--watch', '--watch-only']

  const idx = args.command.indexOf(' get ') + ' get '.length
  const pre = args.command.slice(0, idx - 1)
  const post = args.command.slice(idx - 1)
  return pre + stripThese.reduce((cmd, strip) => cmd.replace(new RegExp(`(\\s)${strip}`), '$1'), post)
}

/**
 * `kubectl get` as a table response
 *
 */
export async function doGetAsTable(
  command: string,
  args: Arguments<KubeOptions>,
  response: RawResponse,
  verb = 'get',
  fullKind?: string
): Promise<KubeTableResponse> {
  const {
    content: { stderr, stdout }
  } = response

  const entityType = fullKind || args.argvNoOptions[args.argvNoOptions.indexOf(verb) + 1]

  const table = await stringToTable(stdout, stderr, args, command, verb, entityType)
  return computeDurations(table)
}

/**
 * `kubectl get --watch` as a table response, but for the special case
 * where there is nothing yet to display
 *
 */
/* function doGetEmptyWatchTable(args: Arguments<KubeOptions>): KubeTableResponse {
  const emptyTable = { body: [] }
  return initWatch(args, emptyTable)
} */

/**
 * `kubectl get` as entity response
 *
 */
export async function doGetAsEntity(
  args: Arguments<KubeOptions>,
  response: RawResponse
): Promise<KubeResource | RawResponse> {
  try {
    // this is the raw data string we get from `kubectl`
    const data = response.content.stdout
    const { safeLoad, safeDump } = await import('js-yaml')

    // parse the raw response; the parser we use depends on whether
    // the user asked for JSON or for YAML
    const resource = formatOf(args) === 'json' ? JSON.parse(data) : await safeLoad(data)

    const kuiResponse = Object.assign(resource, {
      isKubeResource: true,
      originatingCommand: args, // here, not in viewTransformer otherwise nested qexecs won't work
      kuiRawData: data
    })

    if (isKubeItems(kuiResponse)) {
      if (kuiResponse.items.length > 0) {
        // so that isPod() etc. work on the items
        await Promise.all(
          kuiResponse.items.map(async _ => {
            return Object.assign(_, {
              isKubeResource: true,
              originatingCommand: args, // here, not in viewTransformer otherwise nested qexecs won't work
              kuiRawData: await safeDump(_)
            })
          })
        )
      } else {
        return response
      }
    }

    return kuiResponse
  } catch (err) {
    console.error('error handling entity response; raw=', response.content.stdout)
    throw err
  }
}

/** Pretty-print creationTimestamp */
function creationTimestamp(resource: KubeResource) {
  return new Date(resource.metadata.creationTimestamp).toLocaleString()
}

/** ToolbarText presentation */
function toolbarText(resource: KubeResource) {
  const type = 'info' as const

  const hasTimestamp = resource.metadata.creationTimestamp !== undefined
  const hasVersion = hasResourceVersion(resource)

  if (hasTimestamp && hasVersion) {
    return {
      type,
      text: strings('createdOn=X resourceVersion=Y', creationTimestamp(resource), resource.metadata.resourceVersion)
    }
  } else if (hasTimestamp) {
    return { type, text: strings('createdOn', creationTimestamp(resource)) }
  } else if (hasVersion) {
    return { type, text: strings('resourceVersion=Y', creationTimestamp(resource), resource.metadata.resourceVersion) }
  }
}

/**
 * `kubectl get` as entity response
 *
 */
export async function doGetAsMMR(
  args: Arguments<KubeOptions>,
  resource: KubeResource
): Promise<MultiModalResponse<KubeResource>> {
  try {
    // attempt to separate out the app and generated parts of the resource name
    const { name: prettyName, nameHash, version } = extractAppAndName(resource)

    if (isKubeItems(resource)) {
      // then this is a response to e.g. `kubectl get pods -o yaml`
      return {
        apiVersion: resource.apiVersion,
        kind: resource.kind,
        metadata: {
          name: args.command,
          namespace: await getNamespace(args)
        },
        isSimulacrum: true, // this is not a real crudable resource
        originatingCommand: args,
        isKubeResource: true,
        modes: [],
        kuiRawData: resource.kuiRawData
      }
    }

    const doDiffMode = async () => {
      if (isDiffRequest(args)) {
        // NOTE: strings in the diff model could've been processed by js-yaml safedump.
        // To avoid redherring when comparing a raw yaml string and strings like the above,
        // we do safeload and safedump for both of them before sending to diff editor
        const { safeLoad, safeDump } = await import('js-yaml')
        const [_a, _b] = await Promise.all([safeLoad(resource.kuiRawData), safeLoad(args.execOptions.data['diff'])])
        const [a, b] = await Promise.all([safeDump(_a), safeDump(_b)])

        return {
          mode: 'diff',
          label: strings('sidecarLabelNewDiff'),
          content: { a: removeLastAppliedConfig(a), b: removeLastAppliedConfig(b) },
          contentType: 'yaml' as const
        }
      }
    }

    return Object.assign(resource, {
      prettyName,
      nameHash,
      version,
      comparator: sameResourceVersion,
      isKubeResource: true,
      toolbarText: toolbarText(resource),
      onclick: {
        kind: `kubectl get ${kindAndNamespaceOf(resource)}`,
        name: `kubectl get ${kindAndNamespaceOf(resource)} ${resource.metadata.name}`,
        namespace: resource.metadata.namespace ? `kubectl get ns ${resource.metadata.namespace} -o yaml` : undefined
      },
      defaultMode: isDiffRequest && 'diff',
      modes: [await doDiffMode()].filter(_ => _),
      kuiRawData: resource.kuiRawData // also include the raw, uninterpreted data string we got back
    })
  } catch (err) {
    console.error('error handling entity response', resource)
    throw err
  }
}

export async function doTreeMMR(
  args: Arguments<KubeOptions>,
  namespace: string,
  filepath: string,
  resourcesWithState: KubeResourcesWithDiffState[]
) {
  try {
    const applyCommand = formDashFileCommandFromArgs(args, namespace, filepath, 'apply')
    const isDeployed = resourcesWithState.every(({ originalResponse }) => {
      return (
        isKubeResource(originalResponse) &&
        (!isKubeItems(originalResponse) || (isKubeItems(originalResponse) && originalResponse.items.length !== 0))
      )
    })
    const hasChanges = resourcesWithState.findIndex(({ state }) => state === DiffState.CHANGED) !== -1
    const applyButton = (!isDeployed || hasChanges) && {
      mode: 'apply',
      label: hasChanges ? strings('Apply Changes') : strings('Deploy Application'),
      kind: 'drilldown' as const,
      command: applyCommand
    }

    return {
      kind: 'Resources',
      metadata: {
        name: basename(filepath),
        namespace
      },
      onclick: {
        kind: `open ${filepath}`,
        name: `open ${filepath}`,
        namespace: `kubectl get ns ${namespace} -o yaml`
      },
      defaultMode: isDeployed ? deployedMode : dryRunMode,
      modes: await Promise.all([
        getSources(args, filepath, isDeployed),
        isDeployed
          ? doDeployedMode(args, namespace, resourcesWithState, hasChanges)
          : doDryRunMode(args, namespace, resourcesWithState),
        applyButton
      ]).then(_ => _.filter(x => x))
    }
  } catch (err) {
    console.error(err)
    throw err
  }
}
/**
 * This is the handler of `kubectl get -f`, which returns
 * `MultiModalResponse` with three tabs:
 * 1. tree of templates
 * 2. tree of applied resources
 * 3. tree of apply-dry-run resources (TODO)
 *
 */
export async function doGetAsMMRTree(args: Arguments<KubeOptions>, filepath: string, resource: KubeResource) {
  try {
    const namespace = await getNamespace(args)
    const dryRunCommand = `${formDashFileCommandFromArgs(args, namespace, filepath, 'apply')} --dry-run=server`
    const [dryRunRaw, dryRunResponse] = await Promise.all([
      args.REPL.qexec<string>(dryRunCommand),
      args.REPL.qexec<KubeResource>(`${dryRunCommand} -o yaml`)
    ])

    const findInKubeResource = (kind: string, name: string, resource: KubeResource) => {
      if (isKubeResource(resource)) {
        if (isKubeItems(resource)) {
          return resource.items.find(_ => _.kind.toLowerCase() === kind && _.metadata.name === name)
        } else if (resource.metadata.name === name && resource.kind.toLowerCase() === kind) {
          return resource
        }
      }
    }

    let resourcesWithState: KubeResourcesWithDiffState[] =
      dryRunRaw.trim().length > 0 &&
      dryRunRaw
        .trim()
        .split(/\n/)
        .map(line => {
          const cells = line.replace(' (server dry run)', '').split(' ')
          if (cells.length >= 1) {
            const kind = cells[0].split('/')[0].split('.')[0] // e.g. deployment.apps/frontend; service/frontend created
            const name = cells[0].split('/')[1]

            const state = cells[1].includes('unchanged')
              ? DiffState.UNCHANGED
              : cells[1].includes('created')
              ? DiffState.ADDED
              : DiffState.CHANGED

            return {
              state,
              originalResponse: findInKubeResource(kind, name, resource),
              changedResponse: findInKubeResource(kind, name, dryRunResponse)
            }
          }
        })

    if (isKubeResource(resource)) {
      if (isKubeItems(resource) && resource.items.length !== 0) {
        resourcesWithState = resourcesWithState.concat(
          resource.items
            .filter(_ => !findInKubeResource(_.kind, _.metadata.name, dryRunResponse))
            .map(_ => {
              return {
                state: DiffState.DELETED,
                originalResponse: _
              }
            })
        )
      } else if (!findInKubeResource(resource.kind, resource.metadata.name, dryRunResponse)) {
        resourcesWithState.push({
          state: DiffState.DELETED,
          originalResponse: resource
        })
      }
    }

    return doTreeMMR(args, namespace, filepath, resourcesWithState)
  } catch (err) {
    console.error('error getting tree as MMR', err)
    throw err
  }
}

/**
 * kubectl get as custom response
 *
 */
function doGetCustom(args: Arguments<KubeOptions>, response: RawResponse): string {
  return response.content.stdout.trim()
}

async function rawGet(
  args: Arguments<KubeOptions>,
  _command: string,
  _kind: Promise<Explained> = fileOf(args)
    ? undefined
    : getKindAndVersion(_command, args, args.argvNoOptions[args.argvNoOptions.indexOf('get') + 1])
) {
  const command = _command === 'k' ? 'kubectl' : _command

  if ((command === 'oc' || command === 'kubectl') && !fileOf(args) && !args.argvNoOptions.includes('|')) {
    // try talking to the apiServer directly
    const response = await getDirect(args, _kind)
    if (response) {
      // that worked!
      return response
    }
  }

  // otherwise, use the kubectl CLI
  return exec(args, prepareArgsForGet, command).catch((err: CodedError) => {
    // Notes: we are using statusCode internally to this plugin;
    // delete it before rethrowing the error, because the core would
    // otherwise interpret the statusCode as being meaningful to the
    // outside world
    delete err.statusCode

    // trim? at least with 1.15 clients, e.g. `kubectl get all -l
    // app=foo` emits weird initial blank newlines
    err.message = err.message.trim()

    throw err
  })
}

/**
 *  Force Event Watcher to show the NAME column with Event ID
 *  This helps kui table watcher to distinguish the updated rows
 *
 */
const overrideEventCommand = (args: Arguments<KubeOptions>, output: string) => {
  if (output) {
    const cmd = args.command.replace(`${args.parsedOptions.o ? '-o' : '--output'} ${output}`, '-o wide')
    return args.REPL.qexec(cmd)
  } else {
    const cmd = `${args.command} -o wide`
    return args.REPL.qexec(cmd)
  }
}

/**
 * This is the main handler for `kubectl get`. Here, we act as a
 * dispatcher: in `kubectl` a `get` can mean either get-as-table,
 * get-as-entity, or get-as-custom, depending on the `-o` flag.
 *
 */
export const doGet = (command: string) =>
  async function doGet(args: Arguments<KubeOptions>): Promise<KResponse> {
    // first, peel off some special cases:
    if (isUsage(args)) {
      // special case: get --help/-h
      return doHelp(command, args, prepareArgsForGet)
    }

    // first, we do the raw exec of the given command
    const isTableReq = isTableRequest(args)
    const fullKind =
      isTableReq && !fileOf(args) // <-- don't call getKind for `get -f`
        ? getKindAndVersion(command, args, args.argvNoOptions[args.argvNoOptions.indexOf('get') + 1])
        : undefined

    if (!isHeadless() && isWatchRequest(args) && /custom-columns|jsonpath|go-template/.test(formatOf(args))) {
      // special case: get --watch/watch-only

      // special case of special case: kubectl -w get fails; even
      // though we could handle it, we have decided to keep parity
      // with kubectl's errors here
      if (!/^k(ubectl)?\s+-/.test(args.command)) {
        const output = formatOf(args)

        if (fullKind && (await fullKind).kind === 'Event' && output !== 'wide') {
          return overrideEventCommand(args, output)
        } else {
          return doGetWatchTable(args)
        }
      }
    }

    if (args.parsedOptions.limit) {
      args.command = args.command.replace(/--limit \d+/g, '')
      const idx = args.argv.indexOf('--limit')
      if (idx >= 0) {
        args.argv.splice(idx, 2)
      }
      if (!args.execOptions.data) {
        args.execOptions.data = { limit: args.parsedOptions.limit }
      }
    }

    // fetch raw yaml for tree request
    if (isTreeReq(args)) {
      args.command = `${args.command} -o yaml`
      args.parsedOptions.o = 'yaml'
    }

    const response = await rawGet(args, command, fullKind)

    if (isKubeTableResponse(response)) {
      return response
    } else if (response.content.code !== 0 && !isTableReq && response.content.stdout.length === 0) {
      // raw exec yielded an error!
      const err: CodedError = new Error(response.content.stderr)
      err.code = response.content.code
      throw err
    } else if (response.content.wasSentToPty) {
      return response.content.stdout
    } else if (isEntityRequest(args)) {
      // case 1: get-as-entity
      return doGetAsEntity(args, response)
    } else if (isTableReq) {
      // case 2: get-as-table
      return doGetAsTable(command, args, response, undefined, (await fullKind).kind)
    } else {
      return doGetCustom(args, response)
    }
  }

/** KubeResource -> MultiModalResponse view transformer */
export async function viewTransformer(
  args: Arguments<KubeOptions>,
  response: KResponse
): Promise<ReturnType<typeof doGetAsMMR> | Table> {
  if (isKubeResource(response)) {
    // -o yaml or -o json
    return doGetAsMMR(args, response)
  } else if (typeof response === 'string' && formatOf(args) === 'name') {
    // -o name
    const { version, kind } = await getKindAndVersion(
      getCommandFromArgs(args),
      args,
      args.argvNoOptions[args.argvNoOptions.indexOf('get') + 1]
    )
    return {
      style: TableStyle.Light,
      defaultPresentation: 'grid',
      allowedPresentations: ['grid'],
      body: response.split(/\n/).map(name => ({
        name,
        onclick: withKubeconfigFrom(args, `kubectl get ${kindPart(version, kind)} ${name} -o yaml`)
      }))
    }
  }
}

/** return the data in the execOptions as a diff mode */
function doGetAsMMRDiff(args: Arguments<KubeOptions>) {
  const kind = args.argvNoOptions[args.argvNoOptions.indexOf('get') + 1]
  const mode = {
    mode: 'diff',
    label: strings('sidecarLabelNewDiff'),
    content: args.execOptions.data['diff'],
    contentType: 'yaml' as const
  }

  return {
    apiVersion: 'kui-shell/v1',
    kind,
    metadata: {
      name: getResourceNamesForArgv(kind, args),
      namespace: getNamespaceAsExpressed(args)
    },
    toolbarText: {
      type: 'info',
      text: strings('drilldownNewDiff')
    },
    modes: [mode]
  }
}

/** KubeResource -> MultiModalResponse view transformer for `kubectl get` */
function viewTransformerForGet(args: Arguments<KubeOptions>, response: KubeResource) {
  // tranform getFile response to MMR with tree response
  const fileOf = fileOfWithDetail(args)
  if (fileOf.filepath) {
    return doGetAsMMRTree(args, fileOf.filepath, response)
  } else {
    if (!isKubeResource(response) && isDiffRequest(args) && typeof args.execOptions.data['diff'] === 'string') {
      return doGetAsMMRDiff(args)
    } else {
      return viewTransformer(args, response)
    }
  }
}

export const getFlags = Object.assign({}, flags, { viewTransformer: viewTransformerForGet })

/** Register a command listener */
export function getter(registrar: Registrar, command: string, cli = command) {
  registrar.listen(`/${commandPrefix}/${command}/get`, doGet(cli), getFlags)
}

export default (registrar: Registrar) => {
  getter(registrar, 'kubectl')
  getter(registrar, 'k', 'kubectl')
}
