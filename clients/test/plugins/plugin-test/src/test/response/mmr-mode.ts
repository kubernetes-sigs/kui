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
import { TestMMR, MMRExpectMode } from '@kui-shell/test'
import { metadata as _meta } from '../../lib/cmds/mmr-mode'

const { metadata } = _meta

const test = new TestMMR({
  metadata,
  command: 'test mmr mode'
})

// this is the expected modes result showing in the sidecar
const expectModes: MMRExpectMode[] = [
  { mode: 'text', label: 'Plain Text', content: 'test plain text', contentType: 'text/plain' },
  { mode: 'html', label: 'HTML Text', contentType: 'text/html' },
  { mode: 'markdown', contentType: 'text/markdown' },
  {
    mode: 'yaml',
    label: 'raw',
    content: 'apiVersion: this is the api version field\nkind: this is the kind field',
    contentType: 'yaml'
  }
]

const toolbarText = {
  type: 'info',
  text: 'this is the toolbar text'
}

const buttons = [{ mode: 'hi', command: 'test string', kind: 'drilldown' as const }]

test.name()
test.modes(expectModes, { testWindowButtons: true })
test.toolbarText(toolbarText)
test.toolbarButtons(buttons)
