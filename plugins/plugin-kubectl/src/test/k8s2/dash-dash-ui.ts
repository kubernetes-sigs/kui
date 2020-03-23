/*
 * Copyright 2018 IBM Corporation
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

import { Common } from '@kui-shell/test'
import { cli as kui, kuiElectron, CLI } from '@kui-shell/core/tests/lib/headless'
import { createNS } from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

import { dirname } from 'path'
const ROOT = dirname(require.resolve('@kui-shell/plugin-kubectl/tests/package.json'))

const doTests = (ctx: Common.ISuite, impl: CLI) => {
  before(Common.before(ctx, { noApp: true }))
  after(Common.after(ctx))

  const ns: string = createNS()
  const inNamespace = `-n ${ns}`

  xit(`should create a namespace ${ns} `, () => {
    return kui
      .command(`kubectl create namespace ${ns}`, ctx.app)
      .then(kui.expectOK(`namespace/${ns} created`))
      .catch(Common.oops(ctx, true))
  })

  xit('should create sample pod from local file', () => {
    return kui
      .command(`kubectl create -f ${ROOT}/data/k8s/headless/pod.yaml ${inNamespace}`, ctx.app)
      .then(kui.expectOK('nginx'))
      .catch(Common.oops(ctx, true))
  })

  xit('should list the new pod in electron', () => {
    return impl
      .command(`kubectl get pods ${inNamespace} --ui`, ctx.app)
      .then(impl.expectOK('nginx'))
      .catch(Common.oops(ctx, true))
  })

  xit(`should delete the namespace ${ns} `, () => {
    return kui
      .command(`kubectl delete namespace ${ns}`, ctx.app)
      .then(kui.expectOK(`namespace "${ns}" deleted`)) // TODO: weird: why create and delte has different output
      .catch(Common.oops(ctx, true))
  })
}

Common.localDescribe('k8s with electron via bin/kui', function(this: Common.ISuite) {
  doTests(this, kuiElectron)
})

/* Common.localDescribe('k8s with electron via kubectl kui', function(this: Common.ISuite) {
  doTests(this, kubectlElectron)
}) */
