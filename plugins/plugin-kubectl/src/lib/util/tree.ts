/*
 * Copyright 2020 IBM Corporation
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

import { Arguments, DiffState, i18n, TreeItem, TreeResponse, Table, ExecOptions } from '@kui-shell/core'

import { KubeOptions, withKubeconfigFrom } from '../../controller/kubectl/options'
import { KubeResource, hasEvents } from '../model/resource'
import { getCommandFromArgs } from './util'

export const deployedMode = 'deployed resources'
export const sourceMode = 'sources'
export const dryRunMode = 'dry run'

export interface KubeResourcesWithDiffState {
  originalResponse: KubeResource
  state?: DiffState
  changedResponse?: KubeResource
}

export interface DryRun {
  name: string
  kind: string
  state: DiffState
  response?: KubeResource
}

const strings = i18n('plugin-kubectl')
const KEYSEPARATER = '---'

function joinKey(keys: string[]) {
  return keys.join(KEYSEPARATER)
}

interface BucketValue {
  raw: string
  isIntermediate?: boolean
  modifiedRaw?: string
  diff: TreeItem['diff']
  id: string
  name: string
  extends: TreeItem['extends']
  eventArgs?: TreeItem['eventArgs']
  onclick?: string
  onclickOptions?: ExecOptions
  defaultExpanded?: boolean
}

interface Bucket {
  [key: string]: BucketValue
}

interface Buckets {
  all: Bucket
  tiers: Bucket
  tier: Bucket
  apps: Bucket
  app: Bucket
  kind: Bucket
  name: Bucket
  unlabeled: Bucket
}

function getArgsThatProducesEvents(
  cmd: string,
  args: Arguments<KubeOptions>,
  namespace: string
): BucketValue['eventArgs'] {
  const output = `--no-headers -o jsonpath='{.lastTimestamp}{"|"}{.involvedObject.name}{"|"}{.message}{"|"}{.involvedObject.apiVersion}{"|"}{.involvedObject.kind}{"|\\n"}'`
  const command = withKubeconfigFrom(
    args,
    `${cmd} get events -w -n ${namespace} ${output}`.replace(/^k(\s)/, 'kubectl$1')
  )

  return {
    command,
    schema: {
      nCol: 5,
      timestampCol: 0,
      nameCol: 1,
      messageCol: 2,
      apiVersionCol: 3,
      kindCol: 4
    }
  }
}

/**
 * 1. delete empty key
 * 2. merge unlabeled bucket to the top level for tree processing
 * 3. add id to the value in each bucket, e.g. app0,app1,app2
 *
 */
const postProcessBucket = (buckets: Buckets) => {
  const ids = {}
  Object.keys(buckets).forEach(key => {
    if (!buckets[key] || Object.keys(buckets[key]).length === 0) {
      delete buckets[key]
    } else {
      Object.entries(buckets[key]).forEach(([_key, _value]) => {
        const { name } = _value as BucketValue
        if (!ids[name]) {
          ids[name] = 1
        } else {
          ids[name] = ids[name] + 1
        }

        buckets[key][_key].id = `${name}${ids[name] > 1 ? ids[name] : ''}`
      })
    }
  })

  if (buckets.unlabeled && (buckets.tiers || buckets.apps)) {
    const topLevelBucketKey = Object.keys(buckets)[1]
    const newTopLevelBucket = Object.assign({}, buckets[topLevelBucketKey], buckets.unlabeled)
    Object.assign(buckets, { [topLevelBucketKey]: newTopLevelBucket })
    delete buckets.unlabeled
  }

  return buckets
}

/**
 * This function categorizes `resources` into buckets
 *
 */
async function categorizeResources(
  args: Arguments<KubeOptions>,
  namespace: string,
  resourcesWithState: KubeResourcesWithDiffState[],
  doEvents?: boolean
) {
  const cmd = getCommandFromArgs(args)
  const { safeDump } = await import('js-yaml')

  const buckets: Buckets = {
    all: {},
    tiers: {},
    tier: {},
    apps: {},
    app: {},
    unlabeled: {},
    kind: {},
    name: {}
  }

  await Promise.all(
    resourcesWithState.map(async ({ originalResponse, state, changedResponse }) => {
      const resource = originalResponse || changedResponse
      const kind = resource.kind
      const name = resource.metadata.name
      const raw = originalResponse ? originalResponse.kuiRawData || (await safeDump(originalResponse)) : ''
      const modifiedRaw =
        (state === DiffState.CHANGED || state === DiffState.ADDED) &&
        changedResponse &&
        (changedResponse.kuiRawData || (await safeDump(changedResponse)))

      const eventArgs = doEvents && hasEvents(resource) ? getArgsThatProducesEvents(cmd, args, namespace) : undefined

      const append = (
        bucket: Bucket,
        label: string,
        key: string,
        isIntermediate?: boolean,
        defaultExpanded?: boolean,
        onclick?: string,
        onclickOptions?: ExecOptions,
        diff?: DiffState
      ) => {
        if (!bucket[key]) {
          return Object.assign(bucket, {
            [key]: {
              raw,
              name: label,
              onclick,
              onclickOptions,
              extends: {
                kind: [kind],
                name: [name]
              },
              diff,
              isIntermediate,
              defaultExpanded,
              modifiedRaw,
              eventArgs
            }
          })
        } else {
          bucket[key].raw = !bucket[key].raw ? raw : `${bucket[key].raw}---\n${raw}`
          bucket[key].modifiedRaw = !bucket[key].modifiedRaw
            ? modifiedRaw
            : `${bucket[key].modifiedRaw}---\n${modifiedRaw}`
          bucket[key].extends.kind.push(kind)
          bucket[key].extends.name.push(name)
        }
      }

      append(buckets.all, strings('All Resources'), 'all')

      const allLabels: { app?: string; tier?: string } = {}
      const hasMatchLabels = resource.spec && resource.spec.selector && resource.spec.selector.matchLabels
      const hasLabels = resource.metadata.labels

      if (hasMatchLabels) {
        Object.assign(allLabels, resource.spec.selector.matchLabels)
      }
      if (hasLabels) {
        Object.assign(allLabels, resource.metadata.labels)
      }

      const supportedLabels = Object.entries(allLabels)
        .map(([key, value]) => {
          return key === 'app.kubernetes.io/name'
            ? ['app', value]
            : key === 'app.kubernetes.io/component'
            ? ['tier', value]
            : [key, value]
        })
        .filter(([key]) => key === 'app' || key === 'tier')
      const sortedLabels = supportedLabels.sort(([a]) => (a === 'tier' ? -1 : a === 'unlabel' ? 1 : 0))
      const tierIdx = sortedLabels.findIndex(([a]) => a === 'tier')
      const appIdx = sortedLabels.findIndex(([a]) => a === 'app')

      if (appIdx !== -1) {
        sortedLabels.splice(appIdx, 0, ['apps', strings('Apps')])
      }

      if (tierIdx !== -1) {
        sortedLabels.splice(tierIdx, 0, ['tiers', strings('Tiers')])
      }

      if (supportedLabels.length === 0) {
        sortedLabels.push(['unlabeled', strings('unlabeled')]) // use the tiers buckets for unlabeled resources
      }

      sortedLabels.push(['kind', resource.kind], ['name', resource.metadata.name])

      sortedLabels.forEach(([key, value], idx) => {
        const bucketId = joinKey(['all', sortedLabels.slice(0, idx + 1).join(KEYSEPARATER)])

        const isIntermediate = key === 'kind' || key === 'tiers' || key === 'apps' || key === 'unlabeled'
        const onclick = key === 'name' && withKubeconfigFrom(args, `${cmd} get ${kind} ${name} -n ${namespace} -o yaml`)
        const onclickOptions = key === 'name' && modifiedRaw && { data: { diff: modifiedRaw }, noHistory: true }
        const defaultExpanded = isIntermediate || key === 'tier'
        append(
          buckets[key],
          strings(value),
          bucketId,
          isIntermediate,
          defaultExpanded,
          onclick,
          onclickOptions,
          key === 'name' ? state : undefined
        )
      })
    })
  )

  return postProcessBucket(buckets)
}

/**
 * This is the function to transform buckets into `TreeDataItem[]`
 *
 */
function transformBucketsToTree(buckets: Buckets): TreeResponse['data'] {
  const levels = Object.keys(buckets)

  const next = (buckets: Buckets, idx: number, findNextBucketByKey?: string): TreeItem[] => {
    const findNextBucket = (idx: number, filterKey: string) => {
      if (levels[idx]) {
        if (!filterKey) {
          return Object.entries(buckets[levels[idx]])
        } else {
          const found = Object.entries(buckets[levels[idx]]).filter(([key]) => {
            const splits = key.split(`${filterKey}${KEYSEPARATER}`)
            return splits.length > 1 && !splits[1].includes(KEYSEPARATER)
          })

          return found.length !== 0 ? found : findNextBucket(idx + 1, filterKey)
        }
      }
    }

    const nextBucket = findNextBucket(idx, findNextBucketByKey)

    return !nextBucket || nextBucket.length === 0
      ? undefined
      : nextBucket.map(([key, _value], idx) => {
          const value = _value as BucketValue
          const children = next(buckets, idx + 1, key)
          return {
            id: value.id,
            name: value.name,
            hasBadge: value.isIntermediate,
            defaultExpanded: value.defaultExpanded,
            onclick: value.onclick,
            onclickOptions: value.onclickOptions,
            extends: value['extends'],
            diff: value.diff,
            eventArgs: value.eventArgs,
            children
          }
        })
  }

  if (buckets.tiers) {
    return next(buckets, 1)
  } else {
    const children = next(buckets, 1)
    const data = [
      {
        name: buckets.all.all.name,
        id: buckets.all.all.id,
        onclick: buckets.all.all.onclick,
        onclickOptions: buckets.all.all.onclickOptions,
        extends: buckets.all.all.extends,
        diff: buckets.all.all.diff,
        eventArgs: buckets.all.all.eventArgs,
        defaultExpanded: true,
        children
      }
    ]

    return data
  }
}

/**
 * This is the function to fetch templates as `MultiModalMode` with `TreeRespons`:
 * 1. it fetches raw inputs in a directory or a single file
 * 2. it categorizes and puts the raw inputs into four buckets
 * 3. it transforms the buckets into `TreeResponse` and returns a `MultiModalMode`
 *
 */
export async function getSources(args: Arguments<KubeOptions>, filepath: string) {
  const table = await args.tab.REPL.qexec<Table>(`ls -l ${filepath}`)
  table.body.forEach(row => (row.onclickIdempotent = true))
  return {
    mode: sourceMode,
    label: strings('sources'),
    content: table
  }
}

export async function doDryRunMode(
  args: Arguments<KubeOptions>,
  namespace: string,
  resourcesWithState: KubeResourcesWithDiffState[]
) {
  const dryRunBuckets = await categorizeResources(args, namespace, resourcesWithState, false)
  const data = transformBucketsToTree(dryRunBuckets)

  return {
    mode: dryRunMode,
    defaultMode: true,
    label: strings('dry run'),
    content: {
      apiVersion: 'kui-shell/v1' as const,
      kind: 'TreeResponse' as const,
      data,
      toolbarText: {
        type: 'info',
        text: strings('showDryRun', 'Offline')
      }
    }
  }
}

/**
 * This is the function to present the deployed resources as `MultiModalMode` with `TreeRespons`:
 * 1. it categorizes and puts the resources into four buckets
 * 3. it transforms the buckets into `TreeResponse` and returns a `MultiModalMode`
 *
 */
export async function doDeployedMode(
  args: Arguments<KubeOptions>,
  namespace: string,
  resourcesWithState: KubeResourcesWithDiffState[],
  hasChanges?: boolean
) {
  const deployedBuckets = await categorizeResources(args, namespace, resourcesWithState, true)
  const data = transformBucketsToTree(deployedBuckets)

  return {
    mode: deployedMode,
    label: strings('deployed resources'),
    content: {
      apiVersion: 'kui-shell/v1' as const,
      kind: 'TreeResponse' as const,
      data,
      toolbarText: {
        type: 'info',
        text: strings(`showDeployedResources`, hasChanges ? strings('pending changes') : strings('no pending changes'))
      }
    }
  }
}
