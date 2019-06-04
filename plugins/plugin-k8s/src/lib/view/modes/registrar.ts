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

import { ISidecarMode } from '@kui-shell/core/webapp/bottom-stripe'

import { IKubeResource, IResource } from '../../model/resource'
const debug = Debug('k8s/views/modes/registrar')

export type SidecarModeFilter = (resource: IKubeResource) => boolean

/**
 * Interpretation: if the kubernetes resources passes the given "when"
 * filter, then add the given sidecar mode
 *
 */
export interface ModeRegistration {
  when: SidecarModeFilter // when this filter returns true...
  mode: ISidecarMode | ((command: string, resource: IResource) => ISidecarMode) // ...display this mode option
}

/** registered mode handlers */
const registrar: ModeRegistration[] = []

/**
 * Register a new mode
 *
 */
export function registerSidecarMode (registration: ModeRegistration) {
  registrar.push(registration)
}
export default registerSidecarMode

/**
 * @return the relevant modes for the given command on the given resource
 *
 */
export function get (command: string, resource: IResource): ISidecarMode[] {
  debug('get relevant modes', resource)
  const modes: ISidecarMode[] = []
  apply(modes, command, resource)
  return modes
}

/**
 * Apply all registered modes that are relevant to the given resource
 * to the given modes model
 *
 */
export function apply (modes: ISidecarMode[], command: string, resource: IResource) {
  registrar
    .filter(({ when }) => when(resource.resource)) // if relevant...
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
