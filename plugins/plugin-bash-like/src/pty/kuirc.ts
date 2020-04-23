/*
 * Copyright 2020 IBM Corporation
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
const debug = Debug('plugins/bash-like/pty/kuirc')

import { exec } from 'child_process'

/**
 * Preprocess bash/zsh aliases
 *
 */
function prefetchAliases() {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise<string>(async (resolve, reject) => {
    if (process.platform === 'win32') {
      debug('skipping prefetchAliases')
      return resolve('')
    }

    debug('prefetchAliases')
    const os = import('os')
    const fs = import('fs')
    const path = import('path')
    const uuid = import('uuid')
    const { getLoginShell } = await import('./server')
    const shell = await getLoginShell()
    debug('prefetchAliases got shell', shell)

    exec(`${shell} -l -c alias`, async (err, stdout, stderr) => {
      try {
        if (stderr) {
          debug(stderr)
        }
        if (err) {
          debug('error in prefetchAliases 1', err)
          reject(err)
        } else {
          debug('got aliases')
          const aliases = stdout
            .toString()
            .split(/\n/)
            .filter(_ => _)
            .map(alias => {
              if (!/^alias /.test(alias)) {
                return `alias ${alias}`
              } else {
                return alias
              }
            })
            .join('\n')
          const kuirc = (await path).join((await os).tmpdir(), `kuirc-${(await uuid).v4()}`)
          debug('kuirc', kuirc)
          ;(await fs).writeFile(kuirc, aliases, err => {
            if (err) {
              debug(err)
              reject(err)
            } else {
              resolve(kuirc)
            }
          })
        }
      } catch (err) {
        console.error('error in prefetchEnv 2', err)
        reject(err)
      }
    })
  })
}

const kuirc: Promise<string> = prefetchAliases()
export default kuirc
