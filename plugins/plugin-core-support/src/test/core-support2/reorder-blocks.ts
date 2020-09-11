/*
 * Copyright 2020 IBM Corporation
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

import { Common, CLI, ReplExpect, Selectors } from '@kui-shell/test'

describe(`reorder blocks ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  const command1 = 'echo 1'
  const command2 = 'echo 2'
  const command3 = 'echo 3'
  it(`should echo 1,2,3 then reorder them to be echo 3,1,2`, async () => {
    try {
      const res1 = await CLI.command(command1, this.app)
      await ReplExpect.okWithPtyOutput('1')(res1)

      const res2 = await CLI.command(command2, this.app)
      await ReplExpect.okWithPtyOutput('2')(res2)

      const res3 = await CLI.command(command3, this.app)
      await ReplExpect.okWithPtyOutput('3')(res3)

      const N1 = res1.count
      const N2 = res2.count
      const N3 = res3.count
      await this.app.client.click(Selectors.PROMPT_N(N3))
      await this.app.client.waitForVisible(Selectors.BLOCK_UP_BUTTON(N3))
      await this.app.client.click(Selectors.BLOCK_UP_BUTTON(N3))

      await this.app.client.click(Selectors.PROMPT_N(N1))
      await this.app.client.waitForVisible(Selectors.BLOCK_DOWN_BUTTON(N1))
      await this.app.client.click(Selectors.BLOCK_DOWN_BUTTON(N1))

      let idx = 0
      await this.app.client.waitUntil(async () => {
        const [actualPrompt1, actualPrompt2, actualPrompt3] = await Promise.all([
          this.app.client.getText(Selectors.PROMPT_N(N1)),
          this.app.client.getText(Selectors.PROMPT_N(N2)),
          this.app.client.getText(Selectors.PROMPT_N(N3))
        ])

        if (++idx > 5) {
          console.error(`still waiting for text actualValue=${actualPrompt1} ${actualPrompt2} ${actualPrompt3}`)
        }

        return actualPrompt1 === command3 && actualPrompt2 === command1 && actualPrompt3 === command2
      }, CLI.waitTimeout)
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })
})
