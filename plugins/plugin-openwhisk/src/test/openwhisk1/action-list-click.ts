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

const actionName = 'foo'
const actionName2 = 'foo2'

describe('create action list it then click to show it again', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  it('should create an action', () =>
    CLI.command(`let ${actionName} = x=>x -p x 3`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName))
      .catch(Common.oops(this)))

  it('should create another action', () =>
    CLI.command(`let ${actionName2} = x=>x -p x 3`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName2))
      .catch(Common.oops(this)))

  const expectedSrc = 'let main = x=>x'

  it(`should list ${actionName}, click it, show it`, () =>
    CLI.command(`wsk action list`, this.app)
      .then(ReplExpect.okWithCustom({ selector: '', passthrough: true }))

      // click on the row entity, and expect sidecar to show it
      .then(N =>
        this.app.client.click(`${Selectors.OUTPUT_N(N)} .entity[data-name="${actionName}"] .entity-name.clickable`)
      )
      .then(() => this.app)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName))

      // also confirm that source matches
      .then(() =>
        this.app.client.waitUntil(async () => {
          const actualSrc = await this.app.client.getText(Selectors.SIDECAR_ACTION_SOURCE)
          return actualSrc.trim() === expectedSrc
        })
      )

      // wait a bit and retry, to make sure it doesn't disappear
      .then(() => new Promise(resolve => setTimeout(resolve, 3000)))
      .then(() =>
        this.app.client.waitUntil(async () => {
          const actualSrc = await this.app.client.getText(Selectors.SIDECAR_ACTION_SOURCE)
          return actualSrc.trim() === expectedSrc
        })
      )

      .catch(Common.oops(this)))
})
