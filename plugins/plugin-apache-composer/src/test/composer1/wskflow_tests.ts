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
import * as fs from 'fs'
import * as assert from 'assert'

import * as common from '@kui-shell/core/tests/lib/common'
import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'
import * as ui from '@kui-shell/core/tests/lib/ui'

import {
  verifyNodeExists,
  verifyNodeStatusExists,
  verifyTheBasicStuff
} from '@kui-shell/plugin-apache-composer/tests/lib/composer-viz-util'

import { dirname } from 'path'
const cli = ui.cli
const sidecar = ui.sidecar
const keys = ui.keys
const ROOT = dirname(require.resolve('@kui-shell/plugin-apache-composer/tests/package.json'))

/**
 * Here starts the test
 *
 */
// test if the graph is by default zoom to fit
describe('wskflow test bring up the composer visualization when the sidecar is minimized', function(this: common.ISuite) {
  before(openwhisk.before(this))
  after(common.after(this))

  it('should show the if composition graph', () =>
    cli
      .do(`preview ${ROOT}/data/composer/composer-source/if.js`, this.app)
      .then(verifyTheBasicStuff('if.js')) // verify basic things
      .catch(common.oops(this)))

  it('should minimize the sidecar', () =>
    this.app.client
      .keys(keys.ESCAPE)
      .then(() => sidecar.expectClosed(this.app))
      .catch(common.oops(this)))

  it('should show the if composition graph again', () =>
    cli
      .do(`wsk app preview ${ROOT}/data/composer/composer-source/if.js`, this.app)
      .then(() => sidecar.expectOpen(this.app))
      .catch(common.oops(this)))

  it('should use viewBox to let the graph fit the container', () =>
    this.app.client.waitForExist('#wskflowSVG[viewBox]', 3000))
})

// test if app preview update a graph when the watched file gets updated
describe('wskflow test app preview should actively watching an external file', function(this: common.ISuite) {
  before(openwhisk.before(this))
  after(common.after(this))

  const tempFileName = 'testtemp.js'

  it('should write composer.sequence("a", "b") to a temp file', () => {
    return new Promise((resolve, reject) => {
      fs.writeFile(tempFileName, `module.exports = require('openwhisk-composer').sequence("a", "b")`, err => {
        if (err) {
          reject(err)
        } else {
          resolve(true)
        }
      })
    })
  })

  it('should preview the temp file', () =>
    cli
      .do(`preview ${tempFileName}`, this.app)
      .then(verifyTheBasicStuff(tempFileName)) // verify basic things
      .then(verifyNodeExists('a'))
      .then(verifyNodeExists('b'))
      .catch(common.oops(this)))

  it('should update the temp file to composer.sequence("a", "c")asdfasdf', () => {
    return new Promise((resolve, reject) => {
      fs.writeFile(tempFileName, `module.exports = require('openwhisk-composer').sequence("a", "c")asdfasdf`, err => {
        if (err) {
          reject(err)
        } else {
          resolve(true)
        }
      })
    })
  })

  // error message is shown as action code
  it('should update preview with the error message', () =>
    this.app.client.waitForVisible(`${ui.selectors.SIDECAR}.entity-is-actions`, 3000))

  it('should update the temp file to composer.sequence("a", "c")', () => {
    return new Promise((resolve, reject) => {
      fs.writeFile(tempFileName, `module.exports = require('openwhisk-composer').sequence("a", "c")`, err => {
        if (err) {
          reject(err)
        } else {
          resolve(true)
        }
      })
    })
  })

  it('should update preview', async () => {
    try {
      await this.app.client.waitForVisible(ui.selectors.SIDECAR_CUSTOM_CONTENT)
    } catch (err) {
      return common.oops(this)(err)
    }
    return Promise.resolve(this.app)
      .then(verifyNodeExists('a'))
      .then(verifyNodeExists('c'))
      .catch(common.oops(this))
  })

  // should be able to switch JSON tab and switch back
  it('should switch to the JSON tab', async () => {
    try {
      await this.app.client.click(ui.selectors.SIDECAR_MODE_BUTTON('ast'))
      await this.app.client.click(ui.selectors.SIDECAR_MODE_BUTTON('visualization'))
    } catch (err) {
      return common.oops(this)(err)
    }

    return Promise.resolve(this.app)
      .then(verifyNodeExists('a'))
      .then(verifyNodeExists('c'))
      .catch(common.oops(this))
  })

  // update file again, and verify that preview updates too
  it('should update the temp file to composer.sequence("a", "b")', () => {
    return new Promise((resolve, reject) => {
      fs.writeFile(tempFileName, `module.exports = require('openwhisk-composer').sequence("a", "b")`, err => {
        if (err) {
          reject(err)
        } else {
          resolve(true)
        }
      })
    })
  })
  it('should update preview', async () => {
    try {
      await this.app.client.waitForVisible(ui.selectors.SIDECAR_CUSTOM_CONTENT)
      return Promise.resolve(this.app)
        .then(verifyNodeExists('a'))
        .then(verifyNodeExists('b'))
        .catch(common.oops(this))
    } catch (err) {
      return common.oops(this)(err)
    }
  })

  it('should delete the temp file', () => {
    return new Promise((resolve, reject) => {
      fs.unlink(tempFileName, err => {
        if (err) {
          reject(err)
        } else {
          resolve(true)
        }
      })
    })
  })

  it('should preview the temp file and throw file not found error', () =>
    cli
      .do(`preview ${tempFileName}`, this.app)
      .then(cli.expectError(404, 'The specified file does not exist'))
      .catch(common.oops(this)))
})

// test if session flow highlighting is correct
describe('wskflow test create a if composition, invoke, verify session flow is shown correctly', function(this: common.ISuite) {
  before(openwhisk.before(this))
  after(common.after(this))
  const appName = 'test-if'
  const appFile = `${ROOT}/data/composer/composer-source/if-session.js`

  it(`should create an app with ${appFile}`, () =>
    cli
      .do(`wsk app create ${appName} ${appFile}`, this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(appName))
      .catch(common.oops(this)))

  it(`should invoke ${appName} with condition equals true`, () =>
    cli
      .do(`wsk app invoke ${appName} -p condition true`, this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .catch(common.oops(this)))

  it(`should be able to click on the mode button to switch to session flow, and see the true path highlighted`, async () => {
    await this.app.client.click(ui.selectors.SIDECAR_MODE_BUTTON('visualization'))
    return Promise.resolve(this.app)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(appName))
      .then(() => this.app.client.waitForExist('#wskflowSVG', 5000))
      .then(() => this.app)
      .then(verifyNodeStatusExists('() => ({ path: true })', 'success'))
      .then(verifyNodeStatusExists('() => ({ path: false })', 'not-run'))
      .catch(common.oops(this))
  })

  it(`should invoke ${appName} with condition equals false`, () =>
    cli
      .do(`wsk app invoke ${appName} -p condition false`, this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .catch(common.oops(this)))

  it(`should be able to click on the mode button to switch to session flow, and see the false path highlighted`, async () => {
    await this.app.client.click(ui.selectors.SIDECAR_MODE_BUTTON('visualization'))
    return Promise.resolve(this.app)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(appName))
      .then(() => this.app.client.waitForExist('#wskflowSVG', 5000))
      .then(() => this.app)
      .then(verifyNodeStatusExists('() => ({ path: true })', 'not-run'))
      .then(verifyNodeStatusExists('() => ({ path: false })', 'success'))
      .catch(common.oops(this))
  })
})

// click on node in wskflow and show action
describe('wskflow test drilldown to action from wskflow', function(this: common.ISuite) {
  before(openwhisk.before(this))
  after(common.after(this))

  const appName = 'test-if'
  const appFile = '@demos/if.js'
  const actionName = 'authenticate'
  const actionFile = '@demos/authenticate.js'

  it(`should deploy action ${actionName}`, () =>
    cli
      .do(`wsk action create ${actionName} ${actionFile}`, this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName))
      .catch(common.oops(this)))

  it(`should create an app with ${appFile}`, () =>
    cli
      .do(`wsk app create ${appName} ${appFile}`, this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(appName))
      .catch(common.oops(this)))

  it(`should click on the authenticate node and go to the action`, () =>
    this.app.client
      .click(`#wskflowSVG .node[data-name="/_/${actionName}"]`)
      .then(() =>
        this.app.client.waitUntil(async () => {
          return this.app.client.getText(ui.selectors.SIDECAR_TITLE).then(text => text === actionName)
        })
      )
      .then(() => this.app.client.waitForVisible('#qtip', 2000, true)) // qtip better not be visible
      .catch(common.oops(this)))
})

// test if mousedown on a node, drag and release triggers the clicking behavior of the node (it shouldn't)
describe('wskflow test test if pressing a node, dragging and releasing triggers the clicking behavior of the node it should not', function(this: common.ISuite) {
  before(openwhisk.before(this))
  after(common.after(this))

  const appName = 'test-if'
  const appFile = `${ROOT}/data/composer/composer-source/if-session.js`

  it(`should create an app with ${appFile}`, () =>
    cli
      .do(`wsk app create ${appName} ${appFile}`, this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(appName))
      .catch(common.oops(this)))

  it(`should invoke ${appName} with condition equals true`, () =>
    cli
      .do(`wsk app invoke ${appName} -p condition true`, this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .catch(common.oops(this)))

  it(`should be able to click on the mode button to switch to session flow`, async () => {
    await this.app.client.click(ui.selectors.SIDECAR_MODE_BUTTON('visualization'))
    return Promise.resolve(this.app)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(appName))
      .then(() => this.app.client.waitForExist('#wskflowSVG', 5000))
      .then(() => this.app)
      .then(verifyNodeStatusExists('Exit', 'success'))
      .catch(common.oops(this))
  })

  it(`should press, drag and release exist node and still stay at session flow`, () =>
    this.app.client
      .moveToObject('#Exit')
      .then(() => this.app.client.buttonDown())
      .then(() => this.app.client.moveToObject('#wskflowSVG'))
      .then(() => this.app.client.buttonUp())
      .then(() => this.app.client.getText('.sidecar-header-icon'))
      .then(text => assert.strictEqual(text, 'SESSION'))
      .catch(common.oops(this)))

  it(`should click on the exit node and go to the activation`, () =>
    this.app.client
      .click('#Exit')
      .then(() => this.app.client.getText('.sidecar-header-icon'))
      .then(text => assert.strictEqual(text, 'ACTIVATION'))
      .catch(common.oops(this)))
})
