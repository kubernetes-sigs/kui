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
localDescribe('Create an action, list it, delete it, then list nothing explicit entity type', function(
  this: common.ISuite
) {
  before(openwhisk.before(this))
  after(common.after(this))

  ui.aliases.remove.forEach(cmd => {
    // create an action, using the implicit entity type
    it('should create an action', () =>
      cli
        .do(`wsk action create foo ${ROOT}/data/openwhisk/foo.js`, this.app)
        .then(cli.expectJustOK)
        .then(sidecar.expectOpen)
        .then(sidecar.expectShowing('foo')))

    // list it
    it(`should find the new action with "wsk action list"`, () =>
      cli.do('wsk action list', this.app).then(cli.expectOKWithOnly('foo')))

    // delete the action
    it(`should delete the newly created action using "${cmd}"`, () =>
      cli
        .do(`wsk action ${cmd} foo`, this.app)
        .then(cli.expectOK)
        .then(sidecar.expectClosed))
  })
})
