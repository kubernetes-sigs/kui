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

/**
 * tests that create an action and test that it shows up in the list UI
 *    this test also covers toggling the sidecar
 */

import { Common, CLI, ReplExpect, SidecarExpect } from '@kui-shell/test'

import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

import { dirname } from 'path'

const { localDescribe } = Common
const ROOT = dirname(require.resolve('@kui-shell/plugin-openwhisk/tests/package.json'))

// TODO: webpack test
localDescribe('Create a sequence, then list it', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  // create an action, using the implicit entity type
  it('should create an action', () =>
    CLI.command(`wsk action create foo ${ROOT}/data/openwhisk/foo.js`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('foo')))

  // create the second action
  it('should create an action', () =>
    CLI.command(`wsk action create foo2 ${ROOT}/data/openwhisk/foo2.js`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('foo2')))

  // create a sequence
  it('should create a sequence', () =>
    CLI.command(`wsk action create sss1 --sequence foo,foo2`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('sss1')))

  // create a sequence
  it('should create a sequence, alternate --sequence order', () =>
    CLI.command(`wsk action create sss2 foo,foo2 --sequence`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('sss2')))

  // create a sequence
  it('should create a sequence, another alternate --sequence order', async () => {
    try {
      await CLI.command(`wsk action create --sequence sss3 foo,foo2`, this.app)
        .then(ReplExpect.justOK)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing('sss3'))

      // await this.app.client.click(Selectors.SIDECAR_SEQUENCE_CANVAS_NODE_N(0))
      // return SidecarExpect.openInBlockAfter(res).then(SidecarExpect.showing('foo'))
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })

  // list tests
  it(`should find foo with "wsk action list"`, () =>
    CLI.command('wsk action list', this.app).then(ReplExpect.okWith('foo')))
  it(`should find foo2 "wsk action list"`, () =>
    CLI.command(`wsk action list`, this.app).then(ReplExpect.okWith('foo2')))
  it(`should find sss1 with "wsk action list"`, () =>
    CLI.command(`wsk action list`, this.app).then(ReplExpect.okWith('sss1')))
  it(`should find sss2 with "wsk action list"`, () =>
    CLI.command(`wsk action list`, this.app).then(ReplExpect.okWith('sss2')))
  it(`should find sss3 with "wsk action list"`, () =>
    CLI.command(`wsk action list`, this.app).then(ReplExpect.okWith('sss3')))
})
