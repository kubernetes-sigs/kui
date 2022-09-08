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

import { Common, CLI } from '@kui-shell/test'

import { lastOutput, startEditing, typeAndVerify } from './commentary-util'

function expectTab(ctx: Common.ISuite, tabName: string) {
  it(`should show a rendered tab with name ${tabName}`, () => {
    return ctx.app.client
      .$(`${lastOutput(false)} .kui--markdown-tab [data-title="${tabName}"]`)
      .then(_ => _.waitForDisplayed({ timeout: CLI.waitTimeout }))
  })
}

const nSpaces = 5
const indent = (N = nSpaces) => Array(N).fill(' ').join('')

describe('commentary using remark-tabbed', function (this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  const tab1 = 'tab1'
  const tab2 = 'tab2'
  const input1 = `=== "${tab1}"\n\n${indent()}content1`
  startEditing(this)
  typeAndVerify(this, input1, input1, false)
  expectTab(this, tab1)

  typeAndVerify(this, '\n', input1 + `\n${indent()}`, false)
  expectTab(this, 'tab1')

  typeAndVerify(this, 'Backspace', input1 + `\n${indent(nSpaces - 1)}`, false)
  expectTab(this, 'tab1')

  // monaco then deletes the tab
  typeAndVerify(this, 'Backspace', input1 + '\n', false)
  expectTab(this, 'tab1')

  const input2 = `\n=== "${tab2}"\n\n${indent()}content2`
  typeAndVerify(this, input2, input1 + '\n' + input2, false)
  expectTab(this, 'tab1')
  expectTab(this, 'tab2')
})
