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

describe('Use the app list command to list the invokeable compositions', function(this: common.ISuite) {
  before(openwhisk.before(this))
  after(common.after(this))

  /* {
        const cmd = `app init --reset --url ${sharedURL}`
        it(`should ${cmd}`, () => cli.do(cmd, this.app)
            .then(cli.expectOKWithCustom({expect: 'Successfully initialized the required services. You may now create compositions.'}))
           .catch(common.oops(this)))
    } */

  // make an app
  it('should create a composer sequence', () =>
    cli
      .do(`wsk app create ${seqName1} ${ROOT}/data/composer/fsm.json`, this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(seqName1))
      .catch(common.oops(this)))

  // list it
  it(`should list ${seqName1} via app list`, () =>
    cli
      .do(`wsk app list`, this.app)
      .then(cli.expectOKWithOnly(seqName1))
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(seqName1))
      .catch(common.oops(this)))

  // make a second app
  it('should create a second composer sequence', () =>
    cli
      .do(`wsk app create ${seqName2} ${ROOT}/data/composer/fsm.json`, this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(seqName2))
      .catch(common.oops(this)))

  // list it
  it(`should list ${seqName1} via app list`, () =>
    cli
      .do(`wsk app list`, this.app)
      .then(cli.expectOKWith(seqName1)) // seqName1 had better still be in the list
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(seqName2)) // but the sidecar should be showing seqName2
      .catch(common.oops(this)))

  it(`should list ${seqName1} via wsk app list`, () =>
    cli
      .do(`wsk app list`, this.app)
      .then(cli.expectOKWith(seqName2)) // seqName2 had better also be in the list
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(seqName2))
      .catch(common.oops(this)))

  it(`should create package ppp`, () =>
    cli
      .do(`wsk package create ppp`, this.app)
      .then(cli.expectOK)
      .catch(common.oops(this)))

  // make a packaged app
  it('should create a second composer sequence', () =>
    cli
      .do(`wsk app create ppp/${seqName2} ${ROOT}/data/composer/fsm.json`, this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(seqName2, undefined, undefined, 'ppp'))
      .catch(common.oops(this)))

  // get the first app, so that the sidecar shows it (so we can test switching back to the packaged app)
  it(`should get ${seqName1}`, () =>
    cli
      .do(`wsk app get ${seqName1}`, this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(seqName1))
      .catch(common.oops(this)))

  it(`should list ppp/${seqName2} via wsk app list`, () =>
    cli
      .do(`wsk app list`, this.app)
      .then(
        cli.expectOKWithCustom({
          selector: `.entity[data-name="${seqName2}"][data-package-name="ppp"]`,
          expect: `ppp/${seqName2}`
        })
      )
      .then(selector => this.app.client.click(`${selector} .entity-name.clickable`))
      .then(() => this.app)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(seqName2, undefined, undefined, 'ppp'))
      .catch(common.oops(this)))
})
