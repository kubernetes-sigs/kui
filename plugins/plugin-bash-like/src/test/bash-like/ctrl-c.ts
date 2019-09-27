/*
 * Copyright 2017-18 IBM Corporation
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
import { Application } from 'spectron'

import { Common, CLI, Keys, ReplExpect, Selectors, Util } from '@kui-shell/test'

describe(`Cancel via Ctrl+C ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  const cancel = (app: Application, cmd = '') =>
    app.client
      .waitForExist(Selectors.CURRENT_PROMPT_BLOCK)
      .then(() => app.client.getAttribute(Selectors.CURRENT_PROMPT_BLOCK, 'data-input-count'))
      .then(count => parseInt(count, 10))
      .then(count =>
        app.client
          .keys(cmd)
          .then(() => app.client.keys(Keys.ctrlC))
          .then(() => ({ app: app, count: count }))
          .then(ReplExpect.blank)
          .then(() => app.client.getValue(Selectors.PROMPT_N(count))) // make sure the cancelled command text is still there, in the previous block
          .then(input => assert.strictEqual(input, cmd))
      )
      .catch(Common.oops(this))

  it('should hit ctrl+c', () => cancel(this.app))
  it('should type foo and hit ctrl+c', () => cancel(this.app, 'foo'))

  const echoThisString = 'hi'
  Common.localIt('should initiate a command that completes with some delay', async () => {
    try {
      const res = await CLI.command(`/bin/sleep 10 && echo ${echoThisString}`, this.app)

      // we want the ctrlC to go to the xterm input; we need to wait for it to be visible
      // TODO this belongs elsewhere
      await Util.waitForXtermInput(this.app, res.count)

      await new Promise(resolve => setTimeout(resolve, 2000))

      await this.app.client.keys(Keys.ctrlC)
      return this.app.client.waitUntil(async () => {
        const actualText = await this.app.client.getText(Selectors.OUTPUT_N(res.count))
        return /\^C/.test(actualText)
      })
    } catch (err) {
      Common.oops(this)(err)
    }
  })
})
