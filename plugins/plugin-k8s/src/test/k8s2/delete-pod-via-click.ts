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

import { Common, CLI, ReplExpect, SidecarExpect, Selectors } from '@kui-shell/test'
import { waitForGreen, waitForRed, createNS, allocateNS, deleteNS } from '@kui-shell/plugin-k8s/tests/lib/k8s/utils'

const kubectl = 'k'

describe(`delete pod via click ${process.env.MOCHA_RUN_TARGET}`, function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  const ns: string = createNS()
  const inNamespace = `-n ${ns}`
  allocateNS(this, ns)

  it(`should create sample pod from URL via ${kubectl}`, () => {
    return CLI.command(
      `${kubectl} create -f https://raw.githubusercontent.com/kubernetes/examples/master/staging/pod ${inNamespace}`,
      this.app
    )
      .then(ReplExpect.okWithCustom({ selector: Selectors.BY_NAME('nginx') }))
      .then(selector => waitForGreen(this.app, selector))
      .catch(Common.oops(this))
  })

  it(`should get sample pod via ${kubectl}`, () => {
    return CLI.command(`${kubectl} get pod nginx -o yaml ${inNamespace}`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('nginx', undefined, undefined, ns))
      .catch(Common.oops(this))
  })

  xit(`should delete the sample pod by clicking on the sidecar delete button`, async () => {
    try {
      await this.app.client.click(Selectors.SIDECAR_MODE_BUTTON('delete'))
      await this.app.client.waitForExist('#confirm-dialog')
      await this.app.client.click('#confirm-dialog .bx--btn--danger')
      const selector = `${Selectors.OUTPUT_LAST} ${Selectors.BY_NAME('nginx')}`

      return waitForRed(this.app, selector)
    } catch (err) {
      return Common.oops(this)(err)
    }
  })

  deleteNS(this, ns)
})
