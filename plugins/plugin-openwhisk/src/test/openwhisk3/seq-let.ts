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

const seqName = 'seq'
const seqName2 = 'seq2'
const seqName3 = 'seq3'
const seqName4 = 'seq4'
const seqName5 = 'seq5'
const actionNames = ['a', 'b', 'c']

describe('Create a sequence via let', function(this: common.ISuite) {
  before(openwhisk.before(this))
  after(common.after(this))

  // create the component actions
  actionNames.forEach(actionName => {
    it(`should create an action ${actionName} via let`, () =>
      cli
        .do(`let ${actionName}.js = x=>x`, this.app)
        .then(cli.expectJustOK)
        .then(sidecar.expectOpen)
        .then(sidecar.expectShowing(actionName))
        .catch(common.oops(this, true)))
  })

  // create the sequence with white spaces
  it('should create a sequence with white spaces', () =>
    cli
      .do(`let ${seqName} = ${actionNames.join(' -> ')}`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(seqName))
      .catch(common.oops(this, true)))

  // create the sequence without white spaces
  it('should create a sequence without white spaces', () =>
    cli
      .do(`let ${seqName2}=${actionNames.join('->')}`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(seqName2))
      .catch(common.oops(this, true)))

  // create the sequence with white spaces
  it('should create a sequence with inline function', () =>
    cli
      .do(`let ${seqName4} = a->x=>({y:x.y})->b`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(seqName4))
      .catch(common.oops(this, true)))

  // create the sequence with white spaces
  it('should create a sequence with two inline functions', () =>
    cli
      .do(`let ${seqName5} = a->x=>({y:x.y})->x=>({y:x.y})->b`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(seqName5))
      .catch(common.oops(this, true)))

  // do a recursive delete
  it(`should delete ${seqName5} and its two inline anonymous functions`, () =>
    cli
      .do(`wsk action rimraf -r ${seqName5}`, this.app)
      .then(cli.expectOKWithCustom({ expect: 'deleted 3 elements', exact: true }))
      .then(sidecar.expectClosed)
      .catch(common.oops(this, true)))

  // create the sequence with a max of white spaces
  it('should create a sequence with a mix of white space', () =>
    cli
      .do(`let ${seqName3}= ${actionNames.join('-> ')}`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(seqName3))
      .catch(common.oops(this, true)))

  // invoke one of the sequences
  it('should do an async of the sequence, using implicit context', () =>
    cli.do(`wsk action async -p y 3`, this.app).then(cli.expectOKWithString(seqName3))) // e.g. "invoked `seqname3` with id:"

  // call await
  it('should await successful completion of the activation', () =>
    cli
      .do(`await`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(seqName3))
      .then(() => this.app.client.getText(ui.selectors.SIDECAR_ACTIVATION_RESULT))
      .then(ui.expectStruct({ y: 3 }))
      .catch(common.oops(this, true)))
})
