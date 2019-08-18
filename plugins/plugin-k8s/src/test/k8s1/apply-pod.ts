/*
 * Copyright 2018-19 IBM Corporation
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
import { cli, selectors, sidecar, getValueFromMonaco, expectYAMLSubset } from '@kui-shell/core/tests/lib/ui'
import {
  waitForRed,
  waitForGreen,
  defaultModeForGet,
  createNS,
  allocateNS,
  deleteNS
} from '@kui-shell/plugin-k8s/tests/lib/k8s/utils'

const synonyms = ['kubectl', 'k']
const dashFs = ['-f', '--filename']

describe(`kubectl apply pod ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: common.ISuite) {
  before(common.before(this))
  after(common.after(this))

  const ns: string = createNS()
  const inNamespace = `-n ${ns}`

  allocateNS(this, ns)

  // repeat the tests for kubectl, k, etc. i.e. any built-in
  // synonyms/aliases we have for "kubectl"
  synonyms.forEach(kubectl => {
    dashFs.forEach(dashF => {
      it(`should create sample pod from URL via "${kubectl} apply ${dashF}" for test: ${this.title}`, async () => {
        try {
          console.log(`kubectl apply pod 1 ${this.title}`)
          const selector = await cli
            .do(
              `${kubectl} apply ${dashF} https://raw.githubusercontent.com/kubernetes/examples/master/staging/pod ${inNamespace}`,
              this.app
            )
            .then(cli.expectOKWithCustom({ selector: selectors.BY_NAME('nginx') }))
            .catch(common.oops(this))

          // wait for the badge to become green
          console.log(`kubectl apply pod 2 ${this.title}`)
          await waitForGreen(this.app, selector)

          // now click on the table row
          console.log(`kubectl apply pod 3 ${this.title}`)
          await this.app.client.click(`${selector} .clickable`)
          await sidecar
            .expectOpen(this.app)
            .then(sidecar.expectMode(defaultModeForGet))
            .then(sidecar.expectShowing('nginx'))
        } catch (err) {
          return common.oops(this, true)(err)
        }
      })

      it(`should switch to last applied tab for test: ${this.title}`, async () => {
        try {
          // make sure we have a last applied tab
          console.log(`kubectl apply pod 4 ${this.title}`)
          await this.app.client.waitForVisible(selectors.SIDECAR_MODE_BUTTON('last applied'))
          await this.app.client.click(selectors.SIDECAR_MODE_BUTTON('last applied'))
          await this.app.client.waitForVisible(selectors.SIDECAR_MODE_BUTTON_SELECTED('last applied'))

          let idx = 0
          console.log(`kubectl apply pod 5 ${this.title}`)
          await this.app.client.waitUntil(async () => {
            const text = await getValueFromMonaco(this.app)
            if (++idx > 5) {
              console.error(`still waiting for yaml in ${this.title}`, text)
            }

            return Promise.resolve(text).then(
              expectYAMLSubset(
                {
                  apiVersion: 'v1',
                  kind: 'Pod',
                  metadata: {
                    name: 'nginx'
                  }
                },
                false
              )
            )
          })

          console.log(`kubectl apply pod 6 ${this.title}`)
        } catch (err) {
          return common.oops(this, true)(err)
        }
      })

      it(`should delete the sample pod from URL via ${kubectl}`, () => {
        return cli
          .do(
            `${kubectl} delete ${dashF} https://raw.githubusercontent.com/kubernetes/examples/master/staging/pod ${inNamespace}`,
            this.app
          )
          .then(cli.expectOKWithCustom({ selector: selectors.BY_NAME('nginx') }))
          .then(selector => waitForRed(this.app, selector))
          .catch(common.oops(this, true))
      })
    })
  })

  deleteNS(this, ns)
})
