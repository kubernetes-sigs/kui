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

import { Common, CLI, ReplExpect, SidecarExpect, Selectors, Util } from '@kui-shell/test'
import {
  waitForGreen,
  waitForRed,
  defaultModeForGet,
  createNS,
  allocateNS,
  deleteNS
} from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

const commands = ['kubectl', 'k']
if (process.env.NEEDS_OC) {
  commands.push('oc')
}

commands.forEach(command => {
  // this test is still oddly buggy with webpack+proxy, hence the localDescribe
  Common.localDescribe(`${command} get summary tab describe ${process.env.MOCHA_RUN_TARGET || ''}`, function(
    this: Common.ISuite
  ) {
    before(Common.before(this))
    after(Common.after(this))

    const ns: string = createNS()

    /**
     * Interact with the Raw tab
     *
     */
    const testRawTab = async (ctx: Common.ISuite) => {
      await ctx.app.client.waitForVisible(Selectors.SIDECAR_MODE_BUTTON('raw'))
      await ctx.app.client.click(Selectors.SIDECAR_MODE_BUTTON('raw'))

      return ctx.app.client.waitUntil(async () => {
        const ok: boolean = await Util.getValueFromMonaco(ctx.app).then(
          Util.expectYAMLSubset(
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
    const testSummaryTab = async (ctx: Common.ISuite) => {
      await ctx.app.client.waitForVisible(Selectors.SIDECAR_MODE_BUTTON(defaultModeForGet))
      await ctx.app.client.click(Selectors.SIDECAR_MODE_BUTTON(defaultModeForGet))
      await SidecarExpect.form({ Name: 'nginx' }, 'kubectl-summary')
    }

    allocateNS(this, ns, command)

    // this one sometimes times out in webpack in travis; not sure why yet [nickm 20190810]
    // localIt will have it run only in electron for now
    Common.localIt(`should fail with 404 for unknown resource type via ${command}`, () => {
      const fakeType = 'yoyoyo1334u890724'
      return CLI.command(`${command} get ${fakeType} productPage -o yaml`, this.app)
        .then(ReplExpect.error(404))
        .catch(Common.oops(this, true))
    })

    it(`should create sample pod from URL via ${command}`, () => {
      return CLI.command(
        `${command} create -f https://raw.githubusercontent.com/kubernetes/examples/master/staging/pod -n ${ns}`,
        this.app
      )
        .then(ReplExpect.okWithCustom({ selector: Selectors.BY_NAME('nginx') }))
        .then(selector => waitForGreen(this.app, selector))
        .catch(Common.oops(this, true))
    })

    it(`should describe that pod via ${command}`, () => {
      return CLI.command(`${command} describe pod nginx -n ${ns}`, this.app)
        .then(ReplExpect.justOK)
        .then(SidecarExpect.open)
        .then(SidecarExpect.mode(defaultModeForGet))
        .then(SidecarExpect.showing('nginx', undefined, undefined, ns))
        .catch(Common.oops(this, true))
    })

    it(`should summarize that pod via ${command}`, () => {
      return CLI.command(`${command} get pod nginx -n ${ns} -o yaml`, this.app)
        .then(ReplExpect.justOK)
        .then(SidecarExpect.open)
        .then(SidecarExpect.mode(defaultModeForGet))
        .then(SidecarExpect.showing('nginx', undefined, undefined, ns))
        .catch(Common.oops(this, true))
    })

    // flip around the tabs a bit
    it(`should flip to raw tab`, () => testRawTab(this).catch(Common.oops(this, true)))
    it(`should flip to summary tab`, () => testSummaryTab(this).catch(Common.oops(this, true)))
    it(`should flip to raw tab`, () => testRawTab(this).catch(Common.oops(this, true)))
    it(`should flip to summary tab`, () => testSummaryTab(this).catch(Common.oops(this, true)))

    // click delete button
    it('should initiate deletion of the pod via sidecar deletion button', async () => {
      try {
        await this.app.client.waitForVisible(Selectors.SIDECAR_MODE_BUTTON('delete'))
        await this.app.client.click(Selectors.SIDECAR_MODE_BUTTON('delete'))

        // wait for delete confirmation popup
        await this.app.client.waitForExist('#confirm-dialog .bx--btn--danger')
        await this.app.client.click('#confirm-dialog .bx--btn--danger')
        await this.app.client.waitForExist('#confirm-dialog', 20000, true) // go away!
      } catch (err) {
        await Common.oops(this, true)
      }
    })

    it('should show that the click-delete has started', () => {
      // a deletion command should be issued
      let idx = 0
      return this.app.client
        .waitUntil(async () => {
          const value = await this.app.client.getValue(Selectors.PROMPT_FINAL)
          if (++idx > 5) {
            console.error(`kubectl get ${process.env.MOCHA_RUN_TARGET || ''} still waiting for delete command`)
          }

          return /delete/.test(value)
        })
        .catch(Common.oops(this, true))
    })

    it('should wait for that click-delete to finish', async () => {
      try {
        const count = parseInt(await this.app.client.getAttribute(Selectors.PROMPT_BLOCK_FINAL, 'data-input-count'), 10)
        const newResourceSelector = await ReplExpect.okWithCustom({
          selector: Selectors.BY_NAME('nginx')
        })({ app: this.app, count })

        await waitForRed(this.app, newResourceSelector)
      } catch (err) {
        await Common.oops(this, true)
      }
    })

    deleteNS(this, ns, command)
  })
})
