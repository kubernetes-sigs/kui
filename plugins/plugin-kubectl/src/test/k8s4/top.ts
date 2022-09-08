/*
 * Copyright 2019 The Kubernetes Authors
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
  openSidecarByList,
  remotePodYaml,
  waitForGreen,
  createNS,
  allocateNS,
  deleteNS
} from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

const synonyms = ['kubectl']

describe(`kubectl top pod ${process.env.MOCHA_RUN_TARGET || ''}`, function (this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  synonyms.forEach(kubectl => {
    const ns: string = createNS()
    const inNamespace = `-n ${ns}`
    allocateNS(this, ns)

    xit('should create a pod', async () => {
      try {
        const selector: string = await CLI.command(
          `${kubectl} create -f ${remotePodYaml} ${inNamespace}`,
          this.app
        ).then(ReplExpect.okWithCustom({ selector: Selectors.BY_NAME('nginx') }))

        await waitForGreen(this.app, selector)
      } catch (err) {
        return Common.oops(this, true)(err)
      }
    })

    const top1 = `${kubectl} top pod ${inNamespace}`
    xit(`should show that pod in a list via ${top1}`, () => {
      return CLI.command(top1, this.app).then(ReplExpect.okWith('nginx')).catch(Common.oops(this, true))
    })

    const top2 = `${kubectl} top ${inNamespace} pod`
    xit(`should show that pod in a list via ${top2}`, () => {
      return CLI.command(top1, this.app).then(ReplExpect.okWith('nginx')).catch(Common.oops(this, true))
    })

    xit(`should click on top row and show pod in sidecar using ${top1}`, async () => {
      try {
        await openSidecarByList(this, top1, 'nginx')
      } catch (err) {
        return Common.oops(this, true)(err)
      }
    })

    deleteNS(this, ns)
  })
})
