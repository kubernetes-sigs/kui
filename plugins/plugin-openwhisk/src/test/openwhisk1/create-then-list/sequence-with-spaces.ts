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

const actionName1 = 'foo bar'
const actionName2 = 'bam'
const sequenceName1 = 'sss'

// TODO: webpack test
localDescribe('Create a sequence with whitespacey names', function(this: common.ISuite) {
  before(openwhisk.before(this))
  after(common.after(this))

  // create an action, using the implicit entity type
  it('should create an action', () =>
    cli
      .do(`create "${actionName1}" ${ROOT}/data/openwhisk/foo.js`, this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName1))
      .catch(common.oops(this)))

  // create the second action
  it('should create an action', () =>
    cli
      .do(`create ${actionName2} ${ROOT}/data/openwhisk/foo2.js`, this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName2))
      .catch(common.oops(this)))

  it(`should show ${actionName1} by clicking on the result of "ls"`, () =>
    cli
      .do('list', this.app)
      .then(cli.expectOKWithCustom({ passthrough: true }))
      .then(N => this.app.client.click(ui.selectors.LIST_RESULT_BY_N_AND_NAME(N, actionName1)))
      .then(() => this.app)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName1))
      .catch(common.oops(this)))

  // create a sequence
  it('should create a sequence', () =>
    cli
      .do(`create ${sequenceName1} --sequence "${actionName1},${actionName2}"`, this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(sequenceName1))
      .catch(common.oops(this)))

  // click on a sequence component bubble
  it('should show action after clicking on bubble', async () => {
    try {
      await this.app.client.waitForExist(ui.selectors.SIDECAR_SEQUENCE_CANVAS_NODE_N(0))
      await this.app.client.click(ui.selectors.SIDECAR_SEQUENCE_CANVAS_NODE_N(0))
      return sidecar.expectOpen(this.app).then(sidecar.expectShowing(actionName1))
    } catch (err) {
      return common.oops(this)(err)
    }
  })
})
