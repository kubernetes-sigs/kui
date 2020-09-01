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

import {
  eventBus,
  eventChannelUnsafe,
  pexecInCurrentTab,
  KResponse,
  Registrar,
  StatusStripeChangeEvent,
  Tab
} from '@kui-shell/core'

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

  /**
   * Create and initialize a new tab
   *
   */
  commandTree.listen<
    KResponse,
    { cmdline?: string; 'status-stripe-type'?: StatusStripeChangeEvent['type']; 'status-stripe-message'?: string }
  >(
    '/tab/new',
    async args => {
      const message =
        args.parsedOptions['status-stripe-message'] ||
        (args.execOptions.data ? args.execOptions.data['status-stripe-message'] : undefined)
      const statusStripeDecoration = { type: args.parsedOptions['status-stripe-type'], message }

      if (args.parsedOptions.cmdline) {
        const { allocateTabUUID } = await import('@kui-shell/plugin-client-common')

        return new Promise(resolve => {
          const uuid = allocateTabUUID()
          eventBus.emit('/tab/new/request', {
            uuid,
            statusStripeDecoration
          })

          eventChannelUnsafe.once(`/tab/new/${uuid}`, (tab: Tab) => {
            pexecInCurrentTab(args.parsedOptions.cmdline, tab)
            resolve(true)
          })
        })
      } else {
        eventBus.emit('/tab/new/request', { statusStripeDecoration })
        return true
      }
    },
    {
      usage: {
        optional: [
          { name: '--cmdline', alias: '-c', docs: 'Invoke a command in the new tab' },
          { name: '--status-stripe-type', docs: 'Desired status stripe coloration', allowed: ['default', 'blue'] },
          { name: '--status-stripe-message', docs: 'Desired status stripe message' }
        ]
      }
    }
  )

  commandTree.listen('/tab/close', ({ tab }) => closeTab(tab))
}
