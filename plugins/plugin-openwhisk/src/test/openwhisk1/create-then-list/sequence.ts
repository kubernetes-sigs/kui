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

import * as common from '@kui-shell/core/tests/lib/common'
import * as ui from '@kui-shell/core/tests/lib/ui'
import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

import { dirname } from 'path'
const { cli, sidecar } = ui
const { localDescribe } = common
const ROOT = dirname(require.resolve('@kui-shell/plugin-openwhisk/tests/package.json'))

// TODO: webpack test
localDescribe('Create a sequence, then list it', function(this: common.ISuite) {
  before(openwhisk.before(this))
  after(common.after(this))

  // create an action, using the implicit entity type
  it('should create an action', () =>
    cli
      .do(`wsk action create foo ${ROOT}/data/openwhisk/foo.js`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing('foo')))

  // create the second action
  it('should create an action', () =>
    cli
      .do(`wsk action create foo2 ${ROOT}/data/openwhisk/foo2.js`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing('foo2')))

  // create a sequence
  it('should create a sequence', () =>
    cli
      .do(`wsk action create sss1 --sequence foo,foo2`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing('sss1')))

  // create a sequence
  it('should create a sequence, alternate --sequence order', () =>
    cli
      .do(`wsk action create sss2 foo,foo2 --sequence`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing('sss2')))

  // create a sequence
  it('should create a sequence, another alternate --sequence order', () =>
    cli
      .do(`wsk action create --sequence sss3 foo,foo2`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing('sss3')))

  // list tests
  it(`should find foo with "wsk action list"`, () => cli.do('wsk action list', this.app).then(cli.expectOKWith('foo')))
  it(`should find foo2 "wsk action list"`, () => cli.do(`wsk action list`, this.app).then(cli.expectOKWith('foo2')))
  it(`should find sss1 with "wsk action list"`, () =>
    cli.do(`wsk action list`, this.app).then(cli.expectOKWith('sss1')))
  it(`should find sss2 with "wsk action list"`, () =>
    cli.do(`wsk action list`, this.app).then(cli.expectOKWith('sss2')))
  it(`should find sss3 with "wsk action list"`, () =>
    cli.do(`wsk action list`, this.app).then(cli.expectOKWith('sss3')))

  // click on a sequence component bubble
  it('should show action after clicking on bubble', async () => {
    await this.app.client.click(ui.selectors.SIDECAR_SEQUENCE_CANVAS_NODE_N(0))
    return sidecar.expectOpen(this.app).then(sidecar.expectShowing('foo'))
  })
})
