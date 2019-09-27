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

import { Common, CLI, ReplExpect, SidecarExpect, Selectors } from '@kui-shell/test'
import {
  waitForGreen,
  waitForRed,
  defaultModeForGet,
  createNS,
  allocateNS,
  deleteNS
} from '@kui-shell/plugin-k8s/tests/lib/k8s/utils'

const synonyms = ['kubectl']

/**
 * Notes: this test is intended to cover resource creation from a URL
 * that 301-redirects. It also covers "apply" and the creation of
 * deployments.
 *
 */
describe(`kubectl apply deployment against redirecting URL ${process.env.MOCHA_RUN_TARGET ||
  ''}`, function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  // repeat the tests for kubectl, k, etc. i.e. any built-in
  // synonyms/aliases we have for "kubectl"
  synonyms.forEach(kubectl => {
    const ns: string = createNS()
    const inNamespace = `-n ${ns}`

    allocateNS(this, ns)

    it(`should apply with a redirecting URL via ${kubectl}`, async () => {
      try {
        const selector = await CLI.command(
          `${kubectl} apply -f https://k8s.io/examples/controllers/nginx-deployment.yaml ${inNamespace}`,
          this.app
        ).then(
          ReplExpect.okWithCustom({
            selector: Selectors.BY_NAME('nginx-deployment')
          })
        )

        // wait for the badge to become green
        await waitForGreen(this.app, selector)

        // now click on the table row
        await this.app.client.click(`${selector} .clickable`)
        await SidecarExpect.open(this.app)
          .then(SidecarExpect.mode(defaultModeForGet))
          .then(SidecarExpect.showing('nginx-deployment'))
      } catch (err) {
        await Common.oops(this, true)(err)
      }
    })

    it(`should delete the deployment from redirecting URL via ${kubectl}`, () => {
      return CLI.command(
        `${kubectl} delete -f https://k8s.io/examples/controllers/nginx-deployment.yaml ${inNamespace}`,
        this.app
      )
        .then(
          ReplExpect.okWithCustom({
            selector: Selectors.BY_NAME('nginx-deployment')
          })
        )
        .then(selector => waitForRed(this.app, selector))
        .catch(Common.oops(this, true))
    })

    deleteNS(this, ns)
  })
})
