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

import { dirname } from 'path'
const ROOT = dirname(require.resolve('@kui-shell/plugin-apache-composer/tests/package.json'))

const seqName1 = 'seq1'

describe('app invoke with implicit entity', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  for (let idx = 1; idx <= 3; idx++) {
    const name = `foo${idx}`
    it(`should create an action ${name} via let`, () =>
      CLI.command(`let ${name} = x=>x`, this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(name))
        .catch(Common.oops(this)))
  }

  it('should create a composer sequence', () =>
    CLI.command(`wsk app create ${seqName1} ${ROOT}/data/composer/fsm.json`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(seqName1))
      .catch(Common.oops(this)))

  for (let idx = 0; idx < 5; idx++) {
    it(`should invoke ${seqName1} with implicit entity idx=${idx}`, () =>
      CLI.command(`wsk app invoke -p name grumble${idx}`, this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(seqName1))
        .then(() => this.app.client.getText(Selectors.SIDECAR_ACTIVATION_RESULT))
        .then(Util.expectStruct({ name: `grumble${idx}` }))
        .catch(Common.oops(this)))
  }
})
