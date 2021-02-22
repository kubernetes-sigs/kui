/*
 * Copyright 2019 The Kubernetes Authors
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

import { Arguments, expandHomeDir, split, CodedError, inBrowser, ExecOptions, Registrar } from '@kui-shell/core'

import flags from './flags'
import RawResponse from './response'
import commandPrefix from '../command-prefix'
import { KubeOptions, FilepathOption } from './options'

const debug = Debug('plugin-kubeui/controller/kubectl/raw')

/** this is the subset of Arguments that we need */
type Args = Pick<Arguments<KubeOptions>, 'command' | 'argv' | 'parsedOptions' | 'execOptions'>

/** Part of expandTildes: replace one option with the tilde expansion */
function expand(args: Args, option: FilepathOption) {
  const idx = args.argv.indexOf(option.length === 1 ? `-${option}` : `--${option}`)
  if (idx >= 0) {
    const orig = args.argv[idx + 1]
    if (orig) {
      args.argv[idx + 1] = expandHomeDir(orig)
    }
  }
}

/** Expand ~ to the full path of the user's home directory */
function expandTildes(args: Args, env: Arguments['execOptions']['env']) {
  expand(args, 'cache-dir')
  expand(args, 'certificate-authority')
  expand(args, 'client-key')
  expand(args, 'client-certificate')
  expand(args, 'kubeconfig')
  expand(args, args.parsedOptions.f ? 'f' : 'filename')
  expand(args, args.parsedOptions.k ? 'k' : 'kustomize')

  if (env.HOME) {
    env.HOME = expandHomeDir(env.HOME)
  }
}

/**
 * This is the final bottoming out of the exec/spawn of the native
 * executable.
 *
 */
export const doNativeExec = (args: Args): Promise<RawResponse> =>
  new Promise((resolve, reject) => {
    const env = Object.assign({}, !inBrowser() ? process.env : {}, args.execOptions.env)
    delete env.DEBUG

    expandTildes(args, env)

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
        debug('exec stdeout', stdout)
        debug('exec stderr', stderr)
      }

      const noResources = /no resources found/i.test(stderr)
      // const errorFromServer = /Error from server/i.test(stderr)

      if (/* errorFromServer || */ stdout.length === 0 && (code !== 0 || noResources)) {
        const message = stderr
        const fileNotFound = /error: the path/.test(message)
        const codeForREPL =
          noResources || /not found/i.test(message) || /doesn't have/i.test(message) || /couldn't find/.test(message)
            ? 404
            : /already exists/i.test(message)
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
  registrar.listen(`/${commandPrefix}/_kubectl`, doNativeExec, Object.assign({}, flags, { requiresLocal: true }))
}
