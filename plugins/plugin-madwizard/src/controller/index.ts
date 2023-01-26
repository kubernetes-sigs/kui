/*
 * Copyright 2022 The Kubernetes Authors
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

import type { Registrar } from '@kui-shell/core'
import { width, height } from '@kui-shell/client/config.d/style.json'

/** Register Kui Commands */
export default function registerMadwizardCommands(registrar: Registrar) {
  registrar.listen('/madwizard/reset/profile', args => import('./profile/reset').then(_ => _.default(args)))
  registrar.listen('/madwizard/delete/profile', args => import('./profile/delete').then(_ => _.default(args)))
  registrar.listen('/madwizard/rename/profile', args => import('./profile/rename').then(_ => _.default(args)))

  registrar.listen('/madwizard/get/profile', () => import('./profile/get').then(_ => _.default()), {
    needsUI: true
  })

  registrar.listen(`/madwizard/ui`, args => import('./hello').then(_ => _.default(args)), {
    needsUI: true,
    outputOnly: true,
    width,
    height
  })
}
