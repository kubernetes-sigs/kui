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

import { Commands, UI } from '@kui-shell/core'

import { metadataWithNameOnly as metadata } from './metadata'
import { textModes } from './content/modes'

// exporting this for consumption in tests
export { metadata }

interface Options extends Commands.ParsedOptions {
  defaultMode: string
}

const buttons = [{ mode: 'hi', command: 'test string', kind: 'drilldown' as const, defaultMode: true }] // intend to set `defaultMode` here, for testing error handling

const toolbarText = {
  type: 'info',
  text: 'this is the toolbar text'
}

const doModes = (): ((args: Commands.Arguments<Options>) => UI.MultiModalResponse) => {
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

    // TODO: @myan can you add support for testing the onclick part?
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
