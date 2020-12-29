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

import { Common, CLI, ReplExpect, SidecarExpect, Util } from '@kui-shell/test'

import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

const actionName1 = 'foo1'
const actionName1b = 'foo1b'
const actionName2 = 'foo2'
const actionName2b = 'foo2b'
const packageName1 = 'ppp1'
const packageName2 = 'ppp2'
const packageName3 = 'ppp3'
const key1 = 'foo'
const value1 = 'bar'

describe('Rename actions', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

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
      CLI.command(`wsk action rename ${aFull} ${bFull}`, this.app)
        .then(ReplExpect.justOK)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(b, bPackage))
        .catch(Common.oops(this)))

    // verify that annotations survived the rename
    it('should switch to annotations mode', () =>
      CLI.command('wsk action annotations', this.app)
        .then(ReplExpect.justOK)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(b, bPackage))
        .then(Util.getValueFromMonaco)
        .then(Util.expectYAMLSubset(expectAnnotations)))

    // invoke the renamed action
    it(`should invoke the copied action ${bFull}`, () =>
      CLI.command(`wsk action invoke -p "${key}" "${value}"`, this.app)
        .then(ReplExpect.justOK)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(b))
        .then(Util.getValueFromMonaco)
        .then(Util.expectYAML(expect)))

    // verify that the original does not exist
    it(`${aFull} should NOT exist`, async () => {
      try {
        const res = await CLI.command(`wsk action get ${aFull}`, this.app)
        await ReplExpect.error(404, 'The requested resource does not exist.')(res)

        await SidecarExpect.open(res).then(SidecarExpect.showing(b))
      } catch (err) {
        await Common.oops(this, true)(err)
      }
    })
  }

  // RENAME ACTION
  it('should create an action via let', () =>
    CLI.command(`let ${actionName1} = x=>x -p ${key1} ${value1} -a ${key1} ${value1}`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName1))
      .catch(Common.oops(this)))
  mv('non-package to non-package', actionName1, actionName1b)

  // RENAME PACKAGED ACTION TO NON-PACKAGED ACTION
  it('should create a packaged action via let', () =>
    CLI.command(`let ${packageName1}/${actionName2}.js = x=>x -p ${key1} ${value1} -a ${key1} ${value1}`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName2, packageName1))
      .catch(Common.oops(this)))
  mv('package to non-package', actionName2, actionName2b, packageName1)

  // RENAME non-packaged ACTION TO PACKAGED ACTION, existing package
  it('should create a package', () =>
    CLI.command(`wsk package update ${packageName2}`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(packageName2))
      .catch(Common.oops(this)))
  mv('non-package to existing package', actionName1b, actionName2b, undefined, packageName2)

  // RENAME PACKAGED ACTION TO PACKAGED ACTION, new package
  mv('existing package to existing package', actionName2b, actionName1, packageName2, packageName3)
})
