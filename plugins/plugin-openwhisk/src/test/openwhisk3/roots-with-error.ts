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

import * as assert from 'assert'

import { Common, CLI, ReplExpect, SidecarExpect, Selectors, Util } from '@kui-shell/test'

import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

import { dirname } from 'path'

const { localDescribe } = Common
const ROOT = dirname(require.resolve('@kui-shell/plugin-openwhisk/tests/package.json'))

const goodSeqName = '59E47471-F64B-4235-8FF0-00896DDB3AFB'
const errorSeqName = 'C6F15AE8-0DE7-4C6E-8695-CDF4B9544B13'
// MAKE SURE THESE ARE UNIQUE TO THIS TEST!!!
const goodActionName = '94A2EF56-93EA-463A-9F6E-9FAF39AF9EE3'
const errorActionName = '085E6ACA-59E7-40E4-9C0A-BABB99BA976D'

const filter = (L, f) => {
  const filtered = []
  for (let idx = 0; idx < L.length; idx++) {
    if (f(L[idx])) {
      filtered.push(L[idx])
    }
  }
  return filtered
}

// TODO: webpack test
localDescribe('List root-most non-erroring activations with $$!', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  // create the component actions
  it('should create an good action', () =>
    CLI.command(`wsk action update ${goodActionName} ${ROOT}/data/openwhisk/foo.js`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(goodActionName))
      .catch(Common.oops(this)))
  it('should create an erroring action', () =>
    CLI.command(`wsk action update ${errorActionName} ${ROOT}/data/openwhisk/error.js`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(errorActionName))
      .catch(Common.oops(this)))

  // create the sequences (intentional whitespace differences in the -> portion etc., to test syntactic flexibility)
  it('should create an erroring sequence with let', () =>
    CLI.command(`let ${errorSeqName}=${goodActionName}->${errorActionName}`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(errorSeqName))
      .catch(Common.oops(this)))
  it('should create a non-erroring sequence with let', () =>
    CLI.command(`let ${goodSeqName} = ${goodActionName} -> ${goodActionName}`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(goodSeqName))
      .catch(Common.oops(this)))

  // invoke the sequences
  it('should do an async of the non-erroring sequence', () =>
    CLI.command(`wsk action async ${goodSeqName} -p name nnn`, this.app)
      .then(ReplExpect.okWithString(goodSeqName)) // e.g. "invoked `goodSeqName` with id:"
      .catch(Common.oops(this)))

  // call await
  it('should await successful completion of the activation', () =>
    CLI.command(`wsk $ await`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(goodSeqName))
      .then(() => this.app.client.getText(Selectors.SIDECAR_ACTIVATION_RESULT))
      .then(Util.expectStruct({ name: 'Step1 Step1 nnn' }))
      .catch(Common.oops(this)))

  it('should do an async of the erroring sequence', () =>
    CLI.command(`wsk action async ${errorSeqName} -p name nnn`, this.app)
      .then(ReplExpect.okWithString(errorSeqName)) // e.g. "invoked `errorSeqName` with id:"
      .catch(Common.oops(this)))

  // call await
  it('should await not-successful completion of the activation', () =>
    CLI.command(`wsk $ await`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(errorSeqName))
      .then(() => this.app.client.getText(Selectors.SIDECAR_ACTIVATION_RESULT))
      .then(Util.expectStruct({ error: 'oops' }))
      .catch(Common.oops(this)))

  // call $ roots
  it('should call $$! successfully', () =>
    CLI.command(`wsk $$!`, this.app)
      .then(ReplExpect.okWithAny)
      .catch(Common.oops(this)))

  it('should list the erroring sequence activation', () =>
    CLI.command(`wsk $$!`, this.app)
      .then(ReplExpect.okWithCustom({ passthrough: true }))
      .then(N => this.app.client.elements(Selectors.LIST_RESULTS_BY_NAME_N(N)))
      .then(namesInList => filter(namesInList, name => name === errorSeqName))
      .then(expectToBeEmpty => assert.strictEqual(expectToBeEmpty.length, 0))
      .catch(Common.oops(this)))

  it('should not list the non-erroring sequence activation', () =>
    CLI.command(`wsk $$!`, this.app)
      .then(ReplExpect.okWithCustom({ passthrough: true }))
      .then(N => this.app.client.elements(Selectors.LIST_RESULTS_BY_NAME_N(N)))
      .then(namesInList => filter(namesInList, name => name === goodSeqName))
      .then(expectToBeEmpty => assert.strictEqual(expectToBeEmpty.length, 0))
      .catch(Common.oops(this)))
})
