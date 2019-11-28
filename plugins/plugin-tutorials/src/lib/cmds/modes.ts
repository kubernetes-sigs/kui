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

import { UI } from '@kui-shell/core'

// eslint-disable-next-line @typescript-eslint/no-var-requires
// const { modCmd } = require('./util')

/* interface Mode {
  mode: string
  label?: string
  command: Function
  actAsButton?: boolean
  fontawesome?: string
  flush?: string
  balloon?: string
  balloonLength?: string
  echo?: boolean
  noHistory?: boolean
} */

/** view modes */
const _modes: UI.Mode[] = [] /* [
  { mode: 'get', label: 'About' },
  { mode: 'api', label: 'API' },
  { mode: 'config', label: 'Configure' }
].map(_ =>
  Object.assign(_, {
    onclick: false,
    command: ({ name }) => `${modCmd} ${_.mode} "${name}"` // add the command handler, e.g. "module get foo"
  })
) */

/** flush-right buttons for the bottom stripe */
const buttons: UI.Mode[] = [
  /* { mode: 'deploy', label: 'Deploy', //fontawesome: 'fas fa-cloud-upload-alt',
      balloon: 'Deploy this project',
      actAsButton: true, flush: 'right', echo: true, noHistory: false, command: ({name}) => `${modCmd} deploy "${name}"` },

    { mode: 'undeploy', label: 'Undeploy', //fontawesome: 'fas fa-trash-alt',
      balloon: 'Undeploy this project',
      actAsButton: true, flush: 'right', echo: true, noHistory: false, command: ({name}) => `${modCmd} undeploy "${name}"` }, */
  /* {
    mode: 'status',
    label: 'Status',
    fontawesome: 'fas fa-info-circle',
    balloon: 'Detailed status',
    balloonLength: 'medium',
    actAsButton: true,
    flush: 'right',
    echo: true,
    noHistory: false,
    command: ({ name }) => `${modCmd}
 status "${name}"`
  } */
  /* { mode: 'invoke', label: 'Invoke', //fontawesome: 'fas fa-trash-alt',
      balloon: 'Perform a trial inovcation of this project',
      actAsButton: true, flush: 'right', echo: true, noHistory: false, command: ({name, api}) => `invoke main ${apiToDefaultParams(api)}` } */
]

/** Combined mode model (for the bottom stripe) */
export const modes = (defaultMode: string, api, choices): UI.Mode[] => {
  // add the defaultMode attribute to the matching UI.Mode
  const modes: UI.Mode[] = _modes
    .filter(({ mode }) => mode === 'get' || (mode === 'api' && api) || (mode === 'config' && choices))
    .map(_ => (_.mode === defaultMode ? Object.assign({}, _, { defaultMode: true }) : _))

  // return the modes plus any buttons we want to be flush right
  return modes.concat(buttons)
}
