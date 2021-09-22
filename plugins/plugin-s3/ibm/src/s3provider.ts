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
import { REPL, eventChannelUnsafe } from '@kui-shell/core'
import { ProviderInitializer, UnsupportedS3ProviderError } from '@kui-shell/plugin-s3'

import Geos from './model/geos'
import Config from './model/Config'
import updateChannel from './channel'
import { isGoodConfig } from './controller/local'

import baseMountName from './baseMountName'
import IBMCloudS3Provider from './IBMCloudS3Provider'
import { extraProvidersForDefaultRegion, extraProvidersForAllRegions } from './specialMounts'

const debug = Debug('plugin-s3/ibm/s3provider')

/** Listening for reconfigs? */
let listeningAlready = false
let currentConfig: Promise<{ content: void | Config }>

async function fetchConfig(repl: REPL): Promise<void | Config> {
  if (!currentConfig) {
    currentConfig = repl.rexec<void | Config>('ibmcloud cos validate')
  }

  return (await currentConfig).content
}

/** Initialize an S3Provider for the given geo */
async function init(geo: string, mountName: string, repl: REPL, reinit: () => void) {
  try {
    if (!listeningAlready) {
      listeningAlready = true
      eventChannelUnsafe.on(updateChannel, () => {
        currentConfig = undefined
        reinit()
      })
    }

    const config = await fetchConfig(repl)
    listeningAlready = false
    if (!isGoodConfig(config)) {
      return new IBMCloudS3Provider(
        geo,
        mountName,
        undefined,
        new UnsupportedS3ProviderError('Could not find credentials')
      )
    } else {
      if (config && !config['Default Region']) {
        // TODO: isn't there a race here?
        config['Default Region'] = await repl.qexec('ibmcloud cos config region default')
      }

      const provider = new IBMCloudS3Provider(geo, mountName, config)

      // special handling for default geo
      if (provider.isDefault) {
        // e.g. add an /s3/ibm/default mount point
        provider.isDefault = false
        debug(`adding extra providers for default region in geo ${geo}`)
        return [...(await extraProvidersForDefaultRegion(geo, config)), provider]
      } else {
        debug(`adding extra providers for all regions in geo ${geo}`)
        return [...(await extraProvidersForAllRegions(geo, config)), provider]
      }
    }
  } catch (err) {
    return new IBMCloudS3Provider(geo, mountName, undefined, new UnsupportedS3ProviderError(err.message))
  }
}

export function mountNameForGeo(geo: string, ...extra: string[]) {
  return [baseMountName, geo.replace(/-/g, '/'), ...extra].join('/')
}

/**
 * We want one ProviderInitializer per geo
 *
 */
const initializer: ProviderInitializer[] = Object.keys(Geos)
  // .filter(_ => !/-geo$/.test(_)) // don't manifest geo endpoints in the VFS
  .map(geo => {
    const mountName = mountNameForGeo(geo)
    return {
      mountName,
      init: init.bind(undefined, geo, mountName)
    }
  })

export default initializer
