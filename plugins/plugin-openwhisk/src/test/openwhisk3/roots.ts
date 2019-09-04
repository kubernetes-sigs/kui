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

/* const common = require('../../../lib/common')
const ui = require('../../../lib/ui')
const assert = require('assert')
const cli = ui.cli
const sidecar = ui.sidecar
const seqName = 'roots-test-B98D0BB4-137D-4E35-B4AC-E22E1E8A2630'
// MAKE SURE THESE ARE UNIQUE TO THIS TEST!!!
const actionNames = ['roots-test-DEE0231E-4911-4755-BB79-BFE971E53FD6',
  'roots-test-E835ED52-35D1-4A00-8262-7D37CCFCB6E7',
  'roots-test-8B368CCB-BA87-4E02-98D0-A11C564B4367']

const filter = (L, f) => {
  const filtered = []
  for (let idx = 0; idx < L.length; idx++) {
    if (f(L[idx])) {
      filtered.push(L[idx])
    }
  }
  return filtered
} */

describe('List root-most activations with $$', function() {
  // disabled until the bluewhisk views finish updating 20170927
  /*
  before(openwhisk.before(this))
  after(common.after(this))

  // create the component actions
  actionNames.forEach(actionName => {
    it('should create an action via let', () => cli.do(`let ${actionName}.js = x=>x`, this.app)
    .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName))
      .catch(common.oops(this)))
  })

  // create the sequence with white spaces
  it(`should create a sequence ${seqName} with let`, () => cli.do(`let ${seqName} = ${actionNames.join(' -> ')}`, this.app)
    .then(cli.expectJustOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing(seqName))
    .catch(common.oops(this)))

  // invoke the sequence
  it(`should do an async of the sequence ${seqName}, using implicit context`, () => cli.do(`wsk action async -p y 3`, this.app)
    .then(cli.expectJustOK)
    .catch(common.oops(this)))

  // call await
  it('should await successful completion of the activation', () => cli.do(`wsk $ await`, this.app)
    .then(cli.expectJustOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing(seqName))
    .then(() => this.app.client.getText(ui.selectors.SIDECAR_ACTIVATION_RESULT))
    .then(ui.expectStruct({'y': 3}))
    .catch(common.oops(this)))

  // call $ roots
  it('should call $ roots successfully', () => cli.do(`wsk $ roots`, this.app)
    .then(cli.expectJustOK)
    .catch(common.oops(this)))

  it('should list only the sequence activation', () => cli.do(`wsk $ roots --limit 200`, this.app)
    .then(cli.expectOKWithCustom({ passthrough: true}))
    .then(N => this.app.client.elements(ui.selectors.LIST_RESULTS_BY_NAME_N(N)))
    .then(namesInList => filter(namesInList, name => actionNames.indexOf(name) >= 0)) // any of the actionNames? there better not be!
    .then(expectToBeEmpty => assert.equal(expectToBeEmpty.length, 0))
    .catch(common.oops(this)))

  // call $$
  it('should call $$ successfully', () => cli.do(`wsk $$`, this.app)
    .then(cli.expectJustOK)
    .catch(common.oops(this)))
  it('should list only the sequence activation with $$', () => cli.do(`wsk $$ --limit 200`, this.app)
    .then(cli.expectOKWithCustom({ passthrough: true}))
    .then(N => this.app.client.getText(ui.selectors.LIST_RESULTS_BY_NAME_N(N)))
    .then(namesInList => namesInList.filter(name => actionNames.indexOf(name) >= 0)) // any of the actionNames? there better not be!
    .then(expectToBeEmpty => assert.equal(expectToBeEmpty.length, 0))
    .catch(common.oops(this)))
  it('should list nothing with $$ xxx', () => cli.do(`wsk $$ xxxyyyzzzyfdsfdasfjasfdas --limit 200`, this.app)
    .then(cli.expectOKWithCustom({ passthrough: true}))
    .then(N => this.app.client.elements(ui.selectors.LIST_RESULTS_BY_NAME_N(N)))
    .then(namesInList => assert.equal(namesInList.value.length, 0)) // with a junk "xxx" filter, the seq better not appear
    .catch(common.oops(this)))
  it(`should list the sequence activation with $$ ${seqName}`, () => cli.do(`wsk $$ ${seqName} --limit 200`, this.app)
    .then(cli.expectOKWithCustom({ passthrough: true}))
    .then(N => this.app.client.getText(ui.selectors.LIST_RESULTS_BY_NAME_N(N)))
    .then(namesInList => namesInList === seqName ? [namesInList] : namesInList.filter(name => seqName === name))
    .then(expectToBeNonEmpty => { console.log(expectToBeNonEmpty); assert.ok(expectToBeNonEmpty.length > 0) })
    .catch(common.oops(this)))

  // double check that $ list shows a, b, and c
  actionNames.forEach(actionName => {
    it('should list all of the activations', () => cli.do(`wsk $ list --limit 100 --name ${actionName}`, this.app)
      .then(cli.expectOKWith(actionName))
      .catch(common.oops(this)))
  }) */
})
