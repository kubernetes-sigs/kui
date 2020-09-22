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

import Debug from 'debug'
import { REPL } from '@kui-shell/core'

import Provider from './model'
import ibmcloud from './ibmcloud'
import localMinio from './local-minio'

export { Provider }

const debug = Debug('plugin/s3/providers')
const providers = [ibmcloud, localMinio]

export default async function findAvailableProviders(repl: REPL): Promise<Provider[]> {
  const candidates = await Promise.all(
    providers.map(async Provider => {
      try {
        return await Provider(repl)
      } catch (err) {
        debug('error initializing provider', err)
      }
    })
  )

  return candidates.filter(_ => _)
}
