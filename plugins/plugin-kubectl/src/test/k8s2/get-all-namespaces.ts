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

import { Common, CLI, ReplExpect, Selectors, Util } from '@kui-shell/test'
import {
  remotePodYaml,
  waitForGreen,
  waitForRed,
  defaultModeForGet,
  createNS as create,
  waitTillNone
} from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

import * as assert from 'assert'

const synonyms = ['kubectl']

describe(`kubectl get all-namespaces ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  synonyms.forEach(kubectl => {
    /** create the given namespace */
    const createNs = (name: string) => {
      it(`should create namespace ${name} via ${kubectl}`, () => {
        return CLI.command(`${kubectl} create namespace ${name}`, this.app)
          .then(
            ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME(name) })
          )
          .then(selector => waitForGreen(this.app, selector))
          .catch(Common.oops(this, true))
      })
    }

    /** create pod in the given namespace */
    const createPod = (ns: string) => {
      it(`should create sample pod in namespace ${ns} from URL via ${kubectl}`, () => {
        return CLI.command(`${kubectl} create -f ${remotePodYaml} -n ${ns}`, this.app)
          .then(
            ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME('nginx') })
          )
          .then(selector => waitForGreen(this.app, selector))
          .catch(Common.oops(this, true))
      })
    }

    /** list pods across all namespaces, then find the pod corresponding to the given namespace `ns` */
    const listAndClickOn = (ns: string) => {
      const allNamespaces = ['--all-namespaces', '-A']

      allNamespaces.forEach(allNamespace => {
        it(`should list pods ${allNamespace} expecting ns ${ns} via ${kubectl} then click`, async () => {
          try {
            const res = await CLI.command(`${kubectl} get pods ${allNamespace}`, this.app)
            const { app, count } = res

            const asListButton = await this.app.client.$(Selectors.TABLE_SHOW_AS_LIST(count))
            await asListButton.waitForExist({ timeout: CLI.waitTimeout })
            await asListButton.scrollIntoView()
            await asListButton.click()

            await this.app.client.$(Selectors.TABLE_TITLE(count)).then(_ => _.waitForExist())

            const actualTitle = await this.app.client.$(Selectors.TABLE_TITLE(count)).then(_ => _.getText())
            assert.strictEqual(actualTitle, 'Pod')

            const secondaryTitle = await this.app.client
              .$(Selectors.TABLE_TITLE_SECONDARY(count))
              .then(_ => _.getText())
            assert.strictEqual(secondaryTitle, 'all')

            const selector = await ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME(ns) })({ app, count })

            // wait for the badge to become green
            await waitForGreen(this.app, selector)
            // make sure the NAME cell is clickable (as opposed to, say, the NAMESPACE cell)
            const clickOn = `${selector} .clickable[data-key="NAME"]`
            await Util.openSidecarByClick(this, clickOn, 'nginx', defaultModeForGet)
          } catch (err) {
            return Common.oops(this, true)(err)
          }
        })
      })
    }

    /** delete the given namespace */
    const deleteNs = (name: string) => {
      it(`should delete the namespace ${name} via ${kubectl}`, () => {
        return CLI.command(`${kubectl} delete namespace ${name}`, this.app)
          .then(
            ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME(name) })
          )
          .then(selector => waitForRed(this.app, selector))
          .then(() => waitTillNone('namespace', undefined, name))
          .catch(Common.oops(this, true))
      })
    }

    /** delete the pod in the given namespace `ns` */
    const deletePod = (ns: string) => {
      it(`should delete the pod in ns ${ns} by name via ${kubectl}`, () => {
        return CLI.command(`${kubectl} delete pod nginx -n ${ns}`, this.app)
          .then(
            ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME('nginx') })
          )
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
