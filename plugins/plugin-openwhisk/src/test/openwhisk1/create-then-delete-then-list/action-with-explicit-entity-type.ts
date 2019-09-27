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
localDescribe('Create an action, list it, delete it, then list nothing explicit entity type', function(
  this: Common.ISuite
) {
  before(openwhisk.before(this))
  after(Common.after(this))

  openwhisk.aliases.remove.forEach(cmd => {
    // create an action, using the implicit entity type
    it('should create an action', () =>
      CLI.command(`wsk action create foo ${ROOT}/data/openwhisk/foo.js`, this.app)
        .then(ReplExpect.justOK)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing('foo')))

    // list it
    it(`should find the new action with "wsk action list"`, () =>
      CLI.command('wsk action list', this.app).then(ReplExpect.okWithOnly('foo')))

    // delete the action
    it(`should delete the newly created action using "${cmd}"`, () =>
      CLI.command(`wsk action ${cmd} foo`, this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.closed))
  })
})
