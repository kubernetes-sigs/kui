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

import { ISuite } from '../../../../../../../tests/lib/common'
import * as fs from 'fs'
import * as assert from 'assert'
import { join } from 'path'
const ROOT = process.env.TEST_ROOT
const common = require(join(ROOT, 'lib/common'))

const ui = require(join(ROOT, 'lib/ui'))
const cli = ui.cli
const sidecar = ui.sidecar
const keys = ui.keys
// sharedURL = process.env.REDIS_URL || 'redis://127.0.0.1:6379'
const {
  verifyNodeExists,
  verifyNodeStatusExists,
  verifyTheBasicStuff
} = require('../../../tests/lib/composer-viz-util')

/**
 * Here starts the test
 *
 */
// test if the graph is by default zoom to fit
describe('bring up the composer visualization when the sidecar is minimized', function (this: ISuite) {
  before(common.before(this))
  after(common.after(this))

  it('should have an active repl', () => cli.waitForRepl(this.app))

  it('should show the if composition graph', () => cli.do('preview data/composer/composer-source/if.js', this.app)
    .then(verifyTheBasicStuff('if.js', 'composerLib')) // verify basic things
    .catch(common.oops(this)))

  it('should minimize the sidecar', () => this.app.client.keys(keys.ESCAPE)
    .then(() => sidecar.expectClosed(this.app))
    .catch(common.oops(this)))

  it('should show the if composition graph again', () => cli.do('app preview data/composer/composer-source/if.js', this.app)
    .then(() => sidecar.expectOpen(this.app))
    .catch(common.oops(this)))

  it('should use viewBox to let the graph fit the container', () => this.app.client.waitForExist('#wskflowSVG[viewBox]', 3000))
})

// test if app preview update a graph when the watched file gets updated
describe('app preview should actively watching an external file', function (this: ISuite) {
  before(common.before(this))
  after(common.after(this))

  let tempFileName = 'testtemp.js'
  it('should have an active repl', () => cli.waitForRepl(this.app))

  it('should write composer.sequence("a", "b") to a temp file', () => {
    return new Promise((resolve, reject) => {
      fs.writeFile(tempFileName, `module.exports = require('openwhisk-composer').sequence("a", "b")`, (err) => {
        if (err) { reject(err) } else { resolve(true) }
      })
    })
  })

  it('should preview the temp file', () => cli.do(`preview ${tempFileName}`, this.app)
    .then(verifyTheBasicStuff(tempFileName, 'composerLib')) // verify basic things
    .then(verifyNodeExists('a'))
    .then(verifyNodeExists('b'))
    .catch(common.oops(this)))

  it('should update the temp file to composer.sequence("a", "c")asdfasdf', () => {
    return new Promise((resolve, reject) => {
      fs.writeFile(tempFileName, `module.exports = require('openwhisk-composer').sequence("a", "c")asdfasdf`, (err) => {
        if (err) { reject(err) } else { resolve(true) }
      })
    })
  })

  // error message is shown as action code
  it('should update preview with the error message', () => this.app.client.waitForVisible(`${ui.selectors.SIDECAR}.entity-is-actions`, 3000))

  it('should update the temp file to composer.sequence("a", "c")', () => {
    return new Promise((resolve, reject) => {
      fs.writeFile(tempFileName, `module.exports = require('openwhisk-composer').sequence("a", "c")`, (err) => {
        if (err) { reject(err) } else { resolve(true) }
      })
    })
  })

  it('should update preview', () => this.app.client.waitForVisible(ui.selectors.SIDECAR_CUSTOM_CONTENT)
    .then(() => verifyNodeExists('a')(this.app))
    .then(verifyNodeExists('c'))
    .catch(common.oops(this)))

  // should be able to switch JSON tab and switch back
  it('should switch to the JSON tab', () => this.app.client.click(ui.selectors.SIDECAR_MODE_BUTTON('ast'))
    .then(() => this.app.client.click(ui.selectors.SIDECAR_MODE_BUTTON('visualization')))
    .then(() => verifyNodeExists('a')(this.app))
    .then(verifyNodeExists('c'))
    .catch(common.oops(this)))
  // update file again, and verify that preview updates too
  it('should update the temp file to composer.sequence("a", "b")', () => {
    return new Promise((resolve, reject) => {
      fs.writeFile(tempFileName, `module.exports = require('openwhisk-composer').sequence("a", "b")`, (err) => {
        if (err) { reject(err) } else { resolve(true) }
      })
    })
  })
  it('should update preview', () => this.app.client.waitForVisible(ui.selectors.SIDECAR_CUSTOM_CONTENT)
    .then(() => verifyNodeExists('a')(this.app))
    .then(verifyNodeExists('b'))
    .catch(common.oops(this)))

  it('should delete the temp file', () => {
    return new Promise((resolve, reject) => {
      fs.unlink(tempFileName, (err) => {
        if (err) { reject(err) } else { resolve(true) }
      })
    })
  })

  it('should preview the temp file and throw file not found error', () => cli.do(`preview ${tempFileName}`, this.app)
    .then(cli.expectError(404, 'The specified file does not exist'))
    .catch(common.oops(this)))
})

// test if session flow highlighting is correct
describe('create a if composition, invoke, verify session flow is shown correctly', function (this: ISuite) {
  before(common.before(this))
  after(common.after(this))
  const appName = 'test-if'
  const appFile = 'data/composer/composer-source/if-session.js'
  it('should have an active repl', () => cli.waitForRepl(this.app))

  it(`should create an app with ${appFile}`, () => cli.do(`app create ${appName} ${appFile}`, this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing(appName))
    .catch(common.oops(this)))

  it(`should invoke ${appName} with condition equals true`, () => cli.do(`app invoke ${appName} -p condition true`, this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .catch(common.oops(this)))

  it(`should be able to click on the mode button to switch to session flow, and see the true path highlighted`, () => this.app.client.click(ui.selectors.SIDECAR_MODE_BUTTON('visualization'))
     .then(() => this.app)
     .then(sidecar.expectOpen)
     .then(sidecar.expectShowing(appName))
     .then(app => this.app.client.waitForExist('#wskflowSVG', 5000))
     .then(() => this.app)
     .then(verifyNodeStatusExists('p=>({path:true})', 'success'))
     .then(verifyNodeStatusExists('p=>({path:false})', 'not-run'))
     .catch(common.oops(this)))

  it(`should invoke ${appName} with condition equals false`, () => cli.do(`app invoke ${appName} -p condition false`, this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .catch(common.oops(this)))

  it(`should be able to click on the mode button to switch to session flow, and see the false path highlighted`, () => this.app.client.click(ui.selectors.SIDECAR_MODE_BUTTON('visualization'))
    .then(() => this.app)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing(appName))
    .then(() => this.app.client.waitForExist('#wskflowSVG', 5000))
    .then(() => this.app)
    .then(verifyNodeStatusExists('p=>({path:true})', 'not-run'))
    .then(verifyNodeStatusExists('p=>({path:false})', 'success'))
    .catch(common.oops(this)))
})

// click on node in wskflow and show action
describe('drilldown to action from wskflow', function (this: ISuite) {
  before(common.before(this))
  after(common.after(this))

  const appName = 'test-if'
  const appFile = '@demos/if.js'
  it('should have an active repl', () => cli.waitForRepl(this.app))

  it(`should create an app with ${appFile}`, () => cli.do(`app create -r ${appName} ${appFile}`, this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing(appName))
    .catch(common.oops(this)))

  it(`should click on the authenticate node and go to the action`, () => this.app.client.click('#wskflowSVG .node[data-name="/_/authenticate"]')
    .then(() => this.app.client.waitUntil(async () => {
      return this.app.client.getText(ui.selectors.SIDECAR_TITLE)
        .then(text => text === 'authenticate')
    }))
    .then(() => this.app.client.waitForExist('#qtip', 2000, false)) // qtip better not be visible
    .catch(common.oops(this)))
})

// test if mousedown on a node, drag and release triggers the clicking behavior of the node (it shouldn't)
describe('test if pressing a node, dragging and releasing triggers the clicking behavior of the node it should not', function (this: ISuite) {
  before(common.before(this))
  after(common.after(this))

  const appName = 'test-if'
  const appFile = 'data/composer/composer-source/if-session.js'
  it('should have an active repl', () => cli.waitForRepl(this.app))

  it(`should create an app with ${appFile}`, () => cli.do(`app create ${appName} ${appFile}`, this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing(appName))
    .catch(common.oops(this)))

  it(`should invoke ${appName} with condition equals true`, () => cli.do(`app invoke ${appName} -p condition true`, this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .catch(common.oops(this)))

  it(`should be able to click on the mode button to switch to session flow`, () => this.app.client.click(ui.selectors.SIDECAR_MODE_BUTTON('visualization'))
    .then(() => this.app)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing(appName))
    .then(app => this.app.client.waitForExist('#wskflowSVG', 5000))
    .then(() => this.app)
    .then(verifyNodeStatusExists('Exit', 'success'))
    .catch(common.oops(this)))

  it(`should press, drag and release exist node and still stay at session flow`, () => this.app.client.moveToObject('#Exit')
    .then(() => this.app.client.buttonDown())
    .then(() => this.app.client.moveToObject('#wskflowSVG'))
    .then(() => this.app.client.buttonUp())
    .then(() => this.app.client.getText('.sidecar-header-icon'))
    .then(text => assert.strictEqual(text, 'SESSION'))
    .catch(common.oops(this)))

  it(`should click on the exit node and go to the activation`, () => this.app.client.click('#Exit')
    .then(() => this.app.client.getText('.sidecar-header-icon'))
    .then(text => assert.strictEqual(text, 'ACTIVATION'))
    .catch(common.oops(this)))
})
