/*
 * Copyright 2017 The Kubernetes Authors
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

import { Common, CLI, Keys, ReplExpect, Selectors } from '@kui-shell/test'

describe('command history plain', function (this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  Common.proxyIt('should cd to the test dir', () =>
    CLI.command(`cd ${process.env.TEST_ROOT}`, this.app)
      .then(ReplExpect.okWithString('packages/test'))
      .catch(Common.oops(this, true))
  )

  const listCommand = 'lls ../..'
  it('should list local files', () =>
    CLI.command(listCommand, this.app).then(ReplExpect.okWith('README.md')).catch(Common.oops(this, true)))

  it('should hit the up arrow and see previous command', async () => {
    try {
      await this.app.client.keys(Keys.ctrlP)

      let idx = 0
      await this.app.client.waitUntil(
        async () => {
          const promptValue = await this.app.client.$(Selectors.PROMPT_FINAL).then(_ => _.getValue())
          if (++idx > 5) {
            console.error(`still waiting for expectedPromptValue=${listCommand}; actualPromptValue=${promptValue}`)
          }
          return promptValue === listCommand
        },
        { timeout: CLI.waitTimeout }
      )
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })

  it('should hit the down arrow and see previous command', async () => {
    try {
      await this.app.client.keys(Keys.ctrlN)

      let idx = 0
      await this.app.client.waitUntil(
        async () => {
          const promptValue = await this.app.client.$(Selectors.PROMPT_FINAL).then(_ => _.getValue())
          if (++idx > 5) {
            console.error(`still waiting for empty prompt; actualPromptValue=${promptValue}`)
          }
          return promptValue.length === 0
        },
        { timeout: CLI.waitTimeout }
      )
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })

  // 1 says it better be the last command we executed
  it(`should list history with filter 1`, () =>
    CLI.command(`history 1 lls`, this.app).then(ReplExpect.okWithOnly(listCommand)).catch(Common.oops(this, true)))

  it(`should list history 2 and show the list command`, () =>
    CLI.command(`history 2`, this.app).then(ReplExpect.okWith(listCommand)).catch(Common.oops(this, true)))

  // get something on the screen
  it(`should list local files again`, () =>
    CLI.command(listCommand, this.app).then(ReplExpect.okWith('README.md')).catch(Common.oops(this, true)))

  it('should re-execte from history via mouse click', async () => {
    try {
      const res = await CLI.command('history 5 lls', this.app)
      const N = (await ReplExpect.okWithCustom({ passthrough: true })(res)) as any as number
      const selector = `${Selectors.LIST_RESULTS_N(N)}:last-child .entity-name .clickable`
      await this.app.client.$(selector).then(_ => _.waitForDisplayed())
      await this.app.client.$(selector).then(_ => _.click())
      return ReplExpect.okWith('README.md')(await CLI.lastBlock(this.app, 2))
    } catch (err) {
      Common.oops(this, true)(err)
    }
  })

  it(`should list history with no arguments and show the list command`, () =>
    CLI.command(`history`, this.app).then(ReplExpect.okWith(listCommand)))

  it(`should list history with filter, expect nothing`, () =>
    CLI.command(`history gumbogumbo`, this.app)
      .then(ReplExpect.okWithCustom({ selector: Selectors._TABLE_EMPTY }))
      .catch(Common.oops(this, true)))

  it(`should delete command history`, () =>
    CLI.command(`history -c`, this.app).then(ReplExpect.justOK).catch(Common.oops(this, true)))

  it(`should list history with no args after delete and expect nothing`, () =>
    CLI.command(`history`, this.app)
      .then(ReplExpect.okWithCustom({ selector: Selectors._TABLE_EMPTY }))
      .catch(Common.oops(this, true)))

  it(`should list history with idx arg after delete and expect only the previous`, () =>
    CLI.command(`history 10`, this.app).then(ReplExpect.okWithOnly('history')).catch(Common.oops(this, true)))

  it(`should delete command history again`, () =>
    CLI.command(`history -c`, this.app).then(ReplExpect.justOK).catch(Common.oops(this, true)))

  it(`should list history with idx and filter args after delete and expect nothing`, () =>
    CLI.command(`history 10 lls`, this.app)
      .then(ReplExpect.okWithCustom({ selector: Selectors._TABLE_EMPTY }))
      .catch(Common.oops(this, true)))
})
