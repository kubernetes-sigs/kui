/*
 * Copyright 2017-2018 IBM Corporation
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
const debug = Debug('plugins/openwhisk/models/modes')

import { SidecarMode } from '@kui-shell/core/webapp/bottom-stripe'

export const actionSpecificModes: SidecarMode[] = [{ mode: 'code', defaultMode: true }, { mode: 'limits' }]

/**
 * Add action modes; where=push|unshift
 *
 */
export const addActionMode = (mode, where = 'push') => {
  actionSpecificModes[where](mode)
  debug('adding action mode', where, mode, actionSpecificModes)
}

/**
 * Format activation-specific modes
 *
 */
export const activationModes = (opts = {}) =>
  Object.assign(opts, {
    modes: entity => [
      {
        mode: 'result',
        defaultMode: true,
        command: () => 'wsk activation result'
      },
      {
        mode: 'logs',
        label: entity.prettyType === 'sequence' ? 'trace' : 'logs',
        command: () => 'wsk activation logs'
      },
      { mode: 'annotations', command: () => 'annotations' },
      { mode: 'raw', command: () => 'raw' }
    ]
  })

export const addActivationModes = entity => {
  entity.modes = activationModes().modes(entity)
  return entity
}
