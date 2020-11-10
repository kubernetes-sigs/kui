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

import { KubeOptions } from '../../controller/kubectl/options'
import { fetchRawFiles } from './fetch-file'
import { KubeResource, isKubeResource, isKubeItems } from '../model/resource'

const strings = i18n('plugin-kubectl')
const KEYSEPARATER = '---'

function joinKey(keys: string[]) {
  return keys.join(KEYSEPARATER)
}

interface BucketValue {
  raw: TreeItem['content']
  name: string
  parents: string[]
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

/**
 * This function categorizes `resources` into buckets
 *
 */
async function categorizeResources(resources: KubeResource[]) {
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

      const append = (bucket: Bucket, name: string, key?: string) => {
        if (!key) {
          return Object.assign(bucket, { raw, name, parents: [name] })
        } else if (!bucket[key]) {
          return Object.assign(bucket, { [key]: { raw, name } })
        } else {
          bucket[key].raw = !bucket[key].raw ? raw : `${bucket[key].raw}---\n${raw}`
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
          const _value = value as Bucket
          return {
            name: _value.name,
            id: key,
            content: _value.raw,
            contentType: 'yaml' as const,
            children: next(buckets, idx + 1, key)
          }
        })
  }

  const data = [
    {
      name: buckets.all.all.name,
      id: 'all',
      content: buckets.all.all.raw,
      contentType: 'yaml' as const,
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
export async function getSources(args: Arguments<KubeOptions>, filepath: string) {
  const raw = await fetchRawFiles(args, filepath)

  const { safeLoadAll } = await import('js-yaml')
  const resources: KubeResource[] = await safeLoadAll(raw)
  const buckets = await categorizeResources(resources)

  return {
    mode: 'sources',
    label: strings('sources'),
    content: {
      apiVersion: 'kui-shell/v1' as const,
      kind: 'TreeResponse' as const,
      data: transformBucketsToTree(buckets)
    }
  }
}

/**
 * This is the function to present the deployed resources as `MultiModalMode` with `TreeRespons`:
 * 1. it categorizes and puts the resources into four buckets
 * 3. it transforms the buckets into `TreeResponse` and returns a `MultiModalMode`
 *
 */
export async function getDeployedResources(resource: KubeResource) {
  if (isKubeResource(resource)) {
    const raw = isKubeItems(resource) ? resource.items : [resource]
    if (raw && raw.length !== 0) {
      const buckets = await categorizeResources(raw)

      return {
        mode: 'deployed resources',
        label: strings('deployed resources'),
        content: {
          apiVersion: 'kui-shell/v1' as const,
          kind: 'TreeResponse' as const,
          data: transformBucketsToTree(buckets)
        }
      }
    }
  }
}
