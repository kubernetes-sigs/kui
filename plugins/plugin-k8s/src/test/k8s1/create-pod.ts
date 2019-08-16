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

const synonyms = ['kubectl', 'k']
const dashFs = ['-f', '--filename']

describe(`kubectl create pod ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: common.ISuite) {
  before(common.before(this))
  after(common.after(this))

  // repeat the tests for kubectl, k, etc. i.e. any built-in
  // synonyms/aliases we have for "kubectl"
  synonyms.forEach(kubectl => {
    dashFs.forEach(dashF => {
      const ns: string = createNS()
      const inNamespace = `-n ${ns}`

      allocateNS(this, ns)

      it(`should create sample pod from URL via ${kubectl}`, async () => {
        try {
          const selector = await cli
            .do(
              `${kubectl} create ${dashF} https://raw.githubusercontent.com/kubernetes/examples/master/staging/pod ${inNamespace}`,
              this.app
            )
            .then(cli.expectOKWithCustom({ selector: selectors.BY_NAME('nginx') }))

          // wait for the badge to become green
          await waitForGreen(this.app, selector)

          // now click on the table row
          await this.app.client.click(`${selector} .clickable`)
          await sidecar
            .expectOpen(this.app)
            .then(sidecar.expectMode(defaultModeForGet))
            .then(sidecar.expectShowing('nginx'))
        } catch (err) {
          await common.oops(this, true)(err)
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
          .catch(common.oops(this))
      })

      it(`should create sample pod from local file via ${kubectl}`, () => {
        return cli
          .do(`${kubectl} create ${dashF} "${ROOT}/data/k8s/headless/pod.yaml" ${inNamespace}`, this.app)
          .then(cli.expectOKWithCustom({ selector: selectors.BY_NAME('nginx') }))
          .then(selector => waitForGreen(this.app, selector))
          .catch(common.oops(this))
      })

      it(`should delete the sample pod by name via ${kubectl}`, () => {
        return cli
          .do(`${kubectl} delete pod nginx ${inNamespace}`, this.app)
          .then(cli.expectOKWithCustom({ selector: selectors.BY_NAME('nginx') }))
          .then(selector => waitForRed(this.app, selector))
          .catch(common.oops(this))
      })

      deleteNS(this, ns)
    })
  })
})
