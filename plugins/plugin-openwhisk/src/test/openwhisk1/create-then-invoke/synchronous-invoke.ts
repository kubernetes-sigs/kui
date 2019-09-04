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

/**
 * tests that create an action and test that it shows up in the list UI
 *    this test also covers toggling the sidecar
 */

import * as common from '@kui-shell/core/tests/lib/common'
import * as ui from '@kui-shell/core/tests/lib/ui'
import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

import { dirname } from 'path'
const { cli, sidecar } = ui
const { localDescribe } = common
const ROOT = dirname(require.resolve('@kui-shell/plugin-openwhisk/tests/package.json'))

const actionName = 'foo'
const actionName2 = 'foo2'
const packageName = 'ppp'

// TODO: webpack test
localDescribe('Test synchronous action invocation', function(this: common.ISuite) {
  before(openwhisk.before(this))
  after(common.after(this))

  it('should create an action', () =>
    cli
      .do(`wsk action create ${actionName} ${ROOT}/data/openwhisk/foo.js`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName))
      .catch(common.oops(this)))

  it('should invoke that action with implicit entity', () =>
    cli
      .do(`wsk action invoke -p name openwhisk`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName))
      .then(() => this.app.client.getText(ui.selectors.SIDECAR_ACTIVATION_ID))
      .then(ui.expectValidActivationId)
      .then(() => this.app.client.getText(ui.selectors.SIDECAR_ACTIVATION_RESULT))
      .then(ui.expectStruct({ name: 'Step1 openwhisk' }))
      .catch(common.oops(this)))

  it('should create a packaged action', () =>
    cli
      .do(`let ${packageName}/${actionName2} = ${ROOT}/data/openwhisk/foo.js`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName2, undefined, undefined, packageName))
      .catch(common.oops(this)))

  it('should invoke that action with implicit entity', () =>
    cli
      .do(`wsk action invoke -p name openwhisker`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName2))
      .then(() => this.app.client.getText(ui.selectors.SIDECAR_ACTIVATION_ID))
      .then(ui.expectValidActivationId)
      .then(() => this.app.client.getText(ui.selectors.SIDECAR_ACTIVATION_RESULT))
      .then(ui.expectStruct({ name: 'Step1 openwhisker' }))
      .catch(common.oops(this)))

  it('should invoke the first action with explicit entity', () =>
    cli
      .do(`wsk action invoke ${actionName} -p name openwhiskers`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName))
      .then(() => this.app.client.getText(ui.selectors.SIDECAR_ACTIVATION_ID))
      .then(ui.expectValidActivationId)
      .then(() => this.app.client.getText(ui.selectors.SIDECAR_ACTIVATION_RESULT))
      .then(ui.expectStruct({ name: 'Step1 openwhiskers' }))
      .catch(common.oops(this)))
})
