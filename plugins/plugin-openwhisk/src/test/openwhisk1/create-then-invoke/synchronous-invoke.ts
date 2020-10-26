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

import { Common, CLI, ReplExpect, SidecarExpect, Selectors, Util } from '@kui-shell/test'
import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

import { dirname } from 'path'
const { localDescribe } = Common
const ROOT = dirname(require.resolve('@kui-shell/plugin-openwhisk/tests/package.json'))

const actionName = 'foo'
const actionName2 = 'foo2'
const packageName = 'ppp'

// TODO: webpack test
localDescribe('Test synchronous action invocation', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  it('should create an action', () =>
    CLI.command(`wsk action create ${actionName} ${ROOT}/data/openwhisk/foo.js`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName))
      .catch(Common.oops(this)))

  it('should invoke that action with implicit entity', async () => {
    try {
      const res = await CLI.command(`wsk action invoke -p name openwhisk`, this.app)
        .then(ReplExpect.justOK)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(actionName))

      await this.app.client
        .getText(Selectors.SIDECAR_ACTIVATION_TITLE(res.count))
        .then(openwhisk.expectValidActivationId)

      await Util.getValueFromMonaco(res).then(Util.expectYAML({ name: 'Step1 openwhisk' }))
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })

  it('should create a packaged action', () =>
    CLI.command(`let ${packageName}/${actionName2} = ${ROOT}/data/openwhisk/foo.js`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName2, packageName))
      .catch(Common.oops(this)))

  it('should invoke that action with implicit entity', async () => {
    try {
      const res = await CLI.command(`wsk action invoke -p name openwhisker`, this.app)
        .then(ReplExpect.justOK)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(actionName2))

      await this.app.client
        .getText(Selectors.SIDECAR_ACTIVATION_TITLE(res.count))
        .then(openwhisk.expectValidActivationId)

      await Util.getValueFromMonaco(res).then(Util.expectYAML({ name: 'Step1 openwhisker' }))
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })

  it('should invoke the first action with explicit entity', async () => {
    try {
      const res = await CLI.command(`wsk action invoke ${actionName} -p name openwhiskers`, this.app)
        .then(ReplExpect.justOK)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(actionName))

      await this.app.client
        .getText(Selectors.SIDECAR_ACTIVATION_TITLE(res.count))
        .then(openwhisk.expectValidActivationId)

      await Util.getValueFromMonaco(res).then(Util.expectYAML({ name: 'Step1 openwhiskers' }))
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })
})
