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
 * This file tests "test mmr mode" command that opens the sidecar with
 * 3 text modes associated with `toolbar text` and `toolbar button`.
 *
 * See the command implementation in: plugin-test/src/lib/cmds/mmr-mode.ts
 *
 */
import { UI } from '@kui-shell/core'
import { TestMMR, MMRExpectMode } from '@kui-shell/test'

import { MyResource } from '../../lib/models'
import { metadata as _meta } from '../../lib/cmds/mmr-mode'

const { metadata } = _meta

const testDefault = new TestMMR({
  metadata,
  testName: 'test mmr mode',
  command: 'test mmr mode'
})

const testOrder = new TestMMR({
  testName: 'change order',
  metadata,
  command: 'test mmr mode --defaultMode html'
})

// this is the expected modes result showing in the sidecar
const expectModes: MMRExpectMode[] = [
  { mode: 'text', label: 'T1', content: 'test plain text 5', contentType: 'text/plain' },
  { mode: 'text2', label: 'T2', content: 'plain as day', contentType: 'text/plain' },
  { mode: 'text3', label: 'T3', content: 'hello world', contentType: 'text/plain' },
  { mode: 'table', label: 'Tbl1', nRows: 2, nCells: 4, contentType: 'table' },
  { mode: 'html', label: 'H', contentType: 'text/html' },
  { mode: 'm', contentType: 'text/markdown' },
  {
    mode: 'yaml',
    label: 'R',
    content: 'apiVersion: this is the api version field\nkind: this is the kind field',
    contentType: 'yaml'
  }
]

const toolbarText = {
  type: 'info',
  text: 'this is the toolbar text'
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
    command: (tab: UI.Tab, resource: MyResource) => `test string --grumble {resource.grumble}`,
    kind: 'drilldown' as const
  },
  {
    mode: 'b5',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    command: (tab: UI.Tab, resource: MyResource) => `some non-existant command`,
    kind: 'drilldown' as const,
    expectError: 404 as const
  },
  { mode: 'hi', command: 'test string', kind: 'drilldown' as const }
]

testDefault.name({ onclick: { name: { command: 'test string', expect: 'hello world' } } })
testDefault.modes(expectModes, expectModes[0], { testWindowButtons: true })
testDefault.toolbarText(toolbarText)
testDefault.toolbarButtons(buttons)
testOrder.modes(expectModes, expectModes[4])
