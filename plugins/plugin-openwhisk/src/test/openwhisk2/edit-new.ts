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

import * as common from '@kui-shell/core/tests/lib/common'
import * as ui from '@kui-shell/core/tests/lib/ui'
import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'
const { cli, sidecar } = ui

describe('create new actions in editor', function(this: common.ISuite) {
  before(openwhisk.before(this))
  after(common.after(this))

  it('should create an action', () =>
    cli
      .do('let foo = x=>x', this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing('foo'))
      .catch(common.oops(this)))

  it('should report 409 for new over existing action', () =>
    cli
      .do('new foo', this.app)
      .then(cli.expectError(409))
      .catch(common.oops(this)))

  it('should report 498 for new --kind zoo', () =>
    cli
      .do('new nope --kind zoo', this.app)
      .then(cli.expectError(498)) // bad value for optional parameter
      .catch(common.oops(this)))

  /** deploy the new action */
  const deploy = (app, action) => () => {
    return app.client
      .click(ui.selectors.SIDECAR_MODE_BUTTON('Deploy'))
      .then(() => app.client.waitForExist(`${ui.selectors.SIDECAR} .editor-status.is-new`, 10000, true))
      .catch(err => {
        console.error('Ouch, something bad happened, let us clean up the action before retrying')
        console.error(err)
        return cli.do(`wsk action delete ${action}`, app).then(() => {
          throw err
        })
      })
  }

  /** set the monaco editor text */
  const setValue = (client, text, codeStatus) => {
    const status1 = codeStatus
    const status2 = status1 === 'new' ? '' : '.is-modified'

    client.execute(text => {
      document.querySelector('.monaco-editor-wrapper')['editor'].setValue(text)
    }, text)

    return this.app.client.waitForExist(
      `${ui.selectors.SIDECAR} .sidecar-header-secondary-content .custom-header-content .editor-status.is-${status1} ${status2}`
    )
  }

  it('should successfully open editor for unused name, edit the action content and deploy', () =>
    cli
      .do('new foo2', this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing('foo2\n*'))
      .then(() => setValue(this.app.client, 'let main = x => x', 'new')) // edit the action content
      .then(deploy(this.app, 'foo2'))
      .catch(common.oops(this)))

  it('should get the new action, edit the action content but not deployed', () =>
    cli
      .do('wsk action get foo2', this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing('foo2'))
      .then(() =>
        this.app.client.waitUntil(async () => {
          console.log('get: Expected action content: "let main = x => x"')
          const actionSrc = await this.app.client.getText(ui.selectors.SIDECAR_ACTION_SOURCE)
          return actionSrc.trim() === 'let main = x => x'
        })
      )
      .then(() => this.app.client.waitForExist(ui.selectors.SIDECAR_MODE_BUTTON('unlock')))
      .then(() => this.app.client.click(ui.selectors.SIDECAR_MODE_BUTTON('unlock'))) // go to the edit mode
      .then(() =>
        this.app.client.waitForExist(
          `${ui.selectors.SIDECAR} .sidecar-header-secondary-content .custom-header-content .editor-status.is-up-to-date .is-up-to-date`
        )
      )
      .then(() => setValue(this.app.client, 'let main = y => y', 'up-to-date')) // modify the content
      .then(() => this.app.client.click(ui.selectors.SIDECAR_MODE_BUTTON('lock'))) // go to the view mode
      .then(() =>
        this.app.client.waitUntil(async () => {
          // expect the action content not to be changed
          console.log('lock: Expected action content: "let main = x => x"')
          const actionSrc = await this.app.client.getText(ui.selectors.SIDECAR_ACTION_SOURCE)
          return actionSrc.trim() === 'let main = x => x'
        })
      )
      .catch(common.oops(this)))

  it('should get the new action, edit the action content and deployed', () =>
    cli
      .do('wsk action get foo2', this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing('foo2'))
      .then(() =>
        this.app.client.waitUntil(async () => {
          console.log('get: Expected action content: "let main = x => x"')
          const actionSrc = await this.app.client.getText(ui.selectors.SIDECAR_ACTION_SOURCE)
          return actionSrc.trim() === 'let main = x => x'
        })
      )
      .then(() => this.app.client.waitForExist(ui.selectors.SIDECAR_MODE_BUTTON('unlock')))
      .then(() => this.app.client.click(ui.selectors.SIDECAR_MODE_BUTTON('unlock'))) // go to the edit mode
      .then(() =>
        this.app.client.waitForExist(
          `${ui.selectors.SIDECAR} .sidecar-header-secondary-content .custom-header-content .editor-status.is-up-to-date .is-up-to-date`
        )
      )
      .then(() => setValue(this.app.client, 'let main = y => y', 'up-to-date')) // modify the content
      .then(() => this.app.client.waitForExist(ui.selectors.SIDECAR_MODE_BUTTON('Deploy')))
      .then(() => this.app.client.click(ui.selectors.SIDECAR_MODE_BUTTON('Deploy'))) // deploy
      .then(() =>
        this.app.client.waitForExist(
          `${ui.selectors.SIDECAR} .sidecar-header-secondary-content .custom-header-content .editor-status.is-up-to-date .is-up-to-date`
        )
      )
      .then(() => this.app.client.waitForExist(ui.selectors.SIDECAR_MODE_BUTTON('lock')))
      .then(() => this.app.client.click(ui.selectors.SIDECAR_MODE_BUTTON('lock'))) // go to the view mode
      .then(() =>
        this.app.client.waitUntil(async () => {
          // expect the action content to be changed
          console.log('lock: Expected action content "let main = y => y"')
          const actionSrc = await this.app.client.getText(ui.selectors.SIDECAR_ACTION_SOURCE)
          return actionSrc.trim() === 'let main = y => y'
        })
      )
      .catch(common.oops(this)))

  it('should invoke the new action', () =>
    cli
      .do('wsk action invoke foo2', this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing('foo2'))
      .catch(common.oops(this)))

  it('should open a new python', () =>
    cli
      .do('new foo3 --kind python', this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing('foo3\n*'))
      .then(deploy(this.app, 'foo3'))
      .catch(common.oops(this)))
  /* it('should invoke the new python action, with implicit entity', () => cli.do('wsk action invoke', this.app)
       .then(cli.expectOK)
       .then(sidecar.expectOpen)
       .then(sidecar.expectShowing('foo3'))
       .catch(common.oops(this))) */
})
