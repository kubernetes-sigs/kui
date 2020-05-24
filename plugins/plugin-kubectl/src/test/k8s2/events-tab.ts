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
  createNS,
  allocateNS,
  deleteNS,
  waitForGreen,
  defaultModeForGet
} from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

const commands = ['kubectl']
if (process.env.NEEDS_OC) {
  commands.push('oc')
}

const file = 'https://raw.githubusercontent.com/kubernetes/examples/master/staging/pod'
const name = 'nginx'

commands.forEach(command => {
  describe(`kubectl Events tab ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
    before(Common.before(this))
    after(Common.after(this))

    const ns: string = createNS()
    const inNamespace = `-n ${ns}`
    allocateNS(this, ns)

    it('should create sample pod from URL', async () => {
      try {
        const selector: string = await CLI.command(`${command} create -f ${file} ${inNamespace}`, this.app).then(
          ReplExpect.okWithCustom({ selector: Selectors.BY_NAME(name) })
        )

        await waitForGreen(this.app, selector)
        await this.app.client.waitForExist(`${selector} .clickable`)
        await this.app.client.click(`${selector} .clickable`)
        await SidecarExpect.open(this.app)
          .then(SidecarExpect.mode(defaultModeForGet))
          .then(SidecarExpect.showing(name))
      } catch (err) {
        await Common.oops(this, true)
      }
    })

    it('should switch to Events tab', async () => {
      try {
        await this.app.client.waitForVisible(Selectors.SIDECAR_MODE_BUTTON('events'))
        await this.app.client.click(Selectors.SIDECAR_MODE_BUTTON('events'))
        await this.app.client.waitForVisible(Selectors.SIDECAR_MODE_BUTTON_SELECTED('events'))
        await SidecarExpect.toolbarText({ type: 'info', text: 'Events are live streaming', exact: false })
      } catch (err) {
        await Common.oops(this, true)
      }
    })

    const currentEventCount = async (): Promise<number> => {
      const events = await this.app.client.elements(`${Selectors.SIDECAR} .kui--kubectl-event-record`)
      return !events || !events.value ? 0 : events.value.length
    }

    it('should expect at least one event, since we just created the resource', () => {
      return this.app.client
        .waitUntil(async () => {
          return (await currentEventCount()) > 0
        })
        .catch(Common.oops(this, true))
    })

    it('should delete the resource via the terminal and see at least one new event', async () => {
      const eventCountBefore = await currentEventCount()
      await CLI.command(`kubectl delete -f ${file} ${inNamespace}`, this.app)

      await this.app.client.waitUntil(async () => {
        const eventCountAfter = await currentEventCount()
        return eventCountAfter > eventCountBefore
      })
    })

    deleteNS(this, ns)
  })
})
