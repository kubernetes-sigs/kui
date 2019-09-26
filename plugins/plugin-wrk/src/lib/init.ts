/*
 * Copyright 2017,2019 IBM Corporation
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
import { join } from 'path'
import { spawn } from 'child_process'
import { pathExists, move, remove } from 'fs-extra'

import { REPL, Settings } from '@kui-shell/core'

const debug = Debug('wrk/init')

/** location of /_pathTo_/wrk, i.e. the parent directory */
export const wrkPath = (): string => Settings.userDataDir()

/** name of wrk executable file */
export const wrkExeName = (): string => 'wrk'

/** location of /pathTo/wrk_, i.e. the executable */
export const wrkExec = (): string => join(wrkPath(), wrkExeName())

/** usage model */
const usage = {
  check: {
    command: 'check',
    strict: 'check',
    docs: 'Check on the status of the wrk executable',
    example: 'wrk check',
    optional: [
      {
        name: '--details',
        alias: '-d',
        docs: 'Show the location of the wrk executable'
      }
    ]
  },
  clean: {
    command: 'clean',
    strict: 'clean',
    docs: 'Remove the compiled wrk platform artifacts',
    example: 'wrk clean'
  },
  init: {
    command: 'init',
    strict: 'init',
    docs: 'Compile the wrk executable',
    example: 'wrk init'
  }
}

/**
 * Clean up our compiled binary artifacts
 *
 */
const cleanWrk = async () => {
  debug('cleaning out prior build')
  await remove(wrkExec())
  return true
}

/**
 * Compile the `wrk` executable
 *
 */
export const compileWrk = ({ createOutputStream }) =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise<boolean>(async (resolve, reject) => {
    const stdout = createOutputStream()

    try {
      await cleanWrk()

      const tmp = '/tmp'
      const wrkTmp = join(tmp, 'wrk')
      const wrkTmpExec = join(wrkTmp, 'wrk')

      debug('cleaning out tmp dir')
      await remove(wrkTmp)

      debug('cloning from git')
      stdout('cloning from git', true)

      const clone = spawn('git', ['clone', '-b', 'latency_stacks3', 'https://github.com/starpit/wrk.git'], { cwd: tmp })
      clone.stdout.on('data', data => {
        stdout(data.toString().split(/[\n\r]/)[0], true) // print first line only
      })
      let err = ''
      clone.stderr.on('data', data => {
        err += data.toString()
      })
      clone.on('close', exitCode => {
        if (exitCode !== 0) {
          console.error(err)
          reject(new Error('Failed in git clone'))
        } else {
          debug('compiling')
          stdout('compiling wrk', true)

          // compute the "N" for make -j N; we could use fancier logic
          // to get the number of physical CPUs, but this is probably
          // good enough
          const numJobs = Math.max(1, require('os').cpus().length / 2)
          debug('numJobs', numJobs)

          const make = spawn('make', ['-j', numJobs.toString()], {
            cwd: wrkTmp,
            env: {
              PATH: '/usr/local/bin:/usr/bin:/bin',
              MACOSX_DEPLOYMENT_TARGET: '10.14'
            }
          })

          make.stdout.on('data', data => {
            stdout(data.toString().split(/[\n\r]/)[0], true) // print first line only
          })
          let err = ''
          make.stderr.on('data', data => {
            err += data.toString()
          })
          make.on('close', async exitCode => {
            if (exitCode !== 0) {
              console.error(err)
              reject(new Error('Failed in compile'))
            } else if (!(await pathExists(wrkTmpExec))) {
              reject(new Error('Cannot find wrk executable'))
            } else {
              debug('compilation successful')
              stdout('compilation successful', true)

              await move(wrkTmpExec, wrkExec())

              if (!(await pathExists(wrkExec()))) {
                debug('strange, the move did not succeed')
                reject(new Error('Cannot find wrk executable'))
              } else {
                resolve(true)
              }
            }
          })
        }
      })
    } catch (err) {
      console.error(err)
      reject(err)
    }
  })

/**
 * Check the status of the wrk executable
 *
 */
const checkWrk = async ({ parsedOptions }) => {
  if (parsedOptions.details) {
    const msg = document.createElement('div')
    msg.appendChild(document.createTextNode('wrk home: '))

    const clicky = document.createElement('span')
    clicky.className = 'clickable clickable-blatant'
    clicky.innerText = wrkExec()
    clicky.onclick = () => REPL.pexec(`ls ${REPL.encodeComponent(wrkExec())}`)
    msg.appendChild(clicky)

    return msg
  } else if (await pathExists(wrkExec())) {
    return 'wrk compiled and ready'
  } else {
    const msg = document.createElement('div')
    msg.appendChild(document.createTextNode('wrk not yet ready; try '))

    const clicky = document.createElement('span')
    clicky.className = 'clickable clickable-blatant'
    clicky.innerText = 'wrk init'
    clicky.onclick = () => REPL.pexec('wrk init')
    msg.appendChild(clicky)

    return msg
  }
}

export default commandTree => {
  commandTree.listen('/wrk/init', compileWrk, {
    usage: usage.init,
    requiresLocal: true
  })
  commandTree.listen('/wrk/check', checkWrk, {
    usage: usage.check,
    requiresLocal: true
  })
  commandTree.listen('/wrk/clean', cleanWrk, {
    usage: usage.clean,
    requiresLocal: true
  })
}
