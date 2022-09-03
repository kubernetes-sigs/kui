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

import { FormMap } from '../../table-to-map'
import { DescriptionList } from '@kui-shell/core'
import { Selector } from '../../../../model/resource'

export default function toDescriptionList(obj: Record<string, number | boolean | string> | FormMap): DescriptionList {
  return {
    apiVersion: 'kui-shell/v1',
    kind: 'DescriptionList',
    spec: {
      groups: Object.keys(obj).map(term => ({
        term,
        description: obj[term] === null ? 'null' : obj[term] !== undefined ? obj[term].toString() : ''
      }))
    }
  }
}

export function selectorToString(selector: Selector) {
  return !selector.matchLabels
    ? ''
    : Object.keys(selector.matchLabels)
        .map(key => `${key}=${selector.matchLabels[key]}`)
        .join(', ')
}
