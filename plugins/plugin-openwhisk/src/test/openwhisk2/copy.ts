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

import { Common, CLI, ReplExpect, SidecarExpect, Selectors, Util } from '@kui-shell/test'

import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

const actionName1 = 'foo1'
const actionName1b = 'foo1b'
const actionName1c = 'foo1c'
const actionName2 = 'foo2'
const actionName2b = 'foo2b'
const actionName2c = 'foo2c'
const packageName1 = 'ppp1'
const packageName2 = 'ppp2'
const packageName3 = 'ppp3'
const key1 = 'foo'
const value1 = 'bar'

const CMD = 'wsk action copy'

describe('Use copy to copy openwhisk entities', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  const cp = (a, b, aPackage?, bPackage?, cmd = CMD) => {
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

    it(`should copy ${aFull} to ${bFull}`, () =>
      CLI.command(`${cmd} ${aFull} ${bFull}`, this.app)
        .then(ReplExpect.justOK)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(b, undefined, undefined, bPackage))
        .catch(Common.oops(this)))

    // verify that annotations survived the copy
    it('should switch to annotations mode', () =>
      CLI.command('wsk action annotations', this.app)
        .then(ReplExpect.justOK)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(b, undefined, undefined, bPackage))
        .then(app => app.client.getText(`${Selectors.SIDECAR_CONTENT} .action-source`))
        .then(Util.expectSubset(expectAnnotations))
        .catch(Common.oops(this)))

    // invoke the copy
    it(`should invoke the copied action ${bFull}`, () =>
      CLI.command(`wsk action invoke -p "${key}" "${value}"`, this.app)
        .then(ReplExpect.justOK)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(b))
        .then(() => this.app.client.getText(Selectors.SIDECAR_ACTIVATION_RESULT))
        .then(Util.expectStruct(expect))
        .catch(Common.oops(this)))

    // verify that the original still exists
    it(`${aFull} should still exist`, () =>
      CLI.command(`wsk action get ${aFull}`, this.app)
        .then(ReplExpect.justOK)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(a, undefined, undefined, aPackage))
        .catch(Common.oops(this)))

    // verify that original annotations survived the copy
    it('should switch to annotations mode', () =>
      CLI.command('wsk action annotations', this.app)
        .then(ReplExpect.justOK)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(a, undefined, undefined, aPackage))
        .then(app => app.client.getText(`${Selectors.SIDECAR_CONTENT} .action-source`))
        .then(Util.expectSubset(expectAnnotations))
        .catch(Common.oops(this)))
  }

  // COPY ACTION
  it('should create an action via let', () =>
    CLI.command(`let ${actionName1} = x=>x -p ${key1} ${value1} -a ${key1} ${value1}`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName1))
      .catch(Common.oops(this)))
  cp(actionName1, actionName1b)
  cp(actionName1, actionName1c)

  // COPY PACKAGED ACTION TO NON-PACKAGED ACTION
  it('should create a packaged action via let', () =>
    CLI.command(`let ${packageName1}/${actionName2}.js = x=>x -p ${key1} ${value1} -a ${key1} ${value1}`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName2, undefined, undefined, packageName1))
      .catch(Common.oops(this)))
  cp(actionName2, actionName2b, packageName1)
  cp(actionName2, actionName2c, packageName1)

  // COPY PACKAGED ACTION TO PACKAGED ACTION, existing package
  it('should create a package', () =>
    CLI.command(`wsk package update ${packageName2}`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(packageName2))
      .catch(Common.oops(this)))
  cp(actionName2, actionName2b, packageName1, packageName2)

  // COPY PACKAGED ACTION TO PACKAGED ACTION, new package
  cp(actionName2, actionName2b, packageName1, packageName3)
})
