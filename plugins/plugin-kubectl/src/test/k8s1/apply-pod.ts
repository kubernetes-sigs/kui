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

import { Common, CLI, ReplExpect, SidecarExpect, Selectors, Util } from '@kui-shell/test'
import {
  openSidecarByList,
  remotePodYaml,
  waitForRed,
  createNS,
  allocateNS,
  deleteNS
} from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

const synonyms = ['kubectl']
const dashFs = ['-f']

describe(`kubectl apply pod ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  const ns: string = createNS()
  const inNamespace = `-n ${ns}`

  allocateNS(this, ns)

  // repeat the tests for kubectl, k, etc. i.e. any built-in
  // synonyms/aliases we have for "kubectl"
  synonyms.forEach(kubectl => {
    dashFs.forEach(dashF => {
      let res: ReplExpect.AppAndCount

      it(`should create sample pod from URL via "${kubectl} apply ${dashF}" for test: ${this.title}`, async () => {
        try {
          res = await openSidecarByList(
            this,
            `${kubectl} apply ${dashF} ${remotePodYaml} ${inNamespace}`,
            'nginx'
          ).then(SidecarExpect.descriptionList({ Status: 'Running' }))
        } catch (err) {
          return Common.oops(this, true)(err)
        }
      })

      it(`should switch to last applied tab for test: ${this.title}`, async () => {
        try {
          // make sure we have a last applied tab
          console.log(`kubectl apply pod 4 ${this.title}`)
          await Util.switchToTab('last applied')(res)

          let idx = 0
          console.log(`kubectl apply pod 5 ${this.title}`)
          await this.app.client.waitUntil(async () => {
            const text = await Util.getValueFromMonaco(res)
            if (++idx > 5) {
              console.error(`still waiting for yaml in ${this.title}`, text)
            }

            return Promise.resolve(text)
              .then(
                Util.expectYAMLSubset(
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
              .catch(() => false)
          })

          console.log(`kubectl apply pod 6 ${this.title}`)
        } catch (err) {
          return Common.oops(this, true)(err)
        }
      })

      it(`should delete the sample pod from URL via ${kubectl}`, () => {
        return CLI.command(`${kubectl} delete ${dashF} ${remotePodYaml} ${inNamespace}`, this.app)
          .then(
            ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME('nginx') })
          )
          .then(selector => waitForRed(this.app, selector))
          .catch(Common.oops(this, true))
      })
    })
  })

  deleteNS(this, ns)
})
