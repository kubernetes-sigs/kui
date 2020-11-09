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

import { Arguments, ParsedOptions, Registrar, Tab, MultiModalResponse } from '@kui-shell/core'

import { metadataWithNameOnly as metadata } from './metadata'
import { modeOrderVariants } from './content/modes'
import reactContent from './content/react'
import tree from './content/tree'
import { MyResource } from '../models'

// exporting this for consumption in tests
export { metadata }

interface Options extends ParsedOptions {
  defaultMode: string
}

const buttons = [
  { mode: 'b0', command: 'test string', kind: 'drilldown' as const, confirm: true },
  { mode: 'b1', command: 'test string', kind: 'drilldown' as const },
  { mode: 'b2', command: () => 'test string', kind: 'drilldown' as const },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  { mode: 'b3', command: (tab: Tab) => 'test string', kind: 'drilldown' as const },
  {
    mode: 'b4',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    command: (tab: Tab, resource: MyResource) => `test string --grumble ${resource.grumble}`,
    kind: 'drilldown' as const
  },
  {
    mode: 'b5',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    command: (tab: Tab, resource: MyResource) => `some non-existant command`,
    kind: 'drilldown' as const
  },

  // intentionally setting `defaultMode` here, to test error handling
  { mode: 'hi', command: 'test string', kind: 'drilldown' as const, defaultMode: true }
]

const toolbarText = {
  type: 'info' as const,
  text: 'this is the toolbar text'
}

/**
 * @param idx into modeOrderVariants array
 *
 */
const doModes = (idx: number): ((args: Arguments<Options>) => MultiModalResponse<MyResource>) => {
  return (args: Arguments<Options>) => {
    const textModes = modeOrderVariants[idx]
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

/** This is the handler of command: `mmr test react` */
function doReact() {
  return Object.assign(metadata, {
    modes: [
      {
        mode: 'react',
        react: reactContent()
      }
    ]
  })
}

/** This is the handler of command: `mmr test tree` */
async function doTree() {
  return Object.assign(metadata, {
    modes: [
      {
        mode: 'tree',
        content: tree
      }
    ]
  })
}

export default (commandTree: Registrar) => {
  commandTree.listen('/test/mmr/mode', doModes(0), {
    usage: {
      docs: 'A test of MultiModalResponse mode'
    }
  })

  commandTree.listen('/test/mmr/react', doReact, {
    usage: {
      docs: 'A test of MultiModalResponse mode that presents a React component'
    }
  })

  commandTree.listen('/test/mmr/tree', doTree, {
    usage: {
      docs: 'A test of MultiModalResponse mode that presents a TreeResponse'
    }
  })

  modeOrderVariants.slice(1).forEach((_, idx) => {
    // `test mmr mode2/3/4/5` which uses modeOrderVariants[1/2/3/4]
    commandTree.listen(`/test/mmr/mode${idx + 2}`, doModes(idx + 1))
  })
}
