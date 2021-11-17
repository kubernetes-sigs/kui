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
import { REPL, encodeComponent } from '@kui-shell/core'
import { FStat } from '@kui-shell/plugin-bash-like/fs'

import filepath from './filepath'
import Config, { hasDefaultRegion, hasEndpoint, isGoodConfigIgnoringEndpoint } from '../model/Config'

const debug = Debug('plugin-s3/ibm/controller/local')

export function isGoodConfig(config: void | Record<string, any>): config is Config {
  const checkA = isGoodConfigIgnoringEndpoint(config)
  const checkB = hasEndpoint(config)
  const checkC = hasDefaultRegion(config)
  debug('ibm s3 config check a', checkA)
  debug('ibm s3 config check b', checkB)
  debug('ibm s3 config check c', checkC)
  return checkA && checkB && checkC
}

export default async function findLocal(repl: REPL): Promise<void | Config> {
  try {
    const config = JSON.parse(
      (await repl.rexec<FStat>(`vfs fstat ${encodeComponent(filepath())} --with-data`)).content.data
    )
    if (isGoodConfig(config)) {
      return config
    }
  } catch (err) {
    debug('ibm s3 config error reading config', err)
  }
}
