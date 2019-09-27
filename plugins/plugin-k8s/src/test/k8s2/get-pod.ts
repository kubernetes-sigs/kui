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

import { Common, CLI, ReplExpect, SidecarExpect, Selectors } from '@kui-shell/test'
import {
  waitForGreen,
  waitForRed,
  defaultModeForGet,
  createNS,
  allocateNS,
  deleteNS
} from '@kui-shell/plugin-k8s/tests/lib/k8s/utils'

import * as assert from 'assert'

const synonyms = ['kubectl']

describe(`kubectl get pod ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  synonyms.forEach(kubectl => {
    /**
     * Interact with the Containers tab
     *
     */
    const testContainersTab = async (click = true) => {
      if (click) {
        await this.app.client.click(Selectors.SIDECAR_MODE_BUTTON('containers'))
      }

      const table = `${Selectors.SIDECAR} .bx--data-table`
      await this.app.client.waitForExist(table)

      // check the conditions rows
      await this.app.client.waitForExist(`${table} .entity[data-name="nginx"] [data-key="ready"][data-value="true"]`)

      // check that the message shows the final state
      const message = await this.app.client.getText(`${table} .entity[data-name="nginx"] [data-key="message"]`)
      assert.ok(!/Initializing/i.test(message))

      // check that the ready check mark is green
      await this.app.client.waitForExist(
        `${table} .entity[data-name="nginx"] [data-key="ready"].green-text .cell-inner.graphical-icon`
      )
    }

    const testLogTabs = async () => {
      const container = `${Selectors.SIDECAR} .bx--data-table .entity[data-name="nginx"] .entity-name`
      await this.app.client.click(container)
      await SidecarExpect.open(this.app)

      await this.app.client.waitForVisible(Selectors.SIDECAR_BACK_BUTTON) // make sure the back button exists
      await this.app.client.waitForExist(Selectors.SIDECAR_MODE_BUTTON('result')) // Latest Tab
      await this.app.client.waitForExist(Selectors.SIDECAR_MODE_BUTTON('previous'))

      await this.app.client.waitForVisible(Selectors.SIDECAR_BACK_BUTTON) // make sure the back button exists
      await this.app.client.click(Selectors.SIDECAR_BACK_BUTTON) // transition back to the previous view

      await this.app.client.waitForExist(Selectors.SIDECAR_MODE_BUTTON('containers'))
    }

    const ns: string = createNS()
    const inNamespace = `-n ${ns}`
    allocateNS(this, ns)

    /** error handling starts */
    it('should error out when getting non-existent pod', () => {
      const noName = 'shouldNotExist'
      return CLI.command(`${kubectl} get pod ${noName}`, this.app)
        .then(ReplExpect.error(404, `Error from server (NotFound): pods "${noName}" not found`))
        .catch(Common.oops(this))
    })

    it('should error out when getting non-existent pod, with incorrect comment space', () => {
      const noName = 'shouldNotExist#comment'
      return CLI.command(`${kubectl} get pod ${noName}`, this.app)
        .then(ReplExpect.error(404, `Error from server (NotFound): pods "${noName}" not found`))
        .catch(Common.oops(this))
    })

    it('should error out when getting non-existent pod, with correct comment', () => {
      const noName = 'shouldNotExist'
      return CLI.command(`${kubectl} get pod ${noName} #comment`, this.app)
        .then(ReplExpect.error(404, `Error from server (NotFound): pods "${noName}" not found`))
        .catch(Common.oops(this))
    })

    /**
     * NOTE [myan 20190816]: In the test case below, The error message is different based on kube version
     * With version 1.12, the output is 'Error from server (NotFound): pods "shouldNotExist1" not found' only.
     * With higher versions e.g. 1.14, the output is:
     *  'Error from server (NotFound): pods "shouldNotExist1" not found
     *   Error from server (NotFound): pods "shouldNotExist2" not found'
     *
     * TODO: We should test against different kube version
     */
    it('should error out when getting 2 non-existent pods', () => {
      const noName1 = 'shouldNotExist1'
      const noName2 = 'shouldNotExist2'
      return CLI.command(`${kubectl} get pod ${noName1} ${noName2}`, this.app)
        .then(ReplExpect.error(404))
        .catch(Common.oops(this))
    })

    it('should error out when getting pods with incorrect comments', () => {
      return CLI.command(`${kubectl} get pod# comment #comment`, this.app)
        .then(ReplExpect.error(404, 'error: the server doesn\'t have a resource type "pod#"'))
        .catch(Common.oops(this))
    })
    /** error handling ends */

    /** TODO: enabe the following test once we have sidecar table poller ready
    // do this a few times, as we might get lucky and have the
    // containers ready by the time we click on the row; we are trying
    // to test that the containers tab actually polls for completion
    // rather than it presenting a fixed-in-time view into the status
    // of the containers
    for (let idx = 0; idx < 5; idx++) {
      it(`should eventually show ready containers if we click mid-creation iter=${idx}`, async () => {
        try {
          const selector: string = await CLI
            .command(
              `${kubectl} create -f https://raw.githubusercontent.com/kubernetes/examples/master/staging/pod ${inNamespace}`,
              this.app
            )
            .then(ReplExpect.okWithCustom({ selector: Selectors.BY_NAME('nginx') }))

          await waitForGreen(this.app, selector)
          await this.app.client.waitForExist(`${selector} .clickable`)
          await this.app.client.click(`${selector} .clickable`)
          await SidecarExpect
            .open(this.app)
            .then(SidecarExpect.mode(defaultModeForGet))
            .then(SidecarExpect.showing('nginx'))

          await testContainersTab()
        } catch (err) {
          return Common.oops(this)(err)
        }
      })

      it(`should delete the sample pod from URL via ${kubectl} iter=${idx}`, () => {
        return CLI
          .command(
            `${kubectl} delete -f https://raw.githubusercontent.com/kubernetes/examples/master/staging/pod ${inNamespace}`,
            this.app
          )
          .then(ReplExpect.okWithCustom({ selector: Selectors.BY_NAME('nginx') }))
          .then((selector: string) => waitForRed(this.app, selector))
          .catch(Common.oops(this))
      })
    }
    */

    // NOTE: this is an alternative test for the click mid-creation test above, since sidecar table poller is not ready
    it(`should show ready containers if we click after creation`, async () => {
      try {
        const selector: string = await CLI.command(
          `${kubectl} create -f https://raw.githubusercontent.com/kubernetes/examples/master/staging/pod ${inNamespace}`,
          this.app
        ).then(ReplExpect.okWithCustom({ selector: Selectors.BY_NAME('nginx') }))

        await waitForGreen(this.app, selector)
        await this.app.client.waitForExist(`${selector} .clickable`)
        await this.app.client.click(`${selector} .clickable`)
        await SidecarExpect.open(this.app)
          .then(SidecarExpect.mode(defaultModeForGet))
          .then(SidecarExpect.showing('nginx'))

        await testContainersTab()
        await testLogTabs()
        await testContainersTab(false) // testing back button, don't click the container tab
        await testLogTabs()
        await testContainersTab(false) // testing back button, don't click the container tab
      } catch (err) {
        return Common.oops(this)(err)
      }
    })

    it(`should delete the sample pod from URL via ${kubectl}`, () => {
      return CLI.command(
        `${kubectl} delete -f https://raw.githubusercontent.com/kubernetes/examples/master/staging/pod ${inNamespace}`,
        this.app
      )
        .then(ReplExpect.okWithCustom({ selector: Selectors.BY_NAME('nginx') }))
        .then(selector => waitForRed(this.app, selector))
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

    it(`should list pods via ${kubectl} then click`, async () => {
      try {
        const selector: string = await CLI.command(`${kubectl} get pods ${inNamespace}`, this.app).then(
          ReplExpect.okWithCustom({ selector: Selectors.BY_NAME('nginx') })
        )

        // wait for the badge to become green
        await waitForGreen(this.app, selector)

        // now click on the table row
        await this.app.client.click(`${selector} .clickable`)
        await SidecarExpect.open(this.app)
          .then(SidecarExpect.mode(defaultModeForGet))
          .then(SidecarExpect.showing('nginx'))
      } catch (err) {
        return Common.oops(this)(err)
      }
    })

    it('should click on the sidecar maximize button', async () => {
      try {
        await this.app.client.click(Selectors.SIDECAR_MAXIMIZE_BUTTON)
        await this.app.client.waitForExist(Selectors.SIDECAR_FULLSCREEN)
      } catch (err) {
        return Common.oops(this)(err)
      }
    })

    it('should click on the sidecar maximize button to restore split screen', async () => {
      try {
        await this.app.client.click(Selectors.SIDECAR_MAXIMIZE_BUTTON)
        await this.app.client.waitForExist(Selectors.SIDECAR_FULLSCREEN, 20000, true)
      } catch (err) {
        return Common.oops(this)(err)
      }
    })

    it(`should click on containers sidecar tab and show containers table`, testContainersTab)

    it('should drill down to log when container is clicked', testLogTabs)

    it('should transition back from log and see containers table', testContainersTab.bind(this, false)) // testing back button, do not click the Container tab

    it('should drill down to log when container is clicked', testLogTabs)

    it('should transition back from log and see containers table', testContainersTab.bind(this, false)) // testing back button, do not click the Container tab

    it(`should be able to show table with grep`, async () => {
      try {
        const res = await CLI.command(`${kubectl} get pods ${inNamespace} | grep nginx`, this.app)
        const rows = Selectors.xtermRows(res.count)

        await this.app.client.waitForExist(rows)
        await ReplExpect.okWithString('nginx')
      } catch (err) {
        return Common.oops(this, true)(err)
      }
    })

    it(`should delete the sample pod from URL via ${kubectl}`, () => {
      return CLI.command(
        `${kubectl} delete -f https://raw.githubusercontent.com/kubernetes/examples/master/staging/pod ${inNamespace}`,
        this.app
      )
        .then(ReplExpect.okWithCustom({ selector: Selectors.BY_NAME('nginx') }))
        .then((selector: string) => waitForRed(this.app, selector))
        .catch(Common.oops(this))
    })

    deleteNS(this, ns)
  })
})
