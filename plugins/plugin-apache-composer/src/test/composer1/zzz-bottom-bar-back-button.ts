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

//
// tests that create an action and test that it shows up in the list UI
//    this test also covers toggling the sidecar
//

import { v4 as uuid } from 'uuid'

import { Common, CLI, ReplExpect, SidecarExpect, Selectors } from '@kui-shell/test'
import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

import { dirname } from 'path'

const ROOT = dirname(require.resolve('@kui-shell/plugin-apache-composer/tests/package.json'))

const actionName1 = `bottom-bar-back-button-test-${uuid()}`
const actionName2 = `bottom-bar-back-button-test-${uuid()}`
const seqName1 = 'seq1'
// cell1 = `${Selectors.SIDECAR_CUSTOM_CONTENT} .grid[data-action-name="${actionName1}"] .grid-cell`
// cell2 = `${Selectors.SIDECAR_CUSTOM_CONTENT} .grid[data-action-name="${actionName2}"] .grid-cell`
const cell1 = `${Selectors.SIDECAR_CUSTOM_CONTENT} .grid:first-child .grid-cell:first-child`
const cell2 = `${Selectors.SIDECAR_CUSTOM_CONTENT} .grid:first-child .grid-cell:last-child`

describe('Bottom bar back button functionality', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  /* {
        const cmd = `app init --reset --url ${sharedURL}`
        it(`should ${cmd}`, () => CLI.command(cmd, this.app)
            .then(ReplExpect.okWithCustom({expect: 'Successfully initialized the required services. You may now create compositions.'}))
           .catch(Common.oops(this)))
    } */

  it('should create an echo action', () =>
    CLI.command(`let echo = ${ROOT}/data/composer/echo.js`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('echo'))
      .catch(Common.oops(this)))

  it('should create a composer sequence', () =>
    CLI.command(`wsk app update ${seqName1} ${ROOT}/data/composer/composer-source/echo-sequence2.js`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(seqName1))
      .catch(Common.oops(this)))

  const node1 = `${Selectors.SIDECAR_CUSTOM_CONTENT} .node.action[data-deployed="deployed"]:nth-of-type(3)`
  const node2 = `${Selectors.SIDECAR_CUSTOM_CONTENT} .node.action[data-deployed="deployed"]:nth-of-type(4)`

  const getActionName = path => {
    return path.substring(path.lastIndexOf('/') + 1)
  }

  it('should click on the first node', () => {
    return this.app.client
      .waitForVisible(node1)
      .then(() => this.app.client.getAttribute(node1, 'data-name'))
      .then(path => getActionName(path))
      .then(async actionName => {
        await this.app.client.click(node1)
        return Promise.resolve(this.app)
          .then(SidecarExpect.open)
          .then(SidecarExpect.showing(actionName))
      })
      .then(() => this.app.client.click(Selectors.SIDECAR_BACK_BUTTON))
      .then(() => this.app)
      .then(SidecarExpect.showing(seqName1))
      .catch(Common.oops(this))
  })

  it('should click on the second node', () => {
    return this.app.client
      .waitForVisible(node2)
      .then(() => this.app.client.getAttribute(node2, 'data-name'))
      .then(path => getActionName(path))
      .then(async actionName => {
        await this.app.client.click(node2)
        return Promise.resolve(this.app)
          .then(SidecarExpect.open)
          .then(SidecarExpect.showing(actionName))
      })
      .then(() => this.app.client.click(Selectors.SIDECAR_BACK_BUTTON))
      .then(() => this.app)
      .then(SidecarExpect.showing(seqName1))
      .catch(Common.oops(this))
  })

  /* it(`should create an action ${actionName1}`, () => CLI.command(`let ${actionName1} = x=>x`, this.app)
        .then(ReplExpect.ok)
       .then(SidecarExpect.open)
       .then(SidecarExpect.showing(actionName1))
       .catch(Common.oops(this)))

    it(`should invoke ${actionName1}`, () => CLI.command(`invoke ${actionName1} -p x 3`, this.app)
        .then(ReplExpect.ok)
       .then(SidecarExpect.open)
       .then(SidecarExpect.showing(actionName1))
       .then(() => this.app.client.getText(Selectors.SIDECAR_ACTIVATION_RESULT))
       .then(Util.expectStruct({x:3}))
       .catch(Common.oops(this)))

    it(`should create an action ${actionName2}`, () => CLI.command(`let ${actionName2} = x=>x`, this.app)
        .then(ReplExpect.ok)
       .then(SidecarExpect.open)
       .then(SidecarExpect.showing(actionName2))
       .catch(Common.oops(this)))

    it(`should invoke ${actionName2}`, () => CLI.command(`invoke ${actionName2} -p y 9`, this.app)
        .then(ReplExpect.ok)
       .then(SidecarExpect.open)
       .then(SidecarExpect.showing(actionName2))
       .then(() => this.app.client.getText(Selectors.SIDECAR_ACTIVATION_RESULT))
       .then(Util.expectStruct({y:9}))
       .catch(Common.oops(this))) */

  it(`should open grid, click on some cell, and come back`, () => {
    const once = iter =>
      CLI.command('grid', this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)

        // find cell1, click, then click back
        .then(() => this.app.client.getAttribute(cell1, 'data-action-name'))
        .then(async actionName => {
          await this.app.client.click(cell1)
          return Promise.resolve(this.app).then(SidecarExpect.showing(actionName))
        })
        .then(() => this.app.client.click(Selectors.SIDECAR_BACK_BUTTON))
        .then(() => this.app)
        // .then(SidecarExpect.showing('Recent Activity'))

        .catch(err => {
          console.error(err)
          if (iter < 20) {
            return once(iter + 1)
          } else {
            return Common.oops(this)(err)
          }
        })

    return once(0)
  })

  xit(`should open grid, click on ${actionName2}, and come back, then ${actionName1}, and come back`, () => {
    const once = iter =>
      CLI.command('grid', this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        // .then(SidecarExpect.showing('Recent Activity'))

        // find cell1, click, then click back
        .then(() => this.app.client.getAttribute(cell1, 'data-action-name'))
        .then(async actionName => {
          await this.app.client.click(cell1)
          return Promise.resolve(this.app).then(SidecarExpect.showing(actionName))
        })
        .then(() => this.app.client.click(Selectors.SIDECAR_BACK_BUTTON))
        .then(() => this.app)
        // .then(SidecarExpect.showing('Recent Activity'))

        // find cell2, click, then click back
        .then(() => this.app.client.getAttribute(cell2, 'data-action-name'))
        .then(async actionName => {
          await this.app.client.click(cell2)
          return Promise.resolve(this.app).then(SidecarExpect.showing(actionName))
        })
        .then(() => this.app.client.click(Selectors.SIDECAR_BACK_BUTTON))
        .then(() => this.app)
        // .then(SidecarExpect.showing('Recent Activity'))

        .catch(err => {
          console.error(err)
          if (iter < 20) {
            return once(iter + 1)
          } else {
            return Common.oops(this)(err)
          }
        })

    return once(0)
  })
})
