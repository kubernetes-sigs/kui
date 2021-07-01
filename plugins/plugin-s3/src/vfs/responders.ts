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

import { Arguments } from '@kui-shell/core'
import { VFS } from '@kui-shell/plugin-bash-like/fs'

import eventBus from './events'
import { waitForInitDone } from '.'
import Provider from '../providers/model'
import { VFSWithError, mountPathFor } from './S3VFS'
import { knownProviders, MinioConfig } from '../providers'

let _responders: VFSWithError[] = []
let _providers: Provider[] = []

export interface Mount {
  provider: string
  isMounted: boolean
  mountPath: string
  error?: Error
  isDefault?: boolean
  publicOnly: boolean
}

/** @return a list of the providers, with info about mount status for each */
export function mounts(): Mount[] {
  return knownProviders().map(providerFullName => {
    const slashIdx = providerFullName.indexOf('/')
    const provider = slashIdx < 0 ? providerFullName : providerFullName.slice(0, slashIdx)

    try {
      const registrationIdx = _responders.findIndex(_ => _.mountPath === mountPathFor(providerFullName))

      if (registrationIdx < 0) {
        return {
          provider,
          isMounted: false,
          publicOnly: true,
          mountPath: undefined
        }
      } else {
        const { mountPath, error, publicOnly } = _responders[registrationIdx]
        const isMounted = error === undefined

        return {
          error,
          provider,
          mountPath,
          isMounted,
          publicOnly
        }
      }
    } catch (error) {
      console.error('Internal error initializing mount', provider, error)
      return {
        error,
        provider,
        isMounted: false,
        publicOnly: true,
        mountPath: undefined
      }
    }
  })
}

export function vfsFor(mountPath: string): VFS {
  return _responders.find(_ => _.mountPath === mountPath)
}

export function responderFor({ argvNoOptions }: Pick<Arguments, 'argvNoOptions'>) {
  const mountPath = argvNoOptions[2]
  return _responders.find(_ => _.mountPath === mountPath)
}

/**
 * This takes the S3 providers that we know about, and produces a
 * model that can be fed into `mc alias set`. Special case: if this
 * user does not have a configured AWS provider (i.e. we have no AWS
 * S3 credentials for them), we will create an auth-less entry; this
 * will allow access to public AWS s3 buckets.
 *
 */
export async function minioConfig(direct = false): Promise<MinioConfig> {
  await waitForInitDone

  const config: MinioConfig = {
    version: '10',
    aliases: _providers.reduce((M, _, idx) => {
      const endPoint = (direct && _.directEndPoint) || _.endPoint
      M[_responders[idx].mountPath] = {
        url: /^http/.test(endPoint) ? endPoint : `https://${endPoint}`,
        accessKey: _.accessKey,
        secretKey: _.secretKey,
        subdir: _.subdir || '',
        api: 's3v4',
        path: 'auto'
      }
      return M
    }, {})
  }

  return config
}

/** @return the list of Providers we wish to mount to the Kui VFS */
export default function setResponders(providers: Provider[], responders: VFSWithError[]) {
  _providers = providers.slice(0)
  _responders = responders.slice(0)
  eventBus.emit('/s3/configuration/update')

  // don't mount providers with initialization errors
  return _responders.filter(_ => !_.error)
}
