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

import { Common, CLI, Keys, ReplExpect, SidecarExpect, Selectors, Util } from '@kui-shell/test'

import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

const delay = 3000
const actionName = 'foo'

describe('Cancel via Ctrl+C', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  // note that this action resolves with its input parameter; we'll check this in the await step below
  it('should create an action that completes with some delay', () =>
    CLI.command(
      `let ${actionName} = x=> new Promise((resolve, reject) => setTimeout(() => resolve(x), ${delay}))`,
      this.app
    )
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName)))

  it('should invoke the long-running action, then cancel', () =>
    CLI.command(`wsk action invoke -p name openwhisk`, this.app)
      .then(res => new Promise(resolve => setTimeout(() => resolve(res), delay / 3)))
      .then(appAndCount => this.app.client.keys(Keys.ctrlC).then(() => appAndCount))
      .then(ReplExpect.blank)
      .catch(Common.oops(this)))

  // checking the resolve(x)
  it('should await the long-running action', () =>
    CLI.command(`await`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName))
      .then(() => this.app.client.getText(Selectors.SIDECAR_ACTIVATION_RESULT))
      .then(
        Util.expectStruct({
          name: 'openwhisk'
        })
      )
      .catch(Common.oops(this)))
})
