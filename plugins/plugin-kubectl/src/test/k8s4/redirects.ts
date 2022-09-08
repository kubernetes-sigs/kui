/*
 * Copyright 2018 The Kubernetes Authors
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

import { Common, CLI, ReplExpect, Selectors } from '@kui-shell/test'
import {
  waitForRed,
  createNS,
  allocateNS,
  deleteNS,
  openSidecarByList
} from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

const synonyms = ['kubectl']

/** 20200428: travis went bonkers and is unable to fetch this file */

/**
 * Notes: this test is intended to cover resource creation from a URL
 * that 301-redirects. It also covers "apply" and the creation of
 * deployments.
 *
 */
xdescribe(`kubectl apply deployment against redirecting URL ${
  process.env.MOCHA_RUN_TARGET || ''
}`, function (this: Common.ISuite) {
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
        await openSidecarByList(
          this,
          `${kubectl} apply -f https://k8s.io/examples/controllers/nginx-deployment.yaml ${inNamespace}`,
          'nginx-deployment'
        )
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
          ReplExpect.okWithCustom<string>({
            selector: Selectors.BY_NAME('nginx-deployment')
          })
        )
        .then(selector => waitForRed(this.app, selector))
        .catch(Common.oops(this, true))
    })

    deleteNS(this, ns)
  })
})
