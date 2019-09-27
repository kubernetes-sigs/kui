/*
 * Copyright 2019 IBM Corporation
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

import { Common, Selectors, SidecarExpect, Util } from '@kui-shell/test'
import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

import { verifyNodeExists, verifyEdgeExists } from '@kui-shell/plugin-apache-composer/tests/lib/composer-viz-util'

/** shorthands for commands */
const preview = (file: string) => ['preview', file]

/** wait for the creation to finish, then navigate a bit */
const waitForPreview = function(this: Common.ISuite, name: string) {
  it(`should wait for wskflow visualization for ${name}`, async () => {
    const waitForIcon = () => {
      return this.app.client.waitUntil(async () => {
        const iconText = await this.app.client.getText(`${Selectors.SIDECAR} .sidecar-header-icon`)
        return /preview/i.test(iconText)
      })
    }

    await waitForIcon()

    await Promise.resolve(this.app)
      .then(SidecarExpect.open)
      .then(verifyEdgeExists('Entry', 'authenticate'))
      .then(verifyNodeExists('authenticate'))

    await this.app.client.click(Selectors.SIDECAR_MODE_BUTTON('ast'))
    await this.app.client.waitUntil(() => {
      return Util.getValueFromMonaco(this.app).then(Util.expectSubset({ type: 'if' }, false)) // false: don't assert, return false instead
    })

    await this.app.client.click(Selectors.SIDECAR_MODE_BUTTON('source'))
    await this.app.client.waitUntil(async () => {
      // source tab should contain something like require('openwhisk...)
      const source = await Util.getValueFromMonaco(this.app)
      return /require/.test(source)
    })
  })
}

//
// from here on are the tests...
//

Common.localDescribe('popup preview', function(this: Common.ISuite) {
  before(openwhisk.before(this, { popup: preview('@demos/if.js') }))
  after(Common.after(this))

  waitForPreview.bind(this)({ name: 'if.js' })
})
