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

import { Common, CLI, ReplExpect, SidecarExpect, Selectors } from '@kui-shell/test'

import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

import { dirname } from 'path'

const ROOT = dirname(require.resolve('@kui-shell/plugin-openwhisk/tests/package.json'))

describe('edit actions', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  it('should open a file with spaces', () =>
    CLI.command(`open "${ROOT}/data/openwhisk/file with spaces.yaml"`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('file with spaces.yaml'))
      .catch(Common.oops(this)))

  it('should report 499 for edit --kind', () =>
    CLI.command('edit nope --kind foo', this.app)
      .then(ReplExpect.error(499)) // unsupported optional parameter
      .catch(Common.oops(this)))

  it('should create an action', () =>
    CLI.command('let foo = x=>x', this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('foo'))
      .catch(Common.oops(this)))

  it('should report 499 for edit --kind on existing action', () =>
    CLI.command('edit foo --kind foo', this.app)
      .then(ReplExpect.error(499)) // unsupported optional parameter
      .catch(Common.oops(this)))

  it('should edit that entity and show correct sidecar mode buttons', async () => {
    try {
      const res = await CLI.command('edit foo', this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing('foo'))

      // now we click on the edit/done buttons a few times to make
      // sure we can toggle back and forth between read-only and edit
      // mode
      await this.app.client.click(Selectors.SIDECAR_MODE_BUTTON(res.count, 'lock'))
      await this.app.client.waitForExist(Selectors.SIDECAR_MODE_BUTTON(res.count, 'edit'))
      await this.app.client.waitForExist(Selectors.SIDECAR_MODE_BUTTON(res.count, 'code'))
      await this.app.client.waitForExist(Selectors.SIDECAR_MODE_BUTTON(res.count, 'limits'))
      await this.app.client.waitForExist(Selectors.SIDECAR_MODE_BUTTON(res.count, 'annotations'))
      await this.app.client.waitForExist(Selectors.SIDECAR_MODE_BUTTON(res.count, 'raw'))
      await this.app.client.click(Selectors.SIDECAR_MODE_BUTTON(res.count, 'edit'))
      await this.app.client.waitForExist(Selectors.SIDECAR_MODE_BUTTON(res.count, 'lock'))
      await this.app.client.waitForExist(Selectors.SIDECAR_MODE_BUTTON(res.count, 'Deploy'))
      await this.app.client.waitForExist(Selectors.SIDECAR_MODE_BUTTON(res.count, 'Revert'))
    } catch (err) {
      await Common.oops(this)(err)
    }
  })

  it('should create a second action', () =>
    CLI.command('let foo2 = x=>x', this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('foo2'))
      .catch(Common.oops(this)))

  // do this in a loop, to make sure we don't have any event listener leaks
  for (let idx = 0; idx < 20; idx++) {
    it(`should edit the first action iter=${idx}`, () =>
      CLI.command('edit foo', this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing('foo'))
        .then(SidecarExpect.badge('0.0.1'))
        .catch(Common.oops(this)))
  }

  it('should edit the second action', () =>
    CLI.command('edit foo2', this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('foo2'))
      .then(SidecarExpect.badge('0.0.1'))
      .catch(Common.oops(this)))

  it('should create a sequence', () =>
    CLI.command('let seq = x=>x -> x=>x', this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('seq'))
      .catch(Common.oops(this)))
  it('should report 406 for edit of sequence', () =>
    CLI.command('edit seq', this.app)
      .then(ReplExpect.error(406))
      .catch(Common.oops(this)))
})
