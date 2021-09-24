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
  let podName: string
  let replicasetName: string
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

        await SidecarExpect.descriptionList({ Available: 1 })(res)
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
        await Util.clickSidecarModeButton(this, res, 'ownerReference')
        res = ReplExpect.blockAfter(res)
        await SidecarExpect.open(res).then(SidecarExpect.kind('Deployment'))
      } catch (err) {
        return Common.oops(this, true)(err)
      }
    })
  }

  const getLogsViaCommand = () => {
    it('should show logs for whole deployment, pods and replicasets', async () => {
      try {
        await Common.refresh(this)
        // enter kubectl command for logs for a deployment
        await CLI.command(`kubectl logs deployment/myapp ${inNamespace}`, this.app).then(
          ReplExpect.okWithPtyOutput('Drone app ready')
        )
        // enter kubectl command for logs for pod
        await CLI.command(`kubectl get pods ${inNamespace}`, this.app)
        podName = await (
          await this.app.client.$(`.display-inline-block.cell-inner.clickable .kui--cell-inner-text`)
        ).getText()
        await CLI.command(`kubectl logs Pod/${podName} ${inNamespace}`, this.app).then(
          ReplExpect.okWithPtyOutput('Drone app ready')
        )
        // enter kubectl command for logs for replicaset
        await CLI.command(`kubectl get rs ${inNamespace}`, this.app)
        replicasetName = await (
          await this.app.client.$(
            `.kui--scrollback-block-list .repl-block.valid-response:nth-child(4) .entity-name .kui--cell-inner-text`
          )
        ).getText()
        await CLI.command(`kubectl logs ReplicaSet/${replicasetName} ${inNamespace}`, this.app).then(
          ReplExpect.okWithPtyOutput('Drone app ready')
        )
      } catch (err) {
        return Common.oops(this, true)(err)
      }
    })
  }

  const getLogsViaTabs = () => {
    it('should demonstrate use of the logs tab in deployment, pods and replicasets', async () => {
      try {
        // open deployment
        let tableRes = await CLI.command(`kubectl get deployment ${inNamespace}`, this.app)
        let selector = await ReplExpect.okWithCustom<string>({ selector: Selectors.LIST_RESULT_FIRST })(tableRes)
        let res = await Util.openSidecarByClick(this, selector, 'myapp')
        // switch to the logs tab in deployment and show that the content is correct
        await SidecarExpect.descriptionList({ Available: 1 })(res)
          .then(() => Util.switchToTab('logs')(res))
          .then(ReplExpect.okWithPtyOutput('Drone app ready'))
        // open replicaset
        tableRes = await CLI.command(`kubectl get ReplicaSet ${inNamespace}`, this.app)
        selector = await ReplExpect.okWithCustom<string>({ selector: Selectors.LIST_RESULT_FIRST })(tableRes)
        res = await Util.openSidecarByClick(this, selector, 'myapp')
        // switch to logs tab in replicaset and show the content is correct
        await SidecarExpect.descriptionList({ Ready: 1 })(res)
          .then(() => Util.switchToTab('logs')(res))
          .then(ReplExpect.okWithPtyOutput('Drone app ready'))
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

  //
  // The tests are called here
  //
  allocateNS(this, ns)

  createIt()
  listIt()
  getPods()
  getLogsViaCommand()
  getLogsViaTabs()
  deleteItByName()

  createIt()
  deleteItByClickingOnButton()

  deleteNS(this, ns)
})
