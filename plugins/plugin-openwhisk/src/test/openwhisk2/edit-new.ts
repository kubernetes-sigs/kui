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

import { Common, CLI, ReplExpect, SidecarExpect, Selectors, Util } from '@kui-shell/test'

import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

describe('create new actions in editor', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  it('should create an action', () =>
    CLI.command('let foo = x=>x', this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('foo'))
      .catch(Common.oops(this)))

  it('should report 409 for new over existing action', () =>
    CLI.command('new foo', this.app)
      .then(ReplExpect.error(409))
      .catch(Common.oops(this)))

  it('should report 498 for new --kind zoo', () =>
    CLI.command('new nope --kind zoo', this.app)
      .then(ReplExpect.error(498)) // bad value for optional parameter
      .catch(Common.oops(this)))

  /** deploy the new action */
  const deploy = (res: ReplExpect.AppAndCount, action: string) => () => {
    return res.app.client
      .click(Selectors.SIDECAR_MODE_BUTTON(res.count, 'Deploy'))
      .then(() => res.app.client.waitForVisible(`${Selectors.SIDECAR(res.count)} .editor-status.is-new`, 10000, true))
      .catch(err => {
        console.error('Ouch, something bad happened, let us clean up the action before retrying')
        console.error(err)
        return CLI.command(`wsk action delete ${action}`, res.app).then(() => {
          throw err
        })
      })
  }

  /** set the monaco editor text */
  const setValue = async (res: ReplExpect.AppAndCount, text: string, status: string) => {
    // initially: the is-modified indicator should state what we expect to see
    await res.app.client.waitForVisible(
      `${Selectors.SIDECAR(res.count)} .sidecar-toolbar-text-content .editor-status.is-${status}`
    )

    // then: modify the content
    await res.app.client.execute(text => {
      document.querySelector('.monaco-editor-wrapper')['editor'].setValue(text)
    }, text)

    // finally: the is-modified indicator should not have "is new" or "is up to date"
    if (status !== 'new') {
      await this.app.client.waitForVisible(
        `${Selectors.SIDECAR(res.count)} .sidecar-toolbar-text-content .editor-status:not(.is-new):not(.is-up-to-date)`
      )
    }
  }

  it('should successfully open editor for unused name, edit the action content and deploy', async () => {
    try {
      const res = await CLI.command('new foo2', this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing('foo2'))
      await setValue(res, 'let main = x => x', 'new') // edit the action content
      await deploy(res, 'foo2')
    } catch (err) {
      await Common.oops(this)(err)
    }
  })

  it('should get the new action, edit the action content but not deployed', async () => {
    try {
      const res = await CLI.command('wsk action get foo2', this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing('foo2'))

      await this.app.client.waitUntil(async () => {
        console.log('get: Expected action content: "let main = x => x"')
        const actionSrc = await Util.getValueFromMonaco(res)
        return actionSrc.trim() === 'let main = x => x'
      })
      await this.app.client.waitForExist(Selectors.SIDECAR_MODE_BUTTON(res.count, 'edit'))
      await this.app.client.click(Selectors.SIDECAR_MODE_BUTTON(res.count, 'edit')) // go to the edit mode
      await this.app.client.waitForVisible(
        `${Selectors.SIDECAR} .sidecar-toolbar-text-content .editor-status.is-up-to-date .is-up-to-date`
      )
      await setValue(res, 'let main = y => y', 'up-to-date') // modify the content
      await this.app.client.waitForVisible(
        `${Selectors.SIDECAR} .sidecar-toolbar-text-content .editor-status:not(.is-up-to-date)`
      )
      await this.app.client.waitForExist(Selectors.SIDECAR_MODE_BUTTON(res.count, 'lock'))
      await this.app.client.click(Selectors.SIDECAR_MODE_BUTTON(res.count, 'lock')) // go to the view mode
      await this.app.client.waitUntil(async () => {
        // expect the action content not to be changed
        console.log('lock: Expected action content: "let main = x => x"')
        const actionSrc = await Util.getValueFromMonaco(res)
        return actionSrc.trim() === 'let main = x => x'
      })
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })

  it('should get the new action, edit the action content and deployed', async () => {
    try {
      const res = await CLI.command('wsk action get foo2', this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing('foo2'))

      await this.app.client.waitUntil(async () => {
        console.log('get: Expected action content: "let main = x => x"')
        const actionSrc = await Util.getValueFromMonaco(res)
        return actionSrc.trim() === 'let main = x => x'
      })

      await this.app.client.waitForExist(Selectors.SIDECAR_MODE_BUTTON(res.count, 'edit'))
      await this.app.client.click(Selectors.SIDECAR_MODE_BUTTON(res.count, 'edit')) // go to the edit mode
      await this.app.client.waitForVisible(
        `${Selectors.SIDECAR} .sidecar-toolbar-text-content .editor-status.is-up-to-date .is-up-to-date`
      )
      await setValue(res, 'let main = y => y', 'up-to-date') // modify the content
      await this.app.client.waitForExist(Selectors.SIDECAR_MODE_BUTTON(res.count, 'Deploy'))
      await this.app.client.click(Selectors.SIDECAR_MODE_BUTTON(res.count, 'Deploy')) // deploy
      await this.app.client.waitForVisible(
        `${Selectors.SIDECAR} .sidecar-toolbar-text-content .editor-status.is-up-to-date .is-up-to-date`
      )
      await this.app.client.waitForExist(Selectors.SIDECAR_MODE_BUTTON(res.count, 'lock'))
      await this.app.client.click(Selectors.SIDECAR_MODE_BUTTON(res.count, 'lock')) // go to the view mode
      await this.app.client.waitUntil(async () => {
        // expect the action content to be changed
        console.log('lock: Expected action content "let main = y => y"')
        const actionSrc = await Util.getValueFromMonaco(res)
        return actionSrc.trim() === 'let main = y => y'
      })
    } catch (err) {
      await Common.oops(this)(err)
    }
  })

  it('should invoke the new action', () =>
    CLI.command('wsk action invoke foo2', this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('foo2'))
      .catch(Common.oops(this)))

  it('should open a new python', () =>
    CLI.command('new foo3 --kind python', this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('foo3'))
      .then(res => deploy(res, 'foo3'))
      .catch(Common.oops(this)))
  /* it('should invoke the new python action, with implicit entity', () => CLI.command('wsk action invoke', this.app)
       .then(ReplExpect.ok)
       .then(SidecarExpect.open)
       .then(SidecarExpect.showing('foo3'))
       .catch(Common.oops(this))) */
})
