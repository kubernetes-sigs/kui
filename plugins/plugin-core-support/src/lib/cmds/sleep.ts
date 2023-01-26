/*
 * Copyright 2019 The Kubernetes Authors
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

import type { Registrar } from '@kui-shell/core'

/**
 * The command usage model
 *
 */
const usage = {
  command: 'sleep',
  strict: 'sleep',
  required: [{ name: 'sleepTime', number: true, docs: 'The number of seconds to sleep' }]
}

/**
 * The command handlers
 *
 */
export default (commandTree: Registrar) => {
  commandTree.listen(
    '/sleep',
    ({ argvNoOptions }) =>
      new Promise(resolve => {
        const nSeconds = parseInt(argvNoOptions[1], 10)
        const nMillis = nSeconds * 1000

        // resolve with an empty string to defeat the "ok" that the repl
        // would add if we resolved with true
        setTimeout(() => resolve(''), nMillis)
      }),
    { usage }
  )
}
