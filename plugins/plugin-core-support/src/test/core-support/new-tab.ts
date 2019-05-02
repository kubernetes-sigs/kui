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

import * as common from '@kui-shell/core/tests/lib/common' // tslint:disable-line:no-duplicate-imports
import * as ui from '@kui-shell/core/tests/lib/ui'
const { cli, selectors, sidecar } = ui

common.localDescribe('new tab from quiescent tab via command', function (this: common.ISuite) {
  before(common.before(this))
  after(common.after(this))

  it('new tab via command', () => cli.do('tab new', this.app)
     .then(() => this.app.client.waitForVisible('.left-tab-stripe-button-selected[data-tab-button-index="2"]'))
     .then(() => cli.waitForRepl(this.app)) // should have an active repl
     .catch(common.oops(this)))

  it('should execute echo in new tab', () => cli.do('echo hi', this.app)
     .then(cli.expectOKWithString('hi'))
     .then(() => this.app.client.waitForVisible('.left-tab-stripe-button-selected[data-tab-button-index="2"]'))
     .catch(common.oops(this)))

  it('should close tab via command', () => cli.do('tab close', this.app)
     .then(() => this.app.client.waitForExist('.left-tab-stripe-button-selected[data-tab-button-index="2"]', 5000, true))
     .then(() => this.app.client.waitForExist('.left-tab-stripe-button-selected[data-tab-button-index="1"]'))
     .then(() => cli.waitForRepl(this.app)) // should have an active repl
     .catch(common.oops(this)))
})

common.localDescribe('new tab from quiescent tab via button click', function (this: common.ISuite) {
  before(common.before(this))
  after(common.after(this))

  it('new tab via button click', () => this.app.client.click('.new-tab-button')
     .then(() => this.app.client.waitForVisible('.left-tab-stripe-button-selected[data-tab-button-index="2"]'))
     .then(() => cli.waitForRepl(this.app)) // should have an active repl
     .catch(common.oops(this)))

  it('should execute echo in new tab', () => cli.do('echo hi', this.app)
     .then(cli.expectOKWithString('hi'))
     .then(() => this.app.client.waitForVisible('.left-tab-stripe-button-selected[data-tab-button-index="2"]'))
     .catch(common.oops(this)))

  it('should close tab via command', () => cli.do('tab close', this.app)
     .then(() => this.app.client.waitForExist('.left-tab-stripe-button-selected[data-tab-button-index="2"]', 5000, true))
     .then(() => this.app.client.waitForExist('.left-tab-stripe-button-selected[data-tab-button-index="1"]'))
     .then(() => cli.waitForRepl(this.app)) // should have an active repl
     .catch(common.oops(this)))

  it('should execute echo in first tab', () => cli.do('echo hi', this.app)
     .then(cli.expectOKWithString('hi'))
     .then(() => this.app.client.waitForExist('.left-tab-stripe-button-selected[data-tab-button-index="1"]', 5000))
     .catch(common.oops(this)))
})

common.localDescribe('new tab from active tab via button click', function (this: common.ISuite) {
  before(common.before(this))
  after(common.after(this))

  it('start a sleep, then new tab via button click', () => cli.do('sleep 10000', this.app)
     .then(() => this.app.client.click('.new-tab-button'))
     .then(() => this.app.client.waitForVisible('.left-tab-stripe-button-selected[data-tab-button-index="2"]'))
     .then(() => cli.waitForRepl(this.app)) // should have an active repl
     .catch(common.oops(this)))

  it('should execute echo in new tab', () => cli.do('echo hi', this.app)
     .then(cli.expectOKWithString('hi'))
     .then(() => this.app.client.waitForVisible('.left-tab-stripe-button-selected[data-tab-button-index="2"]'))
     .catch(common.oops(this)))
})

common.localDescribe('new tab from active tab that is emitting output via button click', function (this: common.ISuite) {
  before(common.before(this))
  after(common.after(this))

  it('start an echo loop, then new tab via button click', () => cli.do('while true; do echo hi; sleep 1; done', this.app)
     .then(() => new Promise(resolve => setTimeout(resolve, 4000)))
     .then(() => this.app.client.click('.new-tab-button'))
     .then(() => this.app.client.waitForVisible('.left-tab-stripe-button-selected[data-tab-button-index="2"]'))
     .then(() => cli.waitForRepl(this.app)) // should have an active repl
     .then(() => this.app.client.waitForExist(`${selectors.CURRENT_TAB} .xterm`, 5000, true)) // no xterm DOM in the new tab
     .catch(common.oops(this)))

  it('should execute echo in new tab', () => cli.do('echo hi', this.app)
     .then(cli.expectOKWithString('hi'))
     .then(() => this.app.client.waitForVisible('.left-tab-stripe-button-selected[data-tab-button-index="2"]'))
     .catch(common.oops(this)))
})
