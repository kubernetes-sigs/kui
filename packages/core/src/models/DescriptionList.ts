/*
 * Copyright 2021 The Kubernetes Authors
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

import { ScalarResource } from './mmr/content-types'

export default interface DescriptionList {
  apiVersion: 'kui-shell/v1'
  kind: 'DescriptionList'

  spec: {
    groups: {
      /** The term being described */
      term: string

      /** The description of that term */
      description: number | boolean | string

      /** Optional help details for the term */
      termHelp?: {
        title: string
        description: number | boolean | string
      }
    }[]
  }
}

export function isDescriptionList(content: ScalarResource): content is DescriptionList {
  const dl = content as DescriptionList
  return (
    dl.apiVersion === 'kui-shell/v1' &&
    dl.kind === 'DescriptionList' &&
    typeof dl.spec === 'object' &&
    Array.isArray(dl.spec.groups) &&
    dl.spec.groups.length > 0 &&
    typeof dl.spec.groups[0].term === 'string' &&
    typeof dl.spec.groups[0].description !== 'undefined' &&
    (typeof dl.spec.groups[0].termHelp === 'undefined' ||
      (typeof dl.spec.groups[0].termHelp === 'object' &&
        typeof dl.spec.groups[0].termHelp.title === 'string' &&
        typeof dl.spec.groups[0].termHelp.description !== 'undefined'))
  )
}
