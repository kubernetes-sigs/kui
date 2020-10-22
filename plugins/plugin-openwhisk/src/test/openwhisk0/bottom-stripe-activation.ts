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
 *
 */

import { Common, CLI, ReplExpect, SidecarExpect, Selectors, Util } from '@kui-shell/test'

import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

const actionName = 'foo'

describe('Sidecar bottom stripe interactions for activations', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  /** verify the mode buttons work */
  const verify = (name: string, expectedResult: Record<string, any>) => (res: () => ReplExpect.AppAndCount) => {
    if (openwhisk.expectedNamespace()) {
      // this will form a part of the annotations record
      const subsetOfAnnotations = { path: `${openwhisk.expectedNamespace()}/${name}` }
      it(`should show annotations for ${name} by clicking on bottom stripe`, async () => {
        await this.app.client.$(Selectors.SIDECAR_MODE_BUTTON(res().count, 'annotations')).then(_ => _.click())
        return SidecarExpect.open(res())
          .then(SidecarExpect.showing(name))
          .then(Util.getValueFromMonaco)
          .then(Util.expectYAMLSubset(subsetOfAnnotations))
          .catch(Common.oops(this, true))
      })
    }

    // click on result mode button
    it(`should show result for ${name} by clicking on bottom stripe`, async () => {
      await this.app.client.$(Selectors.SIDECAR_MODE_BUTTON(res().count, 'result')).then(_ => _.click())
      return SidecarExpect.open(res())
        .then(SidecarExpect.showing(name))
        .then(() =>
          this.app.client.waitUntil(async () => {
            const ok = await Util.getValueFromMonaco(res()).then(Util.expectYAML(expectedResult, true))
            return ok
          })
        )
        .catch(Common.oops(this, true))
    })

    // click on raw mode button
    it(`should show raw for ${name} by clicking on bottom stripe`, async () => {
      await this.app.client.$(Selectors.SIDECAR_MODE_BUTTON(res().count, 'raw')).then(_ => _.click())
      return SidecarExpect.open(res())
        .then(SidecarExpect.showing(name))
        .then(() =>
          this.app.client.waitUntil(async () => {
            const ok = await Util.getValueFromMonaco(res()).then(Util.expectYAMLSubset({ name }, false)) // parts of the raw annotation record
            return ok
          })
        )
        .catch(Common.oops(this, true))
    })
  }

  // create an action, using the implicit entity type
  it(`should create an action ${actionName}`, () =>
    CLI.command(`let ${actionName} = x => { console.log(JSON.stringify(x)); return x }`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName))
      .catch(Common.oops(this, true)))

  it(`should update the params of ${actionName}`, () =>
    CLI.command(`wsk action update ${actionName} -p x 5 -p y 10`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName))
      .catch(Common.oops(this, true)))

  let res: ReplExpect.AppAndCount
  it(`should invoke ${actionName}`, async () => {
    try {
      res = await CLI.command(`wsk action invoke ${actionName} -p z 3`, this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(actionName))
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })
  verify(actionName, { x: 5, y: 10, z: 3 })(() => res)

  it(`should invoke ${actionName}`, async () => {
    try {
      res = await CLI.command(`wsk action invoke ${actionName} -p z 99`, this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(actionName))
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })
  verify(actionName, { x: 5, y: 10, z: 99 })(() => res)
})
