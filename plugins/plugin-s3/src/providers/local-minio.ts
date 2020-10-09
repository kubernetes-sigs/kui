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

import { eventBus, REPL } from '@kui-shell/core'
import Provider from './model'

const localStorageAccessKey = 'kui-shell/plugin-s3/minio/accessKey'
const localStorageSecretKey = 'kui-shell/plugin-s3/minio/secretKey'

class LocalMinioS3Provider implements Provider {
  public readonly mountName = 'minio'
  public readonly endPoint = '127.0.0.1' // TODO? pull out of mc config?
  public readonly port = 9000
  public readonly useSSL = false
  public readonly accessKey =
    process.env.MINIO_ACCESS_KEY || localStorage.getItem(localStorageAccessKey) || 'minioadmin'

  public readonly secretKey =
    process.env.MINIO_SECRET_KEY || localStorage.getItem(localStorageSecretKey) || 'minioadmin'
}

/** Listening for reconfigs? */
const listeningAlready = false

export default async function init(repl: REPL, reinit: () => void) {
  if (!listeningAlready) {
    eventBus.onEnvUpdate('MINIO_ACCESS_KEY', value => {
      localStorage.setItem(localStorageAccessKey, value)
      reinit()
    })

    eventBus.onEnvUpdate('MINIO_SECRET_KEY', value => {
      localStorage.setItem(localStorageSecretKey, value)
      reinit()
    })
  }

  const provider = new LocalMinioS3Provider()
  if (provider.accessKey && provider.secretKey) {
    return provider
  }
}
