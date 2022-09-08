/*
 * Copyright 2021 The Kubernetes Authors
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

import { Common, CLI, ReplExpect } from '@kui-shell/test'
import { createNS, allocateNS, deleteNS } from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

const commands = ['kubectl']
if (process.env.NEEDS_OC) {
  commands.push('oc')
}

describe('kubectl get redirect', function (this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  const ns: string = createNS()
  const testFile = '/tmp/testredirect'

  allocateNS(this, ns)

  function grepInTestFile(ctx: Common.ISuite, str: string) {
    it(`should grep ${str} in the test file`, async () =>
      CLI.command(`grep "${str}" ${testFile}`, ctx.app)
        .then(ReplExpect.okWithString(str))
        .catch(Common.oops(ctx, true)))
  }

  commands.forEach(kubectl => {
    it(`should get namespace yaml and redirect to a file`, async () =>
      CLI.command(`${kubectl} get namespace ${ns} -o yaml > ${testFile}`, this.app)
        .then(ReplExpect.justOK)
        .catch(Common.oops(this, true)))

    grepInTestFile(this, `name: ${ns}`)

    it(`should get namespace table and append result to the test file`, async () =>
      CLI.command(`${kubectl} get namespace ${ns} >> ${testFile}`, this.app)
        .then(ReplExpect.justOK)
        .catch(Common.oops(this, true)))

    grepInTestFile(this, `name: ${ns}`)
    grepInTestFile(this, 'AGE')

    it('should remove the test file', () =>
      CLI.command(`rm -f ${testFile}`, this.app).then(ReplExpect.ok).catch(Common.oops(this, true)))
  })

  deleteNS(this, ns)
})
