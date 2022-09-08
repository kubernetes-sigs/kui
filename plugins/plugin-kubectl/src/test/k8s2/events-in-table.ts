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

import { Common, CLI, ReplExpect, Selectors, SidecarExpect } from '@kui-shell/test'
import { createNS, allocateNS, deleteNS, waitForGreen } from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

import { readFileSync } from 'fs'
import { dirname, join } from 'path'

const ROOT = dirname(require.resolve('@kui-shell/plugin-kubectl/tests/package.json'))
const inputBuffer = readFileSync(join(ROOT, 'data/k8s/headless/pod.yaml'))
const inputEncoded = inputBuffer.toString('base64')
const name = 'nginx'

const commands = ['kubectl']
if (process.env.NEEDS_OC) {
  commands.push('oc')
}

commands.forEach(command => {
  describe(`${command} get pods watch events ${process.env.MOCHA_RUN_TARGET || ''}`, function (this: Common.ISuite) {
    before(Common.before(this))
    after(Common.after(this))

    const ns: string = createNS()
    const inNamespace = `-n ${ns}`
    let watchEventsRes: ReplExpect.AppAndCount

    allocateNS(this, ns)

    it(`should watch for events and expect empty via ${command}`, () => {
      return CLI.command(`${command} get events -w ${inNamespace}`, this.app)
        .then(ReplExpect.ok)
        .then(res => {
          watchEventsRes = res
          return res
        })
        .catch(Common.oops(this, true))
    })

    it(`should create ${name} pod expect string`, () => {
      return CLI.command(`echo ${inputEncoded} | base64 --decode | kubectl create -f - ${inNamespace}`, this.app)
        .then(ReplExpect.okWithPtyOutput(name))
        .catch(Common.oops(this, true))
    })

    it(`should open a events watcher and expect at least one event, since we just created the resource`, async () => {
      try {
        await ReplExpect.okWithCustom({ selector: Selectors.TABLE_CELL(`pod/${name}`, 'OBJECT') })(watchEventsRes)
      } catch (err) {
        return Common.oops(this, true)(err)
      }
    })

    let watchPodRes1: ReplExpect.AppAndCount
    it(`should open a pods watcher via ${command}`, async () => {
      try {
        watchPodRes1 = await CLI.command(`${command} get pods --watch ${inNamespace}`, this.app)
        await ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME(name) })(watchPodRes1).then(selector =>
          waitForGreen(this.app, selector)
        )
      } catch (err) {
        return Common.oops(this, true)(err)
      }
    })

    it(`should expect at least one event in pod watcher, since we just created the resource`, async () => {
      try {
        await ReplExpect.okWithEvents(this, watchPodRes1)
      } catch (err) {
        return Common.oops(this, true)(err)
      }
    })

    it(`should drilldown the event footer in the pod watcher and expect sidecar open`, async () => {
      try {
        await this.app.client.$(Selectors.TABLE_FOOTER_MESSAGE_LINK(watchPodRes1.count, 1)).then(_ => _.click())
        await SidecarExpect.openInBlockAfter(watchPodRes1).then(SidecarExpect.kind('Event'))
      } catch (err) {
        return Common.oops(this, true)(err)
      }
    })

    let watchPodRes2: ReplExpect.AppAndCount
    it(`should watch with pod name`, async () => {
      try {
        watchPodRes2 = await CLI.command(`${command} get pods ${name} --watch ${inNamespace}`, this.app)
        await ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME(name) })(watchPodRes2).then(selector =>
          waitForGreen(this.app, selector)
        )
      } catch (err) {
        return Common.oops(this, true)(err)
      }
    })

    it(`should expect at least one event in pod watcher 2, since we just created the resource`, async () => {
      try {
        await ReplExpect.okWithEvents(this, watchPodRes2)
      } catch (err) {
        return Common.oops(this, true)(err)
      }
    })

    deleteNS(this, ns)
  })
})
