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

import { REPL, eventChannelUnsafe } from '@kui-shell/core'
import { isGoodConfig, Config, updateChannel } from '@kui-shell/plugin-ibmcloud/cos'

import Provider, { UnsupportedS3ProviderError } from './model'

class IBMCloudS3Provider implements Provider {
  public readonly mountName = 'ibm'
  public readonly endPoint: string
  public readonly accessKey: string
  public readonly secretKey: string

  public constructor(config: Config) {
    this.endPoint = config.endpointForKui
    this.accessKey = config.AccessKeyID
    this.secretKey = config.SecretAccessKey
  }
}

/** Listening for reconfigs? */
const listeningAlready = false

export default async function init(repl: REPL, reinit: () => void) {
  try {
    if (!listeningAlready) {
      eventChannelUnsafe.on(updateChannel, reinit)
    }

    const config = (await repl.rexec<void | Config>('ibmcloud cos validate')).content
    if (isGoodConfig(config)) {
      return new IBMCloudS3Provider(config)
    } else {
      throw new UnsupportedS3ProviderError('Could not find credentials')
    }
  } catch (err) {
    throw new UnsupportedS3ProviderError(err.message)
  }
}
