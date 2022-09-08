/*
 * Copyright 2020 The Kubernetes Authors
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

import { Common, CLI, ReplExpect, Selectors, Util } from '@kui-shell/test'
import {
  remotePodYaml,
  createNS,
  allocateNS,
  deleteNS,
  openSidecarByList
} from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

const commands = ['kubectl']
if (process.env.NEEDS_OC) {
  commands.push('oc')
}

const file = remotePodYaml
const name = 'nginx'

commands.forEach(command => {
  describe(`kubectl Events Sidecar button ${process.env.MOCHA_RUN_TARGET || ''}`, function (this: Common.ISuite) {
    before(Common.before(this))
    after(Common.after(this))

    const ns: string = createNS()
    const inNamespace = `-n ${ns}`
    allocateNS(this, ns)

    let res: ReplExpect.AppAndCount
    let watchEventsRes: ReplExpect.AppAndCount
    it('should create sample pod from URL', async () => {
      try {
        res = await openSidecarByList(this, `${command} create -f ${file} ${inNamespace}`, name)
      } catch (err) {
        await Common.oops(this, true)(err)
      }
    })

    it('should click the show events button and expect an events table', async () => {
      try {
        await Util.clickSidecarModeButton(this, res, 'events')
        watchEventsRes = ReplExpect.blockAfter(res)
        await ReplExpect.okWithCustom({ selector: Selectors.TABLE_CELL(`pod/${name}`, 'OBJECT') })(watchEventsRes)
      } catch (err) {
        await Common.oops(this, true)(err)
      }
    })

    const currentEventCount = async (): Promise<number> => {
      const events = await this.app.client.$$(
        `${Selectors.OUTPUT_N(watchEventsRes.count, watchEventsRes.splitIndex)} ${Selectors.TABLE_CELL(
          `pod/${name}`,
          'OBJECT'
        )}`
      )
      return !events ? 0 : events.length
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
