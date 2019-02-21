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

import * as common from '@kui-shell/core/tests/lib/common'
import { cli, selectors } from '@kui-shell/core/tests/lib/ui'
import { wipe, waitTillNone } from '@kui-shell/plugin-k8s/tests/lib/k8s/wipe'
import { kubectl, cli as kui, CLI } from '@kui-shell/core/tests/lib/headless'

import { dirname } from 'path'
const ROOT = dirname(require.resolve('@kui-shell/plugin-k8s/tests/package.json'))

const synonyms = ['kubectl', 'k']

const doHeadless = (ctx: common.ISuite, impl: CLI) => {
  before(common.before(ctx, { noApp: true }))

  it('should wipe k8s', () => {
    return wipe(ctx, impl)
  })

  synonyms.forEach(kubectl => {
    it(`should create sample pod from local file via ${kubectl}`, () => {
      return impl.do(`${kubectl} create -f ${ROOT}/data/k8s/headless/pod.yaml`, ctx.app)
        .then(impl.expectOK('nginx'))
        .catch(common.oops(ctx))
    })

    it(`should list the new pod via ${kubectl}`, () => {
      return impl.do(`${kubectl} get pods`, ctx.app)
        .then(impl.expectOK('nginx'))
        .catch(common.oops(ctx))
    })

    it(`should get the new pod via ${kubectl}`, () => {
      return impl.do(`${kubectl} get pod nginx`, ctx.app)
        .then(impl.expectOK('nginx'))
        .catch(common.oops(ctx))
    })

    it(`should get the new pod as JSON via ${kubectl}`, () => {
      return impl.do(`${kubectl} get pod nginx -o json`, ctx.app)
        .then(impl.expectOK({
          kind: 'Pod',
          metadata: {
            name: 'nginx'
          }
        }))
        .catch(common.oops(ctx))
    })

    it(`should delete the new pod by yaml via ${kubectl}`, () => {
      return impl.do(`${kubectl} delete -f ${ROOT}/data/k8s/headless/pod.yaml`, ctx.app)
        .then(impl.expectOK('pod "nginx" deleted'))
        .then(waitTillNone('pods', impl))
        .catch(common.oops(ctx))
    })

    it(`should re-create sample pod from local file via ${kubectl}`, () => {
      return impl.do(`${kubectl} create -f ${ROOT}/data/k8s/headless/pod.yaml`, ctx.app)
        .then(impl.expectOK('nginx'))
        .catch(common.oops(ctx))
    })

    it(`should delete the new pod by name via ${kubectl}`, () => {
      return impl.do(`${kubectl} delete pod nginx`, ctx.app)
        .then(impl.expectOK('pod "nginx" deleted'))
        .then(waitTillNone('pods', impl))
        .catch(common.oops(ctx))
    })
  })
}

describe('headless create pod kubectl kui mode', function (this: common.ISuite) {
  doHeadless(this, kubectl)
})

describe('headless create pod bin/kui mode', function (this: common.ISuite) {
  doHeadless(this, kui)
})
