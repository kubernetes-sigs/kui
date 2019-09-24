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
const debug = Debug('plugins/operator-framework/preload')
debug('loading')

import { Capabilities } from '@kui-shell/core'

import registerSidecarMode from '@kui-shell/core/webapp/views/registrar/modes'
import registerSidecarBadge from '@kui-shell/core/webapp/views/registrar/badges'

/**
 * This is the module
 *
 */
export default async () => {
  if (!Capabilities.isHeadless()) {
    return Promise.all([
      import('./view/modes/crds')
        .then(_ => _.crdsMode)
        .then(registerSidecarMode), // show any owned crds
      import('./view/modes/packages')
        .then(_ => _.packagesMode)
        .then(registerSidecarMode), // show packages of OperatorSource
      import('./view/modes/description')
        .then(_ => _.descriptionMode)
        .then(registerSidecarMode), // show description
      import('./view/modes/icon')
        .then(_ => _.iconBadge)
        .then(registerSidecarBadge) // olm icon
    ])
  }
}

debug('finished loading')
