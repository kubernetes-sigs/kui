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

import * as assert from 'assert'

import * as common from '@kui-shell/core/tests/lib/common'
import * as ui from '@kui-shell/core/tests/lib/ui'
import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

import { dirname } from 'path'
const { cli, sidecar } = ui
const ROOT = dirname(require.resolve('@kui-shell/plugin-openwhisk/tests/package.json'))

const actionName1 = 'foo1'

describe('Create jar actions', function(this: common.ISuite) {
  before(openwhisk.before(this))
  after(common.after(this))

  it('should create a jar action', () =>
    cli
      .do(`wsk action create ${actionName1} ${ROOT}/data/openwhisk/jar/echo.jar --main echo`, this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName1))
      .then(sidecar.expectBadge('jar'))
      .then(app => app.client.getText(`${ui.selectors.SIDECAR_CONTENT} .hook-for-third-party-content`))
      .then(code => assert.strictEqual(code, 'This is machine-generated code, wrapping around your original code.'))
      .catch(common.oops(this)))

  it('should invoke the jar action', () =>
    cli
      .do(`wsk action invoke -p x 3`, this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName1))
      .then(sidecar.expectResult({ x: 3 }))
      .catch(common.oops(this)))
})
