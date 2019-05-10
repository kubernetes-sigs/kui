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

import * as common from '@kui-shell/core/tests/lib/common'
import { cli, expectYAMLSubset, expectSubset, selectors, sidecar } from '@kui-shell/core/tests/lib/ui'
import { waitTillNone } from '@kui-shell/plugin-k8s/tests/lib/k8s/wipe'
import { defaultModeForGet, createNS } from '@kui-shell/plugin-k8s/tests/lib/k8s/utils'

const ns1: string = createNS()
const ns2: string = createNS()
const synonyms = ['kubectl']

describe('electron namespace', function (this: common.ISuite) {
  before(common.before(this))
  after(common.after(this))

  synonyms.forEach(kubectl => {
    /** return the editor text */
    const getText = () => {
      return this.app.client.execute(() => {
        return document.querySelector('.monaco-editor-wrapper')['editor'].getValue()
      }).then(res => res.value)
    }

    /** expect to see some familiar bits of a pod in the editor under the raw tab */
    const expectEditorText = () => {
      return this.app.client.waitUntil(async () => {
        const ok: boolean = await getText()
          .then(expectYAMLSubset({
            Status: 'Active'
          }, false))

        return ok
      })
    }

    /** delete the given namespace */
    const deleteIt = (name: string, errOk = false) => {
      it(`should delete the namespace ${name} via ${kubectl}`, () => {
        return cli.do(`${kubectl} delete namespace ${name}`, this.app)
          .then(cli.expectOKWithCustom({ selector: selectors.BY_NAME(name) }))
          .then(selector => this.app.client.waitForExist(`${selector} badge.red-background`))
          .then(() => waitTillNone('namespace', undefined, name))
          .catch(err => {
            if (!errOk) {
              return common.oops(this)(err)
            }
          })
      })
    }

    /** create the given namespace */
    const createIt = (name: string) => {
      it(`should create namespace ${name} via ${kubectl}`, () => {
        return cli.do(`${kubectl} create namespace ${name}`, this.app)
          .then(cli.expectOKWithCustom({ selector: selectors.BY_NAME(name) }))
          .then(selector => this.app.client.waitForExist(`${selector} badge.green-background`))
          .catch(common.oops(this))
      })
    }

    /** kubectl descsribe namespace <name> */
    const describeIt = (name: string) => {
      it(`should describe that namespace ${name} via ${kubectl}`, () => {
        return cli.do(`${kubectl} describe namespace ${name}`, this.app)
          .then(cli.expectJustOK)
          .then(sidecar.expectOpen)
          .then(sidecar.expectShowing(name))
          .then(sidecar.expectMode(defaultModeForGet))
          .then(expectEditorText)
          .catch(common.oops(this))
      })
    }

    /** kubectl get namespace */
    const listIt = (name: string) => {
      it(`should list that namespace ${name} via ${kubectl}`, async () => {
        try {
          const selector = await cli.do(`${kubectl} get namespace`, this.app)
            .then(cli.expectOKWithCustom({ selector: selectors.BY_NAME(name) }))

          // wait for the badge to become green
          await this.app.client.waitForExist(`${selector} badge.green-background`)

          // now click on the table row
          this.app.client.click(`${selector} .clickable`)
          await sidecar.expectOpen(this.app)
            .then(sidecar.expectMode(defaultModeForGet))
            .then(sidecar.expectShowing(name))
            .then(expectEditorText)
        } catch (err) {
          common.oops(this)(err)
        }
      })
    }

    /** create a pod in the given namespace */
    const createPod = (ns: string) => {
      it(`should create sample pod in namespace ${ns} from URL via ${kubectl}`, () => {
        return cli.do(`${kubectl} create -f https://raw.githubusercontent.com/kubernetes/examples/master/staging/pod -n ${ns}`, this.app)
          .then(cli.expectOKWithCustom({ selector: selectors.BY_NAME('nginx') }))
          .then(selector => this.app.client.waitForExist(`${selector} badge.green-background`))
          .catch(common.oops(this))
      })

      it(`should show the sample pod in namespace ${ns} in sidecar via ${kubectl}`, () => {
        return cli.do(`${kubectl} get pod nginx -n ${ns} -o yaml`, this.app)
          .then(cli.expectJustOK)
          .then(sidecar.expectOpen)
          .then(sidecar.expectShowing('nginx', undefined, undefined, ns))
          .then(() => this.app.client.click(selectors.SIDECAR_MODE_BUTTON('status')))
          .then(() => `${selectors.SIDECAR} .result-table .entity[data-name="nginx"] badge.green-background`)
          .then(selector => this.app.client.waitForExist(selector))
          .catch(common.oops(this))
      })
    }

    //
    // now start the tests
    //
    createIt(ns1)
    describeIt(ns1)
    createIt(ns2)
    describeIt(ns2)
    createPod(ns1)
    createPod(ns2)
    deleteIt(ns1)
    deleteIt(ns2)
  })
})
