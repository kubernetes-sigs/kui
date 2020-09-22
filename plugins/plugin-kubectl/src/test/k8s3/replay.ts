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

import { Common, CLI, ReplExpect, Selectors, SidecarExpect } from '@kui-shell/test'
import {
  defaultModeForGet,
  waitForGreen,
  waitForRed,
  createNS,
  allocateNS,
  deleteNS
} from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'
import { AppAndCount } from '@kui-shell/test/mdist/api/repl-expect'

async function removeBlock(this: Common.ISuite, N: number) {
  await this.app.client.moveToObject(Selectors.PROMPT_N(N))
  await this.app.client.waitForVisible(Selectors.BLOCK_REMOVE_BUTTON(N))
  await this.app.client.click(Selectors.BLOCK_REMOVE_BUTTON(N))
}

describe(`kubectl replay ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  const ns: string = createNS()
  const inNamespace = `-n ${ns}`

  allocateNS(this, ns, 'kubectl')

  it(`should create, get and delete the sample pod from URL via kubectl, and replay`, async () => {
    const verifySidecar = async (sidecarNotOpen = false) => {
      console.error('verifying sidecar')
      if (sidecarNotOpen) {
        await SidecarExpect.notOpen(this.app)
      } else {
        await SidecarExpect.open(this.app)
          .then(SidecarExpect.mode(defaultModeForGet))
          .then(SidecarExpect.showing('nginx'))
          .then(SidecarExpect.toolbarText({ type: 'info', text: 'Created on', exact: false }))
      }
    }

    const verifyCreation = async (createRes: AppAndCount, createSelector: string) => {
      console.error('verifying creation')
      await waitForGreen(this.app, createSelector)
      // await this.app.client.waitForVisible(Selectors.TABLE_FOOTER(createRes.count))
    }

    const verifyDeletion = async (deleteSelector: string) => {
      console.error('verifying deletion')
      await waitForRed(this.app, deleteSelector)
    }

    // here comes the tests
    try {
      console.error('creating')
      const createRes = await CLI.command(
        `kubectl create -f https://raw.githubusercontent.com/kubernetes/examples/master/staging/pod ${inNamespace}`,
        this.app
      )

      const createSelector = await ReplExpect.okWithCustom({ selector: Selectors.BY_NAME('nginx') })(createRes)
      await verifyCreation(createRes, createSelector)
      await this.app.client.waitForExist(`${createSelector} .clickable`)
      await this.app.client.click(`${createSelector} .clickable`)
      await verifySidecar()

      console.error('deleting')
      const deleteRes = await CLI.command(
        `kubectl delete -f https://raw.githubusercontent.com/kubernetes/examples/master/staging/pod ${inNamespace}`,
        this.app
      )

      const deleteSelector = await ReplExpect.okWithCustom({ selector: Selectors.BY_NAME('nginx') })(deleteRes)
      await verifyDeletion(deleteSelector)

      console.error('snapshoting')
      await CLI.command('snapshot /tmp/test.kui', this.app).then(ReplExpect.justOK)

      console.error('replaying')
      await Common.refresh(this)

      const { count: N } = await CLI.command('replay /tmp/test.kui', this.app)

      await removeBlock.bind(this)(N)

      await verifyCreation(createRes, createSelector)
      await verifySidecar(true)
      await verifyDeletion(deleteSelector)
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })

  deleteNS(this, ns, 'kubectl')
})

describe(`kubectl replay with re-execution ${process.env.MOCHA_RUN_TARGET || ''}`, async function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  const ns: string = createNS()
  const inNamespace = `-n ${ns}`

  allocateNS(this, ns, 'kubectl')

  it('should replay a kubectl get pods table with re-execution ', async () => {
    try {
      const res = await CLI.command(`kubectl get pods ${inNamespace}`, this.app)
      await ReplExpect.error(127)(res)

      const selector = await CLI.command(
        `kubectl create -f https://raw.githubusercontent.com/kubernetes/examples/master/staging/pod ${inNamespace}`,
        this.app
      ).then(ReplExpect.okWithCustom({ selector: Selectors.BY_NAME('nginx') }))

      await waitForGreen(this.app, selector)

      await CLI.command('snapshot /tmp/test.kui --exec', this.app).then(ReplExpect.justOK)
      await Common.refresh(this)

      const { count: N } = await CLI.command('replay /tmp/test.kui', this.app)
      await removeBlock.bind(this)(N)

      await this.app.client.waitForVisible(Selectors.LIST_RESULT_BY_N_FOR_NAME(res.count, 'nginx'))
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })

  deleteNS(this, ns, 'kubectl')
})
