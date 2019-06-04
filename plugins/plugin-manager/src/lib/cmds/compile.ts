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

import * as Debug from 'debug'

import { userDataDir } from '@kui-shell/core/core/userdata'
import compile from '@kui-shell/core/core/plugin-assembler'
import { CommandRegistrar } from '@kui-shell/core/models/command'

import { success } from '../util'
const debug = Debug('plugins/plugin-manager/cmd/compile')
debug('loading')

debug('finished loading modules')

export default (commandTree: CommandRegistrar) => {
  commandTree.listen('/plugin/compile', () => {
    const rootDir = userDataDir()
    return compile(rootDir, true)
      .then(([newCommands]) => success('installed', 'will be available, after reload', newCommands))
  }, {})
}
