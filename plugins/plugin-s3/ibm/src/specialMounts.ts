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
import IBMCloudS3Provider from './IBMCloudS3Provider'

/** The /s3/ibm/default mount point */
function defaultProvider(geo: string, config: Config) {
  const provider = new IBMCloudS3Provider(geo, `${baseMountName}/default`, config)
  provider.isDefault = true
  return provider
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
    `org.kubernetes-sigs.kui/s3/pseudomount/${geo}/${pseudo}`,
    `${pseudo}-${v4()}`
  )
  const provider = new BindMount(geo, `${baseMountName}/tmp`, config, subdir)
  return provider
}

export default function extraProvidersForDefaultRegion(geo: string, config: Config) {
  return Promise.all([defaultProvider(geo, config), bindProvider(geo, config, 'bin'), bindProvider(geo, config, 'tmp')])
}
