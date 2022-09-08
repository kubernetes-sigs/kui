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
import {
  remotePodYaml,
  waitForGreen,
  waitForRed,
  createNS,
  allocateNS,
  deleteNS
} from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

const commands = ['kubectl']
if (process.env.NEEDS_OC) {
  commands.push('oc')
}

commands.forEach(command => {
  describe(`${command} get not found ${process.env.MOCHA_RUN_TARGET || ''}`, function (this: Common.ISuite) {
    before(Common.before(this))
    after(Common.after(this))

    const ns: string = createNS()
    const inNamespace = `-n ${ns}`
    allocateNS(this, ns)

    it(`should create sample pod from URL via ${command}`, () => {
      return CLI.command(`${command} create -f ${remotePodYaml} ${inNamespace}`, this.app)
        .then(ReplExpect.okWithCustom({ selector: Selectors.BY_NAME('nginx') }))
        .then((selector: string) => waitForGreen(this.app, selector))
        .catch(Common.oops(this, true))
    })

    it(`should get that pod via ${command} including a not found foobar`, () => {
      return CLI.command(`${command} get pod nginx foobar ${inNamespace}`, this.app)
        .then(ReplExpect.okWithCustom({ selector: Selectors.BY_NAME('nginx') }))
        .then((selector: string) => waitForGreen(this.app, selector))
        .catch(Common.oops(this, true))
    })

    it(`should get that non-existing pod via ${command}`, () => {
      return CLI.command(`${command} get pod nginx foobar ${inNamespace}`, this.app)
        .then(ReplExpect.okWithCustom({ selector: Selectors.BY_NAME('foobar') }))
        .then((selector: string) => waitForRed(this.app, selector))
        .catch(Common.oops(this, true))
    })

    it(`should get storageclass and returns non error ${command}`, () => {
      return CLI.command(`${command} get storageclass ${inNamespace}`, this.app)
        .then(ReplExpect.error(404, 'No resources found')) // should not return "no resource type"
        .catch(Common.oops(this, true))
    })

    it(`should get storageclasses and returns non error ${command}`, () => {
      return CLI.command(`${command} get storageclasses ${inNamespace}`, this.app)
        .then(ReplExpect.error(404, 'No resources found')) // should not return "no resource type"
        .catch(Common.oops(this, true))
    })

    deleteNS(this, ns)
  })
})
