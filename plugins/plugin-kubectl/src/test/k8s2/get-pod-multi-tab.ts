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

import { Common, CLI, ReplExpect, SidecarExpect, Selectors } from '@kui-shell/test'
import { waitForGreen, createNS, allocateNS, deleteNS } from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

const commands = ['kubectl']
if (process.env.NEEDS_OC) {
  commands.push('oc')
}

/** source yaml for creating our pod */
const yaml = 'https://raw.githubusercontent.com/kubernetes/examples/master/staging/pod'

/** the yaml file is expected to create a pod with this name */
const podName = 'nginx'

commands.forEach(command => {
  describe(`${command} get pod multi-tab ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
    before(Common.before(this))
    after(Common.after(this))

    /** create pod in the given namespace */
    const createPod = (ns: string) => {
      it(`should create sample pod from URL via ${command} in namespace ${ns}`, () => {
        return CLI.command(`${command} create -f ${yaml} -n ${ns}`, this.app)
          .then(ReplExpect.okWithCustom({ selector: Selectors.BY_NAME(podName) }))
          .then((selector: string) => waitForGreen(this.app, selector))
          .catch(Common.oops(this, true))
      })
    }

    /** get pod in the given namespace */
    const getPod = (ns: string) => {
      it(`should get pod in namespace ${ns} via ${command}`, () => {
        return CLI.command(`${command} get pod ${podName} -n ${ns} -o yaml`, this.app)
          .then(ReplExpect.justOK)
          .then(SidecarExpect.open)
          .then(SidecarExpect.showing(podName, undefined, undefined, ns))
          .catch(Common.oops(this, true))
      })
    }

    /** create new Tab */
    const newTab = (expectedIdx: number) => {
      it('new tab via command', () =>
        CLI.command('tab new', this.app)
          .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(expectedIdx)))
          .then(() => CLI.waitForSession(this)) // should have an active repl
          .catch(Common.oops(this, true)))
    }

    /** switch to the given Tab */
    const switchToTab = (idx: number) => {
      it(`switch to tab ${idx}`, () =>
        CLI.command(`tab switch ${idx}`, this.app)
          .then(() => this.app.client.waitForVisible(Selectors.TAB_SELECTED_N(idx)))
          .catch(Common.oops(this, true)))
    }

    /** expect sidecar to be showing pod in the given namespace */
    const expectShowing = (ns: string) => {
      it(`should be showing pod in namespace ${ns} in the sidecar`, () => {
        return SidecarExpect.showing(podName, undefined, undefined, ns)(this.app)
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

    getPod(ns1)
    newTab(2) // <-- expect the new tab to be the second tab
    getPod(ns2)
    switchToTab(1)
    expectShowing(ns1)
    switchToTab(2)
    expectShowing(ns2)

    deleteNS(this, ns1)
    deleteNS(this, ns2)
  })
})
