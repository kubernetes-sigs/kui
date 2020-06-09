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

function doEcho(this: Common.ISuite, idx: number) {
  it(`should echo ${idx}`, () =>
    CLI.command(`echo ${idx}`, this.app)
      .then(ReplExpect.okWithPtyOutput(idx.toString()))
      .catch(Common.oops(this)))
}

function doRemoveLastCommand(this: Common.ISuite) {
  it('should remove the last command and expect clear screen', async () => {
    try {
      this.app.client.click(Selectors.PROMPT_BLOCK_LAST_MENU)
      await this.app.client.waitForVisible(Selectors.BLOCK_REMOVE_BUTTON)
      this.app.client.click(Selectors.BLOCK_REMOVE_BUTTON)
      return ReplExpect.consoleToBeClear(this.app)
    } catch (err) {
      return Common.oops(this, true)
    }
  })
}

describe(`remove command output ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  const echo = doEcho.bind(this)
  const removeLastCommand = doRemoveLastCommand.bind(this)

  // here come the tests
  echo(1)
  removeLastCommand()
  echo(2)
  removeLastCommand()
})
