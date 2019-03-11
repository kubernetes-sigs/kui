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

import assert = require('assert')

import * as common from '@kui-shell/core/tests/lib/common'
import { cli, selectors, sidecar } from '@kui-shell/core/tests/lib/ui'
import { wipe, waitTillNone } from '@kui-shell/plugin-k8s/tests/lib/k8s/wipe'
import { defaultModeForGet } from '@kui-shell/plugin-k8s/tests/lib/k8s/defaults'

const synonyms = ['kubectl']

describe('electron configmap', function (this: common.ISuite) {
  before(common.before(this))
  after(common.after(this))

  it('should wipe k8s', () => {
    return wipe(this)
  })

  synonyms.forEach(kubectl => {
    it(`should create an empty configmap via ${kubectl}`, () => {
      return cli.do(`${kubectl} create configmap yoyo`, this.app)
        .then(cli.expectOKWithCustom({ selector: selectors.BY_NAME('yoyo') }))
        .then(selector => this.app.client.waitForExist(`${selector} badge.green-background`))
        .catch(common.oops(this))
    })

    it(`should list configmaps via ${kubectl} then click`, async () => {
      try {
        const selector = await cli.do(`${kubectl} get cm`, this.app)
          .then(cli.expectOKWithCustom({ selector: selectors.BY_NAME('yoyo') }))

        // Note: configmaps don't really have a status, so there is nothing to wait for on "get"
        // await this.app.client.waitForExist(`${selector} badge.green-background`)

        // now click on the table row
        await this.app.client.click(`${selector} .clickable`)
        await sidecar.expectOpen(this.app).then(sidecar.expectMode(defaultModeForGet)).then(sidecar.expectShowing('yoyo'))
      } catch (err) {
        common.oops(this)(err)
      }
    })

    it(`should delete the configmap via ${kubectl}`, () => {
      return cli.do(`${kubectl} delete cm yoyo`, this.app)
        .then(cli.expectOKWithString('deleted'))
        .catch(common.oops(this))
    })
  })
})
