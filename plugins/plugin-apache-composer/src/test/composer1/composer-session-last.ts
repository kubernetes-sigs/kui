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
const cli = ui.cli
const sidecar = ui.sidecar
const ROOT = dirname(require.resolve('@kui-shell/plugin-apache-composer/tests/package.json'))

const seqName1 = 'seq1'
const seqName2 = 'seq2'
const seqName3 = 'seq3'

describe('session get --last and --last-failed', function(this: common.ISuite) {
  before(openwhisk.before(this))
  after(common.after(this))

  /* it('should initialize composer', () => cli.do(`wsk app init --url ${sharedURL} --cleanse`, this.app) // cleanse important here for counting sessions in `sessions`
        .then(cli.expectOKWithCustom({expect: 'Successfully initialized and reset the required services. You may now create compositions.'}))
       .catch(common.oops(this))) */

  it('create sequence that invokes without error', () =>
    cli
      .do(`wsk app update ${seqName1} ${ROOT}/data/composer/composer-source/echo-sequence.js`, this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(seqName1))
      // .then(sidecar.expectBadge(badges.sequence))
      .catch(common.oops(this)))

  it(`should invoke ${seqName1}`, () =>
    cli
      .do(`wsk app invoke ${seqName1} -p xxx 333`, this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(seqName1))
      .then(() => this.app.client.getText(ui.selectors.SIDECAR_ACTIVATION_RESULT))
      .then(ui.expectStruct({ xxx: 333 }))
      .catch(common.oops(this)))

  it('create sequence that invokes WITH ERROR', () =>
    cli
      .do(`wsk app update ${seqName2} ${ROOT}/data/composer/composer-source/error-sequence.js`, this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(seqName2))
      // .then(sidecar.expectBadge(badges.sequence))
      .catch(common.oops(this)))

  it(`should show ${seqName1} with session get --last`, () =>
    this.app.client.waitUntil(() => {
      return cli
        .do(`wsk session get --last`, this.app)
        .then(cli.expectOK)
        .then(sidecar.expectOpen)
        .then(sidecar.expectShowing(seqName1, undefined, undefined, undefined, undefined, 500))
        .then(() => this.app.client.getText(ui.selectors.SIDECAR_ACTIVATION_RESULT))
        .then(ui.expectStruct({ xxx: 333 }))
        .catch(common.oops(this))
    }))

  it('create another sequence that invokes without error', () =>
    cli
      .do(`wsk app update ${seqName3} ${ROOT}/data/composer/composer-source/echo-sequence.js`, this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(seqName3))
      // .then(sidecar.expectBadge(badges.sequence))
      .catch(common.oops(this)))

  it(`should invoke ${seqName3}`, () =>
    cli
      .do(`wsk app invoke ${seqName3} -p zzz 555`, this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(seqName3))
      .then(() => this.app.client.getText(ui.selectors.SIDECAR_ACTIVATION_RESULT))
      .then(ui.expectStruct({ zzz: 555 }))
      .catch(common.oops(this)))

  it(`should show ${seqName1} with session get --last ${seqName1}`, () =>
    this.app.client.waitUntil(() => {
      return cli
        .do(`wsk session get --last ${seqName1}`, this.app)
        .then(cli.expectOK)
        .then(sidecar.expectOpen)
        .then(sidecar.expectShowing(seqName1, undefined, undefined, undefined, undefined, 500))
        .then(() => this.app.client.getText(ui.selectors.SIDECAR_ACTIVATION_RESULT))
        .then(ui.expectStruct({ xxx: 333 }))
        .catch(common.oops(this))
    }))

  it(`should show ${seqName3} with session get --last`, () =>
    this.app.client.waitUntil(() => {
      return cli
        .do(`wsk session get --last`, this.app)
        .then(cli.expectOK)
        .then(sidecar.expectOpen)
        .then(sidecar.expectShowing(seqName3, undefined, undefined, undefined, undefined, 500))
        .then(() => this.app.client.getText(ui.selectors.SIDECAR_ACTIVATION_RESULT))
        .then(ui.expectStruct({ zzz: 555 }))
        .catch(common.oops(this))
    }))

  it(`should invoke ${seqName2}`, () =>
    cli
      .do(`wsk app invoke ${seqName2} -p yyy 444`, this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpenWithFailure)
      .then(sidecar.expectShowing(seqName2))
      .then(() => this.app.client.getText(ui.selectors.SIDECAR_ACTIVATION_RESULT))
      .then(ui.expectStruct({ error: { yyy: 444 } }))
      .catch(common.oops(this)))

  it(`should show ${seqName1} with session get --last ${seqName1}`, () =>
    this.app.client.waitUntil(() => {
      return cli
        .do(`wsk session get --last ${seqName1}`, this.app)
        .then(cli.expectOK)
        .then(sidecar.expectOpen)
        .then(sidecar.expectShowing(seqName1, undefined, undefined, undefined, undefined, 500))
        .then(() => this.app.client.getText(ui.selectors.SIDECAR_ACTIVATION_RESULT))
        .then(ui.expectStruct({ xxx: 333 }))
        .catch(common.oops(this))
    }))

  it(`should show ${seqName2} with session get --last-failed`, () =>
    this.app.client.waitUntil(() => {
      return cli
        .do(`wsk session get --last-failed`, this.app)
        .then(cli.expectOK)
        .then(sidecar.expectOpen)
        .then(sidecar.expectShowing(seqName2, undefined, undefined, undefined, undefined, 500))
        .then(() => this.app.client.getText(ui.selectors.SIDECAR_ACTIVATION_RESULT))
        .then(ui.expectStruct({ error: { yyy: 444 } }))
        .catch(common.oops(this))
    }))

  it(`should invoke ${seqName3}`, () =>
    cli
      .do(`wsk app invoke ${seqName3} -p zzz 555`, this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(seqName3))
      .then(() => this.app.client.getText(ui.selectors.SIDECAR_ACTIVATION_RESULT))
      .then(ui.expectStruct({ zzz: 555 }))
      .catch(common.oops(this)))

  it(`should show ${seqName2} with session get --last-failed`, () =>
    this.app.client.waitUntil(() => {
      return cli
        .do(`wsk session get --last-failed`, this.app)
        .then(cli.expectOK)
        .then(sidecar.expectOpen)
        .then(sidecar.expectShowing(seqName2, undefined, undefined, undefined, undefined, 500))
        .then(() => this.app.client.getText(ui.selectors.SIDECAR_ACTIVATION_RESULT))
        .then(ui.expectStruct({ error: { yyy: 444 } }))
        .catch(common.oops(this))
    }))

  // make sure session get works as the first command after a restart
  it('should restart', () => this.app.client.execute('window.location.reload()'))
  it(`should show ${seqName2} with session get --last-failed`, () =>
    this.app.client.waitUntil(() => {
      return cli
        .do(`wsk session get --last-failed`, this.app)
        .then(cli.expectOK)
        .then(sidecar.expectOpen)
        .then(sidecar.expectShowing(seqName2, undefined, undefined, undefined, undefined, 500))
        .then(() => this.app.client.getText(ui.selectors.SIDECAR_ACTIVATION_RESULT))
        .then(ui.expectStruct({ error: { yyy: 444 } }))
        .catch(common.oops(this))
    }))
})
