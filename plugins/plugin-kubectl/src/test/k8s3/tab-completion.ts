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
import { tabby, tabbyWithOptions } from '@kui-shell/plugin-core-support/tests/lib/core-support/tab-completion-util'
import { dirname } from 'path'
import {
  remotePodYaml,
  waitForGreen,
  createNS,
  allocateNS,
  deleteNS
} from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

const ROOT = dirname(require.resolve('@kui-shell/plugin-kubectl/tests/package.json'))
const synonyms = ['kubectl']

describe(`kubectl get tab completion ${process.env.MOCHA_RUN_TARGET || ''}`, function (this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  synonyms.forEach(kubectl => {
    // use a common prefix, so that we can test tab completion of
    // namespace names
    const commonPrefix: string = createNS()
    const uniquePrefix: string = createNS()
    const ns = `${commonPrefix}-aaaa`
    const ns2 = `${commonPrefix}-bbbb` // we want ns to be lexicographically < ns2
    const ns3 = `${uniquePrefix}-cccc` // something prefix-distinct from the first two

    it(`should tab complete kubectl command`, () => {
      return tabby(this, 'kubect', 'kubectl')
    })

    allocateNS(this, ns)
    allocateNS(this, ns2)
    allocateNS(this, ns3)

    it(`should tab complete unique namespace`, () => {
      return tabby(this, `k get pods -n ${uniquePrefix}`, `k get pods -n ${ns3}`, false) // it's ok to have an error, as we don't have any pods, yet
    })

    it(`should tab complete namespaces not unique`, () => {
      return tabbyWithOptions(this, `k get pods -n ${commonPrefix}`, [ns, ns2], `k get pods -n ${ns}`, {
        click: 0,
        expectOK: false, // it's ok to have an error, as we don't have any pods, yet
        expectedPromptAfterTab: `k get pods -n ${commonPrefix}-`
      })
    })

    it(`should create sample pod from URL via ${kubectl}`, () => {
      return CLI.command(`${kubectl} create -f ${remotePodYaml} -n ${ns}`, this.app)
        .then(ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME('nginx') }))
        .then(selector => waitForGreen(this.app, selector))
        .catch(Common.oops(this, true))
    })

    it(`should create tab-completion pod via ${kubectl}`, async () => {
      return CLI.command(`${kubectl}  create -f ${ROOT}/data/k8s/tab-completion.yaml -n ${ns}`, this.app)
        .then(
          ReplExpect.okWithCustom<string>({
            selector: Selectors.BY_NAME('tab-completion-1')
          })
        )
        .then(selector => waitForGreen(this.app, selector))
        .catch(Common.oops(this, true))
    })

    it(`should create tab-completion2 pod via ${kubectl}`, async () => {
      return CLI.command(`${kubectl}  create -f ${ROOT}/data/k8s/tab-completion-2.yaml -n ${ns}`, this.app)
        .then(
          ReplExpect.okWithCustom<string>({
            selector: Selectors.BY_NAME('tab-completion-2')
          })
        )
        .then(selector => waitForGreen(this.app, selector))
        .catch(Common.oops(this, true))
    })

    it(`should tab complete pods`, () => {
      return tabby(this, `k get pods -n ${ns} n`, `k get pods -n ${ns} nginx`)
    })

    it(`should tab complete pods not unique`, () => {
      return tabbyWithOptions(
        this,
        `k get pods -n ${ns} t`,
        [`tab-completion-1`, `tab-completion-2`],
        `k get pods -n ${ns} tab-completion-1`,
        {
          click: 0,
          expectedPromptAfterTab: `k get pods -n ${ns} tab-completion-`
        }
      )
    })

    deleteNS(this, [ns, ns2, ns3])
  })
})
