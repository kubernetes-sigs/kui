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
import { Common, CLI, Selectors } from '@kui-shell/test'

const ROOT = join(dirname(require.resolve('@kui-shell/plugin-client-common/tests/data/tip.md')), '..')

const IN1 = {
  input: join(ROOT, 'data', 'tip.md'),
  tips: [{ title: 'XXXX', content: 'YYYY' }]
}

const IN2 = {
  input: join(ROOT, 'data', 'tip-no-title.md'),
  tips: [{ title: 'Warning', content: 'YYYY' }]
}
;[IN1, IN2].forEach(markdown => {
  describe(`markdown expandable section ${basename(markdown.input)} ${process.env.MOCHA_RUN_TARGET ||
    ''}`, function(this: Common.ISuite) {
    before(Common.before(this))
    after(Common.after(this))

    markdown.tips.forEach(tip => {
      it(`should load the markdown and show tip with title=${tip.title}`, async () => {
        try {
          await CLI.command(`commentary -f ${encodeComponent(markdown.input)}`, this.app)

          const tipSelector = Selectors.Markdown.tipWithTitle(tip.title)
          const tipElement = await this.app.client.$(tipSelector)
          await tipElement.waitForExist({ timeout: CLI.waitTimeout })

          const content = await this.app.client.$(Selectors.Markdown.tipContent(tipSelector))
          await content.waitForExist({ timeout: CLI.waitTimeout })

          await this.app.client.waitUntil(
            async () => {
              const actualText = await content.getText()
              return actualText === tip.content
            },
            { timeout: CLI.waitTimeout }
          )
        } catch (err) {
          await Common.oops(this, true)(err)
        }
      })
    })
  })
})
