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

import { Common, CLI, ReplExpect, SidecarExpect, Selectors, Keys } from '@kui-shell/test'

import { tabButtonSelector } from '../../lib/cmds/tab-management'

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

Common.localDescribe('core new tab switch tabs via keyboard shortcuts', function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  it('new tab via command', () =>
    CLI.command('tab new', this.app)
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(2)))
      .then(() => CLI.waitForSession(this)) // should have an active repl
      .catch(Common.oops(this, true)))

  if (process.platform === 'darwin') {
    it(`switch back to first tab via keyboard shortcut: meta+1`, () =>
      this.app.client
        .keys([Keys.META, Keys.Numpad1, 'NULL'])
        .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(1)))
        .catch(Common.oops(this, true)))

    it(`switch back to second tab via keyboard shortcut: meta+2`, () =>
      this.app.client
        .keys([Keys.META, Keys.Numpad2, 'NULL'])
        .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(2)))
        .catch(Common.oops(this, true)))
  }

  it(`switch back to first tab via keyboard shortcut: control+pageUp`, () =>
    this.app.client
      .keys([Keys.CONTROL, Keys.PageUp, 'NULL'])
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(1)))
      .catch(Common.oops(this, true)))

  it(`switch back to second tab via keyboard shortcut: control+pageDown`, () =>
    this.app.client
      .keys([Keys.CONTROL, Keys.PageDown, 'NULL'])
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(2)))
      .catch(Common.oops(this, true)))

  it('should close tab via "tab close" command', () =>
    CLI.command('tab close', this.app)
      .then(() => this.app.client.waitForExist(Selectors.TAB_N(2), 5000, true))
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(1)))
      .then(() => CLI.waitForRepl(this.app)) // should have an active repl
      .catch(Common.oops(this, true)))
})

// test that new tab does not copy any output over from the cloned tab
Common.pDescribe('core new tab from pty active tab via click', function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  it('should open sidecar with about', () =>
    CLI.command('about', this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .catch(Common.oops(this, true)))

  Common.proxyIt('should cd to the test dir', () =>
    CLI.command(`cd ${process.env.TEST_ROOT}`, this.app)
      .then(ReplExpect.okWithString('packages/test'))
      .catch(Common.oops(this, true))
  )

  it('should less README.md', async () => {
    try {
      const res = await CLI.command('less ../../README.md', this.app)

      const selector = `${Selectors.OUTPUT_N(res.count)} .xterm`
      await this.app.client.waitForExist(selector)
    } catch (err) {
      return Common.oops(this, true)(err)
    }
  })

  it('click new tab button', () =>
    this.app.client
      .click(tabButtonSelector)
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(2)))
      .then(() => CLI.waitForRepl(this.app)) // should have an active repl
      .catch(Common.oops(this, true)))

  // no xterm copied over!
  it('should have a clean tab', () =>
    this.app.client.waitForVisible(`${Selectors.CURRENT_TAB} .xterm`, 5000, true).catch(Common.oops(this, true)))
})

describe('core new tab from quiescent tab via command', function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  const CWD1 = process.cwd()
  const CWD2 = '/tmp'

  it(`cd to ${CWD1} in tab1`, () =>
    CLI.command(`cd ${CWD1}`, this.app)
      .then(ReplExpect.okWithString(CWD1))
      .catch(Common.oops(this, true)))

  it('new tab via command', () =>
    CLI.command('tab new', this.app)
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(2)))
      .then(() => CLI.waitForRepl(this.app)) // should have an active repl
      .catch(Common.oops(this, true)))

  it('should execute echo in new tab', () =>
    CLI.command('echo hi', this.app)
      .then(ReplExpect.okWithString('hi'))
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(2)))
      .catch(Common.oops(this, true)))

  it(`pwd should show CWD1 ${CWD1} in tab2`, () =>
    CLI.command(`pwd`, this.app)
      .then(ReplExpect.okWithString(CWD1))
      .catch(Common.oops(this, true)))

  it(`cd to ${CWD2} in tab2`, () =>
    CLI.command(`cd ${CWD2}`, this.app)
      .then(ReplExpect.okWithString(CWD2))
      .catch(Common.oops(this, true)))

  it(`pwd should show CWD2 ${CWD2} in tab2`, () =>
    CLI.command(`pwd`, this.app)
      .then(ReplExpect.okWithString(CWD2))
      .catch(Common.oops(this, true)))

  it('should close tab via "exit" command', () =>
    CLI.command('exit', this.app)
      .then(() => this.app.client.waitForExist(Selectors.TAB_N(2), 5000, true))
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(1)))
      .then(() => CLI.waitForRepl(this.app)) // should have an active repl
      .catch(Common.oops(this, true)))

  it(`pwd should show CWD1 ${CWD1} now that we are back in tab1`, () =>
    CLI.command(`pwd`, this.app)
      .then(ReplExpect.okWithString(CWD1))
      .catch(Common.oops(this, true)))

  it('new tab via command', () =>
    CLI.command('tab new', this.app)
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(2)))
      .then(() => CLI.waitForSession(this)) // should have an active repl
      .catch(Common.oops(this, true)))

  it(`cd to ${CWD2} in tab2`, () =>
    CLI.command(`cd ${CWD2}`, this.app)
      .then(ReplExpect.okWithString(CWD2))
      .catch(Common.oops(this, true)))

  it(`switch back to first tab via command`, () =>
    CLI.command('tab switch 1', this.app)
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(1)))
      .catch(Common.oops(this, true)))

  it(`pwd should show CWD1 ${CWD1} now that we are back in tab1`, () =>
    CLI.command('pwd', this.app)
      .then(ReplExpect.okWithString(CWD1))
      .catch(Common.oops(this, true)))

  it(`switch back to second tab via command`, () =>
    CLI.command('tab switch 2', this.app)
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(2)))
      .catch(Common.oops(this, true)))

  it(`pwd should show CWD2 ${CWD2} now that we are back in tab2`, () =>
    CLI.command('pwd', this.app)
      .then(ReplExpect.okWithString(CWD2))
      .catch(Common.oops(this, true)))

  it(`switch back to first tab via command`, () =>
    CLI.command('tab switch 1', this.app)
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(1)))
      .catch(Common.oops(this, true)))

  it(`pwd should show CWD1 ${CWD1} now that we are back in tab1`, () =>
    CLI.command('pwd', this.app)
      .then(ReplExpect.okWithString(CWD1))
      .catch(Common.oops(this, true)))
})

describe('core new tab from quiescent tab via button click', function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  it('new tab via button click', () =>
    this.app.client
      .click(tabButtonSelector)
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(2)))
      .then(() => CLI.waitForSession(this)) // should have an active repl
      .catch(Common.oops(this, true)))

  it('should execute echo in new tab', () =>
    CLI.command('echo hi', this.app)
      .then(ReplExpect.okWithString('hi'))
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(2)))
      .catch(Common.oops(this, true)))

  it('should close tab via "tab close" command', () =>
    CLI.command('tab close', this.app)
      .then(() => this.app.client.waitForExist(Selectors.TAB_N(2), 5000, true))
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(1)))
      .then(() => CLI.waitForRepl(this.app)) // should have an active repl
      .catch(Common.oops(this, true)))

  it('should execute echo in first tab', () =>
    CLI.command('echo hi', this.app)
      .then(ReplExpect.okWithString('hi'))
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(1)))
      .catch(Common.oops(this, true)))
})

describe('core new tab from active tab via button click', function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  it('start a sleep, then new tab via button click', () =>
    CLI.command('sleep 10000', this.app)
      .then(() => this.app.client.click(tabButtonSelector))
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(2)))
      .then(() => CLI.waitForSession(this)) // should have an active repl
      .catch(Common.oops(this, true)))

  it('should execute echo in new tab', () =>
    CLI.command('echo hi', this.app)
      .then(ReplExpect.okWithString('hi'))
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(2)))
      .catch(Common.oops(this, true)))
})

describe('core new tab from pty active tab via button click', function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  it('start vi, then new tab via button click', () =>
    CLI.command('vi', this.app)
      .then(() => this.app.client.waitForExist('tab.visible.xterm-alt-buffer-mode'))
      .then(() => this.app.client.click(tabButtonSelector))
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(2)))
      .then(() => CLI.waitForSession(this)) // should have an active repl
      .catch(Common.oops(this, true)))

  it('should execute echo in new tab', () =>
    CLI.command('echo hi', this.app)
      .then(ReplExpect.okWithString('hi'))
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(2)))
      .catch(Common.oops(this, true)))
})

describe('core new tab from active tab that is emitting output via button click', function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  it('start an echo loop, then new tab via button click', () =>
    CLI.command('while true; do echo hi; sleep 1; done', this.app)
      .then(() => new Promise(resolve => setTimeout(resolve, 4000)))
      .then(() => this.app.client.click(tabButtonSelector))
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(2)))
      .then(() => CLI.waitForRepl(this.app)) // should have an active repl
      .then(() => this.app.client.waitForExist(`${Selectors.CURRENT_TAB} .xterm`, 5000, true)) // no xterm DOM in the new tab
      .catch(Common.oops(this, true)))

  it('should execute echo in new tab', () =>
    CLI.command('echo hi', this.app)
      .then(ReplExpect.okWithString('hi'))
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(2)))
      .catch(Common.oops(this, true)))

  it('should close by clicking on the tab closer button', async () => {
    await this.app.client.click('.left-tab-stripe-button-selected .left-tab-stripe-button-closer')
    await this.app.client
      .waitForExist(Selectors.TAB_N(2), 5000, true)
      .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(1)))
  })
})
