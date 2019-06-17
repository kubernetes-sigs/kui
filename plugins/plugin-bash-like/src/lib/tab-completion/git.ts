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

import { exec } from 'child_process'

import { CommandLine } from '@kui-shell/core/models/command'
import { registerEnumerator, TabCompletionSpec } from '@kui-shell/plugin-core-support/lib/tab-completion'

/**
 * Tab completion handler for git branch names
 *
 */
async function completeGitBranches (commandLine: CommandLine, spec: TabCompletionSpec): Promise<string[]> {
  const { argvNoOptions: args } = commandLine
  const { toBeCompleted } = spec

  if (args[0] === 'git' &&
      (args[1] === 'checkout' ||
          args[1] === 'branch')
  ) {
    return new Promise((resolve, reject) => {
      // note how we push the prefix filter to the underlying
      // enumeration command: note the '*' suffix wildcard in the
      // --list option
      exec(`git branch --list ${toBeCompleted ? toBeCompleted + '*' : ''} --sort=refname --sort=committerdate`, (error, stdout, stderr) => {
        if (error) {
          if (stderr) {
            console.error(stderr)
          }
          reject(error)
        } else {
          const completions = stdout.split(/[\n\r]/).map(_ => _.replace(/^\s*[*]\s+/, '').trim())
          resolve(completions)
        }
      })
    })
  }
}

/**
 * Entry point to register tab completion handlers
 *
 */
export default () => {
  registerEnumerator(completeGitBranches)
}
