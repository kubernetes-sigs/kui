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
 * test the new actionName command
 *
 */

import * as common from '@kui/core/tests/lib/common'
import * as ui from '@kui/core/tests/lib/ui'
import * as openwhisk from '@kui/plugin-openwhisk/tests/lib/openwhisk/openwhisk'
const { cli, rp, selectors, sidecar } = ui

describe('create new actions in editor', function (this: common.ISuite) {
  before(openwhisk.before(this))
  after(common.after(this))

  it('should have an active repl', () => cli.waitForRepl(this.app))

  it('should create an action', () => cli.do('let foo = x=>x', this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('foo'))
    .catch(common.oops(this)))

  it('should report 409 for new over existing action', () => cli.do('new foo', this.app)
    .then(cli.expectError(409))
    .catch(common.oops(this)))

  it('should report 498 for new --kind zoo', () => cli.do('new nope --kind zoo', this.app)
    .then(cli.expectError(498)) // bad value for optional parameter
    .catch(common.oops(this)))

  /** deploy the new action */
  const deploy = (app, action) => () => {
    return app.client.click(ui.selectors.SIDECAR_MODE_BUTTON('Deploy'))
      .then(() => app.client.waitForExist(`${ui.selectors.SIDECAR} .editor-status.is-new`, 10000, false))
      .catch(err => {
        console.error('Ouch, something bad happened, let us clean up the action before retrying')
        console.error(err)
        return cli.do(`wsk action delete ${action}`, app)
          .then(() => {
            throw err
          })
      })
  }

  it('should successfully open editor for unused name', () => cli.do('new foo2', this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('foo2'))
    .then(deploy(this.app, 'foo2'))
    .catch(common.oops(this)))

  it('should get the new action', () => cli.do('action get foo2', this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('foo2'))
    .catch(common.oops(this)))

  it('should invoke the new action', () => cli.do('invoke foo2', this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('foo2'))
    .catch(common.oops(this)))

  it('should open a new python', () => cli.do('new foo3 --kind python', this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('foo3'))
    .then(deploy(this.app, 'foo3'))
    .catch(common.oops(this)))
  /* it('should invoke the new python action, with implicit entity', () => cli.do('invoke', this.app)
       .then(cli.expectOK)
       .then(sidecar.expectOpen)
       .then(sidecar.expectShowing('foo3'))
       .catch(common.oops(this))) */

  it('should open a new swift', () => cli.do('new foo4 --kind swift', this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('foo4'))
    .then(deploy(this.app, 'foo4'))
    .catch(common.oops(this)))
  /* it('should invoke the new swift action, with explicit entity', () => cli.do('invoke foo4', this.app)
       .then(cli.expectOK)
       .then(sidecar.expectOpen)
       .then(sidecar.expectShowing('foo4'))
       .catch(common.oops(this))) */

  it('should open a new php', () => cli.do('new foo5 --kind php', this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('foo5'))
    .then(deploy(this.app, 'foo5'))
    .catch(common.oops(this)))
  /* it('should invoke the new php action, with implicit entity', () => cli.do('invoke', this.app)
       .then(cli.expectOK)
       .then(sidecar.expectOpen)
       .then(sidecar.expectShowing('foo5'))
       .catch(common.oops(this))) */
})
