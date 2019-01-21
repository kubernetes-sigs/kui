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

//
// test the edit actionName command for compositions
//
import { join } from 'path'
import * as common from '@kui/core/tests/lib/common'
import * as openwhisk from '@kui/plugin-openwhisk/tests/lib/openwhisk/openwhisk'
import * as ui from '@kui/core/tests/lib/ui'
// sharedURL = process.env.REDIS_URL || 'redis://127.0.0.1:6379'
const cli = ui.cli
const sidecar = ui.sidecar
import {
  verifyTheBasicStuff,
  verifyNodeExists,
  verifyEdgeExists,
  verifyNodeAbsence
} from '@kui/plugin-apache-composer/tests/lib/composer-viz-util'

/** set the monaco editor text */
const setValue = (client, text) => {
  return client.execute(text => {
    document.querySelector('.monaco-editor-wrapper')['editor'].setValue(text)
  }, text)
}

describe('edit compositions', function (this: common.ISuite) {
  before(openwhisk.before(this))
  after(common.after(this))

  /** deploy the changes */
  const deploy = (app, action) => () => {
    return app.client.click(ui.selectors.SIDECAR_MODE_BUTTON('Deploy'))
      .then(() => app.client.waitForExist(`${ui.selectors.SIDECAR}:not(.is-modified):not(.is-new) .is-up-to-date`))
      .then(() => app)
      .catch(err => {
        console.error('Ouch, something bad happened, let us clean up the action before retrying')
        console.error(err)
        return cli.do(`rm ${action}`, app)
          .then(() => {
            throw err
          })
      })
  }

  it('should have an active repl', () => cli.waitForRepl(this.app))

  it(`should open the editor to a new composition and expect wskflow`, () => cli.do('compose comp1', this.app)
    .then(verifyTheBasicStuff('comp1'))
    .then(verifyNodeExists('A'))
    .then(verifyNodeExists('B'))
    .then(verifyEdgeExists('Entry', 'A'))
    .then(verifyEdgeExists('A', 'B'))
    .then(verifyEdgeExists('B', 'Exit'))
    .then(() => setValue(this.app.client,
      '\nmodule.exports = require("openwhisk-composer").sequence(\'A\', \'B\', \'C\')'))
    .then(() => (this.app))
    .then(verifyNodeExists('A'))
    .then(verifyNodeExists('B'))
    .then(verifyNodeExists('C'))
    .then(verifyEdgeExists('Entry', 'A'))
    .then(verifyEdgeExists('A', 'B'))
    .then(verifyEdgeExists('B', 'C'))
    .then(verifyEdgeExists('C', 'Exit'))
    .then(() => setValue(this.app.client,
      '\nmodule.exports = require("openwhisk-composer").sequence(\'A\', \'B\')'))
    .then(() => (this.app))
    .then(verifyNodeExists('A'))
    .then(verifyNodeExists('B'))
    .then(verifyNodeAbsence('C'))
    .then(verifyEdgeExists('Entry', 'A'))
    .then(verifyEdgeExists('A', 'B'))
    .then(verifyEdgeExists('B', 'Exit'))
    .catch(common.oops(this)))

  it(`should open the editor to a new composition and expect error handling`, () => cli.do('compose comp3', this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('comp3'))
    .then(() => setValue(this.app.client,
      '\nmodule.exports = require("openwhisk-composer").sequence(notfound1, notfound2)'))
    .then(() => this.app.client.waitForExist('.editor.parse-error-decoration'))
    .then(() => setValue(this.app.client,
      'module.exports = require("openwhisk-composer").sequence(x=>x, y=>y)'))
    .then(() => this.app.client.waitForExist('.editor.parse-error-decoration', 2000, true))
    .catch(common.oops(this)))

  /* it('should initialize composer', () => cli.do(`app init --url ${sharedURL} --cleanse`, this.app) // cleanse important here for counting sessions in `sessions`
       .then(cli.expectOKWithCustom({expect: 'Successfully initialized and reset the required services. You may now create compositions.'}))
       .catch(common.oops(this))) */

  it('should create an app from FSM', () => cli.do(`app create comp1 ./data/composer/fsm.json`, this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('comp1'))
    // .then(sidecar.expectBadge(badges.fsm))
    .catch(common.oops(this)))

  it('should fail to edit the fsm-based app', () => cli.do('edit comp1', this.app)
    .then(cli.expectError(406))
    .catch(common.oops(this)))

  it('should create an app from source', () => cli.do('app create comp2 ./data/composer/composer-source/seq.js', this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('comp2'))
    // .then(sidecar.expectBadge(badges.composerLib))
    .catch(common.oops(this)))

  // do this in a loop, to make sure we don't have any event listener leaks
  // Disable the test for now since we don't have soure annotation in composition
  // if (false) {
  //   it(`should edit the app with source`, () => cli.do('edit comp2', this.app)
  //     .then(cli.expectOK)
  //     .then(sidecar.expectOpen)
  //     .then(sidecar.expectShowing('comp2'))
  //     .then(sidecar.expectBadge('v0.0.1'))
  //     .then(deploy(this.app, 'comp2'))
  //     .then(sidecar.expectBadge('v0.0.2'))
  //     .catch(common.oops(this)))
  // }

  it(`should fail to open the editor for compose against existing composition`, () => cli.do('compose comp2', this.app)
    .then(cli.expectError(409))
    .catch(common.oops(this)))

  it(`should open the editor to a new composition from a template file`, () => cli.do('compose comp4 -t @demos/hello.js', this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(deploy(this.app, 'comp4'))
    .then(sidecar.expectBadge('v0.0.1'))
    .then(() => this.app.client.waitForVisible('#wskflowSVG')) // the wskflow had better show up after we click Deploy
    .then(() => this.app.client.waitUntil(() => cli.do('app invoke comp4 -p name compose', this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing('comp4'))
      .then(sidecar.expectResult({ 'msg': 'hello compose!' }, false, false))))
    .catch(common.oops(this)))
})
