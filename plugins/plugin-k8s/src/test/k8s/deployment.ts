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

import { dirname } from 'path'
const ROOT = dirname(require.resolve('@kui-shell/plugin-k8s/tests/package.json'))

describe('electron deployment CRUD', function (this: common.ISuite) {
  before(common.before(this))
  after(common.after(this))

  it('should wipe k8s', () => {
    return wipe(this)
  })

  it('should create deployment from local file', () => {
    return cli.do(`kubectl create -f ${ROOT}/data/k8s/deployment.yaml`, this.app)
      .then(cli.expectOKWithCustom({ selector: selectors.BY_NAME('myapp') }))
      .then(selector => this.app.client.waitForExist(`${selector} badge.green-background`), 20000)
      .catch(common.oops(this))
  })

  it('should delete the deployment by name', () => {
    return cli.do('kubectl delete deployment myapp', this.app)
      .then(cli.expectOKWithAny)
      .catch(common.oops(this))
  })
})
