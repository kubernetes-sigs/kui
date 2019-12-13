/*
 * Copyright 2019 IBM Corporation
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

export interface EditorProvider {
  tryOpen: (
    tab: Tab,
    spec: CustomSpec,
    options: ExecOptions
  ) => Promise<{ content: Element; presentation: Presentation }>
}

/** registered editor */
let primaryProvider: EditorProvider

/**
 * Register an editor
 *
 */
export function registerEditor(provider: EditorProvider) {
  primaryProvider = provider
}
export default registerEditor

/**
 * Do we have an editor capability?
 *
 */
export function hasEditor() {
  return primaryProvider !== undefined
}

/**
 * Apply all registered modes that are relevant to the given resource
 * to the given modes model
 *
 */
export function tryOpenWithEditor(tab: Tab, spec: CustomSpec, options: ExecOptions) {
  return primaryProvider.tryOpen(tab, spec, options)
}
