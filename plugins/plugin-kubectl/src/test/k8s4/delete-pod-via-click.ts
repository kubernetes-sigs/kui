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

import { Common, CLI, ReplExpect, SidecarExpect, Selectors } from '@kui-shell/test'
import {
  remotePodYaml,
  waitForGreen,
  waitForRed,
  createNS,
  allocateNS,
  deleteNS
} from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

const kubectl = 'k'

describe(`delete pod via click ${process.env.MOCHA_RUN_TARGET}`, function (this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  const ns: string = createNS()
  const inNamespace = `-n ${ns}`
  allocateNS(this, ns)

  it(`should create sample pod from URL via ${kubectl}`, () => {
    return CLI.command(`${kubectl} create -f ${remotePodYaml} ${inNamespace}`, this.app)
      .then(ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME('nginx') }))
      .then(selector => waitForGreen(this.app, selector))
      .catch(Common.oops(this))
  })

  it(`should get sample pod via ${kubectl} then click delete button`, async () => {
    try {
      const res = await CLI.command(`${kubectl} get pod nginx -o yaml ${inNamespace}`, this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing('nginx', undefined, undefined, ns))

      await this.app.client.$(Selectors.SIDECAR_MODE_BUTTON(res.count, 'delete')).then(_ => _.click())
      await this.app.client.$(Selectors.CONFIRM_DIALOG).then(_ => _.waitForExist())
      await this.app.client.$(Selectors.CONFIRM_DIALOG_CONFIRM_BUTTON).then(_ => _.click())
      const selector = `${Selectors.OUTPUT_LAST} ${Selectors.BY_NAME('nginx')}`

      return waitForRed(this.app, selector)
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })

  /* it(`should delete the sample pod by clicking on the sidecar delete button`, async () => {
    try {
    } catch (err) {
      return Common.oops(this)(err)
    }
  }) */

  deleteNS(this, ns)
})
