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

import { ISuite } from '../../../../tests/lib/common'
import * as common from '../../../../tests/lib/common' // tslint:disable-line:no-duplicate-imports
import * as ui from '../../../../tests/lib/ui'
const { cli, selectors, sidecar } = ui

describe('Cancel via Ctrl+C', function (this: ISuite) {
  before(common.before(this))
  after(common.after(this))

  it('should have an active repl', () => cli.waitForRepl(this.app))

  const cancel = (app, cmd = '') => app.client.waitForExist(ui.selectors.CURRENT_PROMPT_BLOCK)
    .then(() => app.client.getAttribute(ui.selectors.CURRENT_PROMPT_BLOCK, 'data-input-count'))
    .then(count => parseInt(count, 10))
    .then(count => app.client.keys(cmd)
      .then(() => app.client.execute('repl.doCancel()'))
      .then(() => ({ app: app, count: count }))
      .then(cli.expectBlank)
      .then(() => app.client.getValue(ui.selectors.PROMPT_N(count))) // make sure the cancelled command text is still there, in the previous block
      .then(input => assert.strictEqual(input, cmd)))
    .catch(common.oops(this))

  it('should hit ctrl+c', () => cancel(this.app))
  it('should type foo and hit ctrl+c', () => cancel(this.app, 'foo'))

  const echoThisString = 'hi'
  it('should initiate a command that completes with some delay', async () => {
    const res = await cli.do(`sleep 3; echo ${echoThisString}`, this.app)
    await this.app.client.execute('repl.doCancel()')
    return this.app.client.waitUntil(async () => {
      const actualText = await this.app.client.getText(selectors.OUTPUT_N(res.count))
      return actualText === echoThisString
    })
  })
})
