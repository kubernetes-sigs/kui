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

import { REPL } from '@kui-shell/core'
import { FStat } from '@kui-shell/plugin-bash-like/fs'

import Config from '../model/Config'

export function isGoodConfig(config: void | Record<string, any>): config is Config {
  const conf = config as Config
  return (
    config &&
    typeof conf.AccessKeyID === 'string' &&
    typeof conf.SecretAccessKey === 'string' &&
    typeof conf.endpointForKui === 'string'
  )
}

export default async function findLocal(repl: REPL): Promise<void | Config> {
  try {
    const config = JSON.parse(
      (await repl.rexec<FStat>(`vfs fstat ~/.bluemix/plugins/cloud-object-storage/config.json --with-data`)).content
        .data
    )
    if (isGoodConfig(config)) {
      return config
    }
  } catch (err) {}
}
