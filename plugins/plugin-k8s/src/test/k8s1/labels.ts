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
import {
  assertTableTitleMatches,
  waitForGreen,
  waitForRed,
  defaultModeForGet,
  createNS,
  allocateNS,
  deleteNS
} from '@kui-shell/plugin-k8s/tests/lib/k8s/utils'

import * as assert from 'assert'

const synonyms = ['kubectl']

describe(`kubectl label handling ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: common.ISuite) {
  before(common.before(this))
  after(common.after(this))

  synonyms.forEach(kubectl => {
    const ns: string = createNS()
    const inNamespace = `-n ${ns}`
    allocateNS(this, ns)

    it('should error with 404 for non-existent label variant 1', () => {
      return cli
        .do(`${kubectl} get pod -l creepy=pasta ${inNamespace}`, this.app)
        .then(cli.expectError(404))
        .catch(common.oops(this))
    })

    it('should error with 404 for non-existent label variant 2', () => {
      return cli
        .do(`${kubectl} get pod -l feels=life ${inNamespace}`, this.app)
        .then(cli.expectError(404))
        .catch(common.oops(this))
    })

    it('should error with 404 for non-existent label variant 3', () => {
      return cli
        .do(`${kubectl} get pod -lcreepy=pasta ${inNamespace}`, this.app)
        .then(cli.expectError(404))
        .catch(common.oops(this))
    })

    it('should error with 404 for non-existent label variant 4', () => {
      return cli
        .do(`${kubectl} get pod -lfeels=life ${inNamespace}`, this.app)
        .then(cli.expectError(404))
        .catch(common.oops(this))
    })

    it(`should create sample pod from URL via ${kubectl}`, () => {
      return cli
        .do(
          `${kubectl} create -f https://raw.githubusercontent.com/kubernetes/examples/master/staging/pod ${inNamespace}`,
          this.app
        )
        .then(cli.expectOKWithCustom({ selector: selectors.BY_NAME('nginx') }))
        .then((selector: string) => waitForGreen(this.app, selector))
        .catch(common.oops(this))
    })

    it('should add a label to that pod resource', () => {
      return cli
        .do(`${kubectl} label pod nginx creepy=pasta ${inNamespace}`, this.app)
        .then(cli.expectOKWithString('nginx'))
        .catch(common.oops(this))
    })

    it('should add another label that starts with "f" to that pod resource', () => {
      return cli
        .do(`${kubectl} label pod nginx feels=life ${inNamespace}`, this.app)
        .then(cli.expectOKWithString('nginx'))
        .catch(common.oops(this))
    })

    it('should NOT error with 404 for now-existent label variant 1', () => {
      return cli
        .do(`${kubectl} get pod -l feels=life ${inNamespace}`, this.app)
        .then(cli.expectOKWith('nginx'))
        .catch(common.oops(this))
    })

    it('should NOT error with 404 for now-existent label variant 2', () => {
      return cli
        .do(`${kubectl} get pod -l creepy=pasta ${inNamespace}`, this.app)
        .then(cli.expectOKWith('nginx'))
        .catch(common.oops(this))
    })

    it('should NOT error with 404 for now-existent label variant 3', () => {
      return cli
        .do(`${kubectl} get pod -lcreepy=pasta ${inNamespace}`, this.app)
        .then(cli.expectOKWith('nginx'))
        .catch(common.oops(this))
    })

    it('should NOT error with 404 for now-existent label variant 4', () => {
      return cli
        .do(`${kubectl} get pod -lfeels=life ${inNamespace}`, this.app)
        .then(cli.expectOKWith('nginx'))
        .catch(common.oops(this))
    })

    deleteNS(this, ns)
  })
})
