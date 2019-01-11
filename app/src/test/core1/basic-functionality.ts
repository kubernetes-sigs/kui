/*
 * Copyright 2017 IBM Corporation
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

/**
 * A simple test to verify a visible window is opened with a title
 *
 */

import * as assert from 'assert'

import { ISuite } from '@test/lib/common'
import * as common from '@test/lib/common' // tslint:disable-line:no-duplicate-imports
import * as ui from '@test/lib/ui'

const { validateNamespace } = ui

const timeout = parseInt(process.env.TIMEOUT, 10) || 60000

const API_HOST = process.env.API_HOST || 'openwhisk.ng.bluemix.net'
const APP_TITLE = process.env.APP_TITLE || 'Kui Shell'
// const CLI_PLACEHOLDER = process.env.CLI_PLACEHOLDER || 'enter your command'

const selectors = {
  APIHOST: '#openwhisk-api-host',
  NAMESPACE: '#openwhisk-namespace',
  PROMPT_BLOCK: '#main-repl .repl-active',
  PROMPT: '.filledinbelow'
}
selectors.PROMPT = `${selectors.PROMPT_BLOCK} input`

describe('Basic Functionality', function (this: ISuite) {
  before(common.before(this))
  after(common.after(this))

  const openWindow = app => app.client.getWindowCount()
    .then(count => assert.strictEqual(count, 1)) // Verify that one window is open
    .then(() => this.app.browserWindow.isVisible()) // Check if the window is visible
    .then(isVisible => assert.strictEqual(isVisible, true)) // Verify the window is visible
    .then(() => app.client.getTitle()) // Get the window's title
    .then(title => assert.strictEqual(title, APP_TITLE)) // Verify the window's title

  it('shows an initial window', () => openWindow(this.app)
    .catch(common.oops(this)))

  it('has an initial focus on the CLI prompt', () =>
    assert.ok(this.app.client.hasFocus(selectors.PROMPT)))

  /* it('has the expected placeholder text in the CLI prompt', async () => {
    try {
      const attr = await this.app.client.getAttribute(selectors.PROMPT, 'placeholder')
      assert.strictEqual(attr, CLI_PLACEHOLDER)
      return await this.app.client.waitForValue(selectors.PROMPT, timeout, true) // true: expect no value in the prompt input
    } catch (err) {
      common.oops(this)(err)
    }
  }) */
})
