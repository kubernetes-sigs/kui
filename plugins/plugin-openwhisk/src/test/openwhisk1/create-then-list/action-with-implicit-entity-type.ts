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

import { Common, CLI, Keys, ReplExpect, SidecarExpect, Selectors } from '@kui-shell/test'
import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'
import { dirname } from 'path'

const { localDescribe } = Common
const ROOT = dirname(require.resolve('@kui-shell/plugin-openwhisk/tests/package.json'))

// TODO: webpack test
localDescribe('Create action with implicit entity type, then list it', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  // create an action, using the implicit entity type
  it('should create an action', () =>
    CLI.command(`wsk action create foo ${ROOT}/data/openwhisk/foo.js`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('foo'))
      .catch(Common.oops(this, true)))

  // toggle sidebar closed
  it('should toggle the sidebar closed with escape', async () => {
    await this.app.client.keys(Keys.ESCAPE)
    return SidecarExpect.closed(this.app)
  })

  // toggle sidebar back open
  it('should toggle the sidebar back open with escape', async () => {
    await this.app.client.keys(Keys.ESCAPE)
    return SidecarExpect.open(this.app).then(SidecarExpect.showing('foo'))
  })

  // list tests
  openwhisk.aliases.list.forEach(cmd => {
    it(`should find the new action with "wsk action ${cmd}"`, () =>
      CLI.command(`wsk action ${cmd}`, this.app).then(ReplExpect.okWithOnly('foo')))
  })

  // toggle sidebar closed by clicking on the Close button
  it('should toggle the sidebar closed with close button click', async () => {
    try {
      await this.app.client.waitForVisible(Selectors.SIDECAR_CLOSE_BUTTON)
      await this.app.client.click(Selectors.SIDECAR_CLOSE_BUTTON)
      await SidecarExpect.closed(this.app)
    } catch (err) {
      await Common.oops(this, true)
    }
  })
})
