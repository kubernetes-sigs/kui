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

import * as assert from 'assert'

import { Common, CLI, ReplExpect, SidecarExpect, Selectors, Util } from '@kui-shell/test'

import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

const actionName = 'foo'

describe('Sidecar bottom stripe interactions for activations', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  /** verify the mode buttons work */
  const verify = (name, expectedResult, expectedLogs) => {
    // click on parameters mode button
    it(`should show logs for ${name} by clicking on bottom stripe`, async () => {
      await this.app.client.click(Selectors.SIDECAR_MODE_BUTTON('logs'))
      return SidecarExpect.open(this.app)
        .then(SidecarExpect.showing(name))
        .then(() => this.app.client.getText(`${Selectors.SIDECAR_CONTENT} .activation-result`))
        .then(actualLogs => {
          if (actualLogs.replace(/\s+/g, '').indexOf(expectedLogs.replace(/\s+/g, '')) < 0) {
            console.error(actualLogs.replace(/\s+/g, '') + ' != ' + expectedLogs.replace(/\s+/g, ''))
            assert.ok(false)
          }
        })
        .catch(Common.oops(this))
    })

    // this will form a part of the annotations record
    const subsetOfAnnotations = { path: `${openwhisk.expectedNamespace()}/${name}` }

    it(`should show annotations for ${name} by clicking on bottom stripe`, async () => {
      await this.app.client.click(Selectors.SIDECAR_MODE_BUTTON('annotations'))
      return SidecarExpect.open(this.app)
        .then(SidecarExpect.showing(name))
        .then(() => this.app.client.getText(`${Selectors.SIDECAR_CONTENT} .activation-result`))
        .then(Util.expectSubset(subsetOfAnnotations))
        .catch(Common.oops(this))
    })

    // click on result mode button
    it(`should show result for ${name} by clicking on bottom stripe`, async () => {
      await this.app.client.click(Selectors.SIDECAR_MODE_BUTTON('result'))
      return SidecarExpect.open(this.app)
        .then(SidecarExpect.showing(name))
        .then(() =>
          this.app.client.waitUntil(async () => {
            const ok = await this.app.client
              .getText(`${Selectors.SIDECAR_CONTENT} .activation-result`)
              .then(Util.expectStruct(expectedResult, false, true))
            return ok
          })
        )
        .catch(Common.oops(this))
    })

    // click on raw mode button
    it(`should show raw for ${name} by clicking on bottom stripe`, async () => {
      await this.app.client.click(Selectors.SIDECAR_MODE_BUTTON('raw'))
      return SidecarExpect.open(this.app)
        .then(SidecarExpect.showing(name))
        .then(() =>
          this.app.client.waitUntil(async () => {
            const ok = await this.app.client
              .getText(`${Selectors.SIDECAR_CONTENT} .activation-result`)
              .then(Util.expectSubset({ name, namespace: openwhisk.expectedNamespace() }, false)) // parts of the raw annotation record
            return ok
          })
        )
        .catch(Common.oops(this))
    })
  }

  // create an action, using the implicit entity type
  it(`should create an action ${actionName}`, () =>
    CLI.command(`let ${actionName} = x => { console.log(JSON.stringify(x)); return x } -p x 5 -p y 10`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName))
      .catch(Common.oops(this)))

  it(`should invoke ${actionName}`, () =>
    CLI.command(`wsk action invoke ${actionName} -p z 3`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName))
      .catch(Common.oops(this)))
  verify(actionName, { x: 5, y: 10, z: 3 }, '{ "x": 5, "y": 10, "z": 3 }')

  it(`should invoke ${actionName}`, () =>
    CLI.command(`wsk action invoke ${actionName} -p z 99`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName))
      .catch(Common.oops(this)))
  verify(actionName, { x: 5, y: 10, z: 99 }, '{ "x": 5, "y": 10, "z": 99 }')

  // this one is buggy:
  /* it(`should show activation with last`, () => CLI.command(`last --name ${actionName}`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName))
      .catch(Common.oops(this)))
      verify(actionName, {x:5,y:10,z:99}, '{ x: 5, y: 10, z: 99 }') */
})
