/*
 * Copyright 2020 IBM Corporation
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

import { Tab } from '../../tab'
import { CustomSpec } from '../sidecar-core'
import Presentation from '../presentation'
import { ExecOptions } from '../../../models/execOptions'

export interface SidecarProvider {
  showCustom: (tab: Tab, custom: CustomSpec, options?: ExecOptions, resultDom?: Element) => Promise<Presentation>
}

/** registered sidecar */
let primarySidecarProvider: SidecarProvider

/**
 * Register a sidedcar
 *
 */
export function registerSidecar(provider: SidecarProvider) {
  primarySidecarProvider = provider
}

export default registerSidecar

/**
 * Do we have a sidecar capability?
 *
 */
export function hasSidecar() {
  return primarySidecarProvider !== undefined
}

/**
 * Apply all registered modes that are relevant to the given resource
 * to the given modes model
 *
 */
export function showCustom(tab: Tab, custom: CustomSpec, options?: ExecOptions, resultDom?: Element) {
  if (hasSidecar()) {
    return primarySidecarProvider.showCustom(tab, custom, options, resultDom)
  } else {
    throw new Error('no sidecar registered')
  }
}
