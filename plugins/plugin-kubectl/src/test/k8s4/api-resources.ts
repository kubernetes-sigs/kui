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

import { Common, CLI, Selectors, ReplExpect } from '@kui-shell/test'
import { createNS, allocateNS, doHelp } from '../../../tests/lib/k8s/utils'

import * as assert from 'assert'

const commonModes = ['Introduction', 'Options']
const kubectlApiResourcesModes = commonModes.concat(['api-resources'])

describe('kubectl api-resources', function (this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  const ns: string = createNS()
  allocateNS(this, ns)

  it('should get a list of api resources', () =>
    CLI.command('kubectl api-resources', this.app)
      .then(async res => {
        await ReplExpect.okWithCustom({ selector: Selectors.BY_NAME('bindings') })(res)
        const actualTitle = await this.app.client.$(Selectors.TABLE_TITLE(res.count)).then(_ => _.getText())
        assert.strictEqual(actualTitle, 'api-resources')
      })
      .catch(Common.oops(this, true)))

  xit('should get a list of api resources with pagination', () =>
    CLI.command('kubectl api-resources', this.app)
      .then(async res => {
        console.error('api-resource table')
        await ReplExpect.okWithCustom({ selector: Selectors.BY_NAME('bindings') })(res)
        const actualTitle = await this.app.client.$(Selectors.TABLE_TITLE(res.count)).then(_ => _.getText())
        assert.strictEqual(actualTitle, 'api-resources')

        console.error('api-resource pagination forward')
        await this.app.client.$(Selectors.TABLE_PAGINATION_FORWARD(res.count)).then(async _ => {
          await _.waitForExist()
          await _.click()
        })

        console.error('api-resource 10 rows per page')
        const testNumOfRows1 = await this.app.client.execute(tableSelector => {
          const numRowsOfTable = document.querySelectorAll(tableSelector).length
          return numRowsOfTable === 10
        }, Selectors.LIST_RESULTS_N(res.count))

        assert.strictEqual(testNumOfRows1, true)

        console.error('api-resource two deployment rows with different apigroup')
        const testNumOfDeploymentsRows = await this.app.client.execute(deploymentRowsSelector => {
          // should see two deployments rows (NOTE: this behavior depends on different version of kubectl)
          const deploymentRows = document.querySelectorAll(deploymentRowsSelector)
          const numDeploymentRows = deploymentRows.length
          const apiGroup1 = deploymentRows[0].textContent
          const apiGroup2 = deploymentRows[1].textContent

          return numDeploymentRows === 2 && apiGroup1 === 'apps' && apiGroup2 === 'extensions'
        }, `${Selectors.OUTPUT_N(res.count)} ${Selectors.TABLE_CELL('deployments', 'APIGROUP')}`)

        assert.strictEqual(testNumOfDeploymentsRows, true)

        console.error('api-resource pagination backward')
        await this.app.client.$(Selectors.TABLE_PAGINATION_BACKWARD(res.count)).then(async _ => {
          await _.waitForExist()
          await _.click()
        })

        console.error('api-resource table after backward')
        await ReplExpect.okWithCustom({ selector: Selectors.BY_NAME('bindings') })(res)

        console.error('api-resource 10 rows per page after backward')
        const testNumOfRows2 = await this.app.client.execute(tableSelector => {
          const numRowsOfTable = document.querySelectorAll(tableSelector).length
          return numRowsOfTable === 10
        }, Selectors.LIST_RESULTS_N(res.count))

        assert.strictEqual(testNumOfRows2, true)
      })
      .catch(Common.oops(this, true)))

  it('should get a list of api resources', () =>
    CLI.command('kubectl api-resources --namespaced=true', this.app)
      .then(ReplExpect.okWithCustom({ selector: Selectors.BY_NAME('bindings') }))
      .catch(Common.oops(this, true)))

  it('should get a list of api resources', () =>
    CLI.command('kubectl api-resources --api-group=apps', this.app)
      .then(ReplExpect.okWithCustom({ selector: Selectors.BY_NAME('statefulsets') }))
      .catch(Common.oops(this, true)))

  const help = doHelp.bind(this)
  help('kubectl api-resources -h', ['kubectl', 'api-resources'], kubectlApiResourcesModes)
})
