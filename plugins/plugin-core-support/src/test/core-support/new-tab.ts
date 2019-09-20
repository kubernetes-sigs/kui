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

import * as common from '@kui-shell/core/tests/lib/common'
import * as ui from '@kui-shell/core/tests/lib/ui'
const { cli, selectors, sidecar } = ui

import { tabButtonSelector } from '../../lib/new-tab'

describe('core new tab switch tabs', function(this: common.ISuite) {
  before(common.before(this))
  after(common.after(this))

  it('new tab via command', () =>
    cli
      .do('tab new', this.app)
      .then(() => this.app.client.waitForVisible(selectors.TAB_SELECTED_N(2)))
      .then(() => common.waitForSession(this)) // should have an active repl
      .catch(common.oops(this)))

  it(`switch back to first tab via command`, () =>
    cli
      .do('tab switch 1', this.app)
      .then(() => this.app.client.waitForVisible(selectors.TAB_SELECTED_N(1)))
      .catch(common.oops(this)))

  it(`switch back to second tab via command`, () =>
    cli
      .do('tab switch 2', this.app)
      .then(() => this.app.client.waitForVisible(selectors.TAB_SELECTED_N(2)))
      .catch(common.oops(this)))

  it('should close tab via "tab close" command', () =>
    cli
      .do('tab close', this.app)
      .then(() => this.app.client.waitForExist(selectors.TAB_N(2), 5000, true))
      .then(() => this.app.client.waitForVisible(selectors.TAB_SELECTED_N(1)))
      .then(() => cli.waitForRepl(this.app)) // should have an active repl
      .catch(common.oops(this)))
})

// test that new tab does not copy any output over from the cloned tab
common.pDescribe('core new tab from pty active tab via click', function(this: common.ISuite) {
  before(common.before(this))
  after(common.after(this))

  it('should open sidecar with about', () =>
    cli
      .do('about', this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .catch(common.oops(this)))

  common.proxyIt('should cd to the test dir', () =>
    cli
      .do(`cd ${process.env.TEST_ROOT}`, this.app)
      .then(cli.expectOKWithString('packages/tests'))
      .catch(common.oops(this, true))
  )

  it('should less README.md', async () => {
    try {
      const res = await cli.do('less ../../README.md', this.app)

      const selector = `${selectors.OUTPUT_N(res.count)} .xterm`
      await this.app.client.waitForExist(selector)
    } catch (err) {
      return common.oops(this)(err)
    }
  })

  it('click new tab button', () =>
    this.app.client
      .click(tabButtonSelector)
      .then(() => this.app.client.waitForVisible(selectors.TAB_SELECTED_N(2)))
      .then(() => cli.waitForRepl(this.app)) // should have an active repl
      .catch(common.oops(this)))

  // no xterm copied over!
  it('should have a clean tab', () =>
    this.app.client.waitForVisible(`${selectors.CURRENT_TAB} .xterm`, 5000, true).catch(common.oops(this)))
})

describe('core new tab from quiescent tab via command', function(this: common.ISuite) {
  before(common.before(this))
  after(common.after(this))

  const CWD1 = process.cwd()
  const CWD2 = '/tmp'

  it(`cd to ${CWD1} in tab1`, () =>
    cli
      .do(`cd ${CWD1}`, this.app)
      .then(cli.expectOKWithString(CWD1))
      .catch(common.oops(this)))

  it('new tab via command', () =>
    cli
      .do('tab new', this.app)
      .then(() => this.app.client.waitForVisible(selectors.TAB_SELECTED_N(2)))
      .then(() => cli.waitForRepl(this.app)) // should have an active repl
      .catch(common.oops(this)))

  it('should execute echo in new tab', () =>
    cli
      .do('echo hi', this.app)
      .then(cli.expectOKWithString('hi'))
      .then(() => this.app.client.waitForVisible(selectors.TAB_SELECTED_N(2)))
      .catch(common.oops(this)))

  it(`pwd should show CWD1 ${CWD1} in tab2`, () =>
    cli
      .do(`pwd`, this.app)
      .then(cli.expectOKWithString(CWD1))
      .catch(common.oops(this)))

  it(`cd to ${CWD2} in tab2`, () =>
    cli
      .do(`cd ${CWD2}`, this.app)
      .then(cli.expectOKWithString(CWD2))
      .catch(common.oops(this)))

  it(`pwd should show CWD2 ${CWD2} in tab2`, () =>
    cli
      .do(`pwd`, this.app)
      .then(cli.expectOKWithString(CWD2))
      .catch(common.oops(this)))

  it('should close tab via "exit" command', () =>
    cli
      .do('exit', this.app)
      .then(() => this.app.client.waitForExist(selectors.TAB_N(2), 5000, true))
      .then(() => this.app.client.waitForVisible(selectors.TAB_SELECTED_N(1)))
      .then(() => cli.waitForRepl(this.app)) // should have an active repl
      .catch(common.oops(this)))

  it(`pwd should show CWD1 ${CWD1} now that we are back in tab1`, () =>
    cli
      .do(`pwd`, this.app)
      .then(cli.expectOKWithString(CWD1))
      .catch(common.oops(this)))

  it('new tab via command', () =>
    cli
      .do('tab new', this.app)
      .then(() => this.app.client.waitForVisible(selectors.TAB_SELECTED_N(2)))
      .then(() => common.waitForSession(this)) // should have an active repl
      .catch(common.oops(this)))

  it(`cd to ${CWD2} in tab2`, () =>
    cli
      .do(`cd ${CWD2}`, this.app)
      .then(cli.expectOKWithString(CWD2))
      .catch(common.oops(this)))

  it(`switch back to first tab via command`, () =>
    cli
      .do('tab switch 1', this.app)
      .then(() => this.app.client.waitForVisible(selectors.TAB_SELECTED_N(1)))
      .catch(common.oops(this)))

  it(`pwd should show CWD1 ${CWD1} now that we are back in tab1`, () =>
    cli
      .do('pwd', this.app)
      .then(cli.expectOKWithString(CWD1))
      .catch(common.oops(this)))

  it(`switch back to second tab via command`, () =>
    cli
      .do('tab switch 2', this.app)
      .then(() => this.app.client.waitForVisible(selectors.TAB_SELECTED_N(2)))
      .catch(common.oops(this)))

  it(`pwd should show CWD2 ${CWD2} now that we are back in tab2`, () =>
    cli
      .do('pwd', this.app)
      .then(cli.expectOKWithString(CWD2))
      .catch(common.oops(this)))

  it(`switch back to first tab via command`, () =>
    cli
      .do('tab switch 1', this.app)
      .then(() => this.app.client.waitForVisible(selectors.TAB_SELECTED_N(1)))
      .catch(common.oops(this)))

  it(`pwd should show CWD1 ${CWD1} now that we are back in tab1`, () =>
    cli
      .do('pwd', this.app)
      .then(cli.expectOKWithString(CWD1))
      .catch(common.oops(this)))
})

describe('core new tab from quiescent tab via button click', function(this: common.ISuite) {
  before(common.before(this))
  after(common.after(this))

  it('new tab via button click', () =>
    this.app.client
      .click(tabButtonSelector)
      .then(() => this.app.client.waitForVisible(selectors.TAB_SELECTED_N(2)))
      .then(() => common.waitForSession(this)) // should have an active repl
      .catch(common.oops(this)))

  it('should execute echo in new tab', () =>
    cli
      .do('echo hi', this.app)
      .then(cli.expectOKWithString('hi'))
      .then(() => this.app.client.waitForVisible(selectors.TAB_SELECTED_N(2)))
      .catch(common.oops(this)))

  it('should close tab via "tab close" command', () =>
    cli
      .do('tab close', this.app)
      .then(() => this.app.client.waitForExist(selectors.TAB_N(2), 5000, true))
      .then(() => this.app.client.waitForVisible(selectors.TAB_SELECTED_N(1)))
      .then(() => cli.waitForRepl(this.app)) // should have an active repl
      .catch(common.oops(this)))

  it('should execute echo in first tab', () =>
    cli
      .do('echo hi', this.app)
      .then(cli.expectOKWithString('hi'))
      .then(() => this.app.client.waitForVisible(selectors.TAB_SELECTED_N(1)))
      .catch(common.oops(this)))
})

describe('core new tab from active tab via button click', function(this: common.ISuite) {
  before(common.before(this))
  after(common.after(this))

  it('start a sleep, then new tab via button click', () =>
    cli
      .do('sleep 10000', this.app)
      .then(() => this.app.client.click(tabButtonSelector))
      .then(() => this.app.client.waitForVisible(selectors.TAB_SELECTED_N(2)))
      .then(() => common.waitForSession(this)) // should have an active repl
      .catch(common.oops(this)))

  it('should execute echo in new tab', () =>
    cli
      .do('echo hi', this.app)
      .then(cli.expectOKWithString('hi'))
      .then(() => this.app.client.waitForVisible(selectors.TAB_SELECTED_N(2)))
      .catch(common.oops(this)))
})

describe('core new tab from pty active tab via button click', function(this: common.ISuite) {
  before(common.before(this))
  after(common.after(this))

  it('start vi, then new tab via button click', () =>
    cli
      .do('vi', this.app)
      .then(() => this.app.client.waitForExist('tab.visible.xterm-alt-buffer-mode'))
      .then(() => this.app.client.click(tabButtonSelector))
      .then(() => this.app.client.waitForVisible(selectors.TAB_SELECTED_N(2)))
      .then(() => common.waitForSession(this)) // should have an active repl
      .catch(common.oops(this)))

  it('should execute echo in new tab', () =>
    cli
      .do('echo hi', this.app)
      .then(cli.expectOKWithString('hi'))
      .then(() => this.app.client.waitForVisible(selectors.TAB_SELECTED_N(2)))
      .catch(common.oops(this)))
})

describe('core new tab from active tab that is emitting output via button click', function(this: common.ISuite) {
  before(common.before(this))
  after(common.after(this))

  it('start an echo loop, then new tab via button click', () =>
    cli
      .do('while true; do echo hi; sleep 1; done', this.app)
      .then(() => new Promise(resolve => setTimeout(resolve, 4000)))
      .then(() => this.app.client.click(tabButtonSelector))
      .then(() => this.app.client.waitForVisible(selectors.TAB_SELECTED_N(2)))
      .then(() => cli.waitForRepl(this.app)) // should have an active repl
      .then(() => this.app.client.waitForExist(`${selectors.CURRENT_TAB} .xterm`, 5000, true)) // no xterm DOM in the new tab
      .catch(common.oops(this)))

  it('should execute echo in new tab', () =>
    cli
      .do('echo hi', this.app)
      .then(cli.expectOKWithString('hi'))
      .then(() => this.app.client.waitForVisible(selectors.TAB_SELECTED_N(2)))
      .catch(common.oops(this)))

  it('should close by clicking on the tab closer button', async () => {
    await this.app.client.click('.left-tab-stripe-button-selected .left-tab-stripe-button-closer')
    await this.app.client
      .waitForExist(selectors.TAB_N(2), 5000, true)
      .then(() => this.app.client.waitForVisible(selectors.TAB_SELECTED_N(1)))
  })
})
