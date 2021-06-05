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

import Debug from 'debug'
import { flatten, REPL } from '@kui-shell/core'

import Provider, { ProviderInitializer, UnsupportedS3ProviderError } from './model'

import aws from './aws'
import localMinio from './local-minio'

export { Provider, ProviderInitializer, UnsupportedS3ProviderError }
export { default as MinioConfig } from './MinioConfig'

const debug = Debug('plugin/s3/providers')
let providers: ProviderInitializer[] = [aws].concat([localMinio])

export function knownProviders() {
  return providers.map(_ => _.mountName)
}

export function addProviderInitializer(providerInitializers: ProviderInitializer[]) {
  providers = providers.concat(providerInitializers)
}

export default async function findAvailableProviders(repl: REPL, reinit: () => void): Promise<Provider[]> {
  const candidates = flatten(
    await Promise.all(
      providers.map(async ({ init }) => {
        try {
          const provider = await init(repl, reinit)
          return Array.isArray(provider) ? provider : [provider]
        } catch (err) {
          debug('error initializing provider', err)
        }
      })
    )
  )

  return candidates.filter(_ => _)
}
