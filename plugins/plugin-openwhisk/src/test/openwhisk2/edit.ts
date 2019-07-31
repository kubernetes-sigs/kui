/*
 * Copyright 2018 IBM Corporation
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
 * test the edit actionName command
 *
 */

import * as common from '@kui-shell/core/tests/lib/common'
import * as ui from '@kui-shell/core/tests/lib/ui'
import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

import { dirname } from 'path'
const { cli, sidecar } = ui
const ROOT = dirname(require.resolve('@kui-shell/plugin-openwhisk/tests/package.json'))

describe('edit actions', function(this: common.ISuite) {
  before(openwhisk.before(this))
  after(common.after(this))

  it('should open a file with spaces', () =>
    cli
      .do(`open "${ROOT}/data/openwhisk/file with spaces.yaml"`, this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing('file with spaces.yaml'))
      .catch(common.oops(this)))

  it('should report 499 for edit --kind', () =>
    cli
      .do('edit nope --kind foo', this.app)
      .then(cli.expectError(499)) // unsupported optional parameter
      .catch(common.oops(this)))

  it('should create an action', () =>
    cli
      .do('let foo = x=>x', this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing('foo'))
      .catch(common.oops(this)))

  it('should report 499 for edit --kind on existing action', () =>
    cli
      .do('edit foo --kind foo', this.app)
      .then(cli.expectError(499)) // unsupported optional parameter
      .catch(common.oops(this)))

  it('should edit with implicit entity and shows correct sidecar mode buttons', () =>
    cli
      .do('edit', this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing('foo'))
      // now we click on the lock/unlock buttons a few times to make
      // sure we can toggle back and forth between read-only and edit
      // mode
      .then(() => this.app.client.click(ui.selectors.SIDECAR_MODE_BUTTON('lock')))
      .then(() => this.app.client.waitForExist(ui.selectors.SIDECAR_MODE_BUTTON('unlock')))
      .then(() => this.app.client.waitForExist(ui.selectors.SIDECAR_MODE_BUTTON('code')))
      .then(() => this.app.client.waitForExist(ui.selectors.SIDECAR_MODE_BUTTON('limits')))
      .then(() => this.app.client.waitForExist(ui.selectors.SIDECAR_MODE_BUTTON('parameters')))
      .then(() => this.app.client.waitForExist(ui.selectors.SIDECAR_MODE_BUTTON('annotations')))
      .then(() => this.app.client.waitForExist(ui.selectors.SIDECAR_MODE_BUTTON('raw')))
      .then(() => this.app.client.click(ui.selectors.SIDECAR_MODE_BUTTON('unlock')))
      .then(() => this.app.client.waitForExist(ui.selectors.SIDECAR_MODE_BUTTON('lock')))
      .then(() => this.app.client.waitForExist(ui.selectors.SIDECAR_MODE_BUTTON('Deploy')))
      .then(() => this.app.client.waitForExist(ui.selectors.SIDECAR_MODE_BUTTON('Revert')))
      .catch(common.oops(this)))

  it('should create an second action', () =>
    cli
      .do('let foo2 = x=>x', this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing('foo2'))
      .catch(common.oops(this)))

  // do this in a loop, to make sure we don't have any event listener leaks
  for (let idx = 0; idx < 20; idx++) {
    it(`should edit the first action iter=${idx}`, () =>
      cli
        .do('edit foo', this.app)
        .then(cli.expectOK)
        .then(sidecar.expectOpen)
        .then(sidecar.expectShowing('foo'))
        .then(sidecar.expectBadge('v0.0.1'))
        .catch(common.oops(this)))
  }

  it('should edit the second action', () =>
    cli
      .do('edit foo2', this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing('foo2'))
      .then(sidecar.expectBadge('v0.0.1'))
      .catch(common.oops(this)))

  it('should create a sequence', () =>
    cli
      .do('let seq = x=>x -> x=>x', this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing('seq'))
      .catch(common.oops(this)))
  it('should report 406 for edit of sequence', () =>
    cli
      .do('edit seq', this.app)
      .then(cli.expectError(406))
      .catch(common.oops(this)))

  it('should create a zip action', () =>
    cli
      .do(`let zippy.zip = ${ROOT}/data/openwhisk/zip`, this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing('zippy'))
      .catch(common.oops(this)))
  it('should report 406 for edit of zip', () =>
    cli
      .do('edit zippy', this.app)
      .then(cli.expectError(406))
      .catch(common.oops(this)))
})
