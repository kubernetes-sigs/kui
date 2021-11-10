/*
 * Copyright 2017 The Kubernetes Authors
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

/**
 * This plugin introduces commands that dispatch to a local bash-like
 * shell
 *
 */

import Debug from 'debug'
import { spawn, SpawnOptions, exec, ExecOptions as ChildProcessExecOptions } from 'child_process'

import { isHeadless, inProxy, Arguments, ExecOptions, ExecType, Registrar } from '@kui-shell/core'

import { handleNonZeroExitCode } from '../util/exec'
import { extractJSON } from '../util/json'
import { dispatchToShell } from './catchall'

const debug = Debug('plugins/bash-like/cmds/general')

function doSpawn(
  argv: string[],
  execOptions: ExecOptions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<string | number | boolean | Record<string, any>> {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      const options: SpawnOptions = {
        cwd: execOptions.cwd,
        env: Object.assign({}, process.env, execOptions['env'] || {})
      }

      if (process.env.SHELL && argv.find(_ => />|\||`|\$/.test(_))) {
        // if the argv has a | or $ or a backtick, then we need to use
        // a shell to evaluate the argv
        options.shell = process.env.SHELL
      }

      if (!execOptions.onInit && !execOptions.onExit && isHeadless() && !inProxy()) {
        options.stdio = 'inherit'
      }

      const proc = spawn(argv[0], argv.slice(1), options)
      proc.on('error', reject)
      proc.on('close', async exitCode => {
        if (exitCode === 0) {
          resolve(true)
        } else {
          reject(new Error(`non-zero exit code: ${exitCode}`))
        }
      })
    } catch (err) {
      reject(err)
    }
  })
}

export const doExec = (
  cmdLine: string,
  argv: string[],
  execOptions: ExecOptions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<string | number | boolean | Record<string, any>> => {
  if (!execOptions.onInit && !execOptions.onExit && isHeadless() && !inProxy()) {
    return doSpawn(argv, execOptions)
  }

  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      const options: ChildProcessExecOptions = {
        maxBuffer: 1 * 1024 * 1024,
        cwd: execOptions.cwd,
        env: Object.assign({}, process.env, execOptions.env || {})
      }
      if (process.env.SHELL) {
        options.shell = process.env.SHELL
      }

      const proc = exec(cmdLine, options)

      // accumulate doms from the output of the subcommand
      let rawOut = ''
      let rawErr = ''

      let stdout: Promise<ExecOptions['stdout']>

      // caller has requested a callback to set up the stdout stream
      if (execOptions.onInit) {
        debug('setting up stdout via onInit', cmdLine.slice(0, 10))
        stdout = Promise.resolve(
          execOptions.onInit({
            abort: () => proc.kill(),
            xon: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
            xoff: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
            write: () => {} // eslint-disable-line @typescript-eslint/no-empty-function
          })
        )
      }

      if (execOptions.pipeStdin) {
        process.stdin.pipe(proc.stdin)
      }

      proc.stdout.on('data', async data => {
        const out = data.toString()

        if (stdout) {
          ;(await stdout)(data)
        } else {
          rawOut += out
        }
      })

      proc.stderr.on('data', async data => {
        rawErr += data

        if (execOptions.stderr) {
          execOptions.stderr(data.toString())
          // stderrLines += data.toString()
        } else if (stdout) {
          ;(await stdout)(data.toString())
        } else {
          debug(data.toString())
        }
      })

      proc.on('error', reject)

      proc.on('close', async exitCode => {
        if (execOptions.onExit) {
          debug('onExit', exitCode, cmdLine.slice(0, 10))
          execOptions.onExit(exitCode)
          return
        }

        if (exitCode === 0) {
          // great, the process exited normally. resolve!
          if (execOptions && execOptions['json']) {
            // caller expects JSON back
            try {
              resolve(JSON.parse(rawOut))
            } catch (err) {
              const error = new Error('unexpected non-JSON')
              error['value'] = rawOut
              reject(error)
            }
          } else if (execOptions && execOptions.raw) {
            // caller just wants the raw textual output
            resolve(rawOut)
          } else if (!rawOut && !rawErr) {
            // in this case, the command produced nothing, but it did exit
            // with a 0 exit code
            resolve(true)
          } else {
            // else, we pass back a formatted form of the output
            const json = extractJSON(rawOut)

            if (json && typeof json === 'object') {
              json['type'] = 'shell'
              json['verb'] = 'get'
              resolve(json)
            } else {
              resolve(rawOut)
            }
          }
        } else {
          // oops, non-zero exit code. reject!
          debug('non-zero exit code', exitCode)

          // strip off e.g. /bin/sh: line 0:
          const cleanErr = rawErr.replace(/(^\/[^/]+\/[^:]+: )(line \d+: )?/, '')
          try {
            handleNonZeroExitCode(cmdLine, exitCode, rawOut, cleanErr, execOptions)
          } catch (err) {
            reject(err)
          }
        }
      })
    } catch (err) {
      reject(err)
    }
  })
}

const specialHandler = (args: Arguments) => {
  if (args.execOptions.type === ExecType.TopLevel) {
    throw new Error('this command is intended for internal consumption only')
  }
  return dispatchToShell(args)
}

/**
 * Register command handlers
 *
 */
export default (commandTree: Registrar) => {
  commandTree.listen('/!', dispatchToShell, {
    docs: 'Execute a UNIX shell command',
    requiresLocal: true
  })

  commandTree.listen('/sendtopty', specialHandler, {
    docs: 'Execute a UNIX shell command with a PTY',
    hidden: true
  })

  commandTree.listen('/pwd', () => process.env.PWD || process.env.HOME || '/')
}
