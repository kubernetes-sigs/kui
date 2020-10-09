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

import * as assert from 'assert'
import { Application } from 'spectron'

import { Common, CLI, ReplExpect, Selectors, SidecarExpect } from '@kui-shell/test'
import { createNS, allocateNS, deleteNS, waitForGreen, waitForRed } from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

import { readFileSync } from 'fs'
import { dirname, join } from 'path'

const ROOT = dirname(require.resolve('@kui-shell/plugin-kubectl/tests/package.json'))
const inputBuffer = readFileSync(join(ROOT, 'data/k8s/crashy.yaml'))
const inputEncoded = inputBuffer.toString('base64')
const name = 'kui-crashy'

const commands = ['kubectl']
if (process.env.NEEDS_OC) {
  commands.push('oc')
}

const currentEventCount = async (app: Application, outputCount: number): Promise<number> => {
  const events = await app.client.elements(Selectors.TABLE_FOOTER(outputCount))
  const res = !events || !events.value ? 0 : events.value.length
  return res
}

commands.forEach(command => {
  describe(`${command} get pods watch events ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
    before(Common.before(this))
    after(Common.after(this))

    const ns: string = createNS()
    const inNamespace = `-n ${ns}`
    allocateNS(this, ns)

    it(`should create ${name} pod expect string`, () => {
      return CLI.command(`echo ${inputEncoded} | base64 --decode | kubectl create -f - ${inNamespace}`, this.app)
        .then(ReplExpect.okWithPtyOutput(name))
        .catch(Common.oops(this, true))
    })

    it('should open a table watcher and expect at least one event, since we just created the resource', async () => {
      try {
        const res = await CLI.command(`${command} get pods --watch ${inNamespace}`, this.app)
        console.log('wait for pod to come up')
        await ReplExpect.okWithCustom({ selector: Selectors.BY_NAME(name) })(res).then(selector =>
          waitForGreen(this.app, selector)
        )

        console.log('wait for events 1')
        let idx = 0
        await this.app.client.waitUntil(async () => {
          const actualEventCount = await currentEventCount(this.app, res.count)
          if (++idx > 5) {
            console.error('still waiting for events 1')
          }
          console.log('actualEventCount1', actualEventCount)
          return actualEventCount > 0
        }, CLI.waitTimeout)

        console.log('click on event to drill down')
        await this.app.client.click(Selectors.TABLE_FOOTER_MESSAGE_LINK(res.count, 1))
        await SidecarExpect.openInBlockAfter(res).then(SidecarExpect.kind('Event'))
      } catch (err) {
        return Common.oops(this, true)(err)
      }
    })

    it(`should watch with resource name and expect events`, async () => {
      try {
        const res = await CLI.command(`${command} get pods ${name} --watch ${inNamespace}`, this.app)
        console.log('wait for pod to come up')
        await ReplExpect.okWithCustom({ selector: Selectors.BY_NAME(name) })(res).then(selector =>
          waitForGreen(this.app, selector)
        )

        console.log('wait for events 2')
        let idx = 0
        await this.app.client.waitUntil(async () => {
          const actualEventCount = await currentEventCount(this.app, res.count)
          if (++idx > 5) {
            console.error('still waiting for events 2')
          }
          console.log('actualEventCount2', actualEventCount)
          return actualEventCount > 0
        }, CLI.waitTimeout)
      } catch (err) {
        return Common.oops(this, true)(err)
      }
    })

    deleteNS(this, ns)
  })

  // DISABLED: see https://github.com/IBM/kui/issues/5152#issuecomment-692654143
  xdescribe(`${command} create pod watch events ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
    before(Common.before(this))
    after(Common.after(this))

    const ns: string = createNS()
    const inNamespace = `-n ${ns}`
    allocateNS(this, ns)

    it(`should create sample pod from URL via ${command} and expect at least one event, since we just created the resource`, async () => {
      try {
        const createRes = await CLI.command(
          `${command} apply -f https://raw.githubusercontent.com/kubernetes/examples/master/staging/pod ${inNamespace}`,
          this.app
        )

        console.log('wait for creating the pod')
        await ReplExpect.okWithCustom({ selector: Selectors.BY_NAME('nginx') })(createRes).then(selector =>
          waitForGreen(this.app, selector)
        )

        console.log('wait for events 3')
        let idx = 0
        await this.app.client.waitUntil(async () => {
          const actualEventCount = await currentEventCount(this.app, createRes.count)
          if (++idx > 5) {
            console.error('still waiting for some events 3')
          }
          console.log('actualEventCount3', actualEventCount)
          return actualEventCount > 0
        }, CLI.waitTimeout)
        const eventsBeforeDelete = await this.app.client.getText(Selectors.TABLE_FOOTER(createRes.count))

        console.log('wait for deleting the pod')
        const deletion = await CLI.command(`${command} delete pods nginx ${inNamespace}`, this.app)
        const deletionSelector = await ReplExpect.okWithCustom({ selector: Selectors.BY_NAME('nginx') })(deletion)
        await waitForRed(this.app, deletionSelector)

        // the events in the first table shouldn't be affected since that crud-watcher was done
        const eventsAfterDelete = await this.app.client.getText(Selectors.TABLE_FOOTER(createRes.count))
        if (Array.isArray(eventsAfterDelete)) {
          eventsAfterDelete.forEach((event, idx) => assert.ok(event === eventsBeforeDelete[idx]))
        } else {
          assert.ok(eventsAfterDelete === eventsBeforeDelete)
        }
      } catch (err) {
        await Common.oops(this, true)(err)
      }
    })

    deleteNS(this, ns)
  })
})
