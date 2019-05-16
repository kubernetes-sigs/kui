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

import * as common from '@kui-shell/core/tests/lib/common'
import { cli, selectors } from '@kui-shell/core/tests/lib/ui'
import { wipe, waitTillNone } from '@kui-shell/plugin-k8s/tests/lib/k8s/wipe'
import { kubectl, cli as kui, CLI } from '@kui-shell/core/tests/lib/headless'

import { dirname } from 'path'
const ROOT = dirname(require.resolve('@kui-shell/plugin-k8s/tests/package.json'))

// NOTE: k status only works in defualt namespace
const doHeadless = (ctx: common.ISuite, impl: CLI) => {
  before(common.before(ctx, { noApp: true }))

  it('should wipe k8s', () => {
    return wipe(ctx, impl)
  })

  it('should create sample pod from local file', () => {
    return impl.do(`kubectl create -f ${ROOT}/data/k8s/headless/pod.yaml`, ctx.app)
      .then(impl.expectOK('nginx'))
      .catch(common.oops(ctx))
  })

  const alternatives = ['k status', 'kubectl status', 'k list', 'kubectl list']
  alternatives.forEach(cmd => {
    it(`should list the new pod via the "${cmd}"`, () => {
      return impl.do(cmd, ctx.app)
        .then(impl.expectOK('nginx'))
        .catch(common.oops(ctx))
    })
  })

  it('should delete the new pod by yaml', () => {
    return impl.do(`kubectl delete -f ${ROOT}/data/k8s/headless/pod.yaml`, ctx.app)
      .then(impl.expectOK('pod "nginx" deleted'))
      .then(waitTillNone('pods', impl))
      .catch(common.oops(ctx))
  })

  it('should NOT list the new pod via the status command', () => {
    return impl.do('k status', ctx.app)
      .then(impl.expectJustOK())
      .catch(common.oops(ctx))
  })
}

describe('k status kubectl kui headless mode', function (this: common.ISuite) {
  doHeadless(this, kubectl)
})

describe('k status bin/kui headless mode', function (this: common.ISuite) {
  doHeadless(this, kui)
})
