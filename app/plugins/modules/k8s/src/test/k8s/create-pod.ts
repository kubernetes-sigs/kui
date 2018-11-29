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

import { ISuite } from '../../../../../../../tests/lib/common'
import * as common from '../../../../../../../tests/lib/common' // tslint:disable-line:no-duplicate-imports
import { cli, selectors } from '../../../../../../../tests/lib/ui'
import { wipe, waitTillNone } from '../../../../../../../tests/lib/k8s/wipe'

describe('k8s create pod', function (this: ISuite) {
  before(common.before(this))
  after(common.after(this))

  it('should wipe k8s', () => {
    wipe(this)
  })

  it('should have an active repl', () => {
    return cli.waitForRepl(this.app)
  })

  it('should create sample pod from URL', () => {
    return cli.do(`kubectl create -f https://raw.githubusercontent.com/kubernetes/examples/master/staging/pod`, this.app)
      .then(cli.expectOKWithCustom({ selector: selectors.BY_NAME('nginx') }))
      .then(selector => this.app.client.waitForExist(`${selector} badge.green-background`), 20000)
      .catch(common.oops(this))
  })

  it('should delete the sample pod from URL', () => {
    return cli.do('kubectl delete -f https://raw.githubusercontent.com/kubernetes/examples/master/staging/pod', this.app)
      .then(cli.expectOKWithCustom({ selector: selectors.BY_NAME('nginx') }))
      .then(selector => this.app.client.waitForExist(`${selector} badge.red-background`), 20000)
      .catch(common.oops(this))
  })

  it('should create sample pod from local file', () => {
    return cli.do('kubectl create -f ./data/k8s/pod.yaml', this.app)
      .then(cli.expectOKWith('nginx'))
      .catch(common.oops(this))
  })

  it('should delete the sample pod by name', () => {
    return cli.do('kubectl delete pod nginx', this.app)
      .then(cli.expectOKWithCustom({ selector: selectors.BY_NAME('nginx') }))
      .then(selector => this.app.client.waitForExist(`${selector} badge.red-background`), 20000)
      .catch(common.oops(this))
  })
})
