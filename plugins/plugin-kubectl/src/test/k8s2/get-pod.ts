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

import { Common, CLI, ReplExpect, SidecarExpect, Selectors } from '@kui-shell/test'
import {
  remotePodYaml,
  openSidecarByList,
  waitForGreen,
  waitForRed,
  createNS,
  allocateNS,
  deleteNS
} from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

import * as assert from 'assert'
import { dirname } from 'path'
const ROOT = dirname(require.resolve('@kui-shell/plugin-kubectl/tests/package.json'))

const commands = ['kubectl']
if (process.env.NEEDS_OC) {
  commands.push('oc')
}

commands.forEach(command => {
  describe(`${command} get pod no watch ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
    before(Common.before(this))
    after(Common.after(this))

    /**
     * Interact with the Containers tab
     *
     */
    /* const testContainersTab = async (click = true) => {
      if (click) {
        await this.app.client.click(Selectors.SIDECAR_MODE_BUTTON('containers'))
      }

      // in any case, the containers tab should be selected now
      await this.app.client.waitForVisible(Selectors.SIDECAR_MODE_BUTTON_SELECTED('containers'))

      const table = `${Selectors.SIDECAR_TAB_CONTENT} table`
      await this.app.client.waitForVisible(table)

      // check the conditions rows
      await this.app.client.waitForVisible(`${table} [data-name="nginx"] [data-key="restartCount"]`)

      // check that the message shows the final state
      const message = await this.app.client.getText(`${table} [data-name="nginx"] [data-key="message"]`)
      assert.ok(!/Initializing/i.test(message))
    } */

    const ns: string = createNS()
    const inNamespace = `-n ${ns}`
    allocateNS(this, ns)

    /** error handling starts */
    it('should error out when creating an existing namespace', () => {
      return CLI.command(`${command} create ns ${ns}`, this.app)
        .then(ReplExpect.error(409))
        .catch(Common.oops(this, true))
    })

    it('should command not found when kubectl is not specified', () => {
      return CLI.command('get pods', this.app)
        .then(ReplExpect.error(127))
        .catch(Common.oops(this, true))
    })

    it('should error out when getting non-existent pod', () => {
      const noName = 'shouldNotExist'
      return CLI.command(`${command} get pod ${noName}`, this.app)
        .then(ReplExpect.error(404, `Error from server (NotFound): pods "${noName}" not found`))
        .catch(Common.oops(this, true))
    })

    it('should error out when getting non-existent pod, with incorrect comment space', () => {
      const noName = 'shouldNotExist#comment'
      return CLI.command(`${command} get pod ${noName}`, this.app)
        .then(ReplExpect.error(404, `Error from server (NotFound): pods "${noName}" not found`))
        .catch(Common.oops(this, true))
    })

    it('should error out when getting non-existent pod, with correct comment', () => {
      const noName = 'shouldNotExist'
      return CLI.command(`${command} get pod ${noName} #comment`, this.app)
        .then(ReplExpect.error(404, `Error from server (NotFound): pods "${noName}" not found`))
        .catch(Common.oops(this, true))
    })

    it(`should error out when getting without kind`, () => {
      return CLI.command(`${command} get ${inNamespace}`, this.app)
        .then(ReplExpect.error(500))
        .catch(Common.oops(this, true))
    })

    it(`should error out when getting -o name without kind`, () => {
      return CLI.command(`${command} get -o name ${inNamespace}`, this.app)
        .then(ReplExpect.error(500))
        .catch(Common.oops(this, true))
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
      return CLI.command(`${command} get pod ${noName1} ${noName2}`, this.app)
        .then(ReplExpect.error(404))
        .catch(Common.oops(this, true))
    })

    it('should error out when getting pods with incorrect comments', () => {
      return CLI.command(`${command} get pod# comment #comment`, this.app)
        .then(ReplExpect.error(404, 'the server doesn\'t have a resource type "pod#"'))
        .catch(Common.oops(this, true))
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
              `${kubectl} create -f ${remotePodYaml} ${inNamespace}`,
              this.app
            )
            .then(ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME('nginx') }))

          await waitForGreen(this.app, selector)
          await this.app.client.waitForExist(`${selector} .clickable`)
          await this.app.client.click(`${selector} .clickable`)
          await SidecarExpect
            .open(this.app)
            .then(SidecarExpect.mode(defaultModeForGet))
            .then(SidecarExpect.showing('nginx'))

          await testContainersTab()
        } catch (err) {
          return Common.oops(this, true)(err)
        }
      })

      it(`should delete the sample pod from URL via ${kubectl} iter=${idx}`, () => {
        return CLI
          .command(
            `${kubectl} delete -f ${remotePodYaml} ${inNamespace}`,
            this.app
          )
          .then(ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME('nginx') }))
          .then((selector: string) => waitForRed(this.app, selector))
          .catch(Common.oops(this, true))
      })
    }
    */

    // NOTE: this is an alternative test for the click mid-creation test above, since sidecar table poller is not ready
    it(`should show summary tab if we click after creation`, async () => {
      try {
        await openSidecarByList(this, `${command} create -f ${remotePodYaml} ${inNamespace}`, 'nginx').then(
          SidecarExpect.toolbarText({ type: 'info', text: 'Created on', exact: false })
        )

        // await testContainersTab()
        // await testLogsTab()
        // await testContainersTab(false) // testing back button, don't click the container tab
        // await testLogsTabs()
        // await testContainersTab(false) // testing back button, don't click the container tab
      } catch (err) {
        return Common.oops(this, true)(err)
      }
    })

    it('should show "Pod" as table title for "po" get', async () => {
      try {
        const { count } = await CLI.command(`kubectl get po ${inNamespace}`, this.app)

        const actualTitle = await this.app.client.$(Selectors.TABLE_TITLE(count)).then(_ => _.getText())
        assert.strictEqual(actualTitle, 'Pod')
      } catch (err) {
        return Common.oops(this, true)
      }
    })

    const getListAsYAMLCommand = `${command} get pods -o yaml ${inNamespace}`
    it(`should get a list of pods in yaml form via ${getListAsYAMLCommand}`, () => {
      return CLI.command(getListAsYAMLCommand, this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(SidecarExpect.mode('raw'))
        .then(SidecarExpect.showingNotClickable(getListAsYAMLCommand))
        .catch(Common.oops(this, true))
    })

    it(`should delete the sample pod from URL via ${command}`, () => {
      return CLI.command(`${command} delete -f ${remotePodYaml} ${inNamespace}`, this.app)
        .then(
          ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME('nginx') })
        )
        .then(selector => waitForRed(this.app, selector))
        .catch(Common.oops(this, true))
    })

    it(`should create sample pod from URL via ${command}`, () => {
      return CLI.command(`${command} create -f ${remotePodYaml} ${inNamespace}`, this.app)
        .then(
          ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME('nginx') })
        )
        .then((selector: string) => waitForGreen(this.app, selector))
        .catch(Common.oops(this, true))
    })

    it(`should create another sample pod from URL via ${command}`, () => {
      return CLI.command(`${command} create -f ${ROOT}/data/k8s/headless/pod2.yaml ${inNamespace}`, this.app)
        .then(
          ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME('nginx2') })
        )
        .then((selector: string) => waitForGreen(this.app, selector))
        .catch(Common.oops(this, true))
    })

    // this test ensures that having '-n myNamespace' *before* the
    // 'pod nginx' part works properly
    it(`should get the pod with ${command} ${inNamespace} pod`, () => {
      return CLI.command(`${command} get ${inNamespace} pod nginx`, this.app)
        .then(
          ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME('nginx') })
        )
        .then((selector: string) => waitForGreen(this.app, selector))
        .catch(Common.oops(this, true))
    })

    it(`should get the pod with ${command} get all ${inNamespace}`, () => {
      return CLI.command(`${command} get all ${inNamespace}`, this.app)
        .then(
          ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME('nginx') })
        )
        .then((selector: string) => waitForGreen(this.app, selector))
        .catch(Common.oops(this, true))
    })

    it(`should toggle between grid and list mode`, async () => {
      try {
        const res = await CLI.command(`${command} get pods ${inNamespace}`, this.app)
        await ReplExpect.okWithAny(res)

        await this.app.client.$(Selectors.TABLE_SHOW_AS_GRID(res.count)).then(_ => _.click())
        await this.app.client.$(Selectors.TABLE_AS_GRID(res.count)).then(_ => _.waitForDisplayed())

        await this.app.client.$(Selectors.TABLE_SHOW_AS_LIST(res.count)).then(_ => _.click())
        await this.app.client.$(Selectors.TABLE_AS_LIST(res.count)).then(_ => _.waitForDisplayed())
      } catch (err) {
        return Common.oops(this, true)(err)
      }
    })

    it(`should list pods via ${command} then click`, async () => {
      try {
        await openSidecarByList(this, `${command} get pods ${inNamespace}`, 'nginx')
      } catch (err) {
        return Common.oops(this, true)(err)
      }
    })

    // it(`should click on containers sidecar tab and show containers table`, testContainersTab)

    // it('should drill down to log when container is clicked', testLogsTabs)
    // it('should transition back from log and see containers table', testContainersTab.bind(this, false)) // testing back button, do not click the Container tab
    // it('should drill down to log when container is clicked', testLogsTabs)

    // it('should transition back from log and see containers table', testContainersTab.bind(this, false)) // testing back button, do not click the Container tab

    it(`should be able to show table with grep`, async () => {
      try {
        const res = await CLI.command(`${command} get pods ${inNamespace} | grep nginx`, this.app)
        const rows = Selectors.xtermRows(res.count)

        await this.app.client.$(rows).then(_ => _.waitForExist())
        await ReplExpect.okWithString('nginx')
      } catch (err) {
        return Common.oops(this, true)(err)
      }
    })

    deleteNS(this, ns)
  })
})
