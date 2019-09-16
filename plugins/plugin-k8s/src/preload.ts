/*
 * Copyright 2018 IBM Corporation
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

import * as Debug from 'debug'
const debug = Debug('plugins/k8s/preload')
debug('loading')

import { inBrowser, isHeadless } from '@kui-shell/core/core/capabilities'
import { CapabilityRegistration } from '@kui-shell/core/models/plugin'

/**
 * This is the capabilities registraion
 *
 */
export const registerCapability: CapabilityRegistration = async () => {
  if (inBrowser()) {
    debug('register capabilities for browser')
    const { restoreAuth } = await import('./lib/model/auth')
    restoreAuth()
  }
}

/**
 * This is the module
 *
 */
export default async () => {
  if (!isHeadless()) {
    const registerSidecarMode = (await import('@kui-shell/core/webapp/views/registrar/modes')).default
    Promise.all([
      import('./lib/view/modes/pods')
        .then(_ => _.podMode)
        .then(registerSidecarMode), // show pods of deployments
      import('./lib/view/modes/events')
        .then(_ => _.eventsMode)
        .then(registerSidecarMode), // show events
      import('./lib/view/modes/containers')
        .then(_ => _.containersMode)
        .then(registerSidecarMode), // show containers of pods
      import('./lib/view/modes/last-applied')
        .then(_ => _.lastAppliedMode)
        .then(registerSidecarMode), // show a last applied configuration tab
      import('./lib/tab-completion').then(_ => _.default())
    ])
  }
}

debug('finished loading')
