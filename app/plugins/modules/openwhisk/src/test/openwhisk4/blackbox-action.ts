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

import { ISuite } from '@test/lib/common'
import * as common from '@test/lib/common' // tslint:disable-line:no-duplicate-imports
import * as ui from '@test/lib/ui'
const { cli, selectors, sidecar } = ui

describe('blackbox actions', function (this: ISuite) {
  before(common.before(this))
  after(common.after(this))

  it('should have an active repl', () => cli.waitForRepl(this.app))

  it('should create a blackbox action variant 1', () => cli.do(`wsk action create bb1 --docker openwhisk/example`, this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('bb1'))
    .then(() => this.app.client.getText(ui.selectors.SIDECAR_ACTION_SOURCE))
    .then(txt => assert.strictEqual(txt, 'dockerhub image: openwhisk/example'))
    .catch(common.oops(this)))

  it('should create a blackbox action variant 2', () => cli.do(`wsk action create --docker openwhisk/example bb2`, this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('bb2'))
    .catch(common.oops(this)))

  it('should create a blackbox action variant 3', () => cli.do(`wsk action create --docker openwhisk/example bb3 ./data/openwhisk/echo.js`, this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('bb3'))
    .catch(common.oops(this)))

  it('should create a blackbox action variant 4', () => cli.do(`wsk action create bb4 ./data/openwhisk/echo.js --docker openwhisk/example`, this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('bb4'))
    .then(sidecar.expectSource('const main = x=>x'))
    .catch(common.oops(this)))

  it('should create a package', () => cli.do(`wsk package create ppp`, this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('ppp'))
    .catch(common.oops(this)))

  it('should create a blackbox action variant 5', () => cli.do(`wsk action create ppp/bb4 ./data/openwhisk/echo.js --docker openwhisk/example`, this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('bb4', undefined, undefined, 'ppp'))
    .then(sidecar.expectSource('const main = x=>x'))
    .catch(common.oops(this)))

  it(`should invoke bb2`, () => cli.do(`invoke bb2`, this.app)
    .then(cli.expectOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('bb2'))
    .then(() => this.app.client.getText(ui.selectors.SIDECAR_ACTIVATION_RESULT))
    .then(ui.expectStruct({
      'args': {},
      'msg': 'Hello from arbitrary C program!'
    }))
    .catch(common.oops(this)))
})
