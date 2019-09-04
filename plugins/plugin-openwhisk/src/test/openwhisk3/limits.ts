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

const actionName1 = 'foo1'
const actionName2 = 'foo2'
const actionName3 = 'foo3'
const actionName4 = 'foo4'
const actionName5 = 'foo5'
const actionName6 = 'foo6'
const actionName7 = 'foo7'
const actionName8 = 'foo8'
const actionName9 = 'foo9'

// TODO: webpack test
localDescribe('Create an action with limits', function(this: common.ISuite) {
  before(openwhisk.before(this))
  after(common.after(this))

  it('should create an action with -m 129', () =>
    cli
      .do(`wsk action update ${actionName1} ${ROOT}/data/openwhisk/foo.js -m 129`, this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName1))
      .then(sidecar.expectLimit('memory', 129))
      .catch(common.oops(this)))

  it('should create an action with --memory 131', () =>
    cli
      .do(`wsk action update ${actionName2} ${ROOT}/data/openwhisk/foo.js --memory 131`, this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName2))
      .then(sidecar.expectLimit('memory', 131))
      .catch(common.oops(this)))

  it('should create an action with -t 1000', () =>
    cli
      .do(`wsk action update ${actionName3} ${ROOT}/data/openwhisk/foo.js -t 1000`, this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName3))
      .then(sidecar.expectLimit('timeout', 1000))
      .catch(common.oops(this)))

  it('should create an action with --timeout 2000', () =>
    cli
      .do(`wsk action update ${actionName4} ${ROOT}/data/openwhisk/foo.js --timeout 2000`, this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName4))
      .then(sidecar.expectLimit('timeout', 2000))
      .catch(common.oops(this)))

  it('should create an action with --timeout 3s', () =>
    cli
      .do(`wsk action update ${actionName5} ${ROOT}/data/openwhisk/foo.js --timeout 3s`, this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName5))
      .then(sidecar.expectLimit('timeout', 3000))
      .catch(common.oops(this)))

  it('should create an action with --timeout 5m', () =>
    cli
      .do(`wsk action update ${actionName6} ${ROOT}/data/openwhisk/foo.js --timeout 5m`, this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName6))
      .then(sidecar.expectLimit('timeout', 300000))
      .catch(common.oops(this)))

  it('should create an action with -l 1', () =>
    cli
      .do(`wsk action update ${actionName7} ${ROOT}/data/openwhisk/foo.js -l 1`, this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName7))
      .then(sidecar.expectLimit('logs', 1))
      .catch(common.oops(this)))

  it('should fail to create an action with --logs 2', () =>
    cli
      .do(`wsk action update ${actionName8} ${ROOT}/data/openwhisk/foo.js --logs 2`, this.app)
      .then(cli.expectError(499)) // unsupported optional parameter
      .catch(common.oops(this)))

  it('should create an action with --logsize 2', () =>
    cli
      .do(`wsk action update ${actionName8} ${ROOT}/data/openwhisk/foo.js --logsize 2`, this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName8))
      .then(sidecar.expectLimit('logs', 2))
      .catch(common.oops(this)))

  // updating the action8 this time
  it('should create an action with --logsize 3', () =>
    cli
      .do(`wsk action update ${actionName8} ${ROOT}/data/openwhisk/foo.js --logsize 3`, this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName8))
      .then(sidecar.expectLimit('logs', 3))
      .catch(common.oops(this)))

  it('should create an action with --logsize 3', () =>
    cli
      .do(`wsk action update ${actionName9} ${ROOT}/data/openwhisk/foo.js --logsize 3`, this.app)
      .then(cli.expectOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(actionName9))
      .then(sidecar.expectLimit('logs', 3))
      .catch(common.oops(this)))
})
