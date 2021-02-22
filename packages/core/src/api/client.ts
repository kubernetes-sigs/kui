/*
 * Copyright 2019-20 The Kubernetes Authors
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
const debug = Debug('core/api/client')

/** Is the current client running in offline/disconnected mode? */
export function isOfflineClient(): boolean {
  try {
    const { offline } = require('@kui-shell/client/config.d/client.json')
    return offline
  } catch (err) {
    debug('Client did not define an offline status, assuming not offline')
    return false
  }
}
