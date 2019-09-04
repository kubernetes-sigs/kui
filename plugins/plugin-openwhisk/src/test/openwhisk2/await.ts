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
const ROOT = dirname(require.resolve('@kui-shell/plugin-openwhisk/tests/package.json'))

const actionName = 'long'

describe('Invoke asynchronously and await', function(this: common.ISuite) {
  before(openwhisk.before(this))
  after(common.after(this))

  // create an action, using the implicit entity type
  it('should create an action', () =>
    cli
      .do(`wsk action create ${actionName} ${ROOT}/data/openwhisk/long.js`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName)))

  // create the second action
  it('should do an async of the action, using implicit context', () =>
    cli.do(`wsk action async`, this.app).then(cli.expectOKWithString(actionName))) // e.g. "invoked `actionName` with id:"

  // call await
  it('should await completion of the activation', () =>
    cli
      .do(`wsk $ await`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName)))

  // make sure we can do in-context activation commands
  it('should show activation logs', () =>
    cli
      .do(`wsk activation logs`, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName)))
})
