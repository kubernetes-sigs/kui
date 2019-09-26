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
import * as tmp from 'tmp'
import * as fs from 'fs-extra'
import * as path from 'path'
import { exec, spawn } from 'child_process'
import * as which from 'which'

import { Commands, Settings } from '@kui-shell/core'
import compile from '@kui-shell/core/core/plugin-assembler'

import { success } from '../util'
import { install as usage } from '../../usage'
const debug = Debug('plugins/plugin-manager/cmd/install')
debug('loading')

debug('finished module imports')

/**
 * Find the location of the npm executable
 *
 */
const locateNpm = (): Promise<string> =>
  new Promise<string>(resolve => {
    which('npm', { nothrow: true }, (err, resolved) => {
      if (resolved) {
        return resolve(resolved)
      }

      // Try standard locations
      if (err) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const os = require('os')
        const path = os.platform === 'win32' ? `C:\\Program Files\\nodejs` : '/usr/local/bin'
        resolved = which.sync('npm', { path, nothrow: true })
        if (resolved) {
          return resolve(resolved)
        }

        // TODO: eventually install npm or remove dependency on npm
        return resolve(null)
      }
    })
  })

const doInstall = ({ argvNoOptions }: Commands.Arguments) => {
  debug('command execution started')

  argvNoOptions = argvNoOptions.slice(argvNoOptions.indexOf('install') + 1)

  const name = argvNoOptions.shift()

  const rootDir = Settings.userDataDir()
  const moduleDir = path.join(rootDir, 'plugins', 'modules')
  const targetDir = path.join(moduleDir, name) // final location of the plugin

  debug(`installing ${name}`)

  // make a staging area for the npm install
  return new Promise((resolve, reject) => {
    tmp.dir((err, pluginHome) => {
      const cleanup = () => Promise.resolve(true) // fs.remove(pluginHome)//.then(cleanupDir, cleanupDir)
      const fail = err => {
        debug(err)
        return cleanup()
          .then(() => reject(err))
          .catch(reject)
      }

      if (err) {
        fail(err)
      } else {
        debug(`install plugin ${name} in ${pluginHome}`)

        locateNpm().then(npm => {
          if (!npm) {
            return fail('npm could not be found. Please install npm and try again')
          }

          const npmpath = path.dirname(npm)
          const env = Object.assign({}, process.env)
          env.PATH = `${npmpath}${path.delimiter}${process.env.PATH}`
          exec(`${npm} init -y`, { cwd: pluginHome, env }, (error, stdout, stderr) => {
            if (error) {
              return fail(error)
            }

            if (stderr.length > 0) {
              debug(stderr)
            }
            if (stdout.length > 0) {
              debug(stdout)
            }

            const sub = spawn(npm, ['install', name, '--prod', '--no-save', '--no-shrinkwrap'], {
              cwd: pluginHome,
              env
            })

            if (!sub) {
              fail('Internal Error')
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
              debug('npm install done')

              if (code !== 0) {
                reject(new Error())
              } else {
                //
                // NOTE: fs.move doesn't work on linux; fs-extra seems to do hard links?? hence the use of fs.copy
                //
                return fs
                  .ensureDir(targetDir)
                  .then(() => fs.copy(path.join(pluginHome, 'node_modules', name), targetDir))
                  .then(() => fs.copy(path.join(pluginHome, 'node_modules'), path.join(targetDir, 'node_modules')))
                  .then(() => Promise.all([compile(rootDir, true), cleanup()])) // recompile the plugin model
                  .then(([newCommands]) => success('installed', 'will be available, after reload', newCommands))
                  .then(resolve)
                  .catch(fail)
              }
            })
          })
        })
      }
    })
  })
}

export default (commandTree: Commands.Registrar) => {
  commandTree.listen('/plugin/install', doInstall, { usage })
}

debug('loading done')
