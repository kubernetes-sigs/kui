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

import * as common from '@kui-shell/core/tests/lib/common'
import * as ui from '@kui-shell/core/tests/lib/ui'
import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'
const { cli, sidecar } = ui

describe('parameter parsing with quotes', function(this: common.ISuite) {
  before(openwhisk.before(this))
  after(common.after(this))

  const createWith = params => {
    return it(`should create package with -p creds ${params}`, () =>
      cli
        .do(`wsk package update ppp -p creds ${params}`, this.app)
        .then(cli.expectOK)
        .then(sidecar.expectOpen)
        .then(sidecar.expectShowing('ppp'))
        .catch(common.oops(this)))
  }

  const expectParams = params => {
    return it('should show parameters', () =>
      cli
        .do('wsk action params', this.app)
        .then(cli.expectOK)
        .then(sidecar.expectOpen)
        .then(sidecar.expectShowing('ppp'))
        .then(app => app.client.getText(`${ui.selectors.SIDECAR_PACKAGE_PARAMETERS}`))
        .then(ui.expectStruct(params))
        .catch(common.oops(this)))
  }

  createWith(`'"foo" "bar"'`)
  expectParams({ creds: '"foo" "bar"' })

  createWith(`{"foo":"bar"}`)
  expectParams({ creds: { foo: 'bar' } })

  createWith(`{"'foo'":"bar"}`)
  expectParams({ creds: { "'foo'": 'bar' } })

  createWith(`'{"foo": "bar"}'`)
  expectParams({ creds: { foo: 'bar' } })

  createWith(`{"foo":{"bar":"baz"}}`)
  expectParams({ creds: { foo: { bar: 'baz' } } })
})
