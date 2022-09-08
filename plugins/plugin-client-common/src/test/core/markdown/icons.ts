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
import { Common, CLI, ReplExpect, Selectors } from '@kui-shell/test'

const ROOT = join(dirname(require.resolve('@kui-shell/plugin-client-common/tests/data/icons1.md')), '..')

interface Input {
  input: string
  text?: string
  icons: { tagName: string; className: string }[]
}

const send = { tagName: 'span', className: 'mdi mdi-send' }
const envelope = { tagName: 'i', className: 'fas fa-envelope' }

const IN1: Input = {
  input: join(ROOT, 'data/icons1.md'),
  text: '',
  icons: [send]
}

const IN2: Input = {
  input: join(ROOT, 'data/icons2.md'),
  text: '',
  icons: [send, envelope]
}

const IN3: Input = {
  input: join(ROOT, 'data/icons3.md'),
  text: '',
  icons: [send, envelope]
}

const IN4: Input = {
  input: join(ROOT, 'data/icons4.md'),
  text: 'XXXX YYYY',
  icons: [send, envelope, send]
}

const IN5: Input = {
  input: join(ROOT, 'data/icons5.md'),
  text: `${IN4.text} ${IN4.text}`,
  icons: IN4.icons.concat(IN4.icons)
}

const IN6: Input = {
  input: join(ROOT, 'data/icons6.md'),
  text: `${IN4.text}
${IN4.text}`,
  icons: IN4.icons.concat(IN4.icons)
}
;[IN1, IN2, IN3, IN4, IN5, IN6].forEach(markdown => {
  describe(`icons in markdown ${basename(markdown.input)} ${
    process.env.MOCHA_RUN_TARGET || ''
  }`, function (this: Common.ISuite) {
    before(Common.before(this))
    after(Common.after(this))

    it(`should load markdown and show expected text and icons`, async () => {
      try {
        await CLI.command(`commentary -f ${encodeComponent(markdown.input)}`, this.app).then(
          ReplExpect.okWithString(markdown.text)
        )

        const expectedIcons = markdown.icons

        await this.app.client.waitUntil(
          async () => {
            const actualIcons = await this.app.client.$$(Selectors.Markdown.icon)
            return actualIcons.length === expectedIcons.length
          },
          { timeout: CLI.waitTimeout }
        )

        await Promise.all(
          expectedIcons.map(async (expectedIcon, idx) =>
            this.app.client.waitUntil(
              async () => {
                const actualIcon = (await this.app.client.$$(Selectors.Markdown.icon))[idx]

                const actualTagName = await actualIcon.getTagName()
                const expectedTagName = expectedIcon.tagName

                const actualClassName = (await actualIcon.getAttribute('class')).replace(
                  /\s*kui--markdown-icon\s*/g,
                  ''
                )
                const expectedClassName = expectedIcon.className

                return actualTagName === expectedTagName && actualClassName === expectedClassName
              },
              { timeout: CLI.waitTimeout }
            )
          )
        )
      } catch (err) {
        await Common.oops(this, true)(err)
      }
    })
  })
})
