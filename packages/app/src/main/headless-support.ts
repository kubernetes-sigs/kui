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
const debug = Debug('core/main/headless-support')
debug('loading')

/**
 * This supports commads streaming their output to the console
 *
 * @see repl.ts for use of createOutputStream
 * @see cli.ts for the webapp implementation
 *
 */
export const streamTo = async () => {
  const { print } = await import('./headless-pretty-print')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (response: any) => {
    debug('streaming response', response)
    print(response)
    debug('streaming response2')
  }
}
