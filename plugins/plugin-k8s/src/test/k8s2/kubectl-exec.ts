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
import { cli, keys, selectors } from '@kui-shell/core/tests/lib/ui'
import { waitForGreen, createNS, allocateNS, deleteNS } from '@kui-shell/plugin-k8s/tests/lib/k8s/utils'

import { readFileSync } from 'fs'
import { dirname, join } from 'path'
const ROOT = dirname(require.resolve('@kui-shell/plugin-k8s/tests/package.json'))
const inputBuffer = readFileSync(join(ROOT, 'data/k8s/kubectl-exec.yaml'))
const inputEncoded = inputBuffer.toString('base64')

describe(`kubectl exec basic stuff ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: common.ISuite) {
  before(common.before(this))
  after(common.after(this))

  const ns: string = createNS()
  allocateNS(this, ns)

  const podName = 'vim'
  it('should create sample pod from URL', () => {
    return cli
      .do(`echo ${inputEncoded} | base64 --decode | kubectl create -f - -n ${ns}`, this.app)
      .then(cli.expectOKWithString(podName))
      .catch(common.oops(this))
  })

  it('should wait for the pod to come up', () => {
    return cli
      .do(`kubectl get pod ${podName} -n ${ns} -w`, this.app)
      .then(cli.expectOKWithCustom({ selector: selectors.BY_NAME(podName) }))
      .then(selector => waitForGreen(this.app, selector))
      .catch(common.oops(this))
  })

  it('should exec ls through pty', () => {
    return cli
      .do(`kubectl exec ${podName} -n ${ns} -- ls`, this.app)
      .then(cli.expectOKWithString('bin'))
      .catch(common.oops(this))
  })

  it('should exec pwd through pty', () => {
    return cli
      .do(`kubectl exec ${podName} -n ${ns} -- pwd`, this.app)
      .then(cli.expectOKWithString('/'))
      .catch(common.oops(this))
  })

  deleteNS(this, ns)
})
