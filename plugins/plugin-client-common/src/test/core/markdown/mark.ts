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
import { Common, CLI, Selectors, Util } from '@kui-shell/test'

const ROOT = join(dirname(require.resolve('@kui-shell/plugin-client-common/tests/data/marktag1.md')), '..')

interface Input {
  input: string
  marks: string[]
  tabs?: string[]
}

const IN1: Input = {
  input: join(ROOT, 'data/marktag1.md'),
  marks: ['Markymark']
}

const IN2: Input = {
  input: join(ROOT, 'data/marktag2.md'),
  marks: IN1.marks.concat(['Morkymork'])
}

const IN3: Input = {
  input: join(ROOT, 'data/marktag3.md'),
  marks: IN2.marks,
  tabs: ['Tab1Title', 'Tab2Title']
}

const IN4: Input = {
  input: join(ROOT, 'data/marktag4.md'),
  marks: IN3.marks.concat(['Mirkymirk']), // no 'Merkymerk' is it in Tab2, not yet rendered
  tabs: IN3.tabs
}
;[IN1, IN2, IN3, IN4].forEach(markdown => {
  describe(`mark tags in markdown ${basename(markdown.input)} ${
    process.env.MOCHA_RUN_TARGET || ''
  }`, function (this: Common.ISuite) {
    before(Common.before(this))
    after(Common.after(this))
    Util.closeAllExceptFirstTab.bind(this)()

    it(`should load markdown and show ${markdown.marks.length} mark tags`, async () => {
      try {
        await CLI.command(`commentary -f ${encodeComponent(markdown.input)}`, this.app)
        await this.app.client.waitUntil(async () => {
          const marks = await this.app.client.$$('mark')
          return marks.length === markdown.marks.length
        })

        await Promise.all(
          markdown.marks.map(async mark => {
            await this.app.client.waitUntil(async () => {
              const marks = await this.app.client.$$('mark')
              const texts = await Promise.all(marks.map(_ => _.getText()))
              return texts.includes(mark)
            })
          })
        )

        if (markdown.tabs) {
          await Promise.all(
            markdown.tabs.map(tabTitle =>
              this.app.client
                .$(Selectors.Markdown.tabWithTitle(tabTitle))
                .then(_ => _.waitForExist({ timeout: CLI.waitTimeout }))
            )
          )
        }
      } catch (err) {
        await Common.oops(this, true)(err)
      }
    })
  })
})
