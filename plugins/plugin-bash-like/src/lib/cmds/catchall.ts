/*
 * Copyright 2018 The Kubernetes Authors
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
import { CodedError, Streamable, Arguments, ParsedOptions, Registrar } from '@kui-shell/core'

import cwd from '../util/cwd'

const debug = Debug('plugins/bash-like/cmds/catchall')

/**
 * Command handler that dispatches to an outer shell
 *
 */
export const dispatchToShell = async ({
  tab,
  REPL,
  command,
  argv,
  argvNoOptions,
  execOptions,
  parsedOptions,
  createOutputStream
}: Arguments) => {
  /** trim the first part of "/bin/sh: someNonExistentCommand: command not found" */
  const cleanUpError = (err: CodedError) => {
    if (err.message && typeof err.message === 'string') {
      throw new Error(err.message.replace(/[a-zA-Z0-9/]+:\s*/, '').trim())
    } else {
      throw err
    }
  }

  const { ExecType } = await import('@kui-shell/core')
  const useRaw =
    (execOptions.raw || execOptions.type === ExecType.Nested) &&
    execOptions.quiet === undefined &&
    execOptions.echo === undefined &&
    execOptions.replSilence === undefined

  const eOptions =
    useRaw || execOptions.isProxied
      ? execOptions
      : Object.assign({ cwd: await cwd(execOptions, REPL) }, { stdout: await createOutputStream() }, execOptions)

  const actualCommand = command.replace(/^(!|sendtopty)\s+/, '')

  const { Capabilities } = await import('@kui-shell/core')

  if (Capabilities.isHeadless() || (!Capabilities.inBrowser() && useRaw)) {
    const { doExec } = await import('./bash-like')
    const actualArgv = argv[0] === 'sendtopty' ? argv.slice(1) : argv
    const response = await doExec(actualCommand, actualArgv, eOptions).catch(cleanUpError)
    if (useRaw && (typeof response === 'number' || typeof response === 'boolean')) {
      return response
    } else if (useRaw && typeof response === 'string') {
      try {
        return !isNaN(parseInt(response)) ? response : JSON.parse(response) // prevents numeric conversion e.g. JSON.parse('1') = 1
      } catch (err) {
        // debug('response maybe is not JSON', response)
      }
    }
    return response
  } else {
    const { doExec } = await import(/* webpackMode: "lazy" */ '../../pty/client')
    const exec = () => doExec(tab, REPL, actualCommand, argvNoOptions, parsedOptions, eOptions)

    if (useRaw) {
      eOptions.quiet = true
      eOptions.echo = false
      eOptions.replSilence = true

      let response = ''
      eOptions.onInit = () => (_: Streamable) => {
        if (typeof _ === 'string') {
          response += _
        }
      }

      return exec()
        .then(() => response)
        .catch(cleanUpError)
    }

    return exec().catch(cleanUpError)
  }
}

/**
 * Execute the given command using a pty, but return a string
 *
 */
export async function doExecWithStdoutViaPty<O extends ParsedOptions = ParsedOptions>(
  args: Arguments<O>
): Promise<string> {
  const { Capabilities } = await import('@kui-shell/core')
  // eslint-disable-next-line no-async-promise-executor
  return new Promise<string>(async (resolve, reject) => {
    let stdout = ''

    // a bit of plumbing: tell the PTY that we will be handling everything
    const myExecOptions = Object.assign({}, args.execOptions, {
      rethrowErrors: true, // we want to handle errors
      quiet: true, // don't ever emit anything on your own
      replSilence: true, // repl: same thing
      echo: false, // do not even echo "ok"

      // the PTY will call this when the PTY process is ready; in
      // return, we send it back a consumer of streaming output
      onInit: () => {
        return (chunk: Streamable) => {
          if (typeof chunk === 'string') {
            stdout += chunk
          }
        }
      }
    })

    const myArgs = Object.assign({}, args, { execOptions: myExecOptions })

    await dispatchToShell(myArgs).catch(err => {
      // if the PTY emitted anything on stdout, use this as the message
      const message = stdout || err.message

      if (stdout && Capabilities.isHeadless()) {
        // avoid stack traces to our own code? see
        // https://github.com/kubernetes-sigs/kui/issues/7334
        debug(message)
      } else {
        debug(err)
      }

      err.message = message

      reject(err)
    })

    resolve(stdout)
  })
}

/**
 * On preload, register the catchall handler
 *
 */
export const preload = async (commandTree: Registrar) => {
  const { Capabilities } = await import('@kui-shell/core')

  if (Capabilities.inBrowser() && !Capabilities.hasProxy()) {
    debug('skipping catchall registration: in browser and no remote proxy to support it')
    return
  }

  //
  // if we aren't running in a browser, then pass any command not
  // found exceptions to the outer shell
  //
  return commandTree.catchall(
    () => true, // we will accept anything
    dispatchToShell, // command handler dispatches to outer shell
    0 // priority
  )
}
