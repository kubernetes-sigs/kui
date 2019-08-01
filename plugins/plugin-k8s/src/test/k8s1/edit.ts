/*
 * Copyright 2018-19 IBM Corporation
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
import { cli, keys, selectors, sidecar, sleep } from '@kui-shell/core/tests/lib/ui'
import {
  waitForGreen,
  waitForRed,
  defaultModeForGet,
  createNS,
  allocateNS,
  deleteNS,
  waitTillNone
} from '@kui-shell/plugin-k8s/tests/lib/k8s/utils'

const kubectl = 'kubectl'

common.localDescribe('electron kubectl edit', function(this: common.ISuite) {
  before(common.before(this))
  after(common.after(this))

  const ns: string = createNS()
  const inNamespace = `-n ${ns}`

  /** delete the given pod */
  const deleteIt = (name: string, errOk = false) => {
    it(`should delete the pod ${name} via ${kubectl}`, () => {
      return cli
        .do(`${kubectl} delete pod ${name} ${inNamespace}`, this.app)
        .then(cli.expectOKWithCustom({ selector: selectors.BY_NAME(name) }))
        .then(selector => waitForRed(this.app, selector))
        .then(() => waitTillNone('pod', undefined, name, undefined, inNamespace))
        .catch(err => {
          if (!errOk) {
            return common.oops(this)(err)
          }
        })
    })
  }

  const createIt = (name: string) => {
    it(`should create sample pod ${name} from URL via ${kubectl}`, async () => {
      try {
        const selector = await cli
          .do(
            `${kubectl} create -f https://raw.githubusercontent.com/kubernetes/examples/master/staging/pod ${inNamespace}`,
            this.app
          )
          .then(cli.expectOKWithCustom({ selector: selectors.BY_NAME(name) }))

        // wait for the badge to become green
        await waitForGreen(this.app, selector)

        // now click on the table row
        this.app.client.click(`${selector} .clickable`)
        await sidecar
          .expectOpen(this.app)
          .then(sidecar.expectMode(defaultModeForGet))
          .then(sidecar.expectShowing(name))
      } catch (err) {
        common.oops(this)(err)
      }
    })
  }

  const editItWithoutSaving = (name: string, N: number, quit: string) => {
    it(`should edit it via ${kubectl} edit`, async () => {
      const res = cli.do(`${kubectl} edit pod ${name} ${inNamespace}`, this.app)

      const rows = selectors.xtermRows(N)

      // wait for vi to come up
      await this.app.client.waitForExist(rows)

      // hmm.. for some reason we can't type 'wq!' right away
      await sleep(1000)

      // quit without saving
      await this.app.client.keys(quit)
      await this.app.client.keys(keys.ENTER)

      await this.app.client.waitUntil(() => {
        // first false: not exact
        // second false: don't assert, so that we can waitUntil
        return res
          .then(cli.expectOKWithTextContent('cancelled', false, false))
          .then(() => true)
          .catch(() => false)
      })
    })
  }

  //
  // here come the tests
  //
  allocateNS(this, ns)

  const nginx = 'nginx'
  createIt(nginx)
  editItWithoutSaving(nginx, 3, ':wq!')
  editItWithoutSaving(nginx, 4, ':wq')
  deleteIt(nginx)

  deleteNS(this, ns)
})
