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

import { Common, CLI, ReplExpect, Selectors, Util } from '@kui-shell/test'
import { createNS, allocateNS, deleteNS } from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

import { dirname } from 'path'
const ROOT = dirname(require.resolve('@kui-shell/plugin-kubectl/tests/package.json'))

const timeout = 20000

/** confirm the given toggler state */
async function confirmState(this: Common.ISuite, res: ReplExpect.AppAndCount, isExpanded: boolean, kind: string) {
  // confirm the toggler UI
  console.error('C1')
  await this.app.client.$(Selectors.SOURCE_REF_TOGGLE_N(res.count, isExpanded)).then(_ => _.waitForExist({ timeout }))
  console.error('C2')

  if (isExpanded) {
    // if it is expanded, also confirm the expanded editor state
    await this.app.client.waitUntil(
      () => Util.getValueFromMonaco(res, Selectors.SOURCE_REF_N(res.count)).then(Util.expectYAML({ kind }, true)),
      { timeout: CLI.waitTimeout }
    )
  }
}

/** click to toggle state */
async function clickToToggle(this: Common.ISuite, res: ReplExpect.AppAndCount, isExpanded: boolean) {
  console.error('T1')
  const toggler = await this.app.client.$(Selectors.SOURCE_REF_TOGGLE_N(res.count, isExpanded))
  console.error('T2')
  await toggler.waitForExist({ timeout })
  console.error('T2')
  await toggler.click()
  console.error('T3')
  return !isExpanded
}

describe(`kubectl source ref ${process.env.MOCHA_RUN_TARGET || ''}`, function (this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  const ns: string = createNS()
  const inNamespace = `-n ${ns}`
  allocateNS(this, ns)

  it('should create deployment and see source ref', async () => {
    try {
      const res = await CLI.command(`kubectl create -f ${ROOT}/data/k8s/deployment.yaml ${inNamespace}`, this.app)

      const confirm = confirmState.bind(this, res)
      const toggle = clickToToggle.bind(this, res)

      let isExpanded = false // default isExpanded?
      for (let idx = 0; idx < 5; idx++) {
        await confirm(isExpanded, 'Deployment')
        isExpanded = await toggle(isExpanded)
      }
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })

  it('should create with directory and see source ref', async () => {
    try {
      const res = await CLI.command(`kubectl create -f ${ROOT}/data/k8s/bunch ${inNamespace}`, this.app)

      const confirm = confirmState.bind(this, res)
      const toggle = clickToToggle.bind(this, res)

      let isExpanded = false // default isExpanded?
      for (let idx = 0; idx < 5; idx++) {
        await confirm(isExpanded, 'Deployment')
        isExpanded = await toggle(isExpanded)
      }
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })

  it('should create with kustomization and see source ref', async () => {
    try {
      console.error('SRK1')
      const res = await CLI.command(`kubectl apply -k ${ROOT}/data/k8s/kustomize/base ${inNamespace}`, this.app)

      const confirm = confirmState.bind(this, res)
      const toggle = clickToToggle.bind(this, res)

      let isExpanded = false // default isExpanded?
      for (let idx = 0; idx < 5; idx++) {
        console.error(`SRK2.${idx}`)
        await confirm(isExpanded, 'ConfigMap')
        console.error(`SRK3.${idx}`)
        isExpanded = await toggle(isExpanded)
        console.error(`SRK4.${idx}`)
      }
      console.error('SRK5')
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })

  deleteNS(this, ns)
})
