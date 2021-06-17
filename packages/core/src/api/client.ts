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

import Debug from 'debug'
const debug = Debug('core/api/client')

/** Is the current client running in offline/disconnected mode? */
export function isOfflineClient(): boolean {
  try {
    const { offline, readonly, executable } = require('@kui-shell/client/config.d/client.json')

    if (offline === undefined && readonly !== undefined && executable !== undefined) {
      return readonly && !executable
    } else {
      return offline
    }
  } catch (err) {
    debug('Client did not define an offline status, assuming not offline')
    return false
  }
}

/** Is the current client running in readonly mode? */
export function isReadOnlyClient(): boolean {
  try {
    const { offline, readonly } = require('@kui-shell/client/config.d/client.json')

    if (offline) {
      return true
    } else {
      return readonly
    }
  } catch (err) {
    debug('Client did not define a readonly status, assuming not readonly')
    return false
  }
}

/** Is the current client running in an executable mode? */
export function isExecutableClient(): boolean {
  try {
    const { offline, executable } = require('@kui-shell/client/config.d/client.json')

    if (offline) {
      return false
    } else {
      return executable === undefined ? true : executable
    }
  } catch (err) {
    debug('Client did not define an executable status, assuming executable')
    return true
  }
}

export function hideReplayOutput(): boolean {
  try {
    const { hideReplayOutput } = require('@kui-shell/client/config.d/client.json')
    return hideReplayOutput
  } catch (err) {
    debug('Client did not define a hideReplayOutput status, assuming no')
    return false
  }
}

export function executeSequentially(): boolean {
  if (isExecutableClient()) {
    try {
      const { sequentialExecution } = require('@kui-shell/client/config.d/client.json')

      return sequentialExecution
    } catch (err) {
      debug('Client did not define a sequential execution status, assuming not sequential')
      return false
    }
  } else {
    return false
  }
}
