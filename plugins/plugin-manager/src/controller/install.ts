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
import { ensureDir } from 'fs-extra'
import { basename, join } from 'path'
import { execFile, spawn } from 'child_process'

import { Commands, Errors, i18n, REPL, Settings } from '@kui-shell/core'

import locateNpm from '../util/locate-npm'

const strings = i18n('plugin-manager')
const debug = Debug('plugins/plugin-manager/cmd/install')

/**
 * Usage model for plugin install
 *
 */
const usage: Errors.UsageModel = {
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
const doInstall = async ({ argvNoOptions }: Commands.Arguments) => {
  debug('command execution started')

  argvNoOptions = argvNoOptions.slice(argvNoOptions.indexOf('install') + 1)

  const name = argvNoOptions.shift()

  const rootDir = Settings.userDataDir()
  const pluginHome = join(rootDir, 'plugins')
  const targetDir = join(pluginHome, basename(name)) // final location of the plugin
  await ensureDir(targetDir)

  debug(`installing ${name} into pluginHome=${pluginHome} targetDir=${targetDir}`)

  await Settings.exportTo(pluginHome)

  const resolved = await locateNpm()
  if (!resolved) {
    throw new Error('npm could not be found. Please install npm and try again')
  }

  const { npm } = resolved

  // npm init
  await new Promise((resolve, reject) => {
    execFile(npm, ['init', '-y'], { cwd: pluginHome }, (error, stdout, stderr) => {
      if (error) {
        return reject(error)
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
  await new Promise((resolve, reject) => {
    const args = ['install', name, '--prod', '--no-package-lock']
    debug('npm install args', args)
    const sub = spawn(npm, args, {
      cwd: pluginHome
    })

    if (!sub) {
      reject(new Error('Internal Error'))
    }

    sub.stderr.on('data', data => {
      const error = data.toString()
      if (error.indexOf('code E404') >= 0) {
        // the user tried to install a plugin which
        // doesn't exist in the npm registry
        sub.kill()
        return reject(new Error(`The plugin ${name} does not exist`))
      } else if (error.indexOf('ERR') >= 0) {
        // some other error we don't know about
        return reject(error)
      } else {
        debug(error)
      }
    })

    sub.stdout.on('data', data => {
      debug(data.toString())
    })

    sub.on('close', code => {
      debug('npm install done', code)

      if (code !== 0) {
        reject(new Error('Internal Error'))
      } else {
        //
        // NOTE: fs.move doesn't work on linux; fs-extra seems to do hard links?? hence the use of fs.copy
        //
        //          .then(() => fs.copy(join(pluginHome, 'node_modules', name), targetDir))
        //          .then(() => fs.copy(join(pluginHome, 'node_modules'), join(targetDir, 'node_modules')))
        return (
          REPL.qexec(`plugin compile`)
            // .then(([newCommands]) => success('installed', 'will be available, after reload', newCommands))
            .then(() => resolve(true))
            .catch(reject)
        )
      }
    })
  })

  return true
}

export default (commandTree: Commands.Registrar) => {
  commandTree.listen('/plugin/install', doInstall, {
    usage
  })
}
