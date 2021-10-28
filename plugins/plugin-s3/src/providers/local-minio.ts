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
import { Events, REPL } from '@kui-shell/core'
import { fetchFileString } from '@kui-shell/plugin-kubectl'

import Provider, { ProviderInitializer } from './model'

const debug = Debug('plugin-s3/providers/local-minio')

const localStorageAccessKey = 'kui-shell/plugin-s3/minio/accessKey'
const localStorageSecretKey = 'kui-shell/plugin-s3/minio/secretKey'

const mountName = 'minio'

class LocalMinioS3Provider implements Provider {
  public readonly mountName = mountName
  public readonly endPoint = '127.0.0.1' // TODO? pull out of mc config?
  public readonly port = 9000
  public readonly useSSL = false
  public readonly accessKey =
    process.env.MINIO_ACCESS_KEY || localStorage.getItem(localStorageAccessKey) || 'minioadmin'

  public readonly secretKey =
    process.env.MINIO_SECRET_KEY || localStorage.getItem(localStorageSecretKey) || 'minioadmin'

  /** In case of setup/connection errors */
  public error: Error = undefined
}

/** Listening for reconfigs? */
const listeningAlready = false

/** Avoid repeated warnings about inability to connect to minio */
let alreadyReportedCannotConnect = false

async function init(repl: REPL, reinit: () => void) {
  if (!listeningAlready) {
    Events.eventBus.onEnvUpdate('MINIO_ACCESS_KEY', value => {
      localStorage.setItem(localStorageAccessKey, value)
      reinit()
    })

    Events.eventBus.onEnvUpdate('MINIO_SECRET_KEY', value => {
      localStorage.setItem(localStorageSecretKey, value)
      reinit()
    })
  }

  const provider = new LocalMinioS3Provider()
  if (provider.accessKey && provider.secretKey) {
    try {
      // try pining minio to see if it is reachable
      await fetchFileString(
        { REPL: repl },
        `${provider.useSSL ? 'https' : 'http'}://${provider.endPoint}:${provider.port}/minio/health/live`
      )

      // if we got here, then we have successfully connected to minio;
      // so we can resetthis bit, in case we lose connectivity in the future
      alreadyReportedCannotConnect = false
    } catch (error) {
      if (!alreadyReportedCannotConnect) {
        debug('Cannot connect to minio', error)
        alreadyReportedCannotConnect = true
      }
      provider.error = error
    }

    return provider
  }
}

const initializer: ProviderInitializer = {
  init,
  mountName
}

export default initializer
