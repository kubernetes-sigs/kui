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

import { Common, CLI, ReplExpect, SidecarExpect, Selectors, Keys, Util } from '@kui-shell/test'
import {
  waitForGreen,
  createNS,
  allocateNS,
  deleteNS,
  defaultModeForGet
} from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

import { dirname } from 'path'
const ROOT = dirname(require.resolve('@kui-shell/plugin-kubectl/tests/package.json'))

const commands = ['kubectl']

commands.forEach(command => {
  describe(`${command} edit ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
    before(Common.before(this))
    after(Common.after(this))

    const ns: string = createNS()
    const inNamespace = `-n ${ns}`

    const create = (name: string, source = 'pod.yaml') => {
      it(`should create sample pod ${name} from URL via ${command}`, async () => {
        try {
          const selector = await CLI.command(
            `${command} create -f ${ROOT}/data/k8s/headless/${source} ${inNamespace}`,
            this.app
          ).then(ReplExpect.okWithCustom({ selector: Selectors.BY_NAME(name) }))

          // wait for the badge to become green
          await waitForGreen(this.app, selector)
        } catch (err) {
          await Common.oops(this, true)(err)
        }
      })
    }

    const edit = (name: string, kind = 'Pod', nameAsShown = name) => {
      it(`should edit it via ${command} edit with name=${name || 'no-name'}`, async () => {
        try {
          await CLI.command(`${command} edit pod ${name || ''} ${inNamespace}`, this.app)
            .then(ReplExpect.justOK)
            .then(SidecarExpect.open)
            .then(SidecarExpect.showing(nameAsShown, undefined, undefined, ns))
            .then(SidecarExpect.mode('edit'))
            .then(
              SidecarExpect.yaml({
                kind
              })
            )
        } catch (err) {
          await Common.oops(this, true)(err)
        }
      })
    }

    const cancel = (name: string) => {
      it('should cancel edit session', async () => {
        try {
          await this.app.client.click(Selectors.SIDECAR_MODE_BUTTON('cancel'))
          await SidecarExpect.open(this.app)
            .then(SidecarExpect.showing(name, undefined, undefined, ns))
            .then(SidecarExpect.mode(defaultModeForGet))
            .catch(Common.oops(this, true))
        } catch (err) {
          await Common.oops(this, true)(err)
        }
      })
    }

    const modify = (name: string) => {
      it('should modify the content', async () => {
        try {
          const actualText = await Util.getValueFromMonaco(this.app)
          const labelsLineIdx = actualText.split(/\n/).indexOf('  labels:')

          // +2 here because nth-child is indexed from 1, and we want the line after that
          const lineSelector = `.view-lines > .view-line:nth-child(${labelsLineIdx + 2}) .mtk5:last-child`
          await this.app.client.click(lineSelector)

          await new Promise(resolve => setTimeout(resolve, 2000))
          await this.app.client.keys(`${Keys.End}${Keys.ENTER}foo: bar${Keys.ENTER}`)
          await new Promise(resolve => setTimeout(resolve, 2000))
          await this.app.client.click(Selectors.SIDECAR_MODE_BUTTON('Save'))
          await this.app.client.waitForVisible(Selectors.SIDECAR_MODE_BUTTON('Save'), 10000, true)
        } catch (err) {
          await Common.oops(this, true)(err)
        }
      })

      cancel(name)

      it('should switch to yaml tab', async () => {
        try {
          await this.app.client.waitForVisible(Selectors.SIDECAR_MODE_BUTTON('raw'))
          await this.app.client.click(Selectors.SIDECAR_MODE_BUTTON('raw'))
          await this.app.client.waitForVisible(Selectors.SIDECAR_MODE_BUTTON_SELECTED('raw'))
        } catch (err) {
          await Common.oops(this, true)(err)
        }
      })

      it('should show the modified content', () => {
        return SidecarExpect.yaml({ metadata: { labels: { foo: 'bar' } } })(this.app).catch(Common.oops(this, true))
      })
    }

    //
    // here come the tests
    //
    allocateNS(this, ns)

    const nginx = 'nginx'
    create(nginx)

    const name2 = 'nginx2'
    create(name2, 'pod2.yaml')
    edit('', 'List', '2 items')

    edit(nginx)
    cancel(nginx)

    edit(nginx)
    modify(nginx)

    deleteNS(this, ns)
  })
})
