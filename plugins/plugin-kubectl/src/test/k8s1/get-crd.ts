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

import { Common, CLI, ReplExpect, Selectors } from '@kui-shell/test'
import { waitForGreen, createNS, allocateNS, deleteNS } from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

import { dirname } from 'path'
const ROOT = dirname(require.resolve('@kui-shell/plugin-kubectl/tests/package.json'))

const commands = ['kubectl']
if (process.env.NEEDS_OC) {
  commands.push('oc')
}

commands.forEach(command => {
  describe(`${command} get crd ${process.env.MOCHA_RUN_TARGET || ''}`, function (this: Common.ISuite) {
    before(Common.before(this))
    after(Common.after(this))

    const ns: string = createNS()
    const inNamespace = `-n ${ns}`
    const crdName = 'pods.stable.example.com'
    const group = 'stable.example.com'
    const variants = [
      crdName,
      `pods.v1.${group}`,
      `pod.v1.${group}`,
      `po.v1.${group}`,
      `Pod.v1.${group}`,
      `Pods.v1.${group}`,
      `pods.${group}`,
      `pod.${group}`,
      `po.${group}`,
      `Pod.${group}`,
      `Pods.${group}`
    ]

    allocateNS(this, ns, command)

    it(`should create sample pod from local file via ${command}`, () => {
      return CLI.command(`${command} create -f "${ROOT}/data/k8s/headless/pod.yaml" ${inNamespace}`, this.app)
        .then(ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME('nginx') }))
        .then(selector => waitForGreen(this.app, selector))
        .catch(Common.oops(this))
    })

    it(`should create custom resource definition ${crdName} from file via "${command} apply -f"`, async () => {
      return CLI.command(`${command} apply -f ${ROOT}/data/k8s/crd2.yaml ${inNamespace}`, this.app)
        .then(ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME(crdName) }))
        .then(selector => waitForGreen(this.app, selector))
        .catch(Common.oops(this))
    })

    it(`should get pod and return table via ${command}`, () => {
      return CLI.command(`${command} get pod ${inNamespace}`, this.app)
        .then(ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME('nginx') }))
        .then(selector => waitForGreen(this.app, selector))
        .catch(Common.oops(this))
    })

    it(`should get pod with apiVersion and return table via ${command}`, () => {
      return CLI.command(`${command} get pod.v1 ${inNamespace}`, this.app)
        .then(ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME('nginx') }))
        .then(selector => waitForGreen(this.app, selector))
        .catch(Common.oops(this))
    })

    variants.forEach(name => {
      it(`should get ${name} and returns 404 via ${command}`, () => {
        return CLI.command(`${command} get ${name} ${inNamespace}`, this.app)
          .then(ReplExpect.error(404, 'No resources found'))
          .catch(Common.oops(this, true))
      })
    })

    deleteNS(this, ns, command)
  })
})
