/*
 * Copyright 2018 The Kubernetes Authors
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
  remotePodYaml,
  waitForGreen,
  waitForRed,
  openSidecarByList,
  createNS,
  allocateNS,
  deleteNS
} from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

import { dirname } from 'path'
const ROOT = dirname(require.resolve('@kui-shell/plugin-kubectl/tests/package.json'))

const commands = ['kubectl']
if (process.env.NEEDS_OC) {
  commands.push('oc')
}
const dashFs = ['-f', '--filename']

commands.forEach(command => {
  describe(`${command} create pod ${process.env.MOCHA_RUN_TARGET || ''}`, function (this: Common.ISuite) {
    before(Common.before(this))
    after(Common.after(this))

    dashFs.forEach(dashF => {
      const ns: string = createNS()
      const inNamespace = `-n ${ns}`

      allocateNS(this, ns, command)

      it(`should create sample pod from URL via ${command}`, async () => {
        try {
          const resAfter = await openSidecarByList(
            this,
            `${command} create ${dashF} ${remotePodYaml} ${inNamespace}`,
            'nginx'
          ).then(SidecarExpect.button({ mode: 'show-node', label: 'Show Node' }))

          // click on Show Node button
          await this.app.client
            .$(Selectors.SIDECAR_MODE_BUTTON(resAfter.count, 'show-node', resAfter.splitIndex))
            .then(_ => _.click())

          await SidecarExpect.open(ReplExpect.blockAfter(resAfter)).then(SidecarExpect.kind('Node'))
        } catch (err) {
          await Common.oops(this, true)(err)
        }
      })

      it(`should delete the sample pod from URL via ${command}`, () => {
        return CLI.command(`${command} delete ${dashF} ${remotePodYaml} ${inNamespace}`, this.app)
          .then(ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME('nginx') }))
          .then(selector => waitForRed(this.app, selector))
          .catch(Common.oops(this))
      })

      it(`should create sample pod from local file via ${command}`, () => {
        return CLI.command(`${command} create ${dashF} "${ROOT}/data/k8s/headless/pod.yaml" ${inNamespace}`, this.app)
          .then(ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME('nginx') }))
          .then(selector => waitForGreen(this.app, selector))
          .catch(Common.oops(this))
      })

      it(`should delete the sample pod by name via ${command}`, () => {
        return CLI.command(`${command} delete pod nginx ${inNamespace}`, this.app)
          .then(async res => {
            await ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME('nginx') })(res).then(selector =>
              waitForRed(this.app, selector)
            )

            await this.app.client.$(Selectors.TABLE_SHOW_AS_GRID(res.count)).then(_ => _.click())
            await this.app.client.$(Selectors.TABLE_AS_GRID(res.count)).then(_ => _.waitForDisplayed())
            await this.app.client
              .$(`${Selectors.TABLE_AS_GRID_CELL_RED(res.count, 'nginx')}`)
              .then(_ => _.waitForDisplayed())
          })
          .catch(Common.oops(this))
      })

      deleteNS(this, ns, command)
    })
  })
})
