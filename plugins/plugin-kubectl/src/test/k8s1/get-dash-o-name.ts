/*
 * Copyright 2020 The Kubernetes Authors
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
  remotePodYaml,
  waitForGreen,
  createNS,
  allocateNS,
  deleteNS,
  defaultModeForGet
} from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

const synonyms = ['kubectl']
const dashFs = ['-f']

describe(`kubectl get dash o name ${process.env.MOCHA_RUN_TARGET || ''}`, function (this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  const ns: string = createNS()
  const inNamespace = `-n ${ns}`

  allocateNS(this, ns)

  // repeat the tests for kubectl, k, etc. i.e. any built-in
  // synonyms/aliases we have for "kubectl"
  synonyms.forEach(kubectl => {
    dashFs.forEach(dashF => {
      it(`should create sample pod from URL via "${kubectl} apply ${dashF}" for test: ${this.title}`, async () => {
        try {
          const res = await CLI.command(`${kubectl} apply ${dashF} ${remotePodYaml} ${inNamespace}`, this.app)
          const selector = await ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME('nginx') })(res)

          // wait for the badge to become green
          await waitForGreen(this.app, selector)
        } catch (err) {
          return Common.oops(this, true)(err)
        }
      })

      it(`should get -o name and show that pod`, async () => {
        try {
          const res = await CLI.command(`kubectl get pod -o name ${inNamespace}`, this.app)
          const selector = await ReplExpect.okWithCustom<string>({ selector: Selectors.GRID_CELL_BY_NAME('nginx') })(
            res
          )
          // now click on the table row
          await Util.openSidecarByClick(this, `${selector} .clickable`, 'nginx', defaultModeForGet).then(
            SidecarExpect.descriptionList({ Ready: '1/1' })
          )
        } catch (err) {
          return Common.oops(this, true)(err)
        }
      })
    })
  })

  deleteNS(this, ns)
})
