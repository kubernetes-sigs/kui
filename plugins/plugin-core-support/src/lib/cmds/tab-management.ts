/*
 * Copyright 2018-2020 IBM Corporation
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

import { eventBus, Arguments, Registrar } from '@kui-shell/core'

// TODO fixme; this is needed by a few tests
export const tabButtonSelector = '#new-tab-button'

const usage = {
  strict: 'switch',
  command: 'switch',
  required: [{ name: 'tabIndex', numeric: true, docs: 'Switch to the given tab index' }]
}

/**
 * Close the current tab
 *
 */
function closeTab() {
  eventBus.emit('/tab/close/request')
  return true
}

/**
 * Create and initialize a new tab
 *
 */
function newTab() {
  eventBus.emit('/tab/new/request')
  return true
}

/**
 * Same as newTab, but done asynchronously
 *
 */
const newTabAsync = ({ execOptions }: Arguments) => {
  if (execOptions.nested) {
    newTab()
    return true
  } else {
    // we can't proceed until the repl is done installing the next block
    eventBus.once('/core/cli/install-block', () => newTab())

    // tell the REPL we're done, so it can get busy installing the next block!
    return true
  }
}

/**
 * The goal here is to offer a simple command structure for managing tabs
 *
 */
export default function plugin(commandTree: Registrar) {
  commandTree.listen(
    '/tab/switch',
    ({ argvNoOptions }) => {
      const idx = parseInt(argvNoOptions[argvNoOptions.length - 1], 10)
      eventBus.emit('/tab/switch/request', idx - 1)
      return true
    },
    { usage, needsUI: true }
  )

  commandTree.listen('/tab/new', newTabAsync, {
    needsUI: true
  })

  commandTree.listen('/tab/close', () => closeTab(), {
    needsUI: true
  })
}
