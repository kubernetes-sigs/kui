/*
 * Copyright 2018 IBM Corporation
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
import { CommandRegistrar } from '@kui-shell/core/models/command'
const debug = Debug('plugins/core-support/prompt')

import cli = require('@kui-shell/core/webapp/cli')

/**
 * The command usage model
 *
 */
const usage = {
  command: 'prompt',
  strict: 'prompt',
  hidden: true,
  optional: [{ name: 'promptString', positional: true, docs: 'The prompt string' }]
}

/**
 * The command handlers
 *
 */
export default (commandTree: CommandRegistrar) => {
  commandTree.listen(
    '/prompt',
    ({ argvNoOptions, block, nextBlock, tab }) => {
      const placeholder = argvNoOptions[1] || 'Test prompt'
      debug('placeholder', placeholder, argvNoOptions)

      return cli.prompt(
        'Prompt',
        block as HTMLElement,
        nextBlock,
        tab,
        {
          placeholder
        },
        options => {
          debug('response', options.field)
          return Promise.resolve(options.field)
        }
      )
    },
    { usage, noAuthOk: true, inBrowserOk: true }
  )
}
