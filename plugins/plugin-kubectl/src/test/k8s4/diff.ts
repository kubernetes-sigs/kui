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

import { Common, CLI, ReplExpect, SidecarExpect, Selectors } from '@kui-shell/test'
import { waitForGreen, createNS, allocateNS, deleteNS } from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

import { dirname } from 'path'
const ROOT = dirname(require.resolve('@kui-shell/plugin-kubectl/tests/package.json'))

const synonyms = ['kubectl']

describe(`kubectl diff ${process.env.MOCHA_RUN_TARGET || ''}`, function (this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  synonyms.forEach(kubectl => {
    const ns: string = createNS()
    allocateNS(this, ns)

    it(`should create sample pod via ${kubectl}`, () => {
      return CLI.command(`${kubectl} create -f ${ROOT}/data/k8s/crashy.yaml -n ${ns}`, this.app)
        .then(ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME('kui-crashy') }))
        .then((selector: string) => waitForGreen(this.app, selector))
        .catch(Common.oops(this, true))
    })

    it('should see diff between labels', () =>
      CLI.command(`${kubectl} diff -f ${ROOT}/data/k8s/diff/modified-crashy.yaml -n ${ns}`, this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(SidecarExpect.mode('diff'))
        .then(SidecarExpect.textPlainContentFromMonaco('foo', false))
        .catch(Common.oops(this, true)))

    deleteNS(this, ns)
  })
})
