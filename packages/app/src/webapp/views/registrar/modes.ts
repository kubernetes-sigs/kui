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

import * as Debug from 'debug'

import { MetadataBearing } from '@kui-shell/core/models/entity'
import { SidecarMode } from '@kui-shell/core/webapp/bottom-stripe'

const debug = Debug('webapp/views/registrar/modes')

export type SidecarModeFilter<Resource extends MetadataBearing> = (resource: Resource) => boolean

/**
 * Interpretation: if the resource passes the given "when" filter,
 * then add the given sidecar mode
 *
 */
export interface ModeRegistration<Resource extends MetadataBearing> {
  when: SidecarModeFilter<Resource> // when this filter returns true...
  mode: SidecarMode | ((command: string, resource: { resource: Resource }) => SidecarMode) // ...display this mode option
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

/**
 * Apply all registered modes that are relevant to the given resource
 * to the given modes model
 *
 */
export function apply<Resource extends MetadataBearing>(
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

      // otherwise, push
      if (typeof mode === 'function') {
        modes.push(mode(command, resource))
      } else {
        modes.push(mode)
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
export function get<Resource extends MetadataBearing>(
  command: string,
  resource: { resource: Resource }
): SidecarMode[] {
  debug('get relevant modes', resource)
  const modes: SidecarMode[] = []
  apply(modes, command, resource)
  return modes
}
