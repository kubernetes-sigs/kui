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
const debug = Debug('core/main/headless-support')
debug('loading')

import { Streamable } from '../models/streamable'

/**
 * This supports commads streaming their output to the console
 *
 * @see repl.ts for use of createOutputStream
 * @see cli.ts for the webapp implementation
 *
 */
export const streamTo = async (which: 'stdout' | 'stderr') => {
  const [{ clearLine, cursorTo }, { print }] = await Promise.all([
    import('node:readline'),
    import('./headless-pretty-print')
  ])

  const stdout = process[which]
  return (response: Streamable, killLine?: boolean) => {
    debug('streaming response', killLine)

    if (killLine) {
      clearLine(stdout, 0)
      cursorTo(stdout, 0, null)
    }

    print(response, which === 'stdout' ? console.log : console.error, process[which])

    if (!killLine) {
      if (typeof response !== 'string' || !/\n$/.test(response)) {
        if (which === 'stdout') {
          // why only stdout? a legacy of an earlier bad decision.
          // see https://github.com/kubernetes-sigs/kui/issues/7297
          stdout.write('\n')
        }
      }
    }

    return Promise.resolve()
  }
}
