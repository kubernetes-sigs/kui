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

import * as common from '@test/lib/common'
import * as ui from '@test/lib/ui'
import * as openwhisk from '@test/lib/openwhisk/openwhisk'
const { cli, selectors, sidecar } = ui

describe('Create a sequence, list it, delete it', function (this: common.ISuite) {
  before(openwhisk.before(this))
  after(common.after(this))

  it('should have an active repl', () => cli.waitForRepl(this.app))

  const rm = ui.aliases.remove[0]

  // create an action, using the implicit entity type
  it('should create an action', () => cli.do(`action create foo ./data/openwhisk/foo.js`, this.app)
    .then(cli.expectJustOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('foo')))
  it('should create a second action', () => cli.do(`action create foo2 ./data/openwhisk/foo2.js`, this.app)
    .then(cli.expectJustOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('foo2')))

  it('should create a sequence', () => cli.do(`action create --sequence sss foo,foo2`, this.app)
    .then(cli.expectJustOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('sss')))

  // list it
  it(`should find the new sequence with "list"`, () => cli.do('action list', this.app).then(cli.expectOKWith('sss')))

  // delete the actions, keeping the sequence around
  it(`should delete the newly created action using "${rm}"`, () => cli.do(`action ${rm} foo`, this.app)
    .then(cli.expectJustOK)
    .then(sidecar.expectOpen)) // sidecar should stay open, since we deleted an action, not the sequence
  it(`should delete the other newly created action using "${rm}"`, () => cli.do(`action ${rm} foo2`, this.app)
    .then(cli.expectJustOK)
    .then(sidecar.expectOpen)) // sidecar should stay open, since we deleted an action, not the sequence

  // now try clicking on one of the sequence component bubbles
  it('should show action after clicking on bubble', () => this.app.client.click(ui.selectors.SIDECAR_SEQUENCE_CANVAS_NODE_N(0))
    .then(() => sidecar.expectOpen(this.app))
    .then(sidecar.expectShowing('sss'))) // since the action was deleted
  // TODO check for error message "action not found"
})
