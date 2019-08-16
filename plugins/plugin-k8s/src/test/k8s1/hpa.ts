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

import * as common from '@kui-shell/core/tests/lib/common'
import { cli, selectors, sidecar } from '@kui-shell/core/tests/lib/ui'
import {
  waitForGreen,
  waitForRed,
  defaultModeForGet,
  createNS,
  allocateNS,
  deleteNS
} from '@kui-shell/plugin-k8s/tests/lib/k8s/utils'

import { dirname } from 'path'
const ROOT = dirname(require.resolve('@kui-shell/plugin-k8s/tests/package.json'))

const synonyms = ['kubectl']

describe('electron create hpa HorizontalPodAutoscaler', function(this: common.ISuite) {
  before(common.before(this))
  after(common.after(this))

  // repeat the tests for kubectl, k, etc. i.e. any built-in
  // synonyms/aliases we have for "kubectl"
  synonyms.forEach(kubectl => {
    const ns: string = createNS()
    const inNamespace = `-n ${ns}`

    allocateNS(this, ns)

    it(`should create a HorizontalPodAutoscaler hpa via ${kubectl}`, async () => {
      try {
        const selector: string = await cli
          .do(`${kubectl} apply -f "${ROOT}/data/k8s/hpa.yaml" ${inNamespace}`, this.app)
          .then(
            cli.expectOKWithCustom({
              selector: selectors.BY_NAME('travelapp-hpa')
            })
          )

        // wait for the badge to become green
        await waitForGreen(this.app, selector)

        // now click on the table row
        await this.app.client.click(`${selector} .clickable`)
        await sidecar
          .expectOpen(this.app)
          .then(sidecar.expectMode(defaultModeForGet))
          .then(sidecar.expectShowing('travelapp-hpa'))
      } catch (err) {
        common.oops(this)(err)
      }
    })

    it(`should delete the HorizontalPodAutoscaler hpa from URL via ${kubectl}`, () => {
      return cli
        .do(`${kubectl} delete -f "${ROOT}/data/k8s/hpa.yaml" ${inNamespace}`, this.app)
        .then(
          cli.expectOKWithCustom({
            selector: selectors.BY_NAME('travelapp-hpa')
          })
        )
        .then(selector => waitForRed(this.app, selector))
        .catch(common.oops(this))
    })

    deleteNS(this, ns)
  })
})
