/*
 * Copyright 2020 The Kubernetes Authors
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

import type { MultiModalResponse, ResourceWithMetadata } from '@kui-shell/core'

const apiVersion = 'kui-shell/v1'
const kind = 'File'

export default interface File extends ResourceWithMetadata {
  apiVersion
  kind
  spec: {
    /** file as specified by user */
    filepath: string

    /** absolute path to file */
    fullpath: string

    /** file length */
    size: number
  }
}

export function isFile(response: File | MultiModalResponse): response is File {
  return response.apiVersion === apiVersion && response.kind === kind
}
