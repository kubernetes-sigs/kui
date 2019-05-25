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
const debug = Debug('k8s/views/modes/registrar')

import { ISidecarMode } from '@kui-shell/core/webapp/bottom-stripe'

import { IKubeResource, IResource } from '../../model/resource'

type SidecarModeFilter = (resource: IKubeResource) => boolean

/**
 * Interpretation: if the kubernetes resources passes the given "when"
 * filter, then add the given sidecar mode
 *
 */
interface Registration {
  when: SidecarModeFilter // when this filter returns true...
  mode: ISidecarMode // ...display this mode option
  override?: string // and maybe replace an existing mode?
  grabDefaultMode?: boolean // or maybe replace the current default mode?
}

/** registered mode handlers */
const registrar: Registration[] = []

/**
 * Register a new mode
 *
 */
export default function (registration: Registration) {
  registrar.push(registration)
}

/**
 * Apply all registered modes that are relevant to the given resource
 * to the given modes model
 *
 */
export function apply (modes: Array<ISidecarMode>, command: string, resource: IResource) {
  registrar
    .filter(({ when }) => when(resource.yaml)) // if relevant...
    .forEach(({ override, grabDefaultMode, mode }) => {
      // then either push it on the mode model, or replace an existing mode
      if (override) {
        // replace
        const existingIdx = modes.findIndex(_ => _.mode === override)
        if (existingIdx >= 0) {
          modes[existingIdx] = mode
          return
        } else {
          console.error('warning: specified override not found', override, modes)
        }
      }

      // otherwise, push
      modes.push(mode)

      if (grabDefaultMode) {
        const defaultMode = modes.find(_ => _.defaultMode)
        if (defaultMode) {
          delete defaultMode.defaultMode
        }
      }
    })
}
