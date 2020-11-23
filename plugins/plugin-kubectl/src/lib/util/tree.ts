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

import { Arguments, i18n, TreeItem, TreeResponse } from '@kui-shell/core'

import { KubeOptions, withKubeconfigFrom } from '../../controller/kubectl/options'
import { fetchRawFiles } from './fetch-file'
import { KubeResource, isKubeItems, hasEvents, isKubeResource } from '../model/resource'
import { getCommandFromArgs } from './util'

export const deployedMode = 'deployed resources'
export const sourceMode = 'sources'
export const dryRunMode = 'dry run'

const strings = i18n('plugin-kubectl')
const KEYSEPARATER = '---'

function joinKey(keys: string[]) {
  return keys.join(KEYSEPARATER)
}

interface BucketValue {
  raw: TreeItem['content']
  isIntermediate?: boolean
  modifiedRaw?: TreeItem['content']
  willBeAdded?: boolean
  willBeDeleted?: boolean
  id: string
  name: string
  extends: TreeItem['extends']
  eventArgs?: TreeItem['eventArgs']
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

function getArgsThatProducesEvents(args: Arguments<KubeOptions>, namespace: string): BucketValue['eventArgs'] {
  const cmd = getCommandFromArgs(args)
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
  resources: KubeResource[],
  doEvents?: boolean
) {
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
    resources.map(async resource => {
      const kind = resource.kind
      const name = resource.metadata.name
      const raw = resource.kuiRawData ? resource.kuiRawData : await safeDump(resource)

      const eventArgs = doEvents && hasEvents(resource) ? getArgsThatProducesEvents(args, namespace) : undefined

      const append = (bucket: Bucket, label: string, key?: string, isIntermediate?: boolean) => {
        if (!key) {
          return Object.assign(bucket, {
            raw,
            name: label,
            extends: {
              kind: [kind],
              name: [name]
            },
            isIntermediate,
            eventArgs
          })
        } else if (!bucket[key]) {
          return Object.assign(bucket, {
            [key]: {
              raw,
              name: label,
              extends: {
                kind: [kind],
                name: [name]
              },
              isIntermediate,
              eventArgs
            }
          })
        } else {
          bucket[key].raw = !bucket[key].raw ? raw : `${bucket[key].raw}---\n${raw}`
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
        let commonPrefix = 'all'
        commonPrefix = joinKey(['all', sortedLabels.slice(0, idx + 1).join(KEYSEPARATER)])

        const isIntermediate = key === 'kind' || key === 'tiers' || key === 'apps' || key === 'unlabeled'
        append(buckets[key], strings(value), commonPrefix, isIntermediate)
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

  const next = (buckets: Buckets, idx: number, findNextBucketByKey?: string) => {
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
      : nextBucket.map(([key, value], idx) => {
          const {
            name,
            raw,
            eventArgs,
            modifiedRaw,
            willBeAdded,
            willBeDeleted,
            isIntermediate,
            id
          } = value as BucketValue
          return {
            id,
            name,
            hasBadge: isIntermediate,
            defaultExpanded: isIntermediate,
            extends: value['extends'],
            content: raw,
            contentType: 'yaml' as const,
            modifiedContent: modifiedRaw,
            willBeAdded,
            willBeDeleted,
            eventArgs,
            children: next(buckets, idx + 1, key)
          }
        })
  }

  const data = [
    {
      name: buckets.all.all.name,
      id: buckets.all.all.id,
      extends: buckets.all.all.extends,
      content: buckets.all.all.raw,
      contentType: 'yaml' as const,
      modifiedContent: buckets.all.all.modifiedRaw,
      eventArgs: buckets.all.all.eventArgs,
      defaultExpanded: true,
      children: next(buckets, 1)
    }
  ]

  console.error('data', data)
  return data
}

/**
 * This is the function to fetch templates as `MultiModalMode` with `TreeRespons`:
 * 1. it fetches raw inputs in a directory or a single file
 * 2. it categorizes and puts the raw inputs into four buckets
 * 3. it transforms the buckets into `TreeResponse` and returns a `MultiModalMode`
 *
 */
export async function getSources(
  args: Arguments<KubeOptions>,
  namesapce: string,
  filepath: string,
  isDeployed?: boolean
) {
  const raw = await fetchRawFiles(args, filepath)

  const { safeLoadAll } = await import('js-yaml')
  const resources: KubeResource[] = await safeLoadAll(raw)
  const buckets = await categorizeResources(args, namesapce, resources)

  return {
    mode: sourceMode,
    label: strings('sources'),
    content: {
      apiVersion: 'kui-shell/v1' as const,
      kind: 'TreeResponse' as const,
      data: transformBucketsToTree(buckets),
      toolbarText: {
        type: 'info',
        text: strings('showSource', isDeployed ? 'Live' : 'Offline')
      }
    }
  }
}

async function getBuckets(args: Arguments<KubeOptions>, namespace: string, resource: KubeResource, doEvents: boolean) {
  if (isKubeResource(resource)) {
    if (isKubeItems(resource) && resource.items.length !== 0) {
      return categorizeResources(args, namespace, resource.items, doEvents)
    } else {
      return categorizeResources(args, namespace, [resource], doEvents)
    }
  }
}

/** join the modifed buckets into the original one */
function joinBuckets(original: Buckets, modified: Buckets) {
  Object.keys(original).forEach(bucket => {
    Object.keys(original[bucket]).forEach(key => {
      if (modified[bucket] && modified[bucket][key]) {
        original[bucket][key].modifiedRaw = modified[bucket][key].raw
      } else {
        original[bucket][key].modifiedRaw = ''
        original[bucket][key].willBeDeleted = true
      }
    })
  })

  Object.keys(modified).forEach(bucket => {
    Object.keys(modified[bucket]).forEach(key => {
      if (!original[bucket]) {
        original[bucket] = {}
      }
      if (!original[bucket][key]) {
        original[bucket][key] = modified[bucket][key]
        original[bucket][key].willBeAdded = true
        original[bucket][key].modifiedRaw = modified[bucket][key].raw
        original[bucket][key].raw = ''
      }
    })
  })

  const sortedBuckets = {
    all: original.all,
    tiers: original.tiers,
    tier: original.tier,
    apps: original.apps,
    app: original.app,
    unlabeled: original.unlabeled,
    kind: original.kind,
    name: original.name
  }

  return postProcessBucket(sortedBuckets)
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
  deployedResource: KubeResource,
  applyCommand: string,
  dryRun?: KubeResource
) {
  const dryRunBuckets = dryRun ? await getBuckets(args, namespace, dryRun, false) : undefined
  const deployedBuckets = deployedResource ? await getBuckets(args, namespace, deployedResource, true) : undefined
  const applyButton = {
    mode: 'apply',
    label: strings('Apply Changes'),
    kind: 'drilldown' as const,
    command: applyCommand
  }

  if (dryRunBuckets) {
    if (deployedBuckets) {
      // join the `dryRunBuckets` as modifed to `deployedBucket`
      const joinedBuckets = joinBuckets(deployedBuckets, dryRunBuckets)
      const joinedData = transformBucketsToTree(joinedBuckets)

      return {
        mode: deployedMode,
        label: strings('deployed resources'),
        content: {
          apiVersion: 'kui-shell/v1' as const,
          kind: 'TreeResponse' as const,
          data: joinedData,
          toolbarText: {
            type: 'info',
            text: strings(`Showing deployed resources`)
          },
          toolbarButtons: [applyButton]
        }
      }
    } else {
      const dryRunData = transformBucketsToTree(dryRunBuckets)
      return {
        mode: dryRunMode,
        defaultMode: true,
        label: strings('dry run'),
        content: {
          apiVersion: 'kui-shell/v1' as const,
          kind: 'TreeResponse' as const,
          data: dryRunData,
          toolbarText: {
            type: 'info',
            text: strings('showDryRun', 'Offline')
          }
        }
      }
    }
  }
}
