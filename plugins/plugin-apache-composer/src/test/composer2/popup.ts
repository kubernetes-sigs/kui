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

import * as assert from 'assert'

import * as common from '@kui-shell/core/tests/lib/common'
import { cli, selectors, sidecar, expectSubset, getValueFromMonaco } from '@kui-shell/core/tests/lib/ui'
import { wipe, waitTillNone } from '@kui-shell/plugin-k8s/tests/lib/k8s/wipe'
import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'
const { localDescribe } = common

import {
  input,
  composerInput,
  composerErrorInput,
  verifyNodeExists,
  verifyEdgeExists,
  verifyOutgoingEdgeExists,
  verifyTheBasicStuff
} from '@kui-shell/plugin-apache-composer/tests/lib/composer-viz-util'

/** shorthands for commands */
const preview = (file: string) => ['preview', file]

/** wait for the creation to finish, then navigate a bit */
const waitForPreview = function (this: common.ISuite, name: string) {
  it(`should wait for wskflow visualization for ${name}`, async () => {
    const waitForIcon = () => {
      return this.app.client.waitUntil(async () => {
        const iconText = await this.app.client.getText(`${selectors.SIDECAR} .sidecar-header-icon`)
        return /preview/i.test(iconText)
      })
    }

    await waitForIcon()

    await Promise.resolve(this.app)
      .then(sidecar.expectOpen)
      .then(verifyEdgeExists('Entry', 'authenticate'))
      .then(verifyNodeExists('authenticate'))

    await this.app.client.click(selectors.SIDECAR_MODE_BUTTON('ast'))
    await this.app.client.waitUntil(() => {
      return getValueFromMonaco(this.app)
        .then(expectSubset({ type: 'if' }, false)) // false: don't assert, return false instead
    })

    await this.app.client.click(selectors.SIDECAR_MODE_BUTTON('source'))
    await this.app.client.waitUntil(async () => {
      // source tab should contain something like require('openwhisk...)
      const source = await getValueFromMonaco(this.app)
      return /require/.test(source)
    })
  })
}

//
// from here on are the tests...
//

localDescribe('popup preview', function (this: common.ISuite) {
  before(openwhisk.before(this, { popup: preview('@demos/if.js') }))
  after(common.after(this))

  waitForPreview.bind(this)({ name: 'if.js' })
})
