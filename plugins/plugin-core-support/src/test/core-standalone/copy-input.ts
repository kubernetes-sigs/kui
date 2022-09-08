/*
 * Copyright 2020 The Kubernetes Authors
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

describe(`copy command input ${process.env.MOCHA_RUN_TARGET || ''}`, function (this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  const echoText = 'roadhouse'
  const command = `echo ${echoText}`
  it(`should ${command} then copy that input`, async () => {
    try {
      const res = await CLI.command(command, this.app)
      await ReplExpect.okWithPtyOutput(echoText)(res)

      const N = res.count
      await this.app.client.$(Selectors.PROMPT_N(N)).then(_ => _.moveTo())

      const copyButton = await this.app.client.$(Selectors.COMMAND_COPY_BUTTON(N))
      await copyButton.waitForDisplayed()
      await copyButton.click()

      await this.app.client.$(Selectors.COMMAND_COPY_DONE_BUTTON(N)).then(_ => _.waitForDisplayed())
      await this.app.client.$(Selectors.COMMAND_COPY_DONE_BUTTON(N)).then(_ => _.waitForDisplayed())
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })

  it(`should past the command: ${command} in the next block`, async () => {
    try {
      await this.app.client.$(Selectors.CURRENT_PROMPT_BLOCK).then(async _ => {
        await _.waitForExist()
        await _.click()
      })
      await this.app.client.execute(() => document.execCommand('paste'))

      let idx = 0
      await this.app.client.waitUntil(
        async () => {
          const actualValue = await this.app.client.$(Selectors.CURRENT_PROMPT).then(_ => _.getValue())
          if (++idx > 5) {
            console.error(`still waiting for text actualValue=${actualValue} expectedValue=${command}`)
          }

          return command === actualValue
        },
        { timeout: CLI.waitTimeout }
      )
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })
})
