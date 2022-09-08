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

import { Common, CLI, ReplExpect, Selectors } from '@kui-shell/test'
import { waitForGreen, createNS, allocateNS, deleteNS } from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

import { dirname } from 'path'
const ROOT = dirname(require.resolve('@kui-shell/plugin-kubectl/tests/package.json'))

describe(`kubectl get with limit ${process.env.MOCHA_RUN_TARGET || ''}`, function (this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  const ns: string = createNS()
  const inNamespace = `-n ${ns}`

  allocateNS(this, ns)

  it(`should create sample pod from local file`, () => {
    return CLI.command(`kubectl create -f "${ROOT}/data/k8s/headless/pod.yaml" ${inNamespace}`, this.app)
      .then(ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME('nginx') }))
      .then(selector => waitForGreen(this.app, selector))
      .catch(Common.oops(this, true))
  })

  it(`should create sample pod 2 from local file`, () => {
    return CLI.command(`kubectl create -f "${ROOT}/data/k8s/headless/pod2.yaml" ${inNamespace}`, this.app)
      .then(ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME('nginx2') }))
      .then(selector => waitForGreen(this.app, selector))
      .catch(Common.oops(this, true))
  })
  ;[1, 2].forEach(N => {
    it(`should list with --limit ${N} and see a table with ${N} rows`, () => {
      return CLI.command(`kubectl get pod --limit ${N} ${inNamespace}`, this.app)
        .then(ReplExpect.tableWithNRows(N))
        .catch(Common.oops(this, true))
    })
  })

  deleteNS(this, ns)
})
