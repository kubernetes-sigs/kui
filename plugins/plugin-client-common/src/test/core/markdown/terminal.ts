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
import { Common, CLI, ReplExpect, Selectors, Util } from '@kui-shell/test'

const timeout = { timeout: CLI.waitTimeout }
const ROOT = join(dirname(require.resolve('@kui-shell/plugin-client-common/tests/data/terminal1.md')), '..')

interface Input {
  input: string
  splits: {
    text: string
    isTerminal?: boolean
    inverseColors?: boolean
  }[]
}

const IN1: Input = {
  input: join(ROOT, 'data/terminal1.md'),
  splits: [{ text: 'XXXX', isTerminal: true }, { text: 'YYYY' }]
}

const IN2: Input = {
  input: join(ROOT, 'data/terminal2.md'),
  splits: [{ text: IN1.splits[0].text }, { text: IN1.splits[1].text, isTerminal: true }]
}

const IN3: Input = {
  input: join(ROOT, 'data/terminal3.md'),
  splits: [IN2.splits[0], { text: IN2.splits[1].text, isTerminal: true, inverseColors: true }]
}
;[IN1, IN2, IN3].forEach(markdown => {
  describe(`terminals in markdown ${basename(markdown.input)} ${
    process.env.MOCHA_RUN_TARGET || ''
  }`, function (this: Common.ISuite) {
    before(Common.before(this))
    after(Common.after(this))
    Util.closeAllExceptFirstTab.bind(this)()

    it(`should load markdown and show expected terminal split configuration`, async () => {
      try {
        await CLI.command(`replay ${encodeComponent(markdown.input)}`, this.app)

        await Promise.all(
          markdown.splits.map(async (split, idx) => {
            const splitIdx = idx + 1

            await this.app.client.waitUntil(async () => {
              const actualText = await this.app.client.$(Selectors.SPLIT_N(splitIdx)).then(_ => _.getText())
              return actualText.includes(split.text)
            }, timeout)

            if (split.inverseColors) {
              await this.app.client.$(Selectors.SPLIT_N(splitIdx, true)).then(_ => _.waitForExist(timeout))
            }

            if (split.isTerminal) {
              const activePrompt = this.app.client.$(Selectors.CURRENT_PROMPT_FOR_SPLIT(splitIdx))
              await activePrompt.waitForExist(timeout)

              await CLI.commandInSplit('kuiecho AAAA', this.app, splitIdx).then(ReplExpect.okWithString('AAAA'))

              await CLI.commandInSplit('kuiecho BBBB', this.app, splitIdx).then(ReplExpect.okWithString('BBBB'))

              await CLI.commandInSplit('kuiecho CCCC', this.app, splitIdx).then(ReplExpect.okWithString('CCCC'))
            }
          })
        )
      } catch (err) {
        await Common.oops(this, true)(err)
      }
    })
  })
})
