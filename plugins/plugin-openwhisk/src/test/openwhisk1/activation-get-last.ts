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

import { Common, CLI, ReplExpect, SidecarExpect, Selectors, Util } from '@kui-shell/test'

import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

import { dirname } from 'path'

const ROOT = dirname(require.resolve('@kui-shell/plugin-openwhisk/tests/package.json'))

const actionName1 = `foo1-${new Date().getTime()}`
const actionName2 = `foo2-${new Date().getTime()}`
const { localDescribe } = Common

// TODO: webpack test
localDescribe('wsk activation get --last', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  // create an action
  it(`should create an action ${actionName1}`, () =>
    CLI.command(`wsk action create ${actionName1} ${ROOT}/data/openwhisk/foo.js`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName1))
      .catch(Common.oops(this)))

  it(`should invoke it ${actionName1}`, () =>
    CLI.command(`wsk action invoke -p name lastTestIPromise`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName1))
      .catch(Common.oops(this)))

  // create another action
  it(`should create an action ${actionName2}`, () =>
    CLI.command(`wsk action create ${actionName2} ${ROOT}/data/openwhisk/foo.js`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName2))
      .catch(Common.oops(this)))

  it(`should show ${actionName1} with wsk activation get --last`, () =>
    this.app.client
      .waitUntil(() => {
        return CLI.command(`wsk activation get --last`, this.app)
          .then(ReplExpect.ok)
          .then(SidecarExpect.open)
          .then(SidecarExpect.showing(actionName1, undefined, undefined, undefined, undefined, 500))
          .then(() => this.app.client.getText(Selectors.SIDECAR_ACTIVATION_RESULT))
          .then(Util.expectStruct({ name: 'Step1 lastTestIPromise' }))
          .then(() => true)
          .catch(() => false)
      })
      .catch(Common.oops(this)))

  it(`should invoke it ${actionName2}`, () =>
    CLI.command(`wsk action invoke ${actionName2} -p name lastTestIPromise`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName2))
      .catch(Common.oops(this)))

  // this test is too flakey against IBM Cloud Functions, as activation records may only become visible way in the future
  /*
  it(`should show ${actionName1} with wsk activation get --last ${actionName1}`, () => this.app.client.waitUntil(() => {
    return CLI.command(`wsk activation get --last ${actionName1}`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName1, undefined, undefined, undefined, undefined, 500))
      .then(() => this.app.client.getText(Selectors.SIDECAR_ACTIVATION_RESULT))
      .then(Util.expectStruct({name: 'Step1 lastTestIPromise'}))
      .catch(Common.oops(this))
  }))

  it(`should show ${actionName2} with wsk activation get --last ${actionName2}`, () => this.app.client.waitUntil(() => {
    return CLI.command(`wsk activation get --last ${actionName2}`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName2, undefined, undefined, undefined, undefined, 500))
      .then(() => this.app.client.getText(Selectors.SIDECAR_ACTIVATION_RESULT))
      .then(Util.expectStruct({name: 'Step1 lastTestIPromise'}))
      .catch(Common.oops(this))
  })) */
})
