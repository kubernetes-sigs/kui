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
const seqName2 = 'seq2'
const seqName3 = 'seq3'

describe('session get --last and --last-failed', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  /* it('should initialize composer', () => CLI.command(`wsk app init --url ${sharedURL} --cleanse`, this.app) // cleanse important here for counting sessions in `sessions`
        .then(ReplExpect.okWithCustom({expect: 'Successfully initialized and reset the required services. You may now create compositions.'}))
       .catch(Common.oops(this))) */

  it('create sequence that invokes without error', () =>
    CLI.command(`wsk app update ${seqName1} ${ROOT}/data/composer/composer-source/echo-sequence.js`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(seqName1))
      // .then(sidecar.expectBadge(badges.sequence))
      .catch(Common.oops(this)))

  it(`should invoke ${seqName1}`, () =>
    CLI.command(`wsk app invoke ${seqName1} -p xxx 333`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(seqName1))
      .then(() => this.app.client.getText(Selectors.SIDECAR_ACTIVATION_RESULT))
      .then(Util.expectStruct({ xxx: 333 }))
      .catch(Common.oops(this)))

  it('create sequence that invokes WITH ERROR', () =>
    CLI.command(`wsk app update ${seqName2} ${ROOT}/data/composer/composer-source/error-sequence.js`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(seqName2))
      // .then(sidecar.expectBadge(badges.sequence))
      .catch(Common.oops(this)))

  it(`should show ${seqName1} with session get --last`, () =>
    this.app.client.waitUntil(() => {
      return CLI.command(`wsk session get --last`, this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(seqName1, undefined, undefined, undefined, undefined, 500))
        .then(() => this.app.client.getText(Selectors.SIDECAR_ACTIVATION_RESULT))
        .then(Util.expectStruct({ xxx: 333 }))
        .catch(Common.oops(this))
    }))

  it('create another sequence that invokes without error', () =>
    CLI.command(`wsk app update ${seqName3} ${ROOT}/data/composer/composer-source/echo-sequence.js`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(seqName3))
      // .then(sidecar.expectBadge(badges.sequence))
      .catch(Common.oops(this)))

  it(`should invoke ${seqName3}`, () =>
    CLI.command(`wsk app invoke ${seqName3} -p zzz 555`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(seqName3))
      .then(() => this.app.client.getText(Selectors.SIDECAR_ACTIVATION_RESULT))
      .then(Util.expectStruct({ zzz: 555 }))
      .catch(Common.oops(this)))

  it(`should show ${seqName1} with session get --last ${seqName1}`, () =>
    this.app.client.waitUntil(() => {
      return CLI.command(`wsk session get --last ${seqName1}`, this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(seqName1, undefined, undefined, undefined, undefined, 500))
        .then(() => this.app.client.getText(Selectors.SIDECAR_ACTIVATION_RESULT))
        .then(Util.expectStruct({ xxx: 333 }))
        .catch(Common.oops(this))
    }))

  it(`should show ${seqName3} with session get --last`, () =>
    this.app.client.waitUntil(() => {
      return CLI.command(`wsk session get --last`, this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(seqName3, undefined, undefined, undefined, undefined, 500))
        .then(() => this.app.client.getText(Selectors.SIDECAR_ACTIVATION_RESULT))
        .then(Util.expectStruct({ zzz: 555 }))
        .catch(Common.oops(this))
    }))

  it(`should invoke ${seqName2}`, () =>
    CLI.command(`wsk app invoke ${seqName2} -p yyy 444`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.openWithFailure)
      .then(SidecarExpect.showing(seqName2))
      .then(() => this.app.client.getText(Selectors.SIDECAR_ACTIVATION_RESULT))
      .then(Util.expectStruct({ error: { yyy: 444 } }))
      .catch(Common.oops(this)))

  it(`should show ${seqName1} with session get --last ${seqName1}`, () =>
    this.app.client.waitUntil(() => {
      return CLI.command(`wsk session get --last ${seqName1}`, this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(seqName1, undefined, undefined, undefined, undefined, 500))
        .then(() => this.app.client.getText(Selectors.SIDECAR_ACTIVATION_RESULT))
        .then(Util.expectStruct({ xxx: 333 }))
        .catch(Common.oops(this))
    }))

  it(`should show ${seqName2} with session get --last-failed`, () =>
    this.app.client.waitUntil(() => {
      return CLI.command(`wsk session get --last-failed`, this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(seqName2, undefined, undefined, undefined, undefined, 500))
        .then(() => this.app.client.getText(Selectors.SIDECAR_ACTIVATION_RESULT))
        .then(Util.expectStruct({ error: { yyy: 444 } }))
        .catch(Common.oops(this))
    }))

  it(`should invoke ${seqName3}`, () =>
    CLI.command(`wsk app invoke ${seqName3} -p zzz 555`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(seqName3))
      .then(() => this.app.client.getText(Selectors.SIDECAR_ACTIVATION_RESULT))
      .then(Util.expectStruct({ zzz: 555 }))
      .catch(Common.oops(this)))

  it(`should show ${seqName2} with session get --last-failed`, () =>
    this.app.client.waitUntil(() => {
      return CLI.command(`wsk session get --last-failed`, this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(seqName2, undefined, undefined, undefined, undefined, 500))
        .then(() => this.app.client.getText(Selectors.SIDECAR_ACTIVATION_RESULT))
        .then(Util.expectStruct({ error: { yyy: 444 } }))
        .catch(Common.oops(this))
    }))

  // make sure session get works as the first command after a restart
  it('should restart', () => this.app.client.execute('window.location.reload()'))
  it(`should show ${seqName2} with session get --last-failed`, () =>
    this.app.client.waitUntil(() => {
      return CLI.command(`wsk session get --last-failed`, this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(seqName2, undefined, undefined, undefined, undefined, 500))
        .then(() => this.app.client.getText(Selectors.SIDECAR_ACTIVATION_RESULT))
        .then(Util.expectStruct({ error: { yyy: 444 } }))
        .catch(Common.oops(this))
    }))
})
