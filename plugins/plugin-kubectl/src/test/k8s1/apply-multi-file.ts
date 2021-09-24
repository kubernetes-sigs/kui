/*
 * Copyright 2021 The Kubernetes Authors
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
  openSidecarByList,
  remotePodYaml,
  remotePodYaml2,
  waitForRed,
  createNS,
  allocateNS,
  deleteNS
} from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

const synonyms = ['kubectl']
const dashFs = ['-f']
const resources = ['nginx', 'nginx2']

describe(`kubectl apply multi-file ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  const ns: string = createNS()
  const inNamespace = `-n ${ns}`

  allocateNS(this, ns)

  // repeat the tests for kubectl, k, etc. i.e. any built-in
  // synonyms/aliases we have for "kubectl"
  synonyms.forEach(kubectl => {
    dashFs.forEach(dashF => {
      const files = `${dashF} ${remotePodYaml} ${dashF} ${remotePodYaml2}`

      resources.forEach(resource => {
        it(`should create two sample pods from URL via "${kubectl} apply ${dashF}" for test: ${this.title}`, async () => {
          return openSidecarByList(this, `${kubectl} apply ${files} ${inNamespace}`, resource)
            .then(SidecarExpect.descriptionList({ Status: 'Running' }))
            .catch(Common.oops(this, true))
        })
      })

      it(`should delete the sample pods from URL via ${kubectl}`, async () => {
        try {
          const res = await CLI.command(`${kubectl} delete ${files} ${inNamespace}`, this.app)
          await Promise.all(
            resources.map(resource =>
              ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME(resource) })(res).then(selector =>
                waitForRed(this.app, selector)
              )
            )
          )
        } catch (err) {
          Common.oops(this, true)(err)
        }
      })
    })
  })

  deleteNS(this, ns)
})
