/*
 * Copyright 2018 IBM Corporation
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
 * test the local plugin
 *
 */

import * as assert from 'assert'

import * as common from '@kui-shell/core/tests/lib/common'
import * as ui from '@kui-shell/core/tests/lib/ui'
import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'
const { cli, selectors, sidecar } = ui
const { localDescribe } = common

localDescribe('local plugin', function (this: common.ISuite) {
  before(openwhisk.before(this))
  after(common.after(this))

  const LOG_ENTRY = 'hi'
  const LOG_ENTRY2 = 'munchies'

  it('should kill the container', () => cli.do('local kill', this.app)
    .then(cli.expectOK)
    .catch(common.oops(this)))

  it('should remove the nodejs image', () => cli.do('local clean', this.app)
    .then(cli.expectJustOK)
    .catch(common.oops(this)))

  it('should create an action', () => cli.do(`let foo = x=> { console.log("${LOG_ENTRY}"); return x }`, this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('foo'))
    .catch(common.oops(this)))

  // perform more than one invoke; see #1063, which had a test gap
  // due to the lack of repeated local invoke
  for (let idx = 0; idx < 3; idx++) {
    it('should invoke that action locally', () => cli.do('local invoke foo -p name smurf', this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing('foo', 'local activation'))
      .then(() => this.app.client.getText(ui.selectors.SIDECAR_ACTIVATION_RESULT))
      .then(ui.expectStruct({ name: 'smurf' }))
      .catch(common.oops(this)))
  }

  it('should switch to logs mode and observe our log entry', () => cli.do('wsk activation logs', this.app)
    .then(cli.expectJustOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('foo'))
    .then(app => app.client.getText(ui.selectors.SIDECAR_ACTIVATION_RESULT))
    .then(text => assert.ok(text.indexOf(LOG_ENTRY) >= 0)) // <-- our log entry
    .catch(common.oops(this)))

  it('should invoke that action locally, again', () => cli.do('local invoke foo -p dance floor', this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('foo', 'local activation'))
    .then(() => this.app.client.getText(ui.selectors.SIDECAR_ACTIVATION_RESULT))
    .then(ui.expectStruct({ dance: 'floor' }))
    .catch(common.oops(this)))

  it('should invoke that action locally, again, with implicit entity', () => cli.do('local invoke', this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('foo', 'local activation'))
    .then(() => this.app.client.getText(ui.selectors.SIDECAR_ACTIVATION_RESULT))
    .catch(common.oops(this)))

  it('should kill the container', () => cli.do('local kill', this.app)
    .then(cli.expectOK)
    .catch(common.oops(this)))
  it('should kill the container', () => cli.do('local kill', this.app)
    .then(cli.expectOK)
    .catch(common.oops(this)))
  it('should kill the container', () => cli.do('local kill', this.app)
    .then(cli.expectOK)
    .catch(common.oops(this)))

  it('should invoke that action locally after kill', () => cli.do('local invoke foo -p dance floor2', this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('foo', 'local activation'))
    .then(() => this.app.client.getText(ui.selectors.SIDECAR_ACTIVATION_RESULT))
    .then(ui.expectStruct({ dance: 'floor2' }))
    .catch(common.oops(this)))

  // broken right now
  /* it('should play that action locally, with local invoke, variant 1', () => cli.do('invoke -p dance floor3 foo', this.app)
       .then(cli.expectOK)
       .then(sidecar.expectOpen)
       .then(sidecar.expectShowing('foo', 'local activation'))
       .then(() => this.app.client.getText(ui.selectors.SIDECAR_ACTIVATION_RESULT))
       .then(ui.expectStruct({dance:"floor3"}))
       .catch(common.oops(this))) */

  it('should create another action', () => cli.do(`let foo2 = x=> { console.log("${LOG_ENTRY2}"); return x }`, this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('foo2'))
    .catch(common.oops(this)))

  /* it('should debug that action locally', () => cli.do('debug foo2 -p lol cats', this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('foo2'))
    .then(() => this.app.client.waitForVisible(`${ui.selectors.SIDECAR} #debuggerDiv webview`))
    .then(() => this.app.client.click(ui.selectors.SIDECAR_MODE_BUTTON('stop-debugger')))
    .then(() => this.app)
    .then(sidecar.expectFullyClosed)
    .catch(common.oops(this))) */
})
