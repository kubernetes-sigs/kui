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

import * as Debug from 'debug'
const debug = Debug('plugins/bash-like/cmds/catchall')

import { inBrowser, isHeadless } from '@kui-shell/core/core/capabilities'
import { CommandRegistrar, IEvaluatorArgs } from '@kui-shell/core/models/command'

/**
 * Command handler that dispatches to an outer shell
 *
 */
export const dispatchToShell = async ({ tab, block, command, argv, argvNoOptions, execOptions, parsedOptions, createOutputStream }: IEvaluatorArgs) => {
  debug('handling catchall', command)

  /** trim the first part of "/bin/sh: someNonExistentCommand: command not found" */
  const cleanUpError = err => {
    if (err.message && typeof err.message === 'string') {
      err.message = err.message.replace(/[a-zA-Z0-9/]+:\s*/, '').trim()
    }
    throw err
  }

  if (isHeadless()) {
    const { doExec } = await import('./bash-like')
    return doExec(command, Object.assign({}, { stdout: createOutputStream() }, execOptions))
      .catch(cleanUpError)
  } else {
    const { doExec } = await import('../../pty/client')
    return doExec(tab, block as HTMLElement, command.replace(/^!\s+/, ''), Object.assign({}, { stdout: createOutputStream() }, execOptions))
      .catch(cleanUpError)
  }
}

/**
 * On preload, register the catchall handler
 *
 */
export const preload = (commandTree) => {
  //
  // if we aren't running in a browser, then pass any command not
  // found exceptions to the outer shell
  //
  return commandTree.catchall(
    () => true, // we will accept anything
    dispatchToShell, // command handler dispatches to outer shell
    0, // priority
    { noAuthOk: true, inBrowserOk: true })
}
