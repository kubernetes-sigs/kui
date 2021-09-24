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

import { Common, CLI, ReplExpect, SidecarExpect, Selectors, Util } from '@kui-shell/test'
import {
  remotePodYaml,
  waitForGreen,
  waitForRed,
  defaultModeForGet,
  createNS,
  allocateNS,
  deleteNS,
  doHelp
} from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

const commands = ['kubectl', 'k']
if (process.env.NEEDS_OC) {
  commands.push('oc')
}

commands.forEach(command => {
  describe(`${command} get summary tab describe ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
    before(Common.before(this))
    after(Common.after(this))

    const ns: string = createNS()
    let res: ReplExpect.AppAndCount

    /**
     * Interact with the Raw tab
     *
     */
    const testRawTab = async (ctx: Common.ISuite, res: ReplExpect.AppAndCount) => {
      await Util.switchToTab('raw')(res)

      return ctx.app.client.waitUntil(
        async () => {
          const ok: boolean = await Util.getValueFromMonaco(res).then(
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
        },
        { timeout: CLI.waitTimeout }
      )
    }

    /**
     * Interact with the Summary tab
     *
     */
    const testSummaryTab = async (ctx: Common.ISuite, res: ReplExpect.AppAndCount) => {
      await Util.switchToTab(defaultModeForGet)(res).then(SidecarExpect.descriptionList({ Status: 'Running' }))
    }

    allocateNS(this, ns, command)

    // test command usage
    const help = doHelp.bind(this)
    const execCommand = command === 'k' ? 'kubectl' : command
    help(`${command} describe --help`, [execCommand, 'describe'], ['Introduction'])

    it(`should fail with suggestion for invalid command syntax via ${command} describe`, () => {
      return CLI.command(`${command} describe`, this.app)
        .then(ReplExpect.error(500, `error: You must specify the type of resource to describe.`))
        .catch(Common.oops(this, true))
    })

    // this one sometimes times out in webpack in travis; not sure why yet [nickm 20190810]
    // localIt will have it run only in electron for now
    Common.localIt(`should fail with 404 for unknown resource type via ${command}`, () => {
      const fakeType = 'yoyoyo1334u890724'
      return CLI.command(`${command} get ${fakeType} productPage -o yaml`, this.app)
        .then(ReplExpect.error(404))
        .catch(Common.oops(this, true))
    })

    it(`should create sample pod from URL via ${command}`, () => {
      return CLI.command(`${command} create -f ${remotePodYaml} -n ${ns}`, this.app)
        .then(
          ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME('nginx') })
        )
        .then(selector => waitForGreen(this.app, selector))
        .catch(Common.oops(this, true))
    })

    it(`should describe that pod via ${command}`, () => {
      return CLI.command(`${command} describe pod nginx -n ${ns}`, this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(SidecarExpect.mode(defaultModeForGet))
        .then(SidecarExpect.showingTopNav('nginx'))
        .catch(Common.oops(this, true))
    })

    it(`should summarize that pod via ${command}`, async () => {
      return CLI.command(`${command} get pod nginx -n ${ns} -o yaml`, this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(appAndCount => {
          res = appAndCount
          return appAndCount
        })
        .then(SidecarExpect.mode(defaultModeForGet))
        .then(SidecarExpect.showingTopNav('nginx'))
        .catch(Common.oops(this, true))
    })

    // flip around the tabs a bit
    it(`should flip to raw tab`, () => testRawTab(this, res).catch(Common.oops(this, true)))
    it(`should flip to summary tab`, () => testSummaryTab(this, res).catch(Common.oops(this, true)))
    it(`should flip to raw tab`, () => testRawTab(this, res).catch(Common.oops(this, true)))
    it(`should flip to summary tab`, () => testSummaryTab(this, res).catch(Common.oops(this, true)))

    // click delete button
    it('should initiate deletion of the pod via sidecar deletion button', async () => {
      try {
        await this.app.client.$(Selectors.SIDECAR_MODE_BUTTON(res.count, 'delete')).then(async _ => {
          await _.waitForDisplayed()
          await _.click()
        })

        // wait for delete confirmation popup
        await this.app.client.$(Selectors.CONFIRM_DIALOG_CONFIRM_BUTTON).then(async _ => {
          await _.waitForExist()
          await _.click()
        })
        await this.app.client.$(Selectors.CONFIRM_DIALOG).then(_ => _.waitForExist({ timeout: 20000, reverse: true })) // go away!
      } catch (err) {
        await Common.oops(this, true)(err)
      }
    })

    it('should show that the click-delete has started', () => {
      // a deletion command should be issued
      let idx = 0
      return this.app.client
        .waitUntil(async () => {
          const value = await this.app.client.$(Selectors.PROMPT_LAST).then(_ => _.getText())
          if (++idx > 5) {
            console.error(
              `kubectl get ${process.env.MOCHA_RUN_TARGET || ''} still waiting for delete command actual=${value}`
            )
          }

          return /delete/.test(value)
        })
        .catch(Common.oops(this, true))
    })

    it('should wait for that click-delete to finish', async () => {
      try {
        const count = parseInt(
          await this.app.client.$(Selectors.PROMPT_BLOCK_LAST).then(_ => _.getAttribute('data-input-count')),
          10
        )
        const newResourceSelector = await ReplExpect.okWithCustom<string>({
          selector: Selectors.BY_NAME('nginx')
        })({ app: this.app, count })

        await waitForRed(this.app, newResourceSelector)
      } catch (err) {
        await Common.oops(this, true)(err)
      }
    })

    deleteNS(this, ns, command)
  })
})
