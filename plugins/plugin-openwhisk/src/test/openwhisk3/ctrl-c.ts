/*
 * Copyright 2017-18 IBM Corporation
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

import * as common from '@kui-shell/core/tests/lib/common'
import * as ui from '@kui-shell/core/tests/lib/ui'
import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'
const { cli, sidecar } = ui

const delay = 3000
const actionName = 'foo'

describe('Cancel via Ctrl+C', function(this: common.ISuite) {
  before(openwhisk.before(this))
  after(common.after(this))

  // note that this action resolves with its input parameter; we'll check this in the await step below
  it('should create an action that completes with some delay', () =>
    cli
      .do(`let ${actionName} = x=> new Promise((resolve, reject) => setTimeout(() => resolve(x), ${delay}))`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName)))

  it('should invoke the long-running action, then cancel', () =>
    cli
      .do(`wsk action invoke -p name openwhisk`, this.app)
      .then(res => new Promise(resolve => setTimeout(() => resolve(res), delay / 3)))
      .then(appAndCount => this.app.client.keys(ui.ctrlC).then(() => appAndCount))
      .then(cli.expectBlank)
      .catch(common.oops(this)))

  // checking the resolve(x)
  it('should await the long-running action', () =>
    cli
      .do(`await`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName))
      .then(() => this.app.client.getText(ui.selectors.SIDECAR_ACTIVATION_RESULT))
      .then(
        ui.expectStruct({
          name: 'openwhisk'
        })
      )
      .catch(common.oops(this)))
})
