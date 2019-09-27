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

import { Common, CLI, ReplExpect, SidecarExpect, Selectors } from '@kui-shell/test'
import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

const actionName = `foo-${new Date().getTime()}`

describe('activation list, activation get, click on header', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  it('should create an action', () =>
    CLI.command(`let ${actionName} = x=>x -p x 3`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName))
      .catch(Common.oops(this)))

  const expectedSrc = 'let main = x=>x'

  it('should async that action and click on the activation id', () =>
    CLI.command(`wsk action async ${actionName}`, this.app)
      .then(ReplExpect.okWithCustom(CLI.makeCustom('.activationId', '')))
      .then(async selector => {
        const activationId = await this.app.client.getText(selector)
        await this.app.client.click(selector)
        return SidecarExpect.open(this.app).then(SidecarExpect.showing(actionName, activationId))
      })
      .catch(Common.oops(this)))

  it(`click on action name in sidecar header and show action source`, async () => {
    await this.app.client.click(Selectors.SIDECAR_TITLE)
    return SidecarExpect.open(this.app)
      .then(SidecarExpect.showing(actionName))
      .then(() =>
        this.app.client.waitUntil(async () => {
          const actionSrc = await this.app.client.getText(Selectors.SIDECAR_ACTION_SOURCE)
          return actionSrc.trim() === expectedSrc
        })
      )
      .catch(Common.oops(this))
  })
})
