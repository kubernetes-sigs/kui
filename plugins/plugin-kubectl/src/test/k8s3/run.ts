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
import { waitForGreen, createNS, allocateNS, deleteNS } from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

const synonyms = ['kubectl', 'k']

describe(`kubectl run single quotes ${process.env.MOCHA_RUN_TARGET || ''}`, function (this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  const ns: string = createNS()
  allocateNS(this, ns)

  it('should kubectl run with single quotes', () =>
    CLI.command(`kubectl run nginx --image=nginx --overrides='{ "apiVersion": "v1" }' -n ${ns}`, this.app)
      .then(ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME('nginx') }))
      .then(selector => waitForGreen(this.app, selector))
      .catch(Common.oops(this, true)))

  deleteNS(this, ns)
})

describe(`kubectl run ${process.env.MOCHA_RUN_TARGET || ''}`, function (this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  // repeat the tests for kubectl, k, etc. i.e. any built-in
  // synonyms/aliases we have for "kubectl"
  synonyms.forEach(kubectl => {
    const ns: string = createNS()
    allocateNS(this, ns)

    it(`should create pod/deployment from ${kubectl} run`, () => {
      return CLI.command(`${kubectl} run nginx --image nginx -n ${ns}`, this.app)
        .then(ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME('nginx') }))
        .then(selector => waitForGreen(this.app, selector))
        .catch(Common.oops(this, true))
    })

    const kind =
      process.env.TRAVIS_KUBE_SERVER_VERSION && parseInt(process.env.TRAVIS_KUBE_SERVER_VERSION, 10) < 16
        ? 'deployment'
        : 'pod'
    it(`should delete the ${kind} by name via ${kubectl}`, () => {
      return CLI.command(`${kubectl} delete ${kind} nginx -n ${ns}`, this.app)
        .then(ReplExpect.okWithAny)
        .catch(Common.oops(this, true))
    })

    deleteNS(this, ns)
  })
})
