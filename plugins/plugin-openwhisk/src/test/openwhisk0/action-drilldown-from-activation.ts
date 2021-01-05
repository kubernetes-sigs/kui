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

import { Common, CLI, ReplExpect, SidecarExpect, Selectors, Util } from '@kui-shell/test'
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
      .catch(Common.oops(this, true)))

  const expectedSrc = 'let main = x=>x'

  let res: ReplExpect.AppAndCount
  it('should async that action and click on the activation id', async () => {
    try {
      const res1 = await CLI.command(`wsk action async ${actionName}`, this.app)
      res = ReplExpect.blockAfter(res1)

      await ReplExpect.okWithCustom<string>(CLI.makeCustom('.activationId', ''))(res1).then(async selector => {
        const activationId = await this.app.client.$(selector).then(_ => _.getText())
        await this.app.client.$(selector).then(_ => _.click())
        return SidecarExpect.open(res).then(SidecarExpect.showing(actionName, activationId))
      })
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })

  it(`click on action name in sidecar header and show action source`, async () => {
    await this.app.client.$(Selectors.SIDECAR_TITLE(res.count, res.splitIndex)).then(_ => _.click())
    return SidecarExpect.openInBlockAfter(res)
      .then(SidecarExpect.showing(actionName))
      .then(res =>
        this.app.client.waitUntil(async () => {
          const actionSrc = await Util.getValueFromMonaco(res)
          return actionSrc.trim() === expectedSrc
        })
      )
      .catch(Common.oops(this, true))
  })
})
