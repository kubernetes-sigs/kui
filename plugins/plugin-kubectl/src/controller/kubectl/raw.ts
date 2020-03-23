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

import Debug from 'debug'
import { spawn } from 'child_process'

import { expandHomeDir, split, CodedError, inBrowser, ExecOptions, Registrar } from '@kui-shell/core'

import flags from './flags'
import RawResponse from './response'
import { KubeOptions } from './options'
import commandPrefix from '../command-prefix'

const debug = Debug('plugin-kubeui/controller/kubectl/raw')

/** this is the subset of Commands.Arguments that we need */
interface Arguments {
  command: string
  argv: string[]
  parsedOptions: KubeOptions
  execOptions: ExecOptions
}

/**
 * This is the final bottoming out of the exec/spawn of the native
 * executable.
 *
 */
export const doNativeExec = (args: Arguments): Promise<RawResponse> =>
  new Promise((resolve, reject) => {
    const env = Object.assign({}, !inBrowser() ? process.env : {}, args.execOptions.env)
    delete env.DEBUG

    if ((args.parsedOptions.f || args.parsedOptions.filename) && typeof args.parsedOptions.f === 'string') {
      const filename = expandHomeDir(args.parsedOptions.f || args.parsedOptions.filename)
      const idx = args.argv.indexOf(args.parsedOptions.f ? '-f' : '--filename')
      if (idx >= 0) {
        args.argv[idx + 1] = filename
      }
    }

    const executable = args.argv[0].replace(/^_/, '')
    const child = spawn(executable, args.argv.slice(1), { env })

    // this is needed e.g. to handle ENOENT; otherwise the kui process may die with an uncaught exception
    child.on('error', (err: Error) => {
      console.error(`error spawning ${executable}`, err)
      reject(err)
    })

    let stdout = ''
    child.stdout.on('data', data => {
      stdout += data.toString()
    })

    let stderr = ''
    child.stderr.on('data', data => {
      stderr += data.toString()
    })

    child.on('close', async (code: number) => {
      // debug('exec close', code)
      // debug('exec stdout', out)
      if (stderr.length > 0 || code !== 0) {
        debug('exec has stderr with code %s', code)
        debug('exec stderr command', args.command)
        debug('exec stderr', stderr)
      }

      const noResources = stderr.match(/no resources found/i)
      if (code !== 0 || noResources) {
        const message = stderr
        const fileNotFound = message.match(/error: the path/)
        const codeForREPL =
          noResources || message.match(/not found/i) || message.match(/doesn't have/i)
            ? 404
            : message.match(/already exists/i)
            ? 409
            : fileNotFound
            ? 412
            : 500

        if (args.execOptions.failWithUsage) {
          reject(new Error(undefined))
        } else {
          const error: CodedError = new Error(message)
          error.statusCode = code
          error.code = codeForREPL
          reject(error)
        }
      } else {
        resolve({
          content: {
            code,
            stdout,
            stderr,
            wasSentToPty: false
          }
        })
      }
    })
  })

/**
 * A convenience wrapper over `doNativeExec` that extracts only
 * stdout, and discards the exit code and stderr.
 *
 */
export async function doExecRaw(
  command: string,
  parsedOptions: KubeOptions,
  execOptions: ExecOptions
): Promise<string> {
  return (await doNativeExec({ command, argv: split(command), parsedOptions, execOptions })).content.stdout
}

export default async (registrar: Registrar) => {
  registrar.listen(
    `/${commandPrefix}/_kubectl`,
    doNativeExec,
    Object.assign({}, flags, { requiresLocal: true, inBrowserOk: false })
  )
}
