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

import { Common, CLI, ReplExpect, SidecarExpect, Selectors, Util } from '@kui-shell/test'

import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

import { dirname } from 'path'

const ROOT = dirname(require.resolve('@kui-shell/plugin-openwhisk/tests/package.json'))

Common.localDescribe('blackbox actions docker', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  it('should create a blackbox action variant 1', () =>
    CLI.command(`wsk action create bb1 --docker openwhisk/example`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('bb1'))
      .then(res => res.app.client.getText(Selectors.SIDECAR_CUSTOM_CONTENT(res.count)))
      .then(txt => assert.strictEqual(txt, 'dockerhub image: openwhisk/example'))
      .catch(Common.oops(this)))

  it('should create a blackbox action variant 2', () =>
    CLI.command(`wsk action create --docker openwhisk/example bb2`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('bb2'))
      .catch(Common.oops(this)))

  it('should create a blackbox action variant 3', () =>
    CLI.command(`wsk action create --docker openwhisk/example bb3 ${ROOT}/data/openwhisk/echo.js`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('bb3'))
      .catch(Common.oops(this)))

  it('should create a blackbox action variant 4', () =>
    CLI.command(`wsk action create bb4 ${ROOT}/data/openwhisk/echo.js --docker openwhisk/example`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('bb4'))
      .then(Util.getValueFromMonaco)
      .then(txt => txt.includes('// eslint-disable-next-line @typescript-eslint/no-unused-vars\nconst main = x => x'))
      .catch(Common.oops(this)))

  it('should create a package', () =>
    CLI.command(`wsk package create ppp`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('ppp'))
      .catch(Common.oops(this)))

  it('should create a blackbox action variant 5', () =>
    CLI.command(`wsk action create ppp/bb4 ${ROOT}/data/openwhisk/echo.js --docker openwhisk/example`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('bb4', 'ppp'))
      .then(Util.getValueFromMonaco)
      .then(txt => txt.includes('// eslint-disable-next-line @typescript-eslint/no-unused-vars\nconst main = x => x'))
      .catch(Common.oops(this)))

  it(`should invoke bb2`, () =>
    CLI.command(`wsk action invoke bb2`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('bb2'))
      .then(Util.getValueFromMonaco)
      .then(
        Util.expectYAML({
          args: {},
          msg: 'Hello from arbitrary C program!'
        })
      )
      .catch(Common.oops(this)))
})
