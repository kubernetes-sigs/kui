/*
 * Copyright 2020 The Kubernetes Authors
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

import type { Arguments, ParsedOptions, TabLayoutModificationResponse, NewSplitRequest } from '@kui-shell/core'

type Options = NewSplitRequest['options']
type CommandLineOptions = ParsedOptions & Omit<Options, 'inverseColors'> & { inverse: boolean }

/** For debugging, this returns the tab uuid of the current split */
export function debug(args: Arguments) {
  return args.tab.uuid
}

/**
 * This plugin introduces the /split command
 *
 */
export default async function split(
  args?: Arguments<CommandLineOptions>
): Promise<TabLayoutModificationResponse<NewSplitRequest>> {
  if (args.parsedOptions.swap) {
    if (!Array.isArray(args.parsedOptions.swap) || args.parsedOptions.swap.length !== 2) {
      console.error('Expected exactly two --swap options', args.parsedOptions.swap)
      throw new Error('Expected exactly two --swap options')
    } else if (args.parsedOptions.swap.find(_ => _ === 0)) {
      throw new Error('Expected --swap options to be 1-indexed')
    }
  }

  const options: Options = {
    swap: !args.parsedOptions.swap ? undefined : args.parsedOptions.swap,
    if: args.parsedOptions.if,
    ifnot: args.parsedOptions.ifnot,
    index: args.parsedOptions.index,
    cmdline: args.parsedOptions.cmdline,
    inverseColors: args.parsedOptions.inverse,
    masquerade: args.execOptions.masquerade,
    data: args.execOptions.data
  }

  const { i18n } = await import('@kui-shell/core/mdist/api/i18n')
  const strings = i18n('plugin-client-common')

  return {
    apiVersion: 'kui-shell/v1',
    kind: 'TabLayoutModificationResponse',
    spec: {
      modification: 'NewSplit',
      options,
      ok: {
        content: strings(args.parsedOptions.inverse ? 'Created a split with inverted colors' : 'Created a split'),
        contentType: 'text/markdown'
      }
    }
  }
}
