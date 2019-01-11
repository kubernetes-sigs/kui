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

import { ISuite } from '@test/lib/common'
import { join } from 'path'
const ROOT = process.env.TEST_ROOT
const common = require(join(ROOT, 'lib/common'))

const ui = require(join(ROOT, 'lib/ui'))
const cli = ui.cli
const sidecar = ui.sidecar
// sharedURL = process.env.REDIS_URL || 'redis://127.0.0.1:6379'
const seqName1 = 'seq1'
const seqName2 = 'seq2'

describe('Use the app list command to list the invokeable compositions', function (this: ISuite) {
  before(common.before(this))
  after(common.after(this))

  it('should have an active repl', () => cli.waitForRepl(this.app))

  /* {
        const cmd = `app init --reset --url ${sharedURL}`
        it(`should ${cmd}`, () => cli.do(cmd, this.app)
            .then(cli.expectOKWithCustom({expect: 'Successfully initialized the required services. You may now create compositions.'}))
           .catch(common.oops(this)))
    } */

  // make an app
  it('should create a composer sequence', () => cli.do(`app create ${seqName1} ./data/composer/fsm.json`, this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing(seqName1))
    // .then(sidecar.expectBadge(badges.fsm))
    .catch(common.oops(this)))

  // list it
  it(`should list ${seqName1} via app list`, () => cli.do(`app list`, this.app)
    .then(cli.expectOKWithOnly(seqName1))
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing(seqName1))
    // .then(sidecar.expectBadge(badges.fsm))
    .catch(common.oops(this)))

  // make a second app
  it('should create a second composer sequence', () => cli.do(`app create ${seqName2} ./data/composer/fsm.json`, this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing(seqName2))
    // .then(sidecar.expectBadge(badges.fsm))
    .catch(common.oops(this)))

  // list it
  it(`should list ${seqName1} via app list`, () => cli.do(`app list`, this.app)
    .then(cli.expectOKWith(seqName1)) // seqName1 had better still be in the list
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing(seqName2)) // but the sidecar should be showing seqName2
    // .then(sidecar.expectBadge(badges.fsm))
    .catch(common.oops(this)))

  it(`should list ${seqName1} via wsk app list`, () => cli.do(`wsk app list`, this.app)
    .then(cli.expectOKWith(seqName2)) // seqName2 had better also be in the list
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing(seqName2))
    // .then(sidecar.expectBadge(badges.fsm))
    .catch(common.oops(this)))

  it(`should create package ppp`, () => cli.do(`wsk package create ppp`, this.app)
    .then(cli.expectOK)
    .catch(common.oops(this)))

  // make a packaged app
  it('should create a second composer sequence', () => cli.do(`app create ppp/${seqName2} ./data/composer/fsm.json`, this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing(seqName2, undefined, undefined, 'ppp'))
    // .then(sidecar.expectBadge(badges.fsm))
    .catch(common.oops(this)))

  // get the first app, so that the sidecar shows it (so we can test switching back to the packaged app)
  it(`should get ${seqName1}`, () => cli.do(`app get ${seqName1}`, this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing(seqName1))
    // .then(sidecar.expectBadge(badges.fsm))
    .catch(common.oops(this)))

  it(`should list ppp/${seqName2} via wsk app list`, () => cli.do(`app list`, this.app)
    .then(cli.expectOKWithCustom({ selector: `.entity[data-name="${seqName2}"][data-package-name="ppp"]`,
      expect: `ppp/${seqName2}`
    }))
    .then(selector => this.app.client.click(`${selector} .entity-name.clickable`))
    .then(() => this.app)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing(seqName2, undefined, undefined, 'ppp'))
    .catch(common.oops(this)))
})
