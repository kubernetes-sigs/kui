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

import { ClientOptions } from 'minio'
import { REPL } from '@kui-shell/core'

/** Providers may want to limit visibility to buckets */
type BucketFilter = (bucket: { name: string }) => boolean

type Provider = ClientOptions & {
  /** Optimized path for job execution? */
  readonly directEndPoint?: string

  readonly mountName: string
  readonly region?: string
  readonly error?: Error
  readonly bucketFilter?: BucketFilter
  readonly listBuckets?: ClientOptions
  readonly understandsFolders?: boolean
  readonly isDefault?: boolean

  /** Does this provider allows access only to public buckets? */
  readonly publicOnly?: boolean

  /** Is this mount a subirectory mount of an existing mount? */
  readonly subdir?: string
}
export default Provider

export type ProviderInitializer = {
  mountName: string
  init: (repl: REPL, reinit?: () => void) => Provider | Promise<Provider> | Promise<Provider[]>
}

export class UnsupportedS3ProviderError extends Error {}
