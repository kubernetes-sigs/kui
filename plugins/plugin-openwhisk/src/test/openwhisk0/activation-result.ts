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
 * tests that create an action and test that it shows up in the list UI
 *    this test also covers toggling the sidecar
 */
import { Common, CLI, ReplExpect, SidecarExpect } from '@kui-shell/test'

import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

import { dirname } from 'path'

const { localDescribe } = Common
const ROOT = dirname(require.resolve('@kui-shell/plugin-openwhisk/tests/package.json'))

const actionName1 = `foo1-${new Date().getTime()}`

// TODO: webpack test
localDescribe('wsk activation result and wsk activation logs', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  // create an action
  it(`should create an action ${actionName1}`, () =>
    CLI.command(`wsk action create ${actionName1} ${ROOT}/data/openwhisk/foo.js`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName1))
      .catch(Common.oops(this)))

  it(`should async that action then show its logs and result`, () =>
    CLI.command(`wsk action async ${actionName1}`, this.app)
      .then(ReplExpect.okWithCustom(CLI.makeCustom('.activationId', '')))
      .then(async selector => {
        const activationId = await this.app.client.getText(selector)
        return this.app.client.waitUntil(() => {
          return CLI.command(`wsk activation logs ${activationId}`, this.app)
            .then(ReplExpect.ok)
            .then(SidecarExpect.open)
            .then(SidecarExpect.showing(actionName1, activationId))
            .then(SidecarExpect.mode('logs'))
            .then(() => Common.refresh(this))
            .then(() => CLI.command(`wsk activation logs ${activationId}`, this.app))
            .then(SidecarExpect.open)
            .then(SidecarExpect.showing(actionName1, activationId))
            .then(SidecarExpect.mode('logs'))
            .then(() => Common.refresh(this))
            .then(() => CLI.command(`wsk activation result ${activationId}`, this.app))
            .then(SidecarExpect.open)
            .then(SidecarExpect.showing(actionName1, activationId))
            .then(SidecarExpect.mode('result'))
            .then(() => true)
            .catch(() => false)
        })
      })
      .catch(Common.oops(this)))
})
