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
import * as path from 'path'
import { remove } from 'fs-extra'

import { Commands, Settings } from '@kui-shell/core'
import compile from '@kui-shell/core/core/plugin-assembler'

import { success } from '../util'
import { remove as usage } from '../../usage'
const debug = Debug('plugins/plugin-manager/cmd/remove')
debug('loading')

debug('finished module imports')

const doRemove = ({ argvNoOptions }: Commands.Arguments) => {
  debug('command execution started')

  argvNoOptions = argvNoOptions.slice(argvNoOptions.indexOf('remove') + 1)

  const name = argvNoOptions.shift()

  const rootDir = Settings.userDataDir()
  const moduleDir = path.join(rootDir, 'plugins', 'modules')
  const pluginHome = path.join(moduleDir, name)

  debug(`remove plugin ${name} in ${pluginHome}`)

  return remove(pluginHome)
    .then(() => compile(rootDir, true, true)) // first true: externalOnly; second true: we want a reverse diff
    .then(removedCommands => success('removed', 'will no be longer available, after reload', removedCommands))
}

module.exports = (commandTree: Commands.Registrar) => {
  const cmd = commandTree.listen('/plugin/remove', doRemove, {
    usage: usage('remove')
  })
  commandTree.synonym('/plugin/uninstall', doRemove, cmd, {
    usage: usage('uninstall')
  })
}

debug('loading done')
