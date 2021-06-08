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
 * This file tests "test mmr mode-via-registration" command that opens the sidecar with
 * pre-registred mode and badges.
 *
 * See the command implementation in: plugin-test/src/lib/cmds/mmr-mode-via-registration.ts
 *
 */
import { TestMMR, MMRExpectMode } from '@kui-shell/test'

import { metadata as _meta } from '../../lib/cmds/mmr-mode-via-registration'

const { metadata } = _meta

const testRegistrationOnly = new TestMMR({
  testName: 'mmr-mode-via-registration-registrationOnly',
  metadata,
  command: 'test mmr mode-via-registration --registrationOnly'
})

const testRegistrationOnlyWithShow = new TestMMR({
  testName: 'mmr-mode-via-registration-with-show',
  metadata,
  command: 'test mmr mode-via-registration --registrationOnly --show mode2'
})

const testRegistrationWithModes = new TestMMR({
  testName: 'mmr-mode-via-registration',
  metadata,
  command: 'test mmr mode-via-registration'
})

const expectedMarkdownContent = `hello world
aaa
bbbb
sub
hi`

const modes: MMRExpectMode[] = [
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

// these modes come from the mode registrations in preload.ts
const modesFromRegistration: MMRExpectMode[] = [
  { mode: 'mode1', content: 'yo: this is mode1', contentType: 'text/plain' },
  { mode: 'mode2', content: 'this is mode2', contentType: 'text/plain' },
  { mode: 'mode3', label: 'mode3 label', contentType: 'text/markdown' },
  { mode: 'mode5', label: 'mode5 label', content: 'hello world', contentType: 'text/plain' }
]

const buttonFromRegistration = [
  { mode: 'button1', label: 'button1 label', command: 'test string', kind: 'drilldown' as const },
  {
    mode: 'button2',
    label: 'button2 label',
    command: 'test string',
    kind: 'drilldown' as const
  }
]

// see implementation in src/lib/modes
testRegistrationWithModes.badges([
  { title: 'badge1' },
  { title: 'badge2', css: 'red-background' },
  { title: 'badge3', css: 'green-background' }
])
testRegistrationWithModes.modes(modes.concat(modesFromRegistration), modes[0])
testRegistrationWithModes.toolbarButtons(buttonFromRegistration)

testRegistrationOnly.modes(modesFromRegistration, modesFromRegistration[0])
testRegistrationOnly.toolbarButtons(buttonFromRegistration)

// iterate back and forth between these two, to make sure there is no
// erroneous state transfer across the mode models
testRegistrationOnlyWithShow.modes(modesFromRegistration, modesFromRegistration[1])
testRegistrationWithModes.modes(modes.concat(modesFromRegistration), modes[0])
testRegistrationOnlyWithShow.modes(modesFromRegistration, modesFromRegistration[1])
testRegistrationWithModes.modes(modes.concat(modesFromRegistration), modes[0])
