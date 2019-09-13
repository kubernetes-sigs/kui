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
import { createNS, waitForGreen, waitForRed } from '@kui-shell/plugin-k8s/tests/lib/k8s/utils'

describe(`kubectl watch error handler ${process.env.MOCHA_RUN_TARGET}`, function(this: common.ISuite) {
  before(common.before(this))
  after(common.after(this))

  const testResourceNotFound = (watchCmd: string, resourceType: string, resourceName: string) => {
    const errorMessage = `Error from server (NotFound): ${resourceType} "${resourceName}" not found`

    it(`should error out when watching a non-existent ${resourceType}`, () => {
      return cli
        .do(watchCmd, this.app)
        .then(cli.expectError(404, errorMessage))
        .catch(common.oops(this))
    })
  }

  const testWrongCommand = (watchCmd: string, code: number, errMessage?: string) => {
    it(`should error out with wrong command ${watchCmd}`, () => {
      return cli
        .do(watchCmd, this.app)
        .then(errMessage ? cli.expectError(code, errMessage) : cli.expectError(code))
        .catch(common.oops(this))
    })
  }

  // here comes the tests that expect failure due to non-existant resources
  const flags = ['-w', '--watch=true', '-w -w -w']
  flags.forEach(watch => {
    testResourceNotFound(`k get ns shouldNotExist ${watch}`, 'namespaces', 'shouldNotExist')
    testResourceNotFound(`k get ns ${watch} shouldNotExist`, 'namespaces', 'shouldNotExist')

    testResourceNotFound(`k get pod shouldNotExist ${watch}`, 'pods', 'shouldNotExist')
    testResourceNotFound(`k get ${watch} pod shouldNotExist`, 'pods', 'shouldNotExist')

    testResourceNotFound(`k get pods shouldNotExist -n shouldNotExist ${watch}`, 'namespaces', 'shouldNotExist')
  })

  // here comes the tests that expect failure due to wrong flag
  const wrongFlags = ['--watch true', '-w true']
  wrongFlags.forEach(watch => {
    testResourceNotFound(`k get pod ${watch}`, 'pods', 'true') // the command is parsed as `kubectl get pod true`
    testWrongCommand(`k get ${watch} pod`, 404, 'error: the server doesn\'t have a resource type "true"') // the command is parsed as `kubectl get true pod`
  })

  testWrongCommand(`k -w get pod`, 500)

  // here comes the tests should start watching successfully
  it(`should watch pods, starting from an non-existant namespace`, async () => {
    try {
      const ns = createNS()

      // start to watch pods in a non-existant namespace
      const watchResult = await cli.do(`k get pods -w -n ${ns}`, this.app).then(async result => {
        await cli.expectOK(result)
        return result
      })

      // create the namespace
      await cli
        .do(`k create ns ${ns}`, this.app)
        .then(cli.expectOKWithCustom({ selector: selectors.BY_NAME(ns) }))
        .then(status => waitForGreen(this.app, status))

      // create a pod
      await cli
        .do(`k create -f https://raw.githubusercontent.com/kubernetes/examples/master/staging/pod -n ${ns}`, this.app)
        .then(cli.expectOKWithCustom({ selector: selectors.BY_NAME('nginx') }))
        .then(status => waitForGreen(this.app, status))

      // the watch table should have the new pods with online status
      const watchStatus = `${selectors.OUTPUT_N(watchResult.count)} ${selectors.BY_NAME('nginx')}`
      await this.app.client.waitForExist(watchStatus)
      await waitForGreen(this.app, watchStatus)

      // delete the pod
      await cli
        .do(`k delete pods nginx -n ${ns}`, this.app)
        .then(cli.expectOKWithCustom({ selector: selectors.BY_NAME('nginx') }))
        .then(status => waitForRed(this.app, status))

      // the watch table should have the new pods with offline status
      await waitForRed(this.app, watchStatus)

      // delete the namespace
      await cli
        .do(`k delete ns ${ns}`, this.app)
        .then(cli.expectOKWithCustom({ selector: selectors.BY_NAME(ns) }))
        .then(nsStatus => waitForRed(this.app, nsStatus))
    } catch (err) {
      await common.oops(this, true)(err)
    }
  })
})
