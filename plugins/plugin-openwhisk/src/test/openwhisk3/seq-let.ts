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

const seqName = 'seq'
const seqName2 = 'seq2'
const seqName3 = 'seq3'
const seqName4 = 'seq4'
const seqName5 = 'seq5'
const actionNames = ['a', 'b', 'c']

describe('Create a sequence via let', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  // create the component actions
  actionNames.forEach(actionName => {
    it(`should create an action ${actionName} via let`, () =>
      CLI.command(`let ${actionName}.js = x=>x`, this.app)
        .then(ReplExpect.justOK)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(actionName))
        .catch(Common.oops(this, true)))
  })

  // create the sequence with white spaces
  it('should create a sequence with white spaces', () =>
    CLI.command(`let ${seqName} = ${actionNames.join(' -> ')}`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(seqName))
      .catch(Common.oops(this, true)))

  // create the sequence without white spaces
  it('should create a sequence without white spaces', () =>
    CLI.command(`let ${seqName2}=${actionNames.join('->')}`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(seqName2))
      .catch(Common.oops(this, true)))

  // create the sequence with white spaces
  it('should create a sequence with inline function', () =>
    CLI.command(`let ${seqName4} = a->x=>({y:x.y})->b`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(seqName4))
      .catch(Common.oops(this, true)))

  // create the sequence with white spaces
  it('should create a sequence with two inline functions', () =>
    CLI.command(`let ${seqName5} = a->x=>({y:x.y})->x=>({y:x.y})->b`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(seqName5))
      .catch(Common.oops(this, true)))

  // do a recursive delete
  it(`should delete ${seqName5} and its two inline anonymous functions`, () =>
    CLI.command(`wsk action rimraf -r ${seqName5}`, this.app)
      .then(ReplExpect.okWithCustom({ expect: 'deleted 3 elements', exact: true }))
      .then(SidecarExpect.closed)
      .catch(Common.oops(this, true)))

  // create the sequence with a max of white spaces
  it('should create a sequence with a mix of white space', () =>
    CLI.command(`let ${seqName3}= ${actionNames.join('-> ')}`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(seqName3))
      .catch(Common.oops(this, true)))

  // invoke one of the sequences
  it('should do an async of the sequence, using implicit context', () =>
    CLI.command(`wsk action async -p y 3`, this.app).then(ReplExpect.okWithString(seqName3))) // e.g. "invoked `seqname3` with id:"

  // call await
  it('should await successful completion of the activation', () =>
    CLI.command(`await`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(seqName3))
      .then(() => this.app.client.getText(Selectors.SIDECAR_ACTIVATION_RESULT))
      .then(Util.expectStruct({ y: 3 }))
      .catch(Common.oops(this, true)))
})
