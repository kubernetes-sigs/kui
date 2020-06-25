/*
 * Copyright 2019 IBM Corporation
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

import { Common, CLI, Selectors, ReplExpect } from '@kui-shell/test'

const tabButtonSelector = '#new-tab-button'

describe('core new tab switch tabs', function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  it('new tab via command', () =>
    CLI.command('tab new', this.app)
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(2)))
      .then(() => CLI.waitForSession(this)) // should have an active repl
      .catch(Common.oops(this, true)))

  it(`switch back to first tab via command`, () =>
    CLI.command('tab switch 1', this.app)
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(1)))
      .catch(Common.oops(this, true)))

  it(`switch back to second tab via command`, () =>
    CLI.command('tab switch 2', this.app)
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(2)))
      .catch(Common.oops(this, true)))

  it('should close tab via "tab close" command', () =>
    CLI.command('tab close', this.app)
      .then(() => this.app.client.waitForExist(Selectors.TAB_N(2), 5000, true))
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(1)))
      .then(() => CLI.waitForRepl(this.app)) // should have an active repl
      .catch(Common.oops(this, true)))
})

describe('core new tab from pty active tab via button click', function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  it('start vi, then new tab via button click', () =>
    CLI.command('vi', this.app)
      .then(() => this.app.client.waitForExist(Selectors.NOSPLIT_ALT_BUFFER_N(1)))
      .then(() => this.app.client.click(tabButtonSelector))
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(2)))
      .then(() => CLI.waitForSession(this)) // should have an active repl
      .catch(Common.oops(this, true)))

  it('should report proper version', () =>
    CLI.command('version', this.app)
      .then(ReplExpect.okWithCustom({ expect: Common.expectedVersion }))
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(2)))
      .catch(Common.oops(this, true)))
})
