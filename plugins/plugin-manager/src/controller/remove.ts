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

import Debug from 'debug'
import { join } from 'path'
import { execFile } from 'child_process'

import { Commands, Errors, i18n, REPL, Settings } from '@kui-shell/core'

import locateNpm from '../util/locate-npm'
import { installedPlugin } from '../util/usage-common'

const strings = i18n('plugin-manager')
const debug = Debug('plugins/plugin-manager/cmd/remove')

/**
 * Usage model for plugin remove
 *
 */
const usage = (command: string): Errors.UsageModel => ({
  strict: command,
  command,
  breadcrumb: strings('Remove plugin'),
  docs: strings('remove an installed plugin'),
  example: 'plugin remove <plugin>',
  required: installedPlugin
})

const doRemove = async ({ argvNoOptions }: Commands.Arguments) => {
  debug('command execution started')

  argvNoOptions = argvNoOptions.slice(argvNoOptions.indexOf('remove') + 1)

  const name = argvNoOptions.shift()

  const rootDir = Settings.userDataDir()
  const pluginHome = join(rootDir, 'plugins')

  debug(`remove plugin ${name} in ${pluginHome}`)

  const resolved = await locateNpm()
  if (!resolved) {
    throw new Error('npm could not be found. Please install npm and try again')
  }

  const { npm, env } = resolved

  await new Promise((resolve, reject) => {
    execFile(npm, ['uninstall', name, '--no-package-lock'], { cwd: pluginHome, env }, (err, stdout, stderr) => {
      if (stderr) {
        console.error(stderr)
      }
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })

  await REPL.qexec(`plugin compile ${name}`)

  return true
}

export default (commandTree: Commands.Registrar) => {
  const cmd = commandTree.listen('/plugin/remove', doRemove, {
    usage: usage('remove')
  })
  commandTree.synonym('/plugin/uninstall', doRemove, cmd, {
    usage: usage('uninstall')
  })
}
