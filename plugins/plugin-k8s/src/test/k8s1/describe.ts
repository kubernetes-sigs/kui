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
import { cli, expectYAMLSubset, getValueFromMonaco as getText, selectors, sidecar } from '@kui-shell/core/tests/lib/ui'
import {
  waitForGreen,
  waitForRed,
  defaultModeForGet,
  createNS,
  allocateNS,
  deleteNS
} from '@kui-shell/plugin-k8s/tests/lib/k8s/utils'

const synonyms = ['kubectl']

// this test is still oddly buggy with webpack+proxy, hence the localDescribe
common.localDescribe(`kubectl summary ${process.env.MOCHA_RUN_TARGET}`, function(this: common.ISuite) {
  before(common.before(this))
  after(common.after(this))

  synonyms.forEach(kubectl => {
    const ns: string = createNS()

    /**
     * Interact with the Raw tab
     *
     */
    const testRawTab = async (ctx: common.ISuite) => {
      await ctx.app.client.waitForVisible(selectors.SIDECAR_MODE_BUTTON('raw'))
      await ctx.app.client.click(selectors.SIDECAR_MODE_BUTTON('raw'))

      return ctx.app.client.waitUntil(async () => {
        const ok: boolean = await getText(ctx.app).then(
          expectYAMLSubset(
            {
              apiVersion: 'v1',
              kind: 'Pod',
              metadata: {
                name: 'nginx',
                namespace: ns
              }
            },
            false
          )
        )

        return ok
      })
    }

    /**
     * Interact with the Summary tab
     *
     */
    const testSummaryTab = async (ctx: common.ISuite) => {
      await ctx.app.client.waitForVisible(selectors.SIDECAR_MODE_BUTTON(defaultModeForGet))
      await ctx.app.client.click(selectors.SIDECAR_MODE_BUTTON(defaultModeForGet))

      // expect to see some familiar bits of a pod in the editor under the raw tab
      return ctx.app.client.waitUntil(async () => {
        const name = 'nginx'
        const actualText = await getText(ctx.app)
        return new RegExp(`NAME:\\s+${name}`).test(actualText)
      })
    }

    allocateNS(this, ns)

    // this one sometimes times out in webpack in travis; not sure why yet [nickm 20190810]
    // localIt will have it run only in electron for now
    common.localIt(`should fail with 404 for unknown resource type via ${kubectl}`, () => {
      const fakeType = 'yoyoyo1334u890724'
      return cli
        .do(`${kubectl} summary ${fakeType} productPage`, this.app)
        .then(cli.expectError(404))
        .catch(common.oops(this, true))
    })

    it(`should create sample pod from URL via ${kubectl}`, () => {
      return cli
        .do(
          `${kubectl} create -f https://raw.githubusercontent.com/kubernetes/examples/master/staging/pod -n ${ns}`,
          this.app
        )
        .then(cli.expectOKWithCustom({ selector: selectors.BY_NAME('nginx') }))
        .then(selector => waitForGreen(this.app, selector))
        .catch(common.oops(this, true))
    })

    it(`should summarize that pod via ${kubectl}`, () => {
      return cli
        .do(`${kubectl} summary pod nginx -n ${ns}`, this.app)
        .then(cli.expectJustOK)
        .then(sidecar.expectOpen)
        .then(sidecar.expectMode(defaultModeForGet))
        .then(sidecar.expectShowing('nginx', undefined, undefined, ns))
        .catch(common.oops(this, true))
    })

    // flip around the tabs a bit
    it(`should flip to raw tab`, () => testRawTab(this).catch(common.oops(this, true)))
    it(`should flip to summary tab`, () => testSummaryTab(this).catch(common.oops(this, true)))
    it(`should flip to raw tab`, () => testRawTab(this).catch(common.oops(this, true)))
    it(`should flip to summary tab`, () => testSummaryTab(this).catch(common.oops(this, true)))

    // click delete button
    it('should initiate deletion of the pod via sidecar deletion button', async () => {
      try {
        await this.app.client.waitForVisible(selectors.SIDECAR_MODE_BUTTON('delete'))
        await this.app.client.click(selectors.SIDECAR_MODE_BUTTON('delete'))

        // wait for delete confirmation popup
        await this.app.client.waitForExist('#confirm-dialog .bx--btn--danger')
        await this.app.client.click('#confirm-dialog .bx--btn--danger')
        await this.app.client.waitForExist('#confirm-dialog', 20000, true) // go away!
      } catch (err) {
        await common.oops(this, true)
      }
    })

    it('should show that the click-delete has started', () => {
      // a deletion command should be issued
      let idx = 0
      return this.app.client
        .waitUntil(async () => {
          const value = await this.app.client.getValue(selectors.PROMPT_FINAL)
          if (++idx > 5) {
            console.error(`kubectl summary ${process.env.MOCHA_RUN_TARGET || ''} still waiting for delete command`)
          }

          return /delete/.test(value)
        })
        .catch(common.oops(this, true))
    })

    it('should wait for that click-delete to finish', async () => {
      try {
        const count = parseInt(await this.app.client.getAttribute(selectors.PROMPT_BLOCK_FINAL, 'data-input-count'), 10)
        const newResourceSelector = await cli.expectOKWithCustom({
          selector: selectors.BY_NAME('nginx')
        })({ app: this.app, count })

        await waitForRed(this.app, newResourceSelector)
      } catch (err) {
        await common.oops(this, true)
      }
    })

    deleteNS(this, ns)
  })
})
