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

// eslint-disable-next-line @typescript-eslint/no-var-requires
const assert = require('assert')

const ROOT = dirname(require.resolve('@kui-shell/plugin-apache-composer/tests/package.json'))

const seqName1 = 'seq1'

describe('kill composer invocation', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

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
      CLI.command(`wsk app invoke -p ${key} ${value}`, this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(name))
        .then(app => app.client.getText(Selectors.SIDECAR_ACTIVATION_ID))
        .then(sessionId =>
          CLI.command(`wsk session get ${sessionId}`, this.app)
            .then(ReplExpect.ok)
            .then(SidecarExpect.open)
            .then(SidecarExpect.showing(name))
            .then(app => app.client.getText(Selectors.SIDECAR_ACTIVATION_ID))
            .then(sessionId2 => assert.strictEqual(sessionId2, sessionId))
            .then(() => this.app.client.getText(Selectors.SIDECAR_ACTIVATION_RESULT))
            .then(Util.expectStruct(expectedOutput))
            .then(() => {
              console.log('Now issuing app result')
            })
            .then(() => CLI.command(`wsk session result ${sessionId}`, this.app))
            .then(ReplExpect.okWithCustom({ selector: '.hljs' }))
            .then(selector => this.app.client.getText(selector))
            .then(Util.expectStruct(expectedOutput))
        )
        .catch(Common.oops(this)))
  }

  /* {
        const cmd = `app init --reset --url ${sharedURL}`
        it(`should ${cmd}`, () => CLI.command(cmd, this.app)
            .then(ReplExpect.okWithCustom({expect: 'Successfully initialized the required services. You may now create compositions.'}))
           .catch(Common.oops(this)))
    } */

  it('should create a composer sequence', () =>
    CLI.command(`wsk app update ${seqName1} ${ROOT}/data/composer/composer-source/echo-sequence.js`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(seqName1))
      // .then(sidecar.expectBadge(badges.sequence))
      .catch(Common.oops(this)))

  invokeThenResult(seqName1, 'x', 3) // async, then use `app result` to fetch the rsult
})
