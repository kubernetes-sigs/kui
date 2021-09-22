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

import { v4 } from 'uuid'
import { getOrSetPreference } from '@kui-shell/core'

import Config from './model/Config'
import baseMountName from './baseMountName'
import { mountNameForGeo } from './s3provider'
import IBMCloudS3Provider from './IBMCloudS3Provider'

/** The /s3/ibm/default mount point */
function defaultProvider(geo: string, config: Config) {
  const provider = new IBMCloudS3Provider(geo, `${baseMountName}/default`, config)
  provider.isDefault = true
  return provider
}

/** The /s3/ibm/public mount point */
function publicProvider(geo: string, { endpointForKui }: Pick<Config, 'endpointForKui'>) {
  return new IBMCloudS3Provider(geo, mountNameForGeo(geo, 'public'), {
    AccessKeyID: '',
    SecretAccessKey: '',
    endpointForKui
  })
}

/** A "bind" mount that points to a subdirectory of a given mount */
class BindMount extends IBMCloudS3Provider {
  public constructor(geo: string, mountName: string, config: Config, public readonly subdir: string) {
    super(geo, mountName, config)
  }
}

/** The /s3/ibm/tmp and /bin mount points */
async function bindProvider(geo: string, config: Config, pseudo: string) {
  const subdir = await getOrSetPreference(
    `org.kubernetes-sigs.kui/s3/pseudomount/${geo}/${pseudo}/${config.AccessKeyID}`,
    `${pseudo}-${v4()}`
  )
  const provider = new BindMount(geo, `${baseMountName}/${pseudo}`, config, subdir)
  return provider
}

export function extraProvidersForDefaultRegion(geo: string, config: Config) {
  return Promise.all([
    defaultProvider(geo, config), // /s3/ibm/default
    publicProvider(geo, config), // /s3/ibm/public (i.e. access to public buckets without credentials)
    bindProvider(geo, config, 'bin'), // s3/ibm/bin
    bindProvider(geo, config, 'tmp') // s3/ibm/tmp
  ])
}

export function extraProvidersForAllRegions(geo: string, config: Config) {
  return [
    publicProvider(geo, config) // /s3/ibm/public (i.e. access to public buckets without credentials)
  ]
}
