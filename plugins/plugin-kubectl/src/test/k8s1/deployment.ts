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

import { Common, CLI, ReplExpect, SidecarExpect, Selectors, Util } from '@kui-shell/test'
import {
  list,
  defaultModeForGet,
  createNS,
  allocateNS,
  deleteNS,
  openSidecarByList,
  singletonTablesHaveTitle,
  waitTillNone
} from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

import * as assert from 'assert'
import { dirname } from 'path'
const ROOT = dirname(require.resolve('@kui-shell/plugin-kubectl/tests/package.json'))

const ns: string = createNS()
const inNamespace = `-n ${ns}`

describe(`kubectl deployment ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  let res: ReplExpect.AppAndCount
  const createIt = () => {
    it('should create deployment from local file', async () => {
      try {
        await openSidecarByList(this, `kubectl create -f ${ROOT}/data/k8s/deployment.yaml ${inNamespace}`, 'myapp')
      } catch (err) {
        return Common.oops(this, true)(err)
      }
    })
  }

  const listIt = () => {
    it('should list deployments', async () => {
      try {
        const selector = await list(this, `kubectl get deployment ${inNamespace}`, 'myapp')
        const res = await Util.openSidecarByClick(
          this,
          `${selector} [data-value="myapp"].clickable`,
          'myapp',
          defaultModeForGet
        )

        const selectorPrefix = selector.replace(Selectors.BY_NAME('myapp'), '')

        if (singletonTablesHaveTitle) {
          await this.app.client
            .$(`${selectorPrefix} .result-table-title`)
            .then(_ => _.getText())
            .then(title => assert.ok(title === 'DEPLOYMENT'))
        }

        await SidecarExpect.yaml({ Name: 'myapp' })(res)
          .then(() => new Promise(resolve => setTimeout(resolve, 1000)))
          .then(() => Util.switchToTab('pods')(res))
          .then(() => this.app.client.$(`${Selectors.SIDECAR_TAB_CONTENT(res.count, res.splitIndex)} table`))
          .then(_ => _.waitForExist())
          .then(async () => {
            if (singletonTablesHaveTitle) {
              const actualTitle = await this.app.client
                .$(`${Selectors.SIDECAR_CUSTOM_CONTENT(res.count, res.splitIndex)} .result-table-title`)
                .then(_ => _.getText())
              assert.strictEqual(actualTitle, 'PODS')
            }
          })
      } catch (err) {
        return Common.oops(this, true)(err)
      }
    })
  }

  const getPods = () => {
    it('should list pods in deployment, then navigate using Show Owner Reference button', async () => {
      try {
        await Common.refresh(this)
        const tableRes = await CLI.command(`kubectl get pod -lapp=drone-app ${inNamespace}`, this.app)
        const selector = await ReplExpect.okWithCustom<string>({ selector: Selectors.LIST_RESULT_FIRST })(tableRes)
        res = await Util.openSidecarByClick(this, selector, 'myapp')

        await Util.clickSidecarModeButton(this, res, 'ownerReference')
        res = ReplExpect.blockAfter(res)
        await SidecarExpect.open(res)
          .then(SidecarExpect.kind('ReplicaSet'))
          .then(SidecarExpect.button({ mode: 'ownerReference', label: 'Show Owner Reference' }))

        await Util.clickSidecarModeButton(this, res, 'ownerReference')
        res = ReplExpect.blockAfter(res)
        await SidecarExpect.open(res).then(SidecarExpect.kind('Deployment'))
      } catch (err) {
        return Common.oops(this, true)(err)
      }
    })
  }

  const deleteItByName = () => {
    it('should delete the deployment by name', () => {
      return CLI.command(`kubectl delete deployment myapp ${inNamespace}`, this.app)
        .then(ReplExpect.okWithAny)
        .then(() => waitTillNone('deployment', undefined, 'myapp', undefined, inNamespace))
        .catch(Common.oops(this, true))
    })
  }

  const deleteItByClickingOnButton = () => {
    it('should delete the deployment by clicking on the sidecar delete button', async () => {
      try {
        await Util.clickSidecarModeButton(this, res, 'delete')
        await this.app.client.$(Selectors.CONFIRM_DIALOG).then(_ => _.waitForExist())
        await this.app.client.$(Selectors.CONFIRM_DIALOG_CONFIRM_BUTTON).then(_ => _.click())
        await waitTillNone('deployment', undefined, 'myapp', undefined, inNamespace)
      } catch (err) {
        return Common.oops(this, true)(err)
      }
    })
  }

  const getLogs = () => {
    it('should show logs for whole deployment', () => {
      return CLI.command(`kubectl logs deploy/myapp ${inNamespace}`, this.app)
        .then(ReplExpect.okWithPtyOutput('Drone app ready'))
        .catch(Common.oops(this, true))
    })
  }

  //
  // here start the tests
  //
  allocateNS(this, ns)

  createIt()
  listIt()
  getPods()
  getLogs()
  deleteItByName()

  createIt()
  deleteItByClickingOnButton()

  deleteNS(this, ns)
})
