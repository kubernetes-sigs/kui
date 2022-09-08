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
import { createNS, allocateNS, deleteNS } from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

import { readFileSync } from 'fs'
import { dirname, join } from 'path'
const ROOT = dirname(require.resolve('@kui-shell/plugin-kubectl/tests/package.json'))
const inputBuffer = readFileSync(join(ROOT, 'data/k8s/event-generator.yaml'))
const inputEncoded = inputBuffer.toString('base64')

const wdescribe = !process.env.USE_WATCH_PANE ? describe : xdescribe

const podName = 'eventgen'

const commands = ['kubectl']
if (process.env.NEEDS_OC) {
  commands.push('oc')
}

commands.forEach(command => {
  wdescribe(`${command} get events via table ${process.env.MOCHA_RUN_TARGET || ''}`, function (this: Common.ISuite) {
    before(Common.before(this))
    after(Common.after(this))

    const ns: string = createNS()
    allocateNS(this, ns)

    /** error handling starts */
    it('should create pod that generates events', () =>
      CLI.command(`echo ${inputEncoded} | base64 --decode | ${command} create -f - -n ${ns}`, this.app)
        .then(ReplExpect.okWithPtyOutput(podName))
        .catch(Common.oops(this, true)))

    it('should click on Show Involved Object', async () => {
      try {
        const res = await CLI.command(`k get events -o wide -n ${ns}`, this.app)
        const table = `${Selectors.OUTPUT_N(res.count)} table`
        const clickOn = `${table} tr:first-child .clickable`
        const resAfter = await Util.openSidecarByClick(this, clickOn, podName)

        // click the involvedObject button
        await Util.clickSidecarModeButton(this, resAfter, 'involvedObject')

        await SidecarExpect.openInBlockAfter(resAfter)
          .then(SidecarExpect.showing(podName))
          .then(SidecarExpect.kind('Pod'))
      } catch (err) {
        await Common.oops(this, true)(err)
      }
    })

    deleteNS(this, ns)
  })
})
