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

import { Common, CLI, ReplExpect, Selectors, Util } from '@kui-shell/test'

const outputs = ['smurf', 'dragon']
const inputs = outputs.map(_ => Buffer.from(_).toString('base64'))

import { doSplitViaButton } from '../core-support2/split-helpers'
import { tabButtonSelector } from '../../lib/cmds/tab-management'

describe('block copy paste command', function (this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))
  Util.closeAllExceptFirstTab.bind(this)()

  const exec = async (idx = 0) => {
    const res = await CLI.command(`base64 --decode ${inputs[idx]}`, this.app)
    await ReplExpect.okWithString(outputs[idx])(res)
    return res.count
  }

  const focusBlock = async (N: number) => {
    await this.app.client.$(Selectors.PROMPT_CONTEXT_N(N)).then(_ => _.click())
  }

  const execAndCopy = async () => {
    const N = await exec()
    await focusBlock(N)
    await this.app.client.waitUntil(() => this.app.client.$(Selectors.PROMPT_BLOCK_N(N)).then(_ => _.isFocused()), {
      timeout: CLI.waitTimeout
    })
    await this.app.client.execute(() => document.execCommand('copy'))
    return N
  }

  /**
   * @param N the block index to cut
   *
   */
  const cut = async (N: number) => {
    await focusBlock(N)
    await this.app.client.execute(() => document.execCommand('cut'))
  }

  /**
   * @param N the block index in which we expect to find the pasted block
   * @param idx index into the `outputs[]` variable; i.e. a pointer to the expected string
   * @param splitIndex the split index in which we expect to find the pasted block
   *
   */
  const pasteAndVerify = async (N: number, idx = 0, splitIndex = 1) => {
    await this.app.client.execute(() => document.execCommand('paste'))
    await ReplExpect.okWithString(outputs[idx])({ app: this.app, count: N, splitIndex })
  }

  it('block copy by keeping the focus on the prior context', async () => {
    try {
      const N = await execAndCopy()
      await pasteAndVerify(N + 1)
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })

  it('should execute an intervening new base64', () => exec(1).catch(Common.oops(this, true)))

  const expectBlockCount = ReplExpect.blockCount.bind(this)
  it('block copy by focusing on the next active prompt, then cut', async () => {
    try {
      const N = await execAndCopy()
      await CLI.grabFocus(this.app) // focus on the next active prompt
      await pasteAndVerify(N + 1)

      await cut(N + 1)
      await expectBlockCount()
        .inSplit(1)
        .is(N + 1)

      await cut(N)
      await expectBlockCount().inSplit(1).is(N)

      await cut(N - 1)
      await expectBlockCount()
        .inSplit(1)
        .is(N - 1)
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })

  it('click new tab button', () =>
    this.app.client
      .$(tabButtonSelector)
      .then(_ => _.click())
      .then(() => this.app.client.$(Selectors.TAB_SELECTED_N(2)))
      .then(_ => _.waitForDisplayed())
      .then(() => CLI.waitForRepl(this.app)) // should have an active repl
      .catch(Common.oops(this, true)))

  it('should paste the block in the new tab', async () => {
    try {
      const N = await CLI.nOfCurrentBlock(this.app)
      await pasteAndVerify(N, 1) // re: 1, since we cut until we reached the "intervening new base64"
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })

  it('should create a new split via button click and paste the block in that new split', async () => {
    try {
      const splitIndex = 2
      await doSplitViaButton(this, splitIndex)
      const N = await CLI.nOfCurrentBlock(this.app, splitIndex)
      await pasteAndVerify(N, 1, splitIndex) // re: 1, same as above!
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })
})
