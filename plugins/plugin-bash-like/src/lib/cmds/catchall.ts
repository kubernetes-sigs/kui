/*
 * Copyright 2018-19 IBM Corporation
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
import {
  CodedError,
  ExecType,
  Streamable,
  isHeadless,
  inBrowser,
  hasProxy,
  Arguments,
  Registrar
} from '@kui-shell/core'

const debug = Debug('plugins/bash-like/cmds/catchall')

/**
 * Command handler that dispatches to an outer shell
 *
 */
export const dispatchToShell = async ({
  tab,
  command,
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

  const useRaw =
    (execOptions.raw || execOptions.type === ExecType.Nested) &&
    execOptions.quiet === undefined &&
    execOptions.echo === undefined &&
    execOptions.replSilence === undefined

  const eOptions =
    useRaw || execOptions.isProxied
      ? execOptions
      : Object.assign({}, { stdout: await createOutputStream() }, execOptions)

  const actualCommand = command.replace(/^(!|sendtopty)\s+/, '')

  if (isHeadless() || (!inBrowser() && useRaw)) {
    const { doExec } = await import('./bash-like')
    const response = await doExec(actualCommand, eOptions).catch(cleanUpError)
    if (useRaw && (typeof response === 'number' || typeof response === 'boolean')) {
      return response
    } else if (useRaw && typeof response === 'string') {
      try {
        return JSON.parse(response)
      } catch (err) {
        debug('response maybe is not JSON', response)
      }
    }
    return response
  } else {
    const { doExec } = await import(/* webpackMode: "lazy" */ '../../pty/client')
    const exec = () => doExec(tab, actualCommand, argvNoOptions, parsedOptions, eOptions)

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
 * On preload, register the catchall handler
 *
 */
export const preload = (commandTree: Registrar) => {
  if (inBrowser() && !hasProxy()) {
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
    0, // priority
    { noAuthOk: true, inBrowserOk: true }
  )
}
