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
const debug = Debug('plugins/bash-like/pty/prefetch')
debug('loading')

import { exec, execFile } from 'child_process'
import * as propertiesParser from 'properties-parser'

import { getLoginShell } from './server'

/**
 * Preprocess bash/zsh environment variables
 *
 */
function prefetchEnv() {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    if (process.env.TERM || process.platform === 'win32') {
      debug('skipping prefetchEnv')
      return resolve()
    }

    debug('prefetchEnv')
    const shell = await getLoginShell()
    debug('prefetchEnv got shell', shell)

    exec(`${shell} -l -c printenv`, (err, stdout, stderr) => {
      try {
        if (stderr) {
          debug(stderr)
        }
        if (err) {
          debug('error in prefetchEnv 1', err)
          reject(err)
        } else {
          const env = propertiesParser.parse(stdout.toString())
          debug('got env', env)
          for (const key in env) {
            if (key !== '_') {
              process.env[key] = env[key]
            }
          }
          resolve()
        }
      } catch (err) {
        console.error('error in prefetchEnv 2', err)
        reject(err)
      }
    })
  })
}

/**
 * Determine HOME
 *
 */
function prefetchHome() {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    if (process.env.HOME) {
      debug('skipping prefetchHome')
      return resolve()
    }

    exec('eval echo ~', (err, stdout, stderr) => {
      try {
        if (stderr) {
          debug(stderr)
        }
        if (err) {
          debug('Error retrieving HOME', err)
        } else {
          const HOME = stdout.toString()
          debug('got HOME', HOME)
          process.env._HOME = HOME
        }
      } catch (err) {
        reject(err)
      } finally {
        resolve()
      }
    })
  })
}

/**
 * e.g. in this: alias treep='tree -C -A -F -I '\''*~'\'' --dirsfirst'
 * we want to remove those quotes
 */
function unquote(val: string): string {
  return val.replace(/(^')|('$)/g, '').replace(/'\\''/g, "'")
}

/**
 * Parent routine for all prefetching
 *
 */
export default () =>
  Promise.all([prefetchEnv(), prefetchHome()])
    .then(() => {
      if (process.env._HOME && !process.env.HOME) {
        process.env.HOME = process.env._HOME
        delete process.env._HOME
      }
    })
    .catch(err => {
      console.error('error prefetching state', err)
    })
