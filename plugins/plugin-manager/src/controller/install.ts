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
import { ensureDir, symlink, unlink } from 'fs-extra'
import { basename, join } from 'path'
import { execFile, spawn } from 'child_process'

import { userDataDir, exportSettingsTo, i18n, Arguments, Registrar, UsageModel } from '@kui-shell/core'

import Ora from '../util/ora'
import locateNpm from '../util/locate-npm'

const strings = i18n('plugin-manager')
const debug = Debug('plugins/plugin-manager/cmd/install')

/**
 * Usage model for plugin install
 *
 */
const usage: UsageModel = {
  strict: 'install',
  command: 'install',
  breadcrumb: strings('Install plugin'),
  docs: strings('install a plugin'),
  example: 'plugin install <plugin>',
  detailedExample: {
    command: 'plugin install @kui-shell/plugin-sample',
    docs: strings('a simple example plugin')
  },
  required: [{ name: 'plugin', docs: 'an npm module or github link' }]
}

/**
 * This is the command handler for `plugin install`
 *
 */
const doInstall = async (args: Arguments) => {
  const { argvNoOptions, REPL } = args
  const nameWithVersion = argvNoOptions[argvNoOptions.indexOf('install') + 1]
  const nameWithoutVersion = nameWithVersion.replace(/^(@?[^@]+)@.+$/, '$1')

  const spinner = await new Ora().init(strings('Preparing to install', nameWithoutVersion), args)

  const rootDir = userDataDir()
  const pluginHome = join(rootDir, 'plugins')
  const targetDir = join(pluginHome, basename(nameWithoutVersion)) // final location of the plugin
  await ensureDir(targetDir)

  debug(`installing ${nameWithoutVersion} into pluginHome=${pluginHome} targetDir=${targetDir}`)

  await exportSettingsTo(pluginHome)

  const resolved = await locateNpm()
  if (!resolved) {
    throw new Error('npm could not be found. Please install npm and try again')
  }

  const { npm } = resolved

  // npm init
  await spinner.next(strings('Configuring plugin sandbox'))
  await new Promise((resolve, reject) => {
    execFile(npm, ['init', '-y'], { cwd: pluginHome }, async (error, stdout, stderr) => {
      if (error) {
        console.error(error)
        await spinner.fail()
        reject(error)
        return
      }

      if (stderr.length > 0) {
        debug(stderr)
      }
      if (stdout.length > 0) {
        debug(stdout)
      }
      resolve()
    })
  })

  // npm install
  await spinner.next(strings('Installing dependencies'))
  // eslint-disable-next-line no-async-promise-executor
  await new Promise(async (resolve, reject) => {
    const args = ['install', nameWithVersion, '--prod', '--no-package-lock', '--loglevel', 'info']
    debug('npm install args', args)
    const sub = spawn(npm, args, {
      cwd: pluginHome
    })

    if (!sub) {
      await spinner.fail()
      reject(new Error(strings('Error installing dependencies')))
    }

    sub.stderr.on('data', async data => {
      const error = data.toString()
      if (error.indexOf('code E404') >= 0) {
        // the user tried to install a plugin which
        // doesn't exist in the npm registry
        sub.kill()
        await spinner.fail()
        reject(new Error(strings('The plugin {0} does not exist', nameWithVersion)))
      } else if (error.indexOf('ERR') >= 0) {
        // some other error we don't know about
        await spinner.fail()
        return reject(error)
      } else {
        // debug(error)
        spinner.text = error
      }
    })

    sub.stdout.on('data', data => {
      debug(data.toString())
    })

    sub.on('close', async code => {
      debug('npm install done', code)

      if (code !== 0) {
        await spinner.fail()
        reject(new Error('Internal Error'))
      } else {
        resolve()
      }
    })
  })

  await spinner.next(strings('Updating plugin registry'), strings('Installing dependencies'))
  await REPL.qexec('plugin compile')

  let commandPrefix = nameWithoutVersion.replace(/^.*plugin-(.*)$/, '$1')
  try {
    const pjson = await import(join(pluginHome, 'node_modules', nameWithoutVersion, 'package.json'))
    if (pjson.krew && pjson.krew.commandPrefix) {
      commandPrefix = pjson.krew.commandPrefix
    }
  } catch (err) {
    console.error('could not find pjson', err)
  }

  if (process.env.KUI_BIN_DIR && process.env.KUI_BIN_PREFIX && process.env.KUI_BIN) {
    await spinner.next(strings('Creating command-line executable'))
    try {
      const sourcePath = process.env.KUI_BIN
      const target = `${process.env.KUI_BIN_PREFIX}${commandPrefix}`
      debug(
        `creating command-line executable with sourcePath=${sourcePath} commandPrefix=${commandPrefix} target=${target} binDir=${process.env.KUI_BIN_DIR}`
      )
      const targetPath = join(process.env.KUI_BIN_DIR, target)
      await ensureDir(process.env.KUI_BIN_DIR)
      await unlink(targetPath).catch(err => {
        if (err.code !== 'ENOENT') {
          throw err
        }
      })
      await symlink(sourcePath, targetPath)
    } catch (err) {
      await spinner.fail()
      throw err
    }
  }

  await spinner.next(strings('Successfully installed. Here are your new commands:'))
  await spinner.stop()

  return REPL.qexec(`plugin commands "${nameWithoutVersion}"`)
}

export default (commandTree: Registrar) => {
  commandTree.listen('/plugin/install', doInstall, {
    usage
  })
}
