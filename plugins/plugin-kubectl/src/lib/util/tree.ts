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

import { Arguments, Button, i18n, TreeItem, TreeResponse } from '@kui-shell/core'

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
  modifiedRaw?: TreeItem['content']
  willBeAdded?: boolean
  willBeDeleted?: boolean
  name: string
  extends: TreeItem['extends']
  eventArgs?: TreeItem['eventArgs']
}

interface Bucket {
  [key: string]: BucketValue
}

interface Buckets {
  all: Bucket
  labels: Bucket
  labeledResources: Bucket
  kind: Bucket
  name: Bucket
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
    labels: {},
    labeledResources: {},
    kind: {},
    name: {}
  }

  const unlabeled = {}

  await Promise.all(
    resources.map(async resource => {
      const kind = resource.kind
      const name = resource.metadata.name
      const raw = resource.kuiRawData ? resource.kuiRawData : await safeDump(resource)

      const eventArgs = doEvents && hasEvents(resource) ? getArgsThatProducesEvents(args, namespace) : undefined

      const append = (bucket: Bucket, label: string, key?: string) => {
        if (!key) {
          return Object.assign(bucket, {
            raw,
            name: label,
            extends: {
              kind: [kind],
              name: [name]
            },
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
      if (resource.metadata.labels) {
        Object.entries(resource.metadata.labels).map(([labelKey, labelValue]) => {
          let label = labelKey
          if (labelKey === 'app') {
            label = labelValue
            append(buckets.labels, label, label)
          } else if (labelKey === 'name') {
            label = 'unlabeled'
            append(unlabeled, strings('unlabeled'))
          } else {
            append(buckets.labels, label, label)
            append(buckets.labeledResources, labelValue, joinKey([labelKey, labelValue]))
          }

          append(buckets.kind, kind, joinKey([label, kind]))
          append(buckets.name, name, joinKey([label, kind, name]))
        })
      } else {
        append(unlabeled, strings('unlabeled'))
        append(buckets.kind, kind, joinKey(['unlabeled', kind]))
        append(buckets.name, name, joinKey(['unlabeled', kind, name]))
      }
    })
  )

  // Lastly, add unlabeled to bucket, to make sure it shows up at the end of the labels
  if (Object.keys(unlabeled).length !== 0) {
    Object.assign(buckets.labels, { unlabeled })
  }

  return buckets
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
        } else if (levels[idx + 1]) {
          return Object.entries(buckets[levels[idx + 1]]).filter(([key]) => key.includes(`${filterKey}${KEYSEPARATER}`))
        }
      }
    }

    const nextBucket = findNextBucket(idx, findNextBucketByKey)

    return !nextBucket || nextBucket.length === 0
      ? undefined
      : nextBucket.map(([key, value]) => {
          const { name, raw, eventArgs, modifiedRaw, willBeAdded, willBeDeleted } = value as BucketValue
          return {
            name,
            id: key,
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
      id: 'all',
      extends: buckets.all.all.extends,
      content: buckets.all.all.raw,
      contentType: 'yaml' as const,
      modifiedContent: buckets.all.all.modifiedRaw,
      eventArgs: buckets.all.all.eventArgs,
      defaultExpanded: true,
      children: next(buckets, 1)
    }
  ]

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
      if (modified[bucket][key]) {
        original[bucket][key].modifiedRaw = modified[bucket][key].raw
      } else {
        original[bucket][key].modifiedRaw = ''
        original[bucket][key].willBeDeleted = true
      }
    })
  })

  Object.keys(modified).forEach(bucket => {
    Object.keys(modified[bucket]).forEach(key => {
      if (!original[bucket][key]) {
        original[bucket][key] = modified[bucket][key]
        original[bucket][key].willBeAdded = true
        original[bucket][key].modifiedRaw = modified[bucket][key].raw
        original[bucket][key].raw = ''
      }
    })
  })
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
  dryRun?: KubeResource,
  applyButton?: Button
) {
  const dryRunBuckets = dryRun ? await getBuckets(args, namespace, dryRun, false) : undefined
  const deployedBuckets = deployedResource ? await getBuckets(args, namespace, deployedResource, true) : undefined

  if (dryRunBuckets) {
    if (deployedBuckets) {
      // join the `dryRunBuckets` as modifed to `deployedBucket`
      joinBuckets(deployedBuckets, dryRunBuckets)
      const deployedData = transformBucketsToTree(deployedBuckets)

      return {
        mode: deployedMode,
        label: strings('deployed resources'),
        content: {
          apiVersion: 'kui-shell/v1' as const,
          kind: 'TreeResponse' as const,
          data: deployedData,
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
