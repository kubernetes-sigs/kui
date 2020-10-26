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

import { Common, CLI, ReplExpect, SidecarExpect } from '@kui-shell/test'

import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

import { dirname } from 'path'

const ROOT = dirname(require.resolve('@kui-shell/plugin-openwhisk/tests/package.json'))

const actionName = 'foo'
const actionNameWithSpaces = 'foo foo'
const actionName2 = 'foo2'
const packageName = 'ppp'
const packageNameWithSpaces = 'ppp ppp'
const seqName = 'sss'

describe('Delete multiple actions using rimraf', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  it('should fail with 404 to delete non-existent numeric name', () =>
    CLI.command(`wsk action rimraf 3`, this.app)
      .then(ReplExpect.error(404))
      .catch(Common.oops(this)))

  // create an action, using the implicit entity type
  it('should create an action', () =>
    CLI.command(`wsk action create ${actionName} ${ROOT}/data/openwhisk/foo.js`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName))
      .catch(Common.oops(this)))

  // create an action, using the implicit entity type
  it('should create another action', () =>
    CLI.command(`wsk action create ${actionName2} ${ROOT}/data/openwhisk/foo2.js`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName2))
      .catch(Common.oops(this)))

  // delete them both
  it('should delete them both', () =>
    CLI.command(`wsk action rimraf ${actionName} ${actionName2}`, this.app)
      .then(ReplExpect.okWithCustom({ expect: 'deleted 2 elements', exact: true }))
      .then(SidecarExpect.closed)
      .catch(Common.oops(this)))

  it('should NOT find a deleted action', () =>
    CLI.command(`wsk action get ${actionName} --no-retry`, this.app)
      .then(ReplExpect.error(404))
      .catch(Common.oops(this)))

  it('should FAIL to delete a non-existent action', () =>
    CLI.command(`wsk action rimraf ${actionName} --no-retry`, this.app)
      .then(ReplExpect.error(404))
      .catch(Common.oops(this)))

  //
  // recursive removal of packages
  //
  it('should create a packaged action', () =>
    CLI.command(`let ${packageName}/${actionName} = x=>x`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName, packageName))
      .catch(Common.oops(this)))
  it('should create another packaged action', () =>
    CLI.command(`let ${packageName}/${actionName2} = x=>x`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName2, packageName))
      .catch(Common.oops(this)))
  it('should delete the package recursively', () =>
    CLI.command(`wsk package rimraf -r ${packageName}`, this.app)
      .then(ReplExpect.okWithCustom({ expect: 'deleted 3 elements', exact: true }))
      .then(SidecarExpect.closed)
      .catch(Common.oops(this)))
  it('should FAIL to delete the removed package', () =>
    CLI.command(`wsk package rimraf -r ${packageName} --no-retry`, this.app)
      .then(ReplExpect.error(404))
      .catch(Common.oops(this)))
  it('should NOT find the deleted package', () =>
    CLI.command(`wsk action get ${packageName} --no-retry`, this.app)
      .then(ReplExpect.error(404))
      .catch(Common.oops(this)))
  it('should NOT find the deleted package action', () =>
    CLI.command(`wsk action get ${packageName}/${actionName} --no-retry`, this.app)
      .then(ReplExpect.error(404))
      .catch(Common.oops(this)))

  //
  // recursive removal of packages with spaces
  //
  it('should create a packaged action with spaces', () =>
    CLI.command(`let "${packageNameWithSpaces}/${actionNameWithSpaces}" = x=>x`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionNameWithSpaces, packageNameWithSpaces))
      .catch(Common.oops(this)))
  it('should delete the package recursively', () =>
    CLI.command(`wsk package rimraf -r "${packageNameWithSpaces}"`, this.app)
      .then(ReplExpect.okWithCustom({ expect: 'deleted 2 elements', exact: true }))
      .then(SidecarExpect.closed)
      .catch(Common.oops(this)))
  it('should FAIL to delete the removed package', () =>
    CLI.command(`wsk package rimraf -r "${packageNameWithSpaces}" --no-retry`, this.app)
      .then(ReplExpect.error(404))
      .catch(Common.oops(this)))
  it('should NOT find the deleted package', () =>
    CLI.command(`wsk action get "${actionNameWithSpaces}" --no-retry`, this.app)
      .then(ReplExpect.error(404))
      .catch(Common.oops(this)))
  it('should NOT find the deleted package action', () =>
    CLI.command(`wsk action get "${packageNameWithSpaces}/${actionNameWithSpaces}" --no-retry`, this.app)
      .then(ReplExpect.error(404))
      .catch(Common.oops(this)))

  //
  // recursive removal of anonymous inline functions
  //
  it('should create an action', () =>
    CLI.command(`wsk action create ${actionName} ${ROOT}/data/openwhisk/foo.js`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName))
      .catch(Common.oops(this)))
  it('should create another action', () =>
    CLI.command(`wsk action create ${actionName2} ${ROOT}/data/openwhisk/foo2.js`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName2))
      .catch(Common.oops(this)))
  it('should create a sequence with anonymous inline action', () =>
    CLI.command(`let ${seqName} = ${actionName} -> x=>x -> ${actionName2}`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(seqName))
      .catch(Common.oops(this)))
  it('should delete the sequence recursively', () =>
    CLI.command(`wsk action rimraf -r ${seqName}`, this.app)
      .then(ReplExpect.okWithCustom({ expect: 'deleted 2 elements', exact: true }))
      .then(SidecarExpect.closed)
      .catch(Common.oops(this)))
})
