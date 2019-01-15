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

import { ISuite } from '@test/lib/common'
import * as common from '@test/lib/common' // tslint:disable-line:no-duplicate-imports
import { cli, selectors } from '@test/lib/ui'
import { wipe, waitTillNone } from '@test/lib/k8s/wipe'
import { kubectl, cli as kui, CLI } from '@test/lib/headless'

const doHeadless = (ctx: ISuite, impl: CLI) => {
  before(common.before(ctx, { noApp: true }))

  it('should wipe k8s', () => {
    return wipe(ctx, impl)
  })

  it('should create sample pod from local file', () => {
    return impl.do('kubectl create -f ./data/k8s/pod.yaml', ctx.app)
      .then(impl.expectOK('nginx'))
      .catch(common.oops(ctx))
  })

  it('should list the new pod', () => {
    return impl.do('kubectl get pods', ctx.app)
      .then(impl.expectOK('nginx'))
      .catch(common.oops(ctx))
  })

  it('should get the new pod', () => {
    return impl.do('kubectl get pod nginx', ctx.app)
      .then(impl.expectOK('nginx'))
      .catch(common.oops(ctx))
  })

  it('should get the new pod as JSON', () => {
    return impl.do('kubectl get pod nginx -o json', ctx.app)
      .then(impl.expectOK({
        kind: 'Pod',
        metadata: {
          name: 'nginx'
        }
      }))
      .catch(common.oops(ctx))
  })

  it('should delete the new pod by yaml', () => {
    return impl.do('kubectl delete -f ./data/k8s/pod.yaml', ctx.app)
      .then(impl.expectOK('pod "nginx" deleted'))
      .then(waitTillNone('pods', impl))
      .catch(common.oops(ctx))
  })

  it('should re-create sample pod from local file', () => {
    return impl.do('kubectl create -f ./data/k8s/pod.yaml', ctx.app)
      .then(impl.expectOK('nginx'))
      .catch(common.oops(ctx))
  })

  it('should delete the new pod by name', () => {
    return impl.do('kubectl delete pod nginx', ctx.app)
      .then(impl.expectOK('pod "nginx" deleted'))
      .catch(common.oops(ctx))
  })
}

describe('k8s create pod kubectl kui headless mode', function (this: ISuite) {
  doHeadless(this, kubectl)
})

describe('k8s create pod bin/kui headless mode', function (this: ISuite) {
  doHeadless(this, kui)
})

describe('k8s create pod electron mode', function (this: ISuite) {
  before(common.before(this))
  after(common.after(this))

  it('should wipe k8s', () => {
    return wipe(this)
  })

  it('should have an active repl', () => {
    return cli.waitForRepl(this.app, { noAuthOk: true }) // no openwhisk auth ok!
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
