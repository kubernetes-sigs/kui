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

import { dirname } from 'path'

const ROOT = dirname(require.resolve('@kui-shell/plugin-k8s/tests/package.json'))

describe('kubectl exec vi', function(this: common.ISuite) {
  before(common.before(this))
  after(common.after(this))
  const ns: string = createNS()
  const podName2 = 'alpine'
  allocateNS(this, ns)
  it(`should create sample pod from local file via k`, () => {
    return cli
      .do(`kubectl create -f ${ROOT}/data/k8s/kubectl-exec.yaml -n ${ns}`, this.app)
      .then(cli.expectOKWithCustom({ selector: selectors.BY_NAME(podName2) }))
      .then(selector => waitForGreen(this.app, selector))
      .catch(common.oops(this))
  })
  it(`should exec vi commands through pty`, async () => {
    return cli
      .do(`kubectl exec -it ${podName2} vi`, this.app)
      .then(() => this.app.client.waitForExist(`tab.visible.xterm-alt-buffer-mode`))
      .then(() => {
        this.app.client.keys(':q')
        this.app.client.keys(keys.ENTER)
      })
      .then(() => cli.expectBlank)
      .catch(common.oops(this))
  })

  deleteNS(this, ns)
})
