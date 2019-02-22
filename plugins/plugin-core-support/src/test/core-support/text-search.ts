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

import * as assert from 'assert'

import { ISuite } from '@kui-shell/core/tests/lib/common'
import * as common from '@kui-shell/core/tests/lib/common' // tslint:disable-line:no-duplicate-imports
import * as ui from '@kui-shell/core/tests/lib/ui'
const { cli, keys, selectors, sidecar } = ui

describe('Text search', function (this: ISuite) {
  before(common.before(this))
  after(common.after(this))

  it('should open the search bar when cmd+f is pressed', () => this.app.client.keys([ui.ctrlOrMeta, 'f'])
    .then(() => this.app.client.isVisible('#search-bar'))
    .then(r => assert.ok(r, 'search-bar visible'))
    .catch(common.oops(this)))

  it('should not close the search bar if pressing esc outside of search input', () => this.app.client.click(ui.selectors.CURRENT_PROMPT_BLOCK)
    .then(() => this.app.client.keys(keys.ESCAPE))
    .then(() => this.app.client.isVisible('#search-bar'))
    .then(r => assert.ok(r, 'assert if search-bar is visible'))
    .catch(common.oops(this)))

  it('should focus on search input when search input is pressed', () => this.app.client.click('#search-input')
    .then(() => this.app.client.hasFocus('#search-input'))
    .then(r => assert.ok(r, 'assert if search-input is focused'))
    .catch(common.oops(this)))

  it('should close the search bar if pressing esc in search input', () => this.app.client.setValue('#search-input', keys.ESCAPE)
    .then(() => this.app.client.waitForVisible('#search-bar', 2000, false))
    .catch(common.oops(this)))

  // re-open, so that we can test the close button
  it('should open the search bar when cmd+f is pressed', () => this.app.client.keys([ui.ctrlOrMeta, 'f'])
    .then(() => this.app.client.isVisible('#search-bar'))
    .then(r => assert.ok(r, 'search-bar visible'))
    .catch(common.oops(this)))

  // 2 matches test
  it('should close the search bar if clicking the close button', () => this.app.client.click('#search-close-button')
    .then(() => this.app.client.waitForVisible('#search-bar', 2000, false))
    .catch(common.oops(this)))
  it('should add grumble to the repl', () => cli.do('grumble', this.app)
    .then(cli.expectError(404))
    .catch(common.oops(this)))
  it('should add another grumble to the repl', () => cli.do('grumble', this.app)
    .then(cli.expectError(404))
    .catch(common.oops(this)))
  it('should find 2 matches for grumble', async () => {
    try {
      this.app.client.keys([ui.ctrlOrMeta, 'f'])
      await this.app.client.waitForVisible('#search-bar')
      await this.app.client.waitUntil(() => this.app.client.hasFocus('#search-input'))
      await this.app.client.waitUntil(async () => {
        await this.app.client.setValue('#search-input', `grumble${keys.ENTER}`)
        const txt = await this.app.client.getText('#search-found-text')
        return txt === '2 matches'
      })
    } catch (err) {
      common.oops(this)(err)
    }
  })

  // 1 match test
  it('should close the search bar if clicking the close button', () => this.app.client.click('#search-close-button')
    .then(() => this.app.client.waitForVisible('#search-bar', 2000, false))
    .catch(common.oops(this)))
  it('should add bojangles to the repl', () => cli.do('bojangles', this.app)
    .then(cli.expectError(404))
    .catch(common.oops(this)))
  it('should find 1 match for bojangles', () => this.app.client.keys([ui.ctrlOrMeta, 'f'])
    .then(() => this.app.client.waitForVisible('#search-bar'))
    .then(() => this.app.client.hasFocus('#search-input'))
    .then(r => assert.ok(r, 'assert if search-input is focused'))
    .then(() => this.app.client.waitUntil(async () => {
      await this.app.client.setValue('#search-input', `bojangles${keys.ENTER}`)
      const txt = await this.app.client.getText('#search-found-text')
      return txt === '1 match'
    }))
    .catch(common.oops(this)))

  // no matches test
  it('should close the search bar if clicking the close button', () => this.app.client.click('#search-close-button')
    .then(() => this.app.client.waitForVisible('#search-bar', 2000, false))
    .catch(common.oops(this)))
  // re-open, so that we can test entering text and hitting enter
  it('should find nothing when searching for waldo', () => this.app.client.keys([ui.ctrlOrMeta, 'f'])
    .then(() => this.app.client.waitForVisible('#search-bar'))
    .then(() => this.app.client.hasFocus('#search-input'))
    .then(r => assert.ok(r, 'assert if search-input is focused'))
    .then(() => this.app.client.waitUntil(async () => {
      await this.app.client.setValue('#search-input', `waldo${keys.ENTER}`)
      const txt = await this.app.client.getText('#search-found-text')
      return txt === 'no matches'
    }))
    .catch(common.oops(this)))

  // paste test
  it('should close the search bar if clicking the close button', () => this.app.client.click('#search-close-button')
    .then(() => this.app.client.waitForVisible('#search-bar', 2000, false))
    .catch(common.oops(this)))
  it('should paste into the text search box', () => this.app.client.keys([ui.ctrlOrMeta, 'f'])
    .then(() => this.app.client.waitForVisible('#search-bar'))
    .then(() => this.app.client.hasFocus('#search-input'))
    .then(r => assert.ok(r, 'assert if search-input is focused'))
    .then(() => this.app.electron.clipboard.writeText('grumble'))
    .then(() => this.app.client.execute(() => document.execCommand('paste')))
    .then(() => this.app.client.getValue('#search-input'))
    .then(actual => assert.strictEqual(actual, 'grumble')) // paste made it to #search-input?
    .catch(common.oops(this)))
})
