/*
 * Copyright 2022 The Kubernetes Authors
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

import { dirname, join } from 'path'
import { encodeComponent } from '@kui-shell/core'
import { Common, CLI, ReplExpect, Selectors, Util } from '@kui-shell/test'

const ROOT = join(dirname(require.resolve('@kui-shell/plugin-client-common/tests/data/snippet1.md')), '..')

interface Input {
  input: string
  content: string
  tips?: { title: string; content: string }[]
}

const aContent = '222'
const bContent = '333'
const cContent = `TipTitle
TipContent`

const IN1: Input = {
  input: join(ROOT, 'data', 'snippet1.md'),
  content: `aaa
${aContent}
bbb
${bContent}
ccc`
}

const IN1viaUrl: Input = {
  input: join(ROOT, 'data', 'snippet-via-url.md'),
  content: IN1.content
}

const IN2: Input = {
  input: join(ROOT, 'data', 'snippet2.md'),
  content: `aaa
${aContent} ${aContent}
bbb
${bContent} ${bContent}
ccc`
}

const IN3: Input = {
  input: join(ROOT, 'data', 'snippet3.md'),
  content: `aaa
${aContent}
bbb
${cContent}
ccc`,
  tips: [{ title: 'TipTitle', content: 'TipContent' }]
}

const IN4: Input = {
  input: join(ROOT, 'data', 'snippet4.md'),
  content: IN3.content,
  tips: IN3.tips
}

const IN5: Input = {
  input: join(ROOT, 'data', 'snippets-in-tab0.md'),
  content: `AAA
echo AAA
Tab1
Tab2
BBB
echo BBB
DDD`,
  tips: []
}
;[IN1, IN1viaUrl, IN2, IN3, IN4, IN5].forEach(markdown => {
  describe(`markdown snippets hash include ${markdown.input} ${
    process.env.MOCHA_RUN_TARGET || ''
  }`, function (this: Common.ISuite) {
    before(Common.before(this))
    after(Common.after(this))
    Util.closeAllExceptFirstTab.bind(this)()

    it(`should replay ${markdown.input}`, () =>
      CLI.command(`commentary -f ${encodeComponent(markdown.input)}`, this.app)
        .then(ReplExpect.okWithString(markdown.content))
        .catch(Common.oops(this, true)))

    if (markdown.tips) {
      markdown.tips.forEach(tip => {
        it(`should show tip with title=${tip.title}`, () =>
          this.app.client
            .$(Selectors.Markdown.tipWithTitle(tip.title))
            .then(_ => _.waitForExist({ timeout: CLI.waitTimeout })))

        // this assumes a ???+ i.e. default-opened tip
        it(`should show tip with content=${tip.content}`, () =>
          this.app.client
            .$(Selectors.Markdown.tipContent(Selectors.Markdown.tipWithTitle(tip.title)))
            .then(_ => _.waitForExist({ timeout: CLI.waitTimeout })))
      })
    }
  })
})
