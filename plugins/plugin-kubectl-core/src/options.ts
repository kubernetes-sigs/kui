/*
 * Copyright 2019 The Kubernetes Authors
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

export type EntityFormat = 'yaml' | 'json'
export type TableFormat = 'wide' | string // want: 'custom-columns-file=' | 'custom-columns='
export type CustomFormat = string // want: 'go-template' | 'go-template-file' | 'jsonpath' | 'jsonpath-file'
export type OutputFormat = EntityFormat | TableFormat | CustomFormat

/** An incomplete set of kubectl options */
interface KubeOptions extends ParsedOptions {
  A?: boolean
  'all-namespaces'?: boolean

  cluster?: string
  context?: string
  kubeconfig?: string

  'dry-run'?: boolean | string

  n?: string | string[]
  namespace?: string | string[]

  c?: string
  container?: string

  o?: OutputFormat
  output?: OutputFormat

  w?: boolean
  watch?: boolean
  'watch-only'?: boolean

  wait?: boolean

  p?: boolean
  previous?: boolean

  l?: string
  label?: string
  selector?: string | string[]

  f?: string | string[]
  filename?: string | string[]

  k?: string
  kustomize?: string

  h?: boolean
  help?: boolean

  limit?: number

  'sort-by'?: string
}

export default KubeOptions
