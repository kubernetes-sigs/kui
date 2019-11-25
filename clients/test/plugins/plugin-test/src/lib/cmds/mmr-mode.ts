/*
 * Copyright 2019 IBM Corporation
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

/**
 * This file introduces a "test mmr mode" command that opens the sidecar with
 * some text modes.
 *
 */

import { Commands, Models, UI } from '@kui-shell/core'

import { metadataWithNameOnly as metadata } from './metadata'
import { textModes } from './content/modes'

// exporting this for consumption in tests
export { metadata }

interface Options extends Commands.ParsedOptions {
  defaultMode: string
}

export interface MyResource extends Models.ResourceWithMetadata {
  kind: 'Fancy'
  grumble: number
}

const buttons = [
  { mode: 'b0', command: 'test string', kind: 'drilldown' as const, confirm: true },
  { mode: 'b1', command: 'test string', kind: 'drilldown' as const },
  { mode: 'b2', command: () => 'test string', kind: 'drilldown' as const },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  { mode: 'b3', command: (tab: UI.Tab) => 'test string', kind: 'drilldown' as const },
  {
    mode: 'b4',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    command: (tab: UI.Tab, resource: MyResource) => `test string --grumble ${resource.grumble}`,
    kind: 'drilldown' as const
  },
  {
    mode: 'b5',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    command: (tab: UI.Tab, resource: MyResource) => `some non-existant command`,
    kind: 'drilldown' as const
  },

  // intentionally setting `defaultMode` here, to test error handling
  { mode: 'hi', command: 'test string', kind: 'drilldown' as const, defaultMode: true }
]

const toolbarText = {
  type: 'info',
  text: 'this is the toolbar text'
}

const doModes = (): ((args: Commands.Arguments<Options>) => UI.MultiModalResponse<MyResource>) => {
  return (args: Commands.Arguments<Options>) => {
    if (args.parsedOptions.defaultMode !== textModes[0].mode) {
      // change the default mode as requested
      textModes.forEach(mode => {
        if (mode.mode === args.parsedOptions.defaultMode) {
          mode.defaultMode = true
        }
        return mode
      })
    }

    return Object.assign(metadata, { modes: textModes, buttons, toolbarText, onclick: { name: 'test string' } })
  }
}

export default (commandTree: Commands.Registrar) => {
  commandTree.listen('/test/mmr/mode', doModes(), {
    usage: {
      docs: 'A test of MultiModalResponse mode'
    }
  })
}
