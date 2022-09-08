/*
 * Copyright 2019 The Kubernetes Authors
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

import { Tab } from '../../tab'
import { MetadataBearing } from '../../../models/entity'
// import { Button } from '../../../models/mmr/types'
// import { formatButton } from '../../../models/mmr/button'
import { ModeOrButton as SidecarMode } from '../../../models/mmr/types'

const debug = Debug('webapp/views/registrar/modes')

export type SidecarModeFilter<Resource extends MetadataBearing> = (resource: Resource) => boolean

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type ModeDeclaration<Resource extends MetadataBearing> = SidecarMode
//  | ((command: string, resource: { resource: Resource }) => SidecarMode)
//  | Button

/**
 * Interpretation: if the resource passes the given "when" filter,
 * then add the given sidecar mode
 *
 */
export interface ModeRegistration<Resource extends MetadataBearing> {
  when: SidecarModeFilter<Resource> // when this filter returns true...
  mode: ModeDeclaration<Resource> // ...display this mode option
}

/** registered mode handlers */
const registrar: ModeRegistration<MetadataBearing>[] = []

/**
 * Register a new mode
 *
 */
export function registerSidecarMode<Resource extends MetadataBearing>(registration: ModeRegistration<Resource>) {
  registrar.push(registration)
}
export default registerSidecarMode

export const registerModeWhen =
  <Resource extends MetadataBearing>(when: SidecarModeFilter<Resource>) =>
  (mode: ModeDeclaration<Resource>) => {
    registerSidecarMode({ when, mode })
  }

/**
 * Apply all registered modes that are relevant to the given resource
 * to the given modes model
 *
 */
export function apply<Resource extends MetadataBearing>(
  tab: Tab,
  modes: SidecarMode[],
  command: string,
  resource: { resource: Resource }
) {
  registrar
    .filter(({ when }) => {
      // filter out any irrelevant modes (for this resource)
      try {
        return when(resource.resource)
      } catch (err) {
        debug('warning: registered mode threw an exception during filter', err)
        return false
      }
    })
    .forEach(({ mode }) => {
      // then either push it on the mode model, or replace an existing mode
      /* if (override) {
        // replace
        const existingIdx = modes.findIndex(_ => _.mode === override)
        if (existingIdx >= 0) {
          modes[existingIdx] = mode
          return
        } else {
          console.error('warning: specified override not found', override, modes)
        }
      } */

      const theModeOrButton = mode // : Button | SidecarMode = typeof mode === 'function' ? mode(command, resource) : mode
      const theMode = theModeOrButton /* isButton(theModeOrButton)
        ? formatButton(tab, resource.resource, theModeOrButton)
        : theModeOrButton */

      const idxOfPreexistingRegistrationForSameMode = modes.findIndex(({ mode }) => mode === theMode.mode)
      if (idxOfPreexistingRegistrationForSameMode < 0) {
        modes.push(theMode)
      } else {
        // two plugins register the same mode; see if we can break the
        // tie using the `priority` field of the modes
        const oldMode = modes[idxOfPreexistingRegistrationForSameMode]
        const prio1 = oldMode.priority || 0
        const prio2 = theMode.priority || 0
        if (prio2 > prio1) {
          // splice the override in place, deleting the existing entry
          if (oldMode.defaultMode && theMode.defaultMode !== false) {
            theMode.defaultMode = true
          }
          modes.splice(idxOfPreexistingRegistrationForSameMode, 1, theMode)
        }
      }

      /* if (grabDefaultMode) {
        const defaultMode = modes.find(_ => _.defaultMode)
        if (defaultMode) {
          delete defaultMode.defaultMode
        }
      } */
    })
}

/**
 * @return the relevant modes for the given command on the given resource
 *
 */
/* export function get<Resource extends MetadataBearing>(
  command: string,
  resource: { resource: Resource }
): SidecarMode[] {
  debug('get relevant modes', resource)
  const modes: SidecarMode[] = []
  apply(modes, command, resource)
  return modes
} */
