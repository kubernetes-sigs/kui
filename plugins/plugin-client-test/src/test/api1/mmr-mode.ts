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

/**
 * This file tests "test mmr mode" command that opens the sidecar with
 * 3 text modes associated with `toolbar text` and `toolbar button`.
 *
 * See the command implementation in: plugin-test/src/lib/cmds/mmr-mode.ts
 *
 */
import { Tab } from '@kui-shell/core'
import { TestMMR, MMRExpectMode } from '@kui-shell/test'

import { MyResource } from '../../lib/models'
import { metadata as _meta } from '../../lib/cmds/mmr-mode'

const { metadata } = _meta

const expectedMarkdownContent = `hello world
aaa
bbbb
sub
hi`

const expectReact: MMRExpectMode = {
  mode: 'react',
  selector: '.kui--test-react-mode-content',
  innerText: 'Hello world',
  contentType: 'react'
}

// this is the expected modes result showing in the sidecar
const expectModes: MMRExpectMode[] = [
  { mode: 'text', label: 'T1', content: 'test plain text 5', contentType: 'text/plain' },
  { mode: 'text2', label: 'T2', content: 'plain as day', contentType: 'text/plain' },
  { mode: 'text3', label: 'T3', content: 'hello world', contentType: 'text/plain' },
  { mode: 'text4', label: 'T4', content: expectedMarkdownContent, contentType: 'text/markdown' },
  { mode: 'table', label: 'Tbl1', nRows: 25, nCells: 50, contentType: 'table' },
  { mode: 'html', label: 'H', contentType: 'text/html' },
  { mode: 'm', contentType: 'text/markdown' },
  {
    mode: 'yaml',
    label: 'R',
    editor: true,
    content: { apiVersion: 'this is the api version field', kind: 'this is the kind field' },
    contentType: 'yaml'
  }
]

function swapToFirst(modes: MMRExpectMode[], whichMode: string) {
  const swapped = modes.slice(0)
  const idxOfNewFirst = swapped.findIndex(_ => _.mode === whichMode)
  if (idxOfNewFirst < 0) {
    throw new Error('cannot swapToFirst')
  }
  const tmp = swapped[0]
  swapped[0] = swapped[idxOfNewFirst]
  swapped[idxOfNewFirst] = tmp
  return swapped
}

const expectModes2 = swapToFirst(expectModes, 'table')
const expectModes3 = swapToFirst(expectModes, 'text2')
const expectModes4 = swapToFirst(expectModes, 'text3')
const expectModes5 = swapToFirst(expectModes, 'html')

const testDefault = new TestMMR({
  metadata,
  testName: 'test mmr mode',
  command: 'test mmr mode'
})
const testDefault2 = new TestMMR({
  metadata,
  testName: 'test mmr mode2',
  command: 'test mmr mode2'
})
const testDefault3 = new TestMMR({
  metadata,
  testName: 'test mmr mode3',
  command: 'test mmr mode3'
})
const testDefault4 = new TestMMR({
  metadata,
  testName: 'test mmr mode4',
  command: 'test mmr mode4'
})
const testDefault5 = new TestMMR({
  metadata,
  testName: 'test mmr mode5',
  command: 'test mmr mode5'
})

const testReact = new TestMMR({
  metadata,
  testName: 'test mmr react',
  command: 'test mmr react'
})

const testDiff = new TestMMR({
  metadata,
  testName: 'test mmr diff',
  command: 'test mmr diff'
})

const testOrder = new TestMMR({
  testName: 'change order',
  metadata,
  command: 'test mmr mode --defaultMode html'
})

const toolbarText = {
  type: 'info',
  text: 'this is the toolbar text'
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
    command: (tab: Tab, resource: MyResource) => `test string --grumble {resource.grumble}`,
    kind: 'drilldown' as const
  },
  {
    mode: 'b5',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    command: (tab: Tab, resource: MyResource) => `some non-existant command`,
    kind: 'drilldown' as const,
    expectError: 127 as const
  },
  { mode: 'hi', command: 'test string', kind: 'drilldown' as const }
]

testReact.modes([expectReact], expectReact)
testReact.toolbarText({
  type: 'info',
  text: 'hello this is iter',
  exact: false
})

testDiff.diffPlainText('diff', 'barrrrrrrrr')
testDefault.name({})
testDefault.modes(expectModes, expectModes[0])
testDefault2.modes(expectModes2, expectModes2[0])
testDefault3.modes(expectModes3, expectModes3[0])
testDefault4.modes(expectModes4, expectModes4[0])
testDefault5.modes(expectModes5, expectModes5[0])
testDefault.toolbarText(toolbarText)
testDefault.toolbarButtons(buttons)
testOrder.modes(
  expectModes,
  expectModes.find(_ => _.mode === 'html')
)
