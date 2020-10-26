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

import { Common, CLI, ReplExpect, Selectors, SidecarExpect, Util } from '@kui-shell/test'

import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

import { dirname } from 'path'

const { localDescribe } = Common
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

export const expectLimit = (type: string, expectedValue: number | string) => async (res: ReplExpect.AppAndCount) => {
  const expect: Record<string, number | string> = {}
  expect[type] = expectedValue

  await res.app.client.waitForVisible(Selectors.SIDECAR_MODE_BUTTON(res.count, 'limits'))
  await res.app.client.click(Selectors.SIDECAR_MODE_BUTTON(res.count, 'limits'))

  await res.app.client.waitUntil(async () => {
    const txt = await Util.getValueFromMonaco(res)
    return Util.expectYAMLSubset(expect, true)(txt)
  })
}

// TODO: webpack test
localDescribe('Create an action with limits', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  it('should create an action with -m 129', () =>
    CLI.command(`wsk action update ${actionName1} ${ROOT}/data/openwhisk/foo.js -m 129`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName1))
      .then(expectLimit('memory', 129))
      .catch(Common.oops(this)))

  it('should create an action with --memory 131', () =>
    CLI.command(`wsk action update ${actionName2} ${ROOT}/data/openwhisk/foo.js --memory 131`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName2))
      .then(expectLimit('memory', 131))
      .catch(Common.oops(this)))

  it('should create an action with -t 1000', () =>
    CLI.command(`wsk action update ${actionName3} ${ROOT}/data/openwhisk/foo.js -t 1000`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName3))
      .then(expectLimit('timeout', 1000))
      .catch(Common.oops(this)))

  it('should create an action with --timeout 2000', () =>
    CLI.command(`wsk action update ${actionName4} ${ROOT}/data/openwhisk/foo.js --timeout 2000`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName4))
      .then(expectLimit('timeout', 2000))
      .catch(Common.oops(this)))

  it('should create an action with --timeout 3s', () =>
    CLI.command(`wsk action update ${actionName5} ${ROOT}/data/openwhisk/foo.js --timeout 3s`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName5))
      .then(expectLimit('timeout', 3000))
      .catch(Common.oops(this)))

  it('should create an action with --timeout 5m', () =>
    CLI.command(`wsk action update ${actionName6} ${ROOT}/data/openwhisk/foo.js --timeout 5m`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName6))
      .then(expectLimit('timeout', 300000))
      .catch(Common.oops(this)))

  it('should create an action with -l 1', () =>
    CLI.command(`wsk action update ${actionName7} ${ROOT}/data/openwhisk/foo.js -l 1`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName7))
      .then(expectLimit('logs', 1))
      .catch(Common.oops(this)))

  it('should fail to create an action with --logs 2', () =>
    CLI.command(`wsk action update ${actionName8} ${ROOT}/data/openwhisk/foo.js --logs 2`, this.app)
      .then(ReplExpect.error(499)) // unsupported optional parameter
      .catch(Common.oops(this)))

  it('should create an action with --logsize 2', () =>
    CLI.command(`wsk action update ${actionName8} ${ROOT}/data/openwhisk/foo.js --logsize 2`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName8))
      .then(expectLimit('logs', 2))
      .catch(Common.oops(this)))

  // updating the action8 this time
  it('should create an action with --logsize 3', () =>
    CLI.command(`wsk action update ${actionName8} ${ROOT}/data/openwhisk/foo.js --logsize 3`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName8))
      .then(expectLimit('logs', 3))
      .catch(Common.oops(this)))

  it('should create an action with --logsize 3', () =>
    CLI.command(`wsk action update ${actionName9} ${ROOT}/data/openwhisk/foo.js --logsize 3`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(actionName9))
      .then(expectLimit('logs', 3))
      .catch(Common.oops(this)))
})
