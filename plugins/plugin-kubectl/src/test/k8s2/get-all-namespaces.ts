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

import { Common, CLI, ReplExpect, SidecarExpect, Selectors } from '@kui-shell/test'
import {
  waitForGreen,
  waitForRed,
  defaultModeForGet,
  createNS as create,
  waitTillNone
} from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

const synonyms = ['kubectl']

describe(`kubectl get all-namespaces ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  synonyms.forEach(kubectl => {
    /** create the given namespace */
    const createNs = (name: string) => {
      it(`should create namespace ${name} via ${kubectl}`, () => {
        return CLI.command(`${kubectl} create namespace ${name}`, this.app)
          .then(ReplExpect.okWithCustom({ selector: Selectors.BY_NAME(name) }))
          .then(selector => waitForGreen(this.app, selector))
          .catch(Common.oops(this, true))
      })
    }

    /** create pod in the given namespace */
    const createPod = (ns: string) => {
      it(`should create sample pod in namespace ${ns} from URL via ${kubectl}`, () => {
        return CLI.command(
          `${kubectl} create -f https://raw.githubusercontent.com/kubernetes/examples/master/staging/pod -n ${ns}`,
          this.app
        )
          .then(ReplExpect.okWithCustom({ selector: Selectors.BY_NAME('nginx') }))
          .then(selector => waitForGreen(this.app, selector))
          .catch(Common.oops(this, true))
      })
    }

    /** list pods across all namespaces, then find the pod corresponding to the given namespace `ns` */
    const listAndClickOn = (ns: string) => {
      it(`should list pods --all-namespaces expecting ns ${ns} via ${kubectl} then click`, async () => {
        try {
          const selector = await CLI.command(`${kubectl} get pods --all-namespaces`, this.app).then(
            ReplExpect.okWithCustom({ selector: Selectors.BY_NAME(ns) })
          )

          // wait for the badge to become green
          await waitForGreen(this.app, selector)

          // make sure the NAME cell is clickable (as opposed to, say, the NAMESPACE cell)
          await this.app.client.waitForExist(`${selector} .clickable[data-key="NAME"]`)

          // now click on that cell
          await this.app.client.click(`${selector} .clickable`)
          await SidecarExpect.open(this.app)
            .then(SidecarExpect.mode(defaultModeForGet))
            .then(SidecarExpect.showing('nginx', undefined, undefined, ns))
        } catch (err) {
          return Common.oops(this, true)(err)
        }
      })
    }

    /** delete the given namespace */
    const deleteNs = (name: string) => {
      it(`should delete the namespace ${name} via ${kubectl}`, () => {
        return CLI.command(`${kubectl} delete namespace ${name}`, this.app)
          .then(ReplExpect.okWithCustom({ selector: Selectors.BY_NAME(name) }))
          .then(selector => waitForRed(this.app, selector))
          .then(() => waitTillNone('namespace', undefined, name))
          .catch(Common.oops(this, true))
      })
    }

    /** delete the pod in the given namespace `ns` */
    const deletePod = (ns: string) => {
      it(`should delete the pod in ns ${ns} by name via ${kubectl}`, () => {
        return CLI.command(`${kubectl} delete pod nginx -n ${ns}`, this.app)
          .then(ReplExpect.okWithCustom({ selector: Selectors.BY_NAME('nginx') }))
          .then(selector => waitForRed(this.app, selector))
          .catch(Common.oops(this, true))
      })
    }

    //
    // here start the tests
    //
    const ns1: string = create()
    const ns2: string = create()

    createNs(ns1)
    createNs(ns2)

    createPod(ns1)
    createPod(ns2)

    listAndClickOn(ns1)
    listAndClickOn(ns2)

    deletePod(ns1)
    deletePod(ns2)

    deleteNs(ns1)
    deleteNs(ns2)
  })
})
