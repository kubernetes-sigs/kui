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

import { Common, CLI, ReplExpect, Selectors } from '@kui-shell/test'
import { waitForGreen, createNS, allocateNS, deleteNS } from '@kui-shell/plugin-k8s/tests/lib/k8s/utils'

const synonyms = ['kubectl']

describe(`kubectl label handling ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  synonyms.forEach(kubectl => {
    const ns: string = createNS()
    const inNamespace = `-n ${ns}`
    allocateNS(this, ns)

    it('should error with 404 for non-existent label variant 1', () => {
      return CLI.command(`${kubectl} get pod -l creepy=pasta ${inNamespace}`, this.app)
        .then(ReplExpect.error(404))
        .catch(Common.oops(this))
    })

    it('should error with 404 for non-existent label variant 2', () => {
      return CLI.command(`${kubectl} get pod -l feels=life ${inNamespace}`, this.app)
        .then(ReplExpect.error(404))
        .catch(Common.oops(this))
    })

    it('should error with 404 for non-existent label variant 3', () => {
      return CLI.command(`${kubectl} get pod -lcreepy=pasta ${inNamespace}`, this.app)
        .then(ReplExpect.error(404))
        .catch(Common.oops(this))
    })

    it('should error with 404 for non-existent label variant 4', () => {
      return CLI.command(`${kubectl} get pod -lfeels=life ${inNamespace}`, this.app)
        .then(ReplExpect.error(404))
        .catch(Common.oops(this))
    })

    it(`should create sample pod from URL via ${kubectl}`, () => {
      return CLI.command(
        `${kubectl} create -f https://raw.githubusercontent.com/kubernetes/examples/master/staging/pod ${inNamespace}`,
        this.app
      )
        .then(ReplExpect.okWithCustom({ selector: Selectors.BY_NAME('nginx') }))
        .then((selector: string) => waitForGreen(this.app, selector))
        .catch(Common.oops(this))
    })

    it('should add a label to that pod resource', () => {
      return CLI.command(`${kubectl} label pod nginx creepy=pasta ${inNamespace}`, this.app)
        .then(ReplExpect.okWithString('nginx'))
        .catch(Common.oops(this))
    })

    it('should add another label that starts with "f" to that pod resource', () => {
      return CLI.command(`${kubectl} label pod nginx feels=life ${inNamespace}`, this.app)
        .then(ReplExpect.okWithString('nginx'))
        .catch(Common.oops(this))
    })

    it('should NOT error with 404 for now-existent label variant 1', () => {
      return CLI.command(`${kubectl} get pod -l feels=life ${inNamespace}`, this.app)
        .then(ReplExpect.okWith('nginx'))
        .catch(Common.oops(this))
    })

    it('should NOT error with 404 for now-existent label variant 2', () => {
      return CLI.command(`${kubectl} get pod -l creepy=pasta ${inNamespace}`, this.app)
        .then(ReplExpect.okWith('nginx'))
        .catch(Common.oops(this))
    })

    it('should NOT error with 404 for now-existent label variant 3', () => {
      return CLI.command(`${kubectl} get pod -lcreepy=pasta ${inNamespace}`, this.app)
        .then(ReplExpect.okWith('nginx'))
        .catch(Common.oops(this))
    })

    it('should NOT error with 404 for now-existent label variant 4', () => {
      return CLI.command(`${kubectl} get pod -lfeels=life ${inNamespace}`, this.app)
        .then(ReplExpect.okWith('nginx'))
        .catch(Common.oops(this))
    })

    deleteNS(this, ns)
  })
})
