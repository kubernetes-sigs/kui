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
import { isEnabled } from '@kui-shell/plugin-s3'

export async function registerCapability() {
  if (!isEnabled()) {
    return
  }

  const debug = Debug('plugin-s3/ibm/register')
  debug('registering ibm s3 provider 1')

  try {
    const [ibmcloud, addProviderInitializer] = await Promise.all([
      import('./s3provider').then(_ => _.default),
      import('@kui-shell/plugin-s3').then(_ => _.addProviderInitializer)
    ])
    debug('registering ibm s3 provider 2', ibmcloud)

    addProviderInitializer(ibmcloud)
  } catch (err) {
    debug('registering ibm s3 provider error', err)
    return []
  }
}
