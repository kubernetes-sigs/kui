/*
 * Copyright 2021 The Kubernetes Authors
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
  getPrimaryTabId,
  getTab,
  isReadOnlyClient,
  KResponse,
  ParsedOptions,
  Registrar,
  StatusStripeChangeEvent,
  Tab
} from '@kui-shell/core'

interface EditOptions extends ParsedOptions {
  'new-window': boolean
  'status-stripe': StatusStripeChangeEvent['type']
  current?: boolean
  c?: boolean
}

/**
 * The command usage model
 *
 */
const usage = {
  command: 'tab edit toggle',
  strict: 'tab edit toggle',
  optional: [{ name: '--current-tab', alias: '-c', boolean: true, docs: 'Toggle edit mode on current tab' }]
}

function getTabByIndex(argvNoOptions: string[]): Tab {
  const index = parseInt(argvNoOptions[argvNoOptions.length - 1], 10)

  if (isNaN(index)) {
    throw new Error(`4th argument is not a number. Expected type number`)
  } else {
    const tmpTab = getTab(index)
    if (tmpTab === undefined || tmpTab === null) {
      throw new Error('Could not find tab with give index ' + index)
    }
    return tmpTab
  }
}

/** Command registration */
export default function(registrar: Registrar) {
  if (!isReadOnlyClient()) {
    // register the `tab edit toggle` command
    registrar.listen<KResponse, EditOptions>(
      '/tab/edit/toggle',
      ({ tab, argvNoOptions, parsedOptions }) => {
        if (!parsedOptions.c && argvNoOptions.length < 4) {
          throw new Error('Not enough arguments. Expected: tab edit toggle tabIndexNum')
        }
        if (argvNoOptions.length > 4) {
          throw new Error('Too many arguments. Expected: tab edit toggle tabIndexNum')
        }

        const desiredTab = parsedOptions.c ? tab : getTabByIndex(argvNoOptions)

        const uuid = getPrimaryTabId(desiredTab)
        eventBus.emitWithTabId('/kui/tab/edit/toggle', uuid, desiredTab)
        return 'Successfully toggled edit mode'
      },
      { usage, flags: { alias: { 'current-tab': ['c'] }, boolean: ['c'] } }
    )
  }
}
