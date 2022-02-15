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

import { basename, dirname, join } from 'path'
import { encodeComponent } from '@kui-shell/core'
import { Common, CLI, ReplExpect } from '@kui-shell/test'

const ROOT = join(
  dirname(require.resolve('@kui-shell/plugin-client-common/tests/data/tab-indentation-preservation1.md')),
  '..'
)

const bq1 = `
indent00
    indent10
        indent20`

const bq2 = `
indent02
    indent12
        indent22`

interface Input {
  input: string
  text: string
  blockquotes: string[]
}

const IN1: Input = {
  input: join(ROOT, 'data/tab-indentation-preservation1.md'),
  text: 'out of tab',
  blockquotes: [bq1, bq2]
}

const IN2: Input = {
  input: join(ROOT, 'data/tab-indentation-preservation2.md'),
  text: 'Tab2', // to test existence of both tabs
  blockquotes: [bq1, bq2]
}
const IN3: Input = {
  input: join(ROOT, 'data/tab-indentation-preservation3.md'),
  text: 'Bullet2',
  blockquotes: [bq1, bq2]
}
;[IN1, IN2, IN3].forEach(markdown => {
  describe(`tab indentation preservation in markdown text check ${basename(markdown.input)} ${process.env
    .MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
    before(Common.before(this))
    after(Common.after(this))

    it(`should load markdown and show expected text content`, () =>
      CLI.command(`commentary -f ${encodeComponent(markdown.input)}`, this.app)
        .then(ReplExpect.okWithString(markdown.text))
        .catch(Common.oops(this, true)))
  })

  markdown.blockquotes.forEach(bq => {
    describe(`tab indentation preservation in markdown blockquote check ${basename(markdown.input)} ${process.env
      .MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
      before(Common.before(this))
      after(Common.after(this))

      it(`should show blockquote text ${bq}`, () =>
        CLI.command(`commentary -f ${encodeComponent(markdown.input)}`, this.app)
          .then(ReplExpect.okWithString(bq))
          .catch(Common.oops(this, true)))
    })
  })
})
