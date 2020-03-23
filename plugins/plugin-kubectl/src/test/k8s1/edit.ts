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

import { Common, CLI, Keys, ReplExpect, Selectors } from '@kui-shell/test'
import { waitForGreen, createNS, allocateNS, deleteNS, typeSlowly } from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

const commands = ['kubectl']
if (process.env.NEEDS_OC) {
  commands.push('oc')
}

commands.forEach(command => {
  describe(`${command} edit ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
    before(Common.before(this))
    after(Common.after(this))

    const ns: string = createNS()
    const inNamespace = `-n ${ns}`

    const createIt = (name: string) => {
      it(`should create sample pod ${name} from URL via ${command}`, async () => {
        try {
          const selector = await CLI.command(
            `${command} create -f https://raw.githubusercontent.com/kubernetes/examples/master/staging/pod ${inNamespace}`,
            this.app
          ).then(ReplExpect.okWithCustom({ selector: Selectors.BY_NAME(name) }))

          // wait for the badge to become green
          await waitForGreen(this.app, selector)
        } catch (err) {
          await Common.oops(this, true)(err)
        }
      })
    }

    const editIt = (name: string, quit: string) => {
      it(`should edit it via ${command} edit, and using ${quit} to quit`, async () => {
        try {
          const res = await CLI.command(`${command} edit pod ${name} ${inNamespace}`, this.app)

          const rows = Selectors.xtermRows(res.count)

          // wait for vi to come up
          await this.app.client.waitForExist(rows)

          // wait for vi to come up in alt buffer mode
          await this.app.client.waitForExist(`${Selectors.CURRENT_TAB}.xterm-alt-buffer-mode`)

          // wait for apiVersion: v<something> to show up in the pty
          await this.app.client.waitUntil(async () => {
            try {
              const txt = await CLI.getTextContent(this.app, rows)
              return /apiVersion: v/.test(txt)
            } catch (err) {
              console.error(err)
              return false
            }
          })

          await this.app.client.waitUntil(async () => {
            // quit without saving
            await this.app.client.keys(Keys.ESCAPE)
            await typeSlowly(this.app, `${quit}${Keys.ENTER}`)

            // first false: not exact
            // second false: don't assert, so that we can waitUntil
            return Promise.resolve(res)
              .then(ReplExpect.okWithTextContent('cancelled', false, false))
              .then(() => true)
              .catch(() => false)
          })
        } catch (err) {
          await Common.oops(this, true)(err)
        }
      })
    }

    //
    // here come the tests
    //
    allocateNS(this, ns)

    const nginx = 'nginx'
    createIt(nginx)
    editIt(nginx, ':wq!')
    editIt(nginx, ':wq')

    deleteNS(this, ns)
  })
})
