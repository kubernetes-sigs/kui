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
import { ensureDir } from 'fs-extra'
import { spawn } from 'child_process'

import Commands from '@kui-shell/core/api/commands'
import Errors from '@kui-shell/core/api/errors'
import { i18n } from '@kui-shell/core/api/i18n'
import Settings from '@kui-shell/core/api/settings'

import Ora from '../util/ora'
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

const doRemove = async (args: Commands.Arguments) => {
  const { argvNoOptions, REPL } = args
  const name = argvNoOptions[argvNoOptions.indexOf('remove') + 1]

  const spinner = await new Ora().init(strings('Preparing to remove', name), args)

  const rootDir = Settings.userDataDir()
  const pluginHome = join(rootDir, 'plugins')
  await ensureDir(pluginHome)

  debug(`removing plugin ${name} in ${pluginHome}`)

  const resolved = await locateNpm()
  if (!resolved) {
    throw new Error('npm could not be found. Please install npm and try again')
  }

  await spinner.next(strings('Removing', name))
  await new Promise((resolve, reject) => {
    const { npm } = resolved
    const sub = spawn(npm, ['uninstall', name, '--no-package-lock', '--loglevel', 'info'], { cwd: pluginHome })

    sub.on('err', async err => {
      console.error(err)
      await spinner.fail()
      reject(err)
    })

    sub.stderr.on('data', data => {
      spinner.text = data.toString()
    })

    sub.stdout.on('data', data => {
      spinner.text = data.toString()
    })

    sub.on('close', async code => {
      debug('npm uninstall done', code)

      if (code !== 0) {
        await spinner.fail()
        reject(new Error('Internal Error'))
      } else {
        resolve()
      }
    })
  })

  await spinner.next(strings('Updating plugin registry'), strings('Removing', name))
  await REPL.qexec(`plugin compile ${name}`)

  await spinner.next(strings('Successfully removed'))
  await spinner.stop()

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
