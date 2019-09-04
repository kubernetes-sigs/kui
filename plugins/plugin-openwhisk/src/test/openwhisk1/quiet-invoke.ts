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

const actionName = 'foo'
const actionName2 = 'foo2'

// TODO: webpack test
localDescribe('Invoke -q (quiet invoke)', function(this: common.ISuite) {
  before(openwhisk.before(this))
  after(common.after(this))

  it('should create an action', () =>
    cli
      .do(`wsk action create ${actionName} ${ROOT}/data/openwhisk/foo.js -p x 5 -p y 10`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName)))

  // create an action, using the implicit entity type
  it('should create an action', () =>
    cli
      .do(`wsk action create ${actionName2} ${ROOT}/data/openwhisk/foo.js -p x 5 -p y 10`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName2)))

  // quiet invoke shouldn't affect the sidecar
  it('should invoke -q', () =>
    cli
      .do(`wsk action invoke ${actionName} -q`, this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName2)))
})
