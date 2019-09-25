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

import * as fs from 'fs-extra'
import * as path from 'path'

import { userDataDir } from '@kui-shell/core/core/userdata'
import { Commands } from '@kui-shell/core'

import { commands as usage } from '../../usage'

const doList = ({ argvNoOptions }: Commands.Arguments) => {
  const prescanned = path.join(userDataDir(), 'plugins', '.pre-scanned')

  const plugin = argvNoOptions[argvNoOptions.indexOf('commands') + 1]

  return fs
    .readFile(prescanned)
    .then(JSON.parse)
    .then(({ commandToPlugin, flat }) => {
      const commands = []
      const pluginIsInstalled = flat.find(({ route }) => route === plugin)

      if (!pluginIsInstalled) {
        const err = new Error(`Plugin ${plugin} is not installed`)
        err['code'] = 404
        throw err
      }

      for (const command in commandToPlugin) {
        const hostingPlugin = commandToPlugin[command]
        if (hostingPlugin === plugin) {
          commands.push(command)
        }
      }
      return commands
    })
    .then(commands => commands.sort((a, b) => -a.localeCompare(b)))
    .then(commands =>
      commands.filter(
        (command, idx) => !commands.find((other, otherIdx) => idx !== otherIdx && command.endsWith(other))
      )
    )
    .then(commands =>
      commands
        .map(command => command.replace(/^\//, '').replace(/\//g, ' '))
        .map(name => ({
          type: 'command',
          name,
          onclick: name
        }))
    )
    .catch(err => {
      if (err['code'] === 'ENOENT') {
        const error = new Error('This plugin is not installed')
        error['code'] = 404
        throw error
      } else {
        throw err
      }
    })
  // success(false, `offered by the ${plugin} plugin`, commands))
}

export default (commandTree: Commands.Registrar) => {
  commandTree.listen('/plugin/commands', doList, { usage })
}
