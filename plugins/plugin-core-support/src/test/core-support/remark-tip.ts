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

function expectTip(ctx: Common.ISuite, title: string, expanded: boolean) {
  it(`should show a rendered tip with title ${title}`, () => {
    return ctx.app.client
      .$(`${lastOutput(false)} .kui--markdown-tip[data-expanded="${expanded}"][data-title="${title}"]`)
      .then(_ => _.waitForDisplayed({ timeout: CLI.waitTimeout }))
  })
}

const nSpaces = 5
const indent = (N = nSpaces) =>
  Array(N)
    .fill(' ')
    .join('')

function tip(title: string, expanded: boolean, content = 'content') {
  return `???${expanded ? '+' : ''} tip "${title}"\n\n${indent()}${content}`
}

describe('commentary using remark-tip', function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  const expanded1 = false
  const title1 = 'titlefun'
  const input1 = tip(title1, expanded1)
  startEditing(this)
  typeAndVerify(this, input1, input1, false)
  expectTip(this, title1, expanded1)

  const expanded2 = true
  const title2 = 'titleshouldbeexpanded'
  const input2 = tip(title2, expanded2)
  startEditing(this)
  typeAndVerify(this, input2, input2, false)
  expectTip(this, title2, expanded2)
})
