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
import { cli, keys, selectors, sidecar, sleep, getTextContent } from '@kui-shell/core/tests/lib/ui'
import {
  waitForGreen,
  waitForRed,
  defaultModeForGet,
  createNS,
  allocateNS,
  deleteNS,
  typeSlowly,
  waitTillNone
} from '@kui-shell/plugin-k8s/tests/lib/k8s/utils'

const kubectl = 'kubectl'

describe(`kubectl edit ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: common.ISuite) {
  before(common.before(this))
  after(common.after(this))

  const ns: string = createNS()
  const inNamespace = `-n ${ns}`

  /** delete the given pod */
  const deleteIt = (name: string) => {
    it(`should delete the pod ${name} via ${kubectl}`, () => {
      return cli
        .do(`${kubectl} delete pod ${name} ${inNamespace}`, this.app)
        .then(cli.expectOKWithCustom({ selector: selectors.BY_NAME(name) }))
        .then(selector => waitForRed(this.app, selector))
        .then(() => waitTillNone('pod', undefined, name, undefined, inNamespace))
        .catch(common.oops(this, true))
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
      } catch (err) {
        await common.oops(this, true)(err)
      }
    })
  }

  const editItWithoutSaving = (name: string, quit: string) => {
    it(`should edit it via ${kubectl} edit`, async () => {
      try {
        const res = await cli.do(`${kubectl} edit pod ${name} ${inNamespace}`, this.app)

        const rows = selectors.xtermRows(res.count)

        // wait for vi to come up
        await this.app.client.waitForExist(rows)

        // wait for vi to come up in alt buffer mode
        await this.app.client.waitForExist(`tab.visible.xterm-alt-buffer-mode`)

        // wait for apiVersion: v<something> to show up in the pty
        await this.app.client.waitUntil(async () => {
          const txt = await getTextContent(this.app, rows)
          return /apiVersion: v/.test(txt)
        })

        // quit without saving
        await typeSlowly(this.app, `${quit}${keys.ENTER}`)

        await this.app.client.waitUntil(() => {
          // first false: not exact
          // second false: don't assert, so that we can waitUntil
          return Promise.resolve(res)
            .then(cli.expectOKWithTextContent('cancelled', false, false))
            .then(() => true)
            .catch(() => false)
        })
      } catch (err) {
        await common.oops(this, true)(err)
      }
    })
  }

  //
  // here come the tests
  //
  allocateNS(this, ns)

  const nginx = 'nginx'
  createIt(nginx)
  editItWithoutSaving(nginx, ':wq!')
  editItWithoutSaving(nginx, ':wq')

  deleteNS(this, ns)
})
