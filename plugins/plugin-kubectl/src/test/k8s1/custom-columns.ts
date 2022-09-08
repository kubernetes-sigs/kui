/*
 * Copyright 2021 The Kubernetes Authors
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
  list,
  remotePodYaml,
  defaultModeForGet,
  createNS,
  allocateNS,
  deleteNS,
  waitForGreen,
  waitForRed
} from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

const kubectl = 'kubectl'
const dashF = '-f'

const ns: string = createNS()
const inNamespace = `-n ${ns}`

describe(`${kubectl} get custom-columns ${process.env.MOCHA_RUN_TARGET || ''}`, function (this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  //
  // here start the tests
  //
  allocateNS(this, ns)

  const doCreate = async (wait = true) => {
    const res = await CLI.command(`${kubectl} apply ${dashF} ${remotePodYaml} ${inNamespace}`, this.app)
    const selector = await ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME('nginx') })(res)

    if (wait) {
      // wait for the badge to become green
      await waitForGreen(this.app, selector)
    }
  }

  const create = () => {
    it(`should create sample pod from URL via "${kubectl} apply ${dashF}" for test: ${this.title}`, async () => {
      try {
        await doCreate()
      } catch (err) {
        return Common.oops(this, true)(err)
      }
    })
  }

  const get = (byName: boolean, watch: boolean) => {
    it(`should get ${byName ? 'by name' : ''} ${
      watch ? '--watch' : ''
    } -o custom-columns=Name:.metadata.name and show that pod`, async () => {
      try {
        const selector = await list(
          this,
          `kubectl get pod ${byName ? 'nginx' : ''} ${
            watch ? '--watch' : ''
          } -o custom-columns=Name:.metadata.name ${inNamespace}`,
          'nginx',
          false
        )
        await Util.openSidecarByClick(this, `${selector} [data-value="nginx"].clickable`, 'nginx', defaultModeForGet)
      } catch (err) {
        return Common.oops(this, true)(err)
      }
    })
  }

  const recreate = () => {
    it('should recreate with watch', async () => {
      try {
        await CLI.command(`kubectl delete pod nginx ${inNamespace}`, this.app)
          .then(ReplExpect.okWithCustom<string>({ selector: Selectors.BY_NAME('nginx') }))
          .then(selector => waitForRed(this.app, selector))

        const res = await CLI.command(
          `kubectl get pod -w -o custom-columns=Name:.metadata.name ${inNamespace}`,
          this.app
        ).then(ReplExpect.ok)

        doCreate(false)

        await this.app.client
          .$(`${Selectors.OUTPUT_N(res.count, res.splitIndex)} ${Selectors.BY_NAME('nginx')}`)
          .then(_ => _.waitForExist({ timeout: CLI.waitTimeout }))
      } catch (err) {
        return Common.oops(this, true)(err)
      }
    })
  }

  create()
  get(false, false)
  get(false, true)
  get(false, true)
  get(true, true)
  recreate()

  deleteNS(this, ns)
})
