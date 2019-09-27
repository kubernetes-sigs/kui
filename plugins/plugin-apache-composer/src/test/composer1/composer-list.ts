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

import { Common, CLI, ReplExpect, SidecarExpect } from '@kui-shell/test'
import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

import { dirname } from 'path'

const ROOT = dirname(require.resolve('@kui-shell/plugin-apache-composer/tests/package.json'))

const seqName1 = 'seq1'
const seqName2 = 'seq2'

describe('Use the app list command to list the invokeable compositions', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  /* {
        const cmd = `app init --reset --url ${sharedURL}`
        it(`should ${cmd}`, () => CLI.command(cmd, this.app)
            .then(ReplExpect.okWithCustom({expect: 'Successfully initialized the required services. You may now create compositions.'}))
           .catch(Common.oops(this)))
    } */

  // make an app
  it('should create a composer sequence', () =>
    CLI.command(`wsk app create ${seqName1} ${ROOT}/data/composer/fsm.json`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(seqName1))
      .catch(Common.oops(this)))

  // list it
  it(`should list ${seqName1} via app list`, () =>
    CLI.command(`wsk app list`, this.app)
      .then(ReplExpect.okWithOnly(seqName1))
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(seqName1))
      .catch(Common.oops(this)))

  // make a second app
  it('should create a second composer sequence', () =>
    CLI.command(`wsk app create ${seqName2} ${ROOT}/data/composer/fsm.json`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(seqName2))
      .catch(Common.oops(this)))

  // list it
  it(`should list ${seqName1} via app list`, () =>
    CLI.command(`wsk app list`, this.app)
      .then(ReplExpect.okWith(seqName1)) // seqName1 had better still be in the list
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(seqName2)) // but the sidecar should be showing seqName2
      .catch(Common.oops(this)))

  it(`should list ${seqName1} via wsk app list`, () =>
    CLI.command(`wsk app list`, this.app)
      .then(ReplExpect.okWith(seqName2)) // seqName2 had better also be in the list
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(seqName2))
      .catch(Common.oops(this)))

  it(`should create package ppp`, () =>
    CLI.command(`wsk package create ppp`, this.app)
      .then(ReplExpect.ok)
      .catch(Common.oops(this)))

  // make a packaged app
  it('should create a second composer sequence', () =>
    CLI.command(`wsk app create ppp/${seqName2} ${ROOT}/data/composer/fsm.json`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(seqName2, undefined, undefined, 'ppp'))
      .catch(Common.oops(this)))

  // get the first app, so that the sidecar shows it (so we can test switching back to the packaged app)
  it(`should get ${seqName1}`, () =>
    CLI.command(`wsk app get ${seqName1}`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(seqName1))
      .catch(Common.oops(this)))

  it(`should list ppp/${seqName2} via wsk app list`, () =>
    CLI.command(`wsk app list`, this.app)
      .then(
        ReplExpect.okWithCustom({
          selector: `.entity[data-name="${seqName2}"][data-package-name="ppp"]`,
          expect: `ppp/${seqName2}`
        })
      )
      .then(selector => this.app.client.click(`${selector} .entity-name.clickable`))
      .then(() => this.app)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(seqName2, undefined, undefined, 'ppp'))
      .catch(Common.oops(this)))
})
