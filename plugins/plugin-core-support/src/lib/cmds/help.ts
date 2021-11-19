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

/* import Debug from 'debug'
const debug = Debug('plugins/core-support/help')
debug('loading')

import { Capabilities, Arguments, Registrar, CodedError, UsageError, i18n } from '@kui-shell/core'

const strings = i18n('plugin-core-support') */

/**
 * Respond with a top-level usage document
 *
 */
/* const help = usage => ({ argvNoOptions: args, REPL }: Arguments) => {
  const rest = args.slice(args.indexOf('help') + 1)
  debug('help command', rest, usage)

  if (rest.length > 0) {
    // then the user asked e.g. "help foo"; interpret this as "foo help"
    debug('reversal')
    return REPL.qexec(
      rest
        .concat('help')
        .map(val => REPL.encodeComponent(val))
        .join(' ')
    )

    // } else if (args.length !== 1) {
  } else if (usage) {
    debug('usage-based', args)

    // this will be our return value
    const topLevelUsage = {
      title: strings('helpUsageTitle'),
      header: 'A summary of the top-level command structure.',
      available: [],
      nRowsInViewport: 8 // show a few more rows for top-level help
    }

    // traverse the top-level usage documents, populating topLevelUsage.available
    for (const key in usage) {
      const { route, usage: model } = usage[key]
      if (
        model &&
        !model.synonymFor &&
        (Capabilities.isHeadless() || !model.headlessOnly) &&
        (!Capabilities.inBrowser() || !model.requiresLocal)
      ) {
        topLevelUsage.available.push({
          label: route.substring(1),
          available: model.available,
          hidden: model.hidden,
          synonyms: model.synonyms,
          command: model.commandPrefix || model.command, // either subtree or leaf command
          docs: model.command ? model.header : model.title // for leaf commands, print full header
        })
      }
    }

    debug('generated top-level usage model')
    throw new UsageError({ usage: topLevelUsage })
  } else {
    debug('no usage model')

    const error: CodedError = new Error('No documentation found')
    error.code = 404
    throw error
  }
} */

/**
 * The module. Here, we register as a listener for commands.
 *
 */
/* export default async (commandTree: Registrar, { usage }) => {
  commandTree.listen('/help', help(usage))
  commandTree.listen('/?', help(usage))
} */
