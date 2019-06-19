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

import registerSidecarMode from '@kui-shell/core/webapp/views/registrar/modes'
import registerSidecarBadge from '@kui-shell/core/webapp/views/registrar/badges'

import { crdsMode } from './view/modes/crds'
import { iconBadge } from './view/modes/icon'
import { packagesMode } from './view/modes/packages'
import { descriptionMode } from './view/modes/description'

/**
 * This is the module
 *
 */
export default async () => {
  registerSidecarMode(crdsMode) // show any owned crds
  registerSidecarMode(packagesMode) // show packages of OperatorSource
  registerSidecarMode(descriptionMode) // show description
  registerSidecarBadge(iconBadge) // olm icon
}
