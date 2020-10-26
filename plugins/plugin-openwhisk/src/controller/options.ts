/*
 * Copyright 2019 IBM Corporation
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

import { ParsedOptions } from '@kui-shell/core'

import { clientOptions } from '../client/get'

export interface ListOptions extends ParsedOptions {
  name?: string
  namespace?: string
  skip?: number
  limit?: number
  count?: boolean
}

/**
 * The openwhisk API does not accept "undefined" values for list
 * options. So, tediously, we need to do the null checks ourselves.
 *
 * @return dest, after insertion of non-null options
 */
export function copy(src: ListOptions, dest: ListOptions): ListOptions {
  if (src.name) {
    dest.name = src.name
  }

  if (src.namespace) {
    dest.namespace = src.namespace
  }

  if (src.skip !== undefined) {
    dest.skip = src.skip
  }

  if (src.limit !== undefined) {
    dest.limit = src.limit
  }

  if (src.count) {
    dest.count = src.count
  }

  return Object.assign(dest, clientOptions)
}

export function nameForList(name: string): { namespace: string; id: string } {
  // notes: strip off trailing slash, so that e.g. "action list foo/"
  // is treated as a request to list the actions in package "foo"
  const parts = name && name.replace(/\/$/, '').split('/')

  const ns = parts && parts.length >= 2 ? parts[1] : undefined
  const id = !parts ? undefined : parts.length === 1 ? `${parts[0]}/` : parts.length === 2 ? undefined : `${parts[2]}/`

  return { namespace: ns, id }
}
