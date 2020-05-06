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
import { Application } from 'spectron'

import { CLI, Common, Selectors, Keys } from '@kui-shell/test'

const APP_TITLE = process.env.APP_TITLE || 'Kui'
// const CLI_PLACEHOLDER = process.env.CLI_PLACEHOLDER || 'enter your command'

const selectors = {
  APIHOST: '#openwhisk-api-host',
  NAMESPACE: '#openwhisk-namespace',
  PROMPT_BLOCK: '#main-repl .repl-active',
  PROMPT: '.filledinbelow'
}
selectors.PROMPT = `${selectors.PROMPT_BLOCK} input`

Common.localDescribe('Basic Functionality', function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  const openWindow = (app: Application) =>
    app.client
      .getWindowCount()
      .then(count => assert.strictEqual(count, 1)) // Verify that one window is open
      .then(() =>
        app.client.waitUntil(async () => {
          // Check if the window is visible
          console.log(`waiting for browser window visibility ${await app.browserWindow.isVisible()}`)
          return app.browserWindow.isVisible()
        }, CLI.waitTimeout)
      )
      .then(() => app.client.getTitle()) // Get the window's title
      .then(title => assert.strictEqual(title, APP_TITLE)) // Verify the window's title

  it('shows an initial window', () => openWindow(this.app).catch(Common.oops(this, true)))

  it('has an initial focus on the CLI prompt', () => assert.ok(this.app.client.hasFocus(selectors.PROMPT)))

  it('should do nothing when hitting escape key', async () => {
    await this.app.client.keys(Keys.ESCAPE)
    await this.app.client.waitForExist(Selectors.TERMINAL_WITH_SIDECAR_VISIBLE, 2000, true)
  })

  /* it('has the expected placeholder text in the CLI prompt', async () => {
    try {
      const attr = await this.app.client.getAttribute(selectors.PROMPT, 'placeholder')
      assert.strictEqual(attr, CLI_PLACEHOLDER)
      return await this.app.client.waitForValue(selectors.PROMPT, timeout, true) // true: expect no value in the prompt input
    } catch (err) {
      return oops(this)(err)
    }
  }) */
})

describe('bodyCss', function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  Common.localIt('should have kui.in-electron in bodyCss', async () => {
    try {
      await this.app.client.waitForExist('body.in-electron')
    } catch (err) {
      return Common.oops(this)(err)
    }
  })

  Common.remoteIt('should have kui.not-electron in bodyCss', async () => {
    try {
      await this.app.client.waitForExist('body.not-electron')
    } catch (err) {
      return Common.oops(this)(err)
    }
  })
})
