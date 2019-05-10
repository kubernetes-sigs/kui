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

import assert = require('assert')

import * as common from '@kui-shell/core/tests/lib/common'
import { cli, expectSubset, selectors, sidecar } from '@kui-shell/core/tests/lib/ui'
import { defaultModeForGet, createNS, allocateNS, deleteNS } from '@kui-shell/plugin-k8s/tests/lib/k8s/utils'

const synonyms = ['kubectl']

describe('electron get pod', function (this: common.ISuite) {
  before(common.before(this))
  after(common.after(this))

  synonyms.forEach(kubectl => {
    /**
     * Interact with the Containers tab
     *
     */
    const testContainersTab = async (fast = false) => {
      this.app.client.click(selectors.SIDECAR_MODE_BUTTON('containers'))

      const table = `${selectors.SIDECAR} [k8s-table="Containers"]`
      await this.app.client.waitForExist(table)

      if (!fast) {
        const tableTitle = await this.app.client.getText(`${table} .result-table-title`)
        assert.strictEqual(tableTitle.toLowerCase(), 'containers')
      }

      // check the conditions rows
      await this.app.client.waitForExist(`${table} .entity[data-name="nginx"] [data-key="ready"][data-value="true"]`)

      // check that the message shows the final state
      const message = await this.app.client.getText(`${table} .entity[data-name="nginx"] [data-key="message"]`)
      assert.ok(!/Initializing/i.test(message))

      // check that the ready check mark is green
      await this.app.client.waitForExist(`${table} .entity[data-name="nginx"] [data-key="ready"].green-text .fa-check-circle`)
    }

    /**
     * Interact with the Raw tab
     *
     */
    const testRawTab = async () => {
      this.app.client.click(selectors.SIDECAR_MODE_BUTTON('raw'))

      // expect to see some familiar bits of a pod in the editor under the raw tab
      return this.app.client.getText(`${selectors.SIDECAR} .monaco-editor .view-lines`)
        .then(expectSubset({
          apiVersion: 'v1',
          kind: 'Pod',
          metadata: {
            name: 'nginx',
            namespace: ns
          }
        }))
    }

    const ns: string = createNS()
    const inNamespace = `-n ${ns}`
    allocateNS(this, ns)

    // do this a few times, as we might get lucky and have the
    // containers ready by the time we click on the row; we are trying
    // to test that the containers tab actually polls for completion
    // rather than it presenting a fixed-in-time view into the status
    // of the containers
    for (let idx = 0; idx < 5; idx++) {
      it(`should eventually show ready containers if we click mid-creation iter=${idx}`, async () => {
        try {
          const selector = await cli.do(`${kubectl} create -f https://raw.githubusercontent.com/kubernetes/examples/master/staging/pod ${inNamespace}`, this.app)
            .then(cli.expectOKWithCustom({ selector: selectors.BY_NAME('nginx') }))

          await this.app.client.waitForExist(`${selector} .clickable`)
          this.app.client.click(`${selector} .clickable`)
          await sidecar.expectOpen(this.app).then(sidecar.expectMode(defaultModeForGet)).then(sidecar.expectShowing('nginx'))

          await testContainersTab(true)
        } catch (err) {
          common.oops(this)(err)
        }
      })

      it(`should delete the sample pod from URL via ${kubectl} iter=${idx}`, () => {
        return cli.do(`${kubectl} delete -f https://raw.githubusercontent.com/kubernetes/examples/master/staging/pod ${inNamespace}`, this.app)
          .then(cli.expectOKWithCustom({ selector: selectors.BY_NAME('nginx') }))
          .then(selector => this.app.client.waitForExist(`${selector} badge.red-background`))
          .catch(common.oops(this))
      })
    }

    it(`should create sample pod from URL via ${kubectl}`, () => {
      return cli.do(`${kubectl} create -f https://raw.githubusercontent.com/kubernetes/examples/master/staging/pod ${inNamespace}`, this.app)
        .then(cli.expectOKWithCustom({ selector: selectors.BY_NAME('nginx') }))
        .then(selector => this.app.client.waitForExist(`${selector} badge.green-background`))
        .catch(common.oops(this))
    })

    it(`should list pods via ${kubectl} then click`, async () => {
      try {
        const selector = await cli.do(`${kubectl} get pods ${inNamespace}`, this.app)
          .then(cli.expectOKWithCustom({ selector: selectors.BY_NAME('nginx') }))

        // wait for the badge to become green
        await this.app.client.waitForExist(`${selector} badge.green-background`)

        // now click on the table row
        this.app.client.click(`${selector} .clickable`)
        await sidecar.expectOpen(this.app).then(sidecar.expectMode(defaultModeForGet)).then(sidecar.expectShowing('nginx'))
      } catch (err) {
        common.oops(this)(err)
      }
    })

    it(`should click on status sidecar tab and show status table`, async () => {
      try {
        this.app.client.click(selectors.SIDECAR_MODE_BUTTON('status'))

        const table = `${selectors.SIDECAR} [k8s-table="Pod"]`
        await this.app.client.waitForExist(table)

        const tableTitle = await this.app.client.getText(`${table} .result-table-title`)
        assert.strictEqual(tableTitle.toLowerCase(), 'pod')

        // wait for the badge to become green
        await this.app.client.waitForExist(`${table} .entity[data-name="nginx"] [data-key="status"].green-background`)
      } catch (err) {
        common.oops(this)(err)
      }
    })

    it(`should click on conditions sidecar tab and show conditions table`, async () => {
      this.app.client.click(selectors.SIDECAR_MODE_BUTTON('conditions'))

      const table = `${selectors.SIDECAR} [k8s-table="Conditions"]`
      await this.app.client.waitForExist(table)

      const tableTitle = await this.app.client.getText(`${table} .result-table-title`)
      assert.strictEqual(tableTitle.toLowerCase(), 'conditions')

      // check the conditions rows
      await Promise.all([
        this.app.client.waitForExist(`${table} .entity[data-name="PodScheduled"] [data-key="status"][data-value="True"]`),
        this.app.client.waitForExist(`${table} .entity[data-name="Initialized"] [data-key="status"][data-value="True"]`),
        this.app.client.waitForExist(`${table} .entity[data-name="Ready"] [data-key="status"][data-value="True"]`),
        this.app.client.waitForExist(`${table} .entity[data-name="ContainersReady"] [data-key="status"][data-value="True"]`)
      ])
    })

    it(`should click on containers sidecar tab and show containers table`, testContainersTab)

    it(`should delete the sample pod from URL via ${kubectl}`, () => {
      return cli.do(`${kubectl} delete -f https://raw.githubusercontent.com/kubernetes/examples/master/staging/pod ${inNamespace}`, this.app)
        .then(cli.expectOKWithCustom({ selector: selectors.BY_NAME('nginx') }))
        .then(selector => this.app.client.waitForExist(`${selector} badge.red-background`))
        .catch(common.oops(this))
    })

    deleteNS(this, ns)
  })
})
