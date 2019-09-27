/*
 * Copyright 2017 IBM Corporation
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

import { Commands, REPL, UI } from '@kui-shell/core'
import { optionsToString } from './util'

/**
 * Create a view mode.
 *
 * @param mode the name of the view mode, a string
 * @param options is the command line options struct given by the
 * user.
 *
 */
const mode = (mode: string) => (options: Commands.ParsedOptions): UI.Mode => ({
  mode,
  direct: (tab: UI.Tab, entity: { name: string }) =>
    REPL.qexec(
      `${mode} ${optionsToString(options)}${
        entity && entity.name ? ' ' + entity.name : options.name ? ' ' + options.name : ''
      }`
    )
})

/**
 * The view modes. Change this whenever a new view mode is added to the tool.
 *
 */
const _modes = [
  mode('summary'),
  // mode('timeline'),  // disabled for now shell issue #794
  mode('grid')
]

/**
 * Return a view mode model, crafted for the given default mode, and
 * any command line options the user might have passed in.
 *
 */
export const modes = (defaultMode: string, options) =>
  _modes
    .map(_ => _(options))
    .map(_ => {
      if (_.mode === defaultMode) {
        return Object.assign({ defaultMode: true }, _)
      } else {
        return _
      }
    })
