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

import { Common, CLI, ReplExpect, SidecarExpect, Selectors, Util } from '@kui-shell/test'
import {
  remotePodYaml,
  waitForGreen,
  createNS,
  allocateNS,
  deleteNS
} from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

const commands = ['kubectl']
if (process.env.NEEDS_OC) {
  commands.push('oc')
}

/** source yaml for creating our pod */
const yaml = remotePodYaml

/** the yaml file is expected to create a pod with this name */
const podName = 'nginx'

commands.forEach(command => {
  describe(`${command} get pod multi-tab ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
    before(Common.before(this))
    after(Common.after(this))
    Util.closeAllExceptFirstTab.bind(this)()

    /** create pod in the given namespace */
    const createPod = (ns: string) => {
      it(`should create sample pod from URL via ${command} in namespace ${ns}`, () => {
        return CLI.command(`${command} create -f ${yaml} -n ${ns}`, this.app)
          .then(
            ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME(podName) })
          )
          .then(selector => waitForGreen(this.app, selector))
          .catch(Common.oops(this, true))
      })
    }

    /** get pod in the given namespace */
    const getPod = (ns: string, gotRes: (res: ReplExpect.AppAndCount) => void) => {
      it(`should get pod in namespace ${ns} via ${command}`, async () => {
        try {
          const res = await CLI.command(`${command} get pod ${podName} -n ${ns} -o yaml`, this.app)
            .then(ReplExpect.ok)
            .then(SidecarExpect.open)
            .then(SidecarExpect.showing(podName, undefined, undefined, ns))
          gotRes(res)
        } catch (err) {
          await Common.oops(this, true)(err)
        }
      })
    }

    /** create new Tab */
    const newTab = (expectedIdx: number) => {
      it('new tab via command', () =>
        CLI.command('tab new', this.app)
          .then(() => this.app.client.$(Selectors.TAB_SELECTED_N(expectedIdx)))
          .then(_ => _.waitForDisplayed())
          .then(() => CLI.waitForSession(this)) // should have an active repl
          .catch(Common.oops(this, true)))
    }

    /** switch to the given Tab */
    const switchToTab = (idx: number) => {
      it(`switch to tab ${idx}`, () =>
        CLI.command(`tab switch ${idx}`, this.app)
          .then(() => this.app.client.$(Selectors.TAB_SELECTED_N(idx)))
          .then(_ => _.waitForDisplayed())
          .catch(Common.oops(this, true)))
    }

    /** expect sidecar to be showing pod in the given namespace */
    const expectShowing = (res: () => ReplExpect.AppAndCount, ns: string) => {
      it(`should be showing pod in namespace ${ns} in the sidecar`, () => {
        return SidecarExpect.showing(podName, undefined, undefined, ns)(res())
      })
    }

    // here is the test script:
    const ns1 = createNS()
    allocateNS(this, ns1)

    const ns2 = createNS()
    allocateNS(this, ns2)

    createPod(ns1)
    createPod(ns2)

    it('should refresh', () => Common.refresh(this))
    Util.closeAllExceptFirstTab.bind(this)(1)

    let res1: ReplExpect.AppAndCount
    let res2: ReplExpect.AppAndCount

    getPod(ns1, (res: ReplExpect.AppAndCount) => (res1 = res))
    newTab(2) // <-- expect the new tab to be the second tab
    getPod(ns2, (res: ReplExpect.AppAndCount) => (res2 = res))
    switchToTab(1)
    expectShowing(() => res1, ns1)
    switchToTab(2)
    expectShowing(() => res2, ns2)

    deleteNS(this, [ns1, ns2])
  })
})
