/*
 * Copyright 2017 IBM Corporation
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
import * as ui from '@kui-shell/core/tests/lib/ui'
import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

import { dirname } from 'path'
const { cli, sidecar } = ui
const ROOT = dirname(require.resolve('@kui-shell/plugin-openwhisk/tests/package.json'))

const actionName = 'foo'
const actionNameWithSpaces = 'foo foo'
const actionName2 = 'foo2'
const packageName = 'ppp'
const packageNameWithSpaces = 'ppp ppp'
const seqName = 'sss'

describe('Delete multiple actions using rimraf', function(this: common.ISuite) {
  before(openwhisk.before(this))
  after(common.after(this))

  it('should fail with 404 to delete non-existent numeric name', () =>
    cli
      .do(`wsk action rimraf 3`, this.app)
      .then(cli.expectError(404))
      .then(sidecar.expectClosed)
      .catch(common.oops(this)))

  // create an action, using the implicit entity type
  it('should create an action', () =>
    cli
      .do(`wsk action create ${actionName} ${ROOT}/data/openwhisk/foo.js`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName))
      .catch(common.oops(this)))

  // create an action, using the implicit entity type
  it('should create another action', () =>
    cli
      .do(`wsk action create ${actionName2} ${ROOT}/data/openwhisk/foo2.js`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName2))
      .catch(common.oops(this)))

  // delete them both
  it('should delete them both', () =>
    cli
      .do(`wsk action rimraf ${actionName} ${actionName2}`, this.app)
      .then(cli.expectOKWithCustom({ expect: 'deleted 2 elements', exact: true }))
      .then(sidecar.expectClosed)
      .catch(common.oops(this)))

  it('should NOT find a deleted action', () =>
    cli
      .do(`wsk action get ${actionName} --no-retry`, this.app)
      .then(cli.expectError(404))
      .catch(common.oops(this)))

  it('should FAIL to delete a non-existent action', () =>
    cli
      .do(`wsk action rimraf ${actionName} --no-retry`, this.app)
      .then(cli.expectError(404))
      .catch(common.oops(this)))

  //
  // recursive removal of packages
  //
  it('should create a packaged action', () =>
    cli
      .do(`let ${packageName}/${actionName} = x=>x`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName, undefined, undefined, packageName))
      .catch(common.oops(this)))
  it('should create another packaged action', () =>
    cli
      .do(`let ${packageName}/${actionName2} = x=>x`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName2, undefined, undefined, packageName))
      .catch(common.oops(this)))
  it('should delete the package recursively', () =>
    cli
      .do(`wsk package rimraf -r ${packageName}`, this.app)
      .then(cli.expectOKWithCustom({ expect: 'deleted 3 elements', exact: true }))
      .then(sidecar.expectClosed)
      .catch(common.oops(this)))
  it('should FAIL to delete the removed package', () =>
    cli
      .do(`wsk package rimraf -r ${packageName} --no-retry`, this.app)
      .then(cli.expectError(404))
      .catch(common.oops(this)))
  it('should NOT find the deleted package', () =>
    cli
      .do(`wsk action get ${packageName} --no-retry`, this.app)
      .then(cli.expectError(404))
      .catch(common.oops(this)))
  it('should NOT find the deleted package action', () =>
    cli
      .do(`wsk action get ${packageName}/${actionName} --no-retry`, this.app)
      .then(cli.expectError(404))
      .catch(common.oops(this)))

  //
  // recursive removal of packages with spaces
  //
  it('should create a packaged action with spaces', () =>
    cli
      .do(`let "${packageNameWithSpaces}/${actionNameWithSpaces}" = x=>x`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionNameWithSpaces, undefined, undefined, packageNameWithSpaces))
      .catch(common.oops(this)))
  it('should delete the package recursively', () =>
    cli
      .do(`wsk package rimraf -r "${packageNameWithSpaces}"`, this.app)
      .then(cli.expectOKWithCustom({ expect: 'deleted 2 elements', exact: true }))
      .then(sidecar.expectClosed)
      .catch(common.oops(this)))
  it('should FAIL to delete the removed package', () =>
    cli
      .do(`wsk package rimraf -r "${packageNameWithSpaces}" --no-retry`, this.app)
      .then(cli.expectError(404))
      .catch(common.oops(this)))
  it('should NOT find the deleted package', () =>
    cli
      .do(`wsk action get "${actionNameWithSpaces}" --no-retry`, this.app)
      .then(cli.expectError(404))
      .catch(common.oops(this)))
  it('should NOT find the deleted package action', () =>
    cli
      .do(`wsk action get "${packageNameWithSpaces}/${actionNameWithSpaces}" --no-retry`, this.app)
      .then(cli.expectError(404))
      .catch(common.oops(this)))

  //
  // recursive removal of anonymous inline functions
  //
  it('should create an action', () =>
    cli
      .do(`wsk action create ${actionName} ${ROOT}/data/openwhisk/foo.js`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName))
      .catch(common.oops(this)))
  it('should create another action', () =>
    cli
      .do(`wsk action create ${actionName2} ${ROOT}/data/openwhisk/foo2.js`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName2))
      .catch(common.oops(this)))
  it('should create a sequence with anonymous inline action', () =>
    cli
      .do(`let ${seqName} = ${actionName} -> x=>x -> ${actionName2}`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(seqName))
      .catch(common.oops(this)))
  it('should delete the sequence recursively', () =>
    cli
      .do(`wsk action rimraf -r ${seqName}`, this.app)
      .then(cli.expectOKWithCustom({ expect: 'deleted 2 elements', exact: true }))
      .then(sidecar.expectClosed)
      .catch(common.oops(this)))
})
