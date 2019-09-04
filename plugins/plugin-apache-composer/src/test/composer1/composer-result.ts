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
import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'
import * as ui from '@kui-shell/core/tests/lib/ui'

import { dirname } from 'path'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const assert = require('assert')
const cli = ui.cli
const sidecar = ui.sidecar
const ROOT = dirname(require.resolve('@kui-shell/plugin-apache-composer/tests/package.json'))

const seqName1 = 'seq1'

describe('kill composer invocation', function(this: common.ISuite) {
  before(openwhisk.before(this))
  after(common.after(this))

  /** expected return value */
  const expect = (key, value, extraExpect, expectIsIt) => {
    if (expectIsIt) {
      return extraExpect
    } else {
      const expect = {}
      expect[key] = value
      return Object.assign(expect, extraExpect)
    }
  }

  // note that we do an implicit-action use of the async command
  const invokeThenResult = (name, key, value, extraExpect = {}, expectIsIt = false) => {
    const expectedOutput = expect(key, value, extraExpect, expectIsIt)

    it(`should invoke the composition ${name} with ${key}=${value}, then get its result`, () =>
      cli
        .do(`wsk app invoke -p ${key} ${value}`, this.app)
        .then(cli.expectOK)
        .then(sidecar.expectOpen)
        .then(sidecar.expectShowing(name))
        .then(app => app.client.getText(ui.selectors.SIDECAR_ACTIVATION_ID))
        .then(sessionId =>
          cli
            .do(`wsk session get ${sessionId}`, this.app)
            .then(cli.expectOK)
            .then(sidecar.expectOpen)
            .then(sidecar.expectShowing(name))
            .then(app => app.client.getText(ui.selectors.SIDECAR_ACTIVATION_ID))
            .then(sessionId2 => assert.strictEqual(sessionId2, sessionId))
            .then(() => this.app.client.getText(ui.selectors.SIDECAR_ACTIVATION_RESULT))
            .then(ui.expectStruct(expectedOutput))
            .then(() => {
              console.log('Now issuing app result')
            })
            .then(() => cli.do(`wsk session result ${sessionId}`, this.app))
            .then(cli.expectOKWithCustom({ selector: '.hljs' }))
            .then(selector => this.app.client.getText(selector))
            .then(ui.expectStruct(expectedOutput))
        )
        .catch(common.oops(this)))
  }

  /* {
        const cmd = `app init --reset --url ${sharedURL}`
        it(`should ${cmd}`, () => cli.do(cmd, this.app)
            .then(cli.expectOKWithCustom({expect: 'Successfully initialized the required services. You may now create compositions.'}))
           .catch(common.oops(this)))
    } */

  it('should create a composer sequence', () =>
    cli
      .do(`wsk app update ${seqName1} ${ROOT}/data/composer/composer-source/echo-sequence.js`, this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(seqName1))
      // .then(sidecar.expectBadge(badges.sequence))
      .catch(common.oops(this)))

  invokeThenResult(seqName1, 'x', 3) // async, then use `app result` to fetch the rsult
})
