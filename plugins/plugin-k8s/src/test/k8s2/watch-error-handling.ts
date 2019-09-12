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
import { cli } from '@kui-shell/core/tests/lib/ui'
import { createNS, allocateNS, deleteNS } from '@kui-shell/plugin-k8s/tests/lib/k8s/utils'

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

  // here comes the tests should be successful
  const ns = createNS()
  it('should watch pods in non-existent namespace but see empty table', () => {
    return cli
      .do(`k get pods -n ${ns} -w`, this.app)
      .then(cli.expectOK)
      .catch(common.oops(this))
  })

  allocateNS(this, ns)
  deleteNS(this, ns)
})
