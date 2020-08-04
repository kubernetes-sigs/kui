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

import ClientOptions, { UnsupportedS3ProviderError } from './model'

interface Config {
  AccessKeyID: string
  SecretAccessKey: string
}

function isGoodConfig(config: Record<string, any>): config is Config {
  const conf = config as Config
  return typeof conf.AccessKeyID === 'string' && typeof conf.SecretAccessKey === 'string'
}

class IBMCloudS3Provider implements ClientOptions {
  public readonly endPoint: string
  public readonly accessKey: string
  public readonly secretKey: string

  public constructor(config: Config) {
    this.endPoint = 's3.us-south.cloud-object-storage.appdomain.cloud' // FIXME
    this.accessKey = config.AccessKeyID
    this.secretKey = config.SecretAccessKey
  }
}

export default async function init(repl: REPL) {
  try {
    const config = JSON.parse(
      (await repl.rexec<FStat>(`vfs fstat ~/.bluemix/plugins/cloud-object-storage/config.json --with-data`)).content
        .data
    )
    if (isGoodConfig(config)) {
      return new IBMCloudS3Provider(config)
    }
  } catch (err) {
    throw new UnsupportedS3ProviderError(err.message)
  }
}
