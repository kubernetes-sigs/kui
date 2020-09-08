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

import * as assert from 'assert'

import { Common, CLI, ReplExpect, Selectors } from '@kui-shell/test'

describe(`insert command ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  // here come the tests
  it(`should show version then insert a block before`, async () => {
    try {
      const res1 = await CLI.command('version', this.app)
      await ReplExpect.okWithCustom({ expect: Common.expectedVersion })(res1)

      const N = res1.count
      this.app.client.click(Selectors.PROMPT_BLOCK_MENU(N))
      await this.app.client.waitForVisible(Selectors.BLOCK_INSERT_BUTTON)
      await this.app.client.click(Selectors.BLOCK_INSERT_BUTTON)

      await CLI.command('# show version', this.app)
      await this.app.client.waitForVisible(`${Selectors.OUTPUT_N(N)} ${Selectors.TERMINAL_CARD}`)
      const title: string = await this.app.client.getText(`${Selectors.OUTPUT_N(N)} ${Selectors.TERMINAL_CARD}`)
      assert.strictEqual(title, 'show version')

      await this.app.client.waitForVisible(`${Selectors.OUTPUT_N(N + 1)}`)
      const version: string = await this.app.client.getText(`${Selectors.OUTPUT_N(N + 1)}`)
      assert.strictEqual(version, Common.expectedVersion)
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })

  it(`should report proper version`, () =>
    CLI.command('version', this.app)
      .then(ReplExpect.okWithCustom({ expect: Common.expectedVersion }))
      .catch(Common.oops(this, true)))
})
