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
import { waitForGreen, waitForRed, createNS, allocateNS, deleteNS } from '@kui-shell/plugin-k8s/tests/lib/k8s/utils'

const kubectl = 'k'

describe(`delete pod via click ${process.env.MOCHA_RUN_TARGET}`, function(this: common.ISuite) {
  before(common.before(this))
  after(common.after(this))

  const ns: string = createNS()
  const inNamespace = `-n ${ns}`
  allocateNS(this, ns)

  it(`should create sample pod from URL via ${kubectl}`, () => {
    return cli
      .do(
        `${kubectl} create -f https://raw.githubusercontent.com/kubernetes/examples/master/staging/pod ${inNamespace}`,
        this.app
      )
      .then(cli.expectOKWithCustom({ selector: selectors.BY_NAME('nginx') }))
      .then(selector => waitForGreen(this.app, selector))
      .catch(common.oops(this))
  })

  it(`should get sample pod via ${kubectl}`, () => {
    return cli
      .do(`${kubectl} get pod nginx -o yaml ${inNamespace}`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing('nginx', undefined, undefined, ns))
      .catch(common.oops(this))
  })

  it(`should delete the sample pod by clicking on the sidecar delete button`, async () => {
    try {
      await this.app.client.click(selectors.SIDECAR_MODE_BUTTON('delete'))
      await this.app.client.waitForExist('#confirm-dialog')
      await this.app.client.click('#confirm-dialog .bx--btn--danger')
      const selector = `${selectors.OUTPUT_LAST} ${selectors.BY_NAME('nginx')}`

      return waitForRed(this.app, selector)
    } catch (err) {
      return common.oops(this)(err)
    }
  })

  deleteNS(this, ns)
})
