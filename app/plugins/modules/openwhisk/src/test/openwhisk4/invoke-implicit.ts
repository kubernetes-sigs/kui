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

import { join } from 'path'

import * as common from '@test/lib/common'
import * as ui from '@test/lib/ui'
import * as openwhisk from '@test/lib/openwhisk/openwhisk'
const { cli, selectors, sidecar } = ui

const actionName = 'foo'

describe('wsk action invoke with implicit entity', function (this: common.ISuite) {
  before(openwhisk.before(this))
  after(common.after(this))

  it('should have an active repl', () => cli.waitForRepl(this.app))

  it('should create an action', () => cli.do(`let ${actionName} = x=>x -p x 3`, this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing(actionName))
    .catch(common.oops(this)))

  for (let idx = 0; idx < 5; idx++) {
    it(`should invoke ${actionName} with implicit entity idx=${idx}`, () => cli.do(`wsk action invoke -p name grumble`, this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName))
      .then(() => this.app.client.getText(ui.selectors.SIDECAR_ACTIVATION_RESULT))
      .then(ui.expectStruct({ x: 3, name: 'grumble' }))
      .catch(common.oops(this)))
  }

  const paramsJson = require(join(process.env.TEST_ROOT, 'data/openwhisk/params.json'))

  it(`should invoke ${actionName} with implicit entity and --param-file`, () => cli.do(`invoke --param-file ./data/openwhisk/params.json`, this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing(actionName))
    .then(() => this.app.client.getText(ui.selectors.SIDECAR_ACTIVATION_RESULT))
    .then(ui.expectStruct(Object.assign({ x: 3 }, paramsJson)))
    .catch(common.oops(this)))

  it(`should invoke ${actionName} with implicit entity and -P`, () => cli.do(`invoke -P ./data/openwhisk/params.json`, this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing(actionName))
    .then(() => this.app.client.getText(ui.selectors.SIDECAR_ACTIVATION_RESULT))
    .then(ui.expectStruct(Object.assign({ x: 3 }, paramsJson)))
    .catch(common.oops(this)))

  it(`should invoke ${actionName} with explicit entity and -P`, () => cli.do(`invoke ${actionName} -P ./data/openwhisk/params.json`, this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing(actionName))
    .then(() => this.app.client.getText(ui.selectors.SIDECAR_ACTIVATION_RESULT))
    .then(ui.expectStruct(Object.assign({ x: 3 }, paramsJson)))
    .catch(common.oops(this)))

  it(`should fail when requesting parameters of an activation`, () => cli.do('params', this.app)
    .then(cli.expectError(0, 'The current entity does not support viewing parameters'))
    .catch(common.oops(this)))
})
