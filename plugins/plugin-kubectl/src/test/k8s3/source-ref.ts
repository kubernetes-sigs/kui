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

import { Common, CLI, Selectors, Util } from '@kui-shell/test'
import { createNS, allocateNS, deleteNS } from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

import { dirname } from 'path'
const ROOT = dirname(require.resolve('@kui-shell/plugin-kubectl/tests/package.json'))

describe(`kubectl source ref ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  const ns: string = createNS()
  const inNamespace = `-n ${ns}`
  allocateNS(this, ns)

  it('should create deployment and see source ref', async () => {
    try {
      const res = await CLI.command(`kubectl create -f ${ROOT}/data/k8s/deployment.yaml ${inNamespace}`, this.app)

      let isExpanded = true

      console.error('1', Selectors.SOURCE_REF_TOGGLE_N(res.count, isExpanded))
      // toggler should not be expanded (the false argument)
      await this.app.client.waitForVisible(Selectors.SOURCE_REF_TOGGLE_N(res.count, isExpanded))

      // click to toggle open: no longer needed, now opened by default https://github.com/IBM/kui/pull/5869
      // console.error('2')
      // await this.app.client.click(Selectors.SOURCE_REF_TOGGLE_N(res.count, false))
      // toggler should now be expanded (the true argument)
      // console.error('3')
      // await this.app.client.waitForVisible(Selectors.SOURCE_REF_TOGGLE_N(res.count, isExpanded))

      // click to toggle closed
      console.error('4')
      await this.app.client.click(Selectors.SOURCE_REF_TOGGLE_N(res.count, isExpanded))
      isExpanded = false

      // toggler should not be expanded (the false argument)
      await this.app.client.waitForVisible(Selectors.SOURCE_REF_TOGGLE_N(res.count, isExpanded))

      await this.app.client.waitUntil(
        () =>
          Util.getValueFromMonaco(this.app, Selectors.SOURCE_REF_N(res.count)).then(
            Util.expectYAML({ kind: 'Deployment' }, true)
          ),
        CLI.waitTimeout
      )
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })

  deleteNS(this, ns)
})
