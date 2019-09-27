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

import { Common, CLI, ReplExpect, SidecarExpect, Selectors, Util } from '@kui-shell/test'

import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

import { dirname } from 'path'

const ROOT = dirname(require.resolve('@kui-shell/plugin-openwhisk/tests/package.json'))

import paramsJson = require('@kui-shell/plugin-openwhisk/tests/data/openwhisk/params.json')

const actionName = 'foo'

describe('wsk action invoke with implicit entity', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  it('should create an action', () =>
    CLI.command(`let ${actionName} = x=>x -p x 3`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName))
      .catch(Common.oops(this)))

  for (let idx = 0; idx < 5; idx++) {
    it(`should invoke ${actionName} with implicit entity idx=${idx}`, () =>
      CLI.command(`wsk action invoke -p name grumble`, this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(actionName))
        .then(() => this.app.client.getText(Selectors.SIDECAR_ACTIVATION_RESULT))
        .then(Util.expectStruct({ x: 3, name: 'grumble' }))
        .catch(Common.oops(this)))
  }

  it(`should invoke ${actionName} with implicit entity and --param-file`, () =>
    CLI.command(`wsk action invoke --param-file ${ROOT}/data/openwhisk/params.json`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName))
      .then(() => this.app.client.getText(Selectors.SIDECAR_ACTIVATION_RESULT))
      .then(Util.expectStruct(Object.assign({ x: 3 }, paramsJson)))
      .catch(Common.oops(this)))

  it(`should invoke ${actionName} with implicit entity and -P`, () =>
    CLI.command(`wsk action invoke -P ${ROOT}/data/openwhisk/params.json`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName))
      .then(() => this.app.client.getText(Selectors.SIDECAR_ACTIVATION_RESULT))
      .then(Util.expectStruct(Object.assign({ x: 3 }, paramsJson)))
      .catch(Common.oops(this)))

  it(`should invoke ${actionName} with explicit entity and -P`, () =>
    CLI.command(`wsk action invoke ${actionName} -P ${ROOT}/data/openwhisk/params.json`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName))
      .then(() => this.app.client.getText(Selectors.SIDECAR_ACTIVATION_RESULT))
      .then(Util.expectStruct(Object.assign({ x: 3 }, paramsJson)))
      .catch(Common.oops(this)))

  it(`should fail when requesting parameters of an activation`, () =>
    CLI.command('wsk action params', this.app)
      .then(ReplExpect.error(0, 'The current entity does not support viewing parameters'))
      .catch(Common.oops(this)))
})
