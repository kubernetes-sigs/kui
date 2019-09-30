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

import { Commands, REPL } from '@kui-shell/core'

import { registerTabCompletionEnumerator, TabCompletionSpec } from '@kui-shell/plugin-core-support'

const debug = Debug('plugins/bash-like/tab-completion/git')

/**
 * Tab completion handler for git branch names
 *
 */
async function completeGitBranches(commandLine: Commands.CommandLine, spec: TabCompletionSpec): Promise<string[]> {
  const args = commandLine.argvNoOptions
  const { toBeCompleted } = spec

  if (args[0] === 'git' && (args[1] === 'checkout' || args[1] === 'branch')) {
    try {
      const completions = await REPL.rexec<string>(
        `! git branch --list ${toBeCompleted ? toBeCompleted + '*' : ''} --sort=refname --sort=committerdate`
      )

      return completions
        .split(/[\n\r]/)
        .filter(_ => _)
        .map(_ => _.trim())
    } catch (err) {
      debug('squashing error from attempted git tab completion', err)
      return []
    }
  }
}

/**
 * Entry point to register tab completion handlers
 *
 */
export default () => {
  registerTabCompletionEnumerator(completeGitBranches)
}
