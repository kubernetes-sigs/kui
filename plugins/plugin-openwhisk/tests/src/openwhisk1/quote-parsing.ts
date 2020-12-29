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

import { Common, CLI, ReplExpect, SidecarExpect, Util } from '@kui-shell/test'

import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

describe('parameter parsing with quotes', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  const createWith = params => {
    return it(`should create package with -p creds ${params}`, () =>
      CLI.command(`wsk package update ppp -p creds ${params}`, this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing('ppp'))
        .catch(Common.oops(this)))
  }

  const expectParams = params => {
    return it('should show parameters', () =>
      CLI.command('wsk package params', this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing('ppp'))
        .then(Util.getValueFromMonaco)
        .then(Util.expectYAML(params))
        .catch(Common.oops(this)))
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
