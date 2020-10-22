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

import * as assert from 'assert'

import { Common, CLI, ReplExpect, SidecarExpect, Util } from '@kui-shell/test'

import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

// so we can compare the content of code mode
import { readFileSync } from 'fs'
import * as path from 'path'

const { localDescribe } = Common

const actionName = 'foo'
const actionName2 = 'foo2'
const ROOT = path.dirname(require.resolve('@kui-shell/plugin-openwhisk/tests/package.json'))
const fooSrc = readFileSync(path.join(ROOT, 'data/openwhisk/foo.js')).toString()
const foo2Src = readFileSync(path.join(ROOT, 'data/openwhisk/foo2.js')).toString()

// TODO: webpack test
localDescribe('Sidecar bottom stripe interactions for actions', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  /** verify the mode buttons work */
  const verify = (
    name: string,
    expectedParams: Record<string, any>,
    expectedAnnotations: Record<string, any>,
    expectedSrc: string
  ) => (res: () => ReplExpect.AppAndCount) => {
    // click on parameters mode button
    it(`should show parameters for ${name} by clicking on bottom stripe`, async () => {
      await Util.switchToTab('parameters')(res())
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(name))
        .then(Util.getValueFromMonaco)
        .then(Util.expectYAML(expectedParams))
        .catch(Common.oops(this))
    })

    // click on annotations mode button
    it(`should show annotations for ${name} by clicking on bottom stripe`, async () => {
      await Util.switchToTab('annotations')(res())
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(name))
        .then(Util.getValueFromMonaco)
        .then(Util.expectYAMLSubset(expectedAnnotations))
        .catch(Common.oops(this))
    })

    // click on code mode button
    it(`should show code for ${name} by clicking on bottom stripe`, async () => {
      await Util.switchToTab('code')(res())
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(name))
        .then(Util.getValueFromMonaco)
        .then(code => assert.strictEqual(code.replace(/\s+/g, ''), expectedSrc.replace(/\s+/g, '')))
        .catch(Common.oops(this))
    })
  }

  // create an action, using the implicit entity type
  let res: ReplExpect.AppAndCount
  it(`should create an action ${actionName}`, async () => {
    try {
      res = await CLI.command(
        `wsk action create ${actionName} ${ROOT}/data/openwhisk/foo.js -p x 5 -p y 10 -a aaa 888`,
        this.app
      )
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(actionName))
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })

  // create an action, using the implicit entity type
  it(`should create an action ${actionName2}`, async () => {
    try {
      res = await CLI.command(
        `wsk action create ${actionName2} ${ROOT}/data/openwhisk/foo2.js -p x 6 -p y 11 -a aaa 999`,
        this.app
      )
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(actionName2))
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })

  verify(actionName2, { x: 6, y: 11 }, { aaa: 999 }, foo2Src)(() => res)

  it(`should get ${actionName}`, async () => {
    try {
      res = await CLI.command(`wsk action get ${actionName}`, this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(actionName))
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })

  verify(actionName, { x: 5, y: 10 }, { aaa: 888 }, fooSrc)(() => res)
})
