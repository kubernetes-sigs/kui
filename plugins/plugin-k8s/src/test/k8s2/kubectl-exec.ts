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

describe('kubectl commands to pty', function(this: common.ISuite) {
  before(common.before(this))
  after(common.after(this))

  const ns: string = createNS()
  const podName1 = 'nginx'
  allocateNS(this, ns)
  it(`should create sample pod from URL via k`, () => {
    return cli
      .do(`k create -f https://raw.githubusercontent.com/kubernetes/examples/master/staging/pod -n ${ns}`, this.app)
      .then(cli.expectOKWithCustom({ selector: selectors.BY_NAME(podName1) }))
      .then(selector => waitForGreen(this.app, selector))
      .catch(common.oops(this))
  })

  it(`should exec bash through pty`, () => {
    return cli
      .do(`kubectl exec -it ${podName1} bash`, this.app)
      .then(() => this.app.client.getAttribute(`${selectors.PROMPT_BLOCK}.processing`, 'data-input-count'))
      .then(count => parseInt(count, 10))
      .then(count => this.app.client.waitForExist(`${selectors.xtermRows(count)}`, 5000))
      .then(() => {
        this.app.client.keys('exit')
        this.app.client.keys(keys.ENTER)
      })
      .catch(common.oops(this))
  })

  it(`should pass to pty when using grep `, () => {
    return cli
      .do(`kubectl get pods -n ${podName1} | grep compose`, this.app)
      .then(() => this.app.client.waitForExist(`${selectors.OUTPUT_LAST}`, 5000))
      .then(() => this.app.client.waitForExist(`${selectors.OUTPUT_LAST} .xterm-container .xterm-rows`, 5000))
      .catch(common.oops(this))
  })

  it(`should exec pwd through pty`, () => {
    return cli
      .do(`kubectl exec -it ${podName1} pwd`, this.app)
      .then(() => this.app.client.waitForExist(`${selectors.OUTPUT_LAST}`, 5000))
      .then(() => cli.expectOKWithCustom({ selector: selectors.BY_NAME('/') }))
      .catch(common.oops(this))
  })

  deleteNS(this, ns)
})
