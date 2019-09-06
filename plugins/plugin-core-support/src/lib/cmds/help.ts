/*
 * Copyright 2017 IBM Corporation
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
const debug = Debug('plugins/core-support/help')
debug('loading')

import * as repl from '@kui-shell/core/core/repl'
import { CommandRegistrar, EvaluatorArgs } from '@kui-shell/core/models/command'

/**
 * Respond with a top-level usage document or Open the About Sidecar
 *
 */
const help = usage => ({ argvNoOptions: args }: EvaluatorArgs) => {
  const rest = args.slice(args.indexOf('help') + 1)
  debug('help command', rest)

  if (rest.length > 0) {
    // then the user asked e.g. "help foo"; interpret this as "foo help"
    debug('reversal')
    return repl.qexec(
      rest
        .concat('--help')
        .map(val => repl.encodeComponent(val))
        .join(' ')
    )
  } else {
    // open the About Sidecar
    return repl.qexec('about')
  }
}

/**
 * The module. Here, we register as a listener for commands.
 *
 */
export default async (commandTree: CommandRegistrar, { usage }) => {
  commandTree.listen('/help', help(usage), {
    noAuthOk: true,
    inBrowserOk: true
  })
  commandTree.listen('/?', help(usage), {
    noAuthOk: true,
    inBrowserOk: true
  })
}
