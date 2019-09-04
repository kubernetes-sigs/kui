/*
 * Copyright 2018 IBM Corporation
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
import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'
import * as ui from '@kui-shell/core/tests/lib/ui'

import { dirname } from 'path'
const cli = ui.cli
const sidecar = ui.sidecar
const ROOT = dirname(require.resolve('@kui-shell/plugin-apache-composer/tests/package.json'))

const seqName1 = 'seq1'

describe('app invoke -r', function(this: common.ISuite) {
  before(openwhisk.before(this))
  after(common.after(this))

  for (let idx = 1; idx <= 3; idx++) {
    const name = `foo${idx}`
    it(`should create an action ${name} via let`, () =>
      cli
        .do(`let ${name} = x=>x`, this.app)
        .then(cli.expectOK)
        .then(sidecar.expectOpen)
        .then(sidecar.expectShowing(name))
        .catch(common.oops(this)))
  }

  it('should create a composer sequence', () =>
    cli
      .do(`wsk app create ${seqName1} ${ROOT}/data/composer/fsm.json`, this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(seqName1))
      .catch(common.oops(this)))

  for (let idx = 0; idx < 5; idx++) {
    it(`should invoke ${seqName1} with implicit entity idx=${idx}`, () =>
      cli
        .do(`wsk app invoke -r -p name grumble${idx}`, this.app)
        .then(cli.expectOKWithCustom({ selector: '.json' }))
        .then(selector => this.app.client.getText(selector))
        .then(ui.expectStruct({ name: `grumble${idx}` }))
        .catch(common.oops(this)))
  }
})
