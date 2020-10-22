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

import { Common, CLI, ReplExpect, SidecarExpect, Selectors } from '@kui-shell/test'

import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'
import { dirname } from 'path'

const { localDescribe } = Common
const ROOT = dirname(require.resolve('@kui-shell/plugin-openwhisk/tests/package.json'))

const actionName1 = 'foo bar'
const actionName2 = 'bam'
const sequenceName1 = 'sss'

// TODO: webpack test
localDescribe('Create a sequence with whitespacey names', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  // create an action, using the implicit entity type
  it('should create an action', () =>
    CLI.command(`wsk action create "${actionName1}" ${ROOT}/data/openwhisk/foo.js`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName1))
      .catch(Common.oops(this)))

  // create the second action
  it('should create an action', () =>
    CLI.command(`wsk action create ${actionName2} ${ROOT}/data/openwhisk/foo2.js`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName2))
      .catch(Common.oops(this)))

  it(`should show ${actionName1} by clicking on the result of "ls"`, async () => {
    try {
      const res = await CLI.command('wsk action list', this.app).then(ReplExpect.justOK)

      await this.app.client.$(Selectors.LIST_RESULT_BY_N_AND_NAME(res.count, actionName1)).then(_ => _.click())

      await SidecarExpect.openInBlockAfter(res).then(SidecarExpect.showing(actionName1))
    } catch (err) {
      Common.oops(this, true)(err)
    }
  })

  // create a sequence
  it('should create a sequence', () =>
    CLI.command(`wsk action create ${sequenceName1} --sequence "${actionName1},${actionName2}"`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(sequenceName1))
      .catch(Common.oops(this)))

  // click on a sequence component bubble
  /* it('should show action after clicking on bubble', async () => {
    try {
      await this.app.client.waitForExist(Selectors.SIDECAR_SEQUENCE_CANVAS_NODE_N(0))
      await this.app.client.click(Selectors.SIDECAR_SEQUENCE_CANVAS_NODE_N(0))
      return SidecarExpect.open(this.app).then(SidecarExpect.showing(actionName1))
    } catch (err) {
      return Common.oops(this)(err)
    }
  }) */
})
