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

import { eventBus, Registrar, Tab } from '@kui-shell/core'

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
function closeTab(tab: Tab) {
  eventBus.emitWithTabId('/tab/close/request', tab.uuid, tab)
  return true
}

/**
 * Create and initialize a new tab
 *
 */
const newTabAsync = () => {
  eventBus.emit('/tab/new/request')
  return true
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
    { usage }
  )

  commandTree.listen('/tab/new', newTabAsync)

  commandTree.listen('/tab/close', ({ tab }) => closeTab(tab))
}
