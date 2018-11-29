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

import { ISuite } from '../../../../tests/lib/common'
import * as common from '../../../../tests/lib/common' // tslint:disable-line:no-duplicate-imports
import * as ui from '../../../../tests/lib/ui'
const { cli, selectors, sidecar } = ui

const expectConsoleToBeClear = ({ app }) => {
  return app.client.waitUntil(() => {
    return app.client.elements(selectors.PROMPT_BLOCK)
      .then(elements => elements.value.length === 1)
      /* .then(() => app.client.getAttribute('#main-repl .repl-block input', 'placeholder'))
      .then(placeholderText => placeholderText === 'enter your command') */
  })
}

describe('Clear the console', function (this: ISuite) {
  before(common.before(this))
  after(common.after(this))

  it('should have an active repl', () => cli.waitForRepl(this.app))

  // get something on the screen
  it(`should list actions`, () => cli.do('action list', this.app).then(cli.expectJustOK))

  it('should clear the console', () => cli.do('clear', this.app)
    .then(expectConsoleToBeClear)
    .catch(common.oops(this)))

  // get something on the screen
  it(`should list actions again`, () => cli.do('action list', this.app).then(cli.expectJustOK))

  const JUNK = 'junk text that should stay'
  it('should clear the console with ctrl+l', () => cli.do(JUNK, this.app, true)
    .then(() => this.app.client.keys([ui.ctrlOrMeta, 'l'])) // use control-l to clear
    .then(() => ({ app: this.app }))
    .then(expectConsoleToBeClear)
    .then(() => this.app.client.getValue(selectors.CURRENT_PROMPT))
    .then(text => assert.strictEqual(text, JUNK))
    .catch(common.oops(this)))

  // hit enter, and expect that JUNK to fail
  it(`should fail with command not found`, () => {
    return cli.do('nope', this.app)
      .then(cli.expectError(404))
      .catch(common.oops(this))
  })

  // get something on the screen
  it(`should list actions yet again`, () => cli.do('action list', this.app)
    .then(cli.expectJustOK)
    .catch(common.oops(this)))

  // see shell issue #485
  it('should clear properly despite existing prompt', () => cli.do('wipe', this.app) // wipe will change the placeholder text
    .then(() => this.app.client.keys([ui.ctrlOrMeta, 'l'])) // use control-l to clear
    .then(() => ({ app: this.app }))
    .then(expectConsoleToBeClear)
    .catch(common.oops(this)))
})
