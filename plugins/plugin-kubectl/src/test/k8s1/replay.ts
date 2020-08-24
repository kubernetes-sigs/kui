/*
 * Copyright 2020 IBM Corporation
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
import { waitForGreen, waitForRed, createNS, allocateNS, deleteNS } from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

describe(`kubectl replay watch updates ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  const ns: string = createNS()
  const inNamespace = `-n ${ns}`

  allocateNS(this, ns, 'kubectl')

  it(`should create and delete the sample pod from URL via kubectl, and replay`, async () => {
    try {
      console.error('creating')
      const createRes = await CLI.command(
        `kubectl create -f https://raw.githubusercontent.com/kubernetes/examples/master/staging/pod ${inNamespace}`,
        this.app
      )

      const createSelector = await ReplExpect.okWithCustom({ selector: Selectors.BY_NAME('nginx') })(createRes)
      await waitForGreen(this.app, createSelector)
      await this.app.client.waitForVisible(Selectors.TABLE_FOOTER(createRes.count))

      console.error('deleting')
      const deleteRes = await CLI.command(
        `kubectl delete -f https://raw.githubusercontent.com/kubernetes/examples/master/staging/pod ${inNamespace}`,
        this.app
      )

      const deleteSelector = await ReplExpect.okWithCustom({ selector: Selectors.BY_NAME('nginx') })(deleteRes)
      await waitForRed(this.app, deleteSelector)

      console.error('snapshoting')
      await CLI.command('snapshot /tmp/test.kui', this.app).then(ReplExpect.justOK)

      console.error('replaying')
      await Common.refresh(this)

      await CLI.command('replay /tmp/test.kui', this.app)

      console.error('verifying creation')
      await waitForGreen(this.app, createSelector)
      await this.app.client.waitForVisible(Selectors.TABLE_FOOTER(createRes.count))

      console.error('verifying deletion')
      await waitForRed(this.app, deleteSelector)
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })

  deleteNS(this, ns, 'kubectl')
})
