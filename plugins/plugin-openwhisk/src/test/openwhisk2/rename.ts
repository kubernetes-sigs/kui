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
const { cli, sidecar } = ui

const actionName1 = 'foo1'
const actionName1b = 'foo1b'
const actionName2 = 'foo2'
const actionName2b = 'foo2b'
const packageName1 = 'ppp1'
const packageName2 = 'ppp2'
const packageName3 = 'ppp3'
const key1 = 'foo'
const value1 = 'bar'

describe('Rename actions', function(this: common.ISuite) {
  before(openwhisk.before(this))
  after(common.after(this))

  const mv = (task, a, b, aPackage?, bPackage?) => {
    // pass this key-value pair to the invocation
    const key = 'name'
    const value = `whisker ${a} to ${b}`
    const expect = {}
    const expectAnnotations = {}
    const aFull = `${aPackage ? aPackage + '/' : ''}${a}`
    const bFull = `${bPackage ? bPackage + '/' : ''}${b}`

    // expected return value, as struct
    expect[key] = value // passed to this invocation
    expect[key1] = value1 // bound to the original action; make sure it survives the copy
    expectAnnotations[key1] = value1

    it(`***** ${task}`, () => true)

    it(`should rename ${aFull} to ${bFull}`, () =>
      cli
        .do(`wsk action rename ${aFull} ${bFull}`, this.app)
        .then(cli.expectJustOK)
        .then(sidecar.expectOpen)
        .then(sidecar.expectShowing(b, undefined, undefined, bPackage))
        .catch(common.oops(this)))

    // verify that annotations survived the rename
    it('should switch to annotations mode', () =>
      cli
        .do('wsk action annotations', this.app)
        .then(cli.expectJustOK)
        .then(sidecar.expectOpen)
        .then(sidecar.expectShowing(b, undefined, undefined, bPackage))
        .then(app => app.client.getText(`${ui.selectors.SIDECAR_CONTENT} .action-source`))
        .then(ui.expectSubset(expectAnnotations)))

    // invoke the renamed action
    it(`should invoke the copied action ${bFull}`, () =>
      cli
        .do(`wsk action invoke -p "${key}" "${value}"`, this.app)
        .then(cli.expectJustOK)
        .then(sidecar.expectOpen)
        .then(sidecar.expectShowing(b))
        .then(() => this.app.client.getText(ui.selectors.SIDECAR_ACTIVATION_RESULT))
        .then(ui.expectStruct(expect)))

    // verify that the original does not exist
    it(`${aFull} should NOT exist`, () =>
      cli
        .do(`wsk action get ${aFull}`, this.app)
        .then(cli.expectError(404, 'The requested resource does not exist.'))
        .then(sidecar.expectOpen)
        .then(sidecar.expectShowing(b))
        .catch(common.oops(this)))
  }

  // RENAME ACTION
  it('should create an action via let', () =>
    cli
      .do(`let ${actionName1} = x=>x -p ${key1} ${value1} -a ${key1} ${value1}`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName1))
      .catch(common.oops(this)))
  mv('non-package to non-package', actionName1, actionName1b)

  // RENAME PACKAGED ACTION TO NON-PACKAGED ACTION
  it('should create a packaged action via let', () =>
    cli
      .do(`let ${packageName1}/${actionName2}.js = x=>x -p ${key1} ${value1} -a ${key1} ${value1}`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName2, undefined, undefined, packageName1))
      .catch(common.oops(this)))
  mv('package to non-package', actionName2, actionName2b, packageName1)

  // RENAME non-packaged ACTION TO PACKAGED ACTION, existing package
  it('should create a package', () =>
    cli
      .do(`wsk package update ${packageName2}`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(packageName2))
      .catch(common.oops(this)))
  mv('non-package to existing package', actionName1b, actionName2b, undefined, packageName2)

  // RENAME PACKAGED ACTION TO PACKAGED ACTION, new package
  mv('existing package to existing package', actionName2b, actionName1, packageName2, packageName3)
})
