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

describe('Use the app delete command to delete an invokeable composition', function(this: Common.ISuite) {
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

  /** invoke a composition */
  const invoke = (name, key, value, extraExpect, expectIsIt = false) => {
    it(`should invoke the composition ${name} with ${key}=${value}`, () =>
      CLI.command(`wsk app invoke ${name} -p ${key} ${value}`, this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(name))
        .then(() => this.app.client.getText(Selectors.SIDECAR_ACTIVATION_RESULT))
        .then(Util.expectStruct(expect(key, value, extraExpect, expectIsIt)))
        .catch(Common.oops(this)))
  }

  /* {
        const cmd = `app init --reset --url ${sharedURL}`
        it(`should ${cmd}`, () => CLI.command(cmd, this.app)
            .then(ReplExpect.okWithCustom({expect: 'Successfully initialized the required services. You may now create compositions.'}))
           .catch(Common.oops(this)))

    } */

  // we have to make an app before we can delete it
  it('should create a composer sequence', () =>
    CLI.command(`wsk app update ${seqName1} ${ROOT}/data/composer/composer-source/echo-sequence.js`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(seqName1))
      // .then(sidecar.expectBadge(badges.sequence))
      .catch(Common.oops(this)))
  invoke(seqName1, 'x', 3, undefined, undefined)

  it(`should get ${seqName1} via app get`, () =>
    CLI.command(`wsk app get ${seqName1}`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(seqName1)) // and sidecar should be showing it, too
      // .then(sidecar.expectBadge(badges.sequence))
      .catch(Common.oops(this)))

  // show up in the list prior to deletion
  it(`should list ${seqName1} via app list`, () =>
    CLI.command(`wsk app list`, this.app)
      .then(ReplExpect.okWithOnly(seqName1)) // seqName1 had better still be in the list
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(seqName1)) // and sidecar should be showing it, too
      // .then(sidecar.expectBadge(badges.sequence))
      .catch(Common.oops(this)))

  it(`should delete a composer sequence`, () =>
    CLI.command(`wsk app delete ${seqName1}`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.closed)
      .catch(Common.oops(this)))

  // now the list should be empty
  it(`should list nothing via wsk app list`, () =>
    CLI.command(`wsk app list`, this.app)
      .then(ReplExpect.blank) // expect empty result from the list (other than 'OK')
      .then(SidecarExpect.closed)
      .catch(Common.oops(this)))

  it(`should fail to delete an unexisting composer sequence`, () =>
    CLI.command(`wsk app delete ${seqName1}`, this.app)
      .then(ReplExpect.error(404, 'The requested resource does not exist'))
      .catch(Common.oops(this)))

  // now the package binding should NOT exist
  it('should fail to get the package binding', () =>
    CLI.command(`wsk package get openwhisk-composer.${seqName1}`, this.app)
      .then(ReplExpect.error(404))
      .catch(Common.oops(this)))
})
