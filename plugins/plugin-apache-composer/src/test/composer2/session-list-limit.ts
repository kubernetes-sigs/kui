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

import { Common, CLI, ReplExpect, SidecarExpect, Selectors } from '@kui-shell/test'
import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

import Debug from 'debug'

const debug = Debug('tests/apache-composer/session-list-limit')

describe('session list --limit --skip', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  const getUniqueName = () => {
    const nums = new Date().getTime().toString()
    const chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
    return [...nums].map(num => chars[num]).join('')
  }

  const appName = getUniqueName()

  const invokeApp = appName => {
    it(`should invoke ${appName}`, () =>
      CLI.command(`wsk app invoke ${appName}`, this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(appName))
        .catch(Common.oops(this)))
  }

  const createSessionArray = (name, count) => {
    const sessionArray = []
    for (let index = 0; index < count; index++) {
      sessionArray.push(name)
    }
    return sessionArray
  }

  const verifySessionList = async ({ commandIndex, expectedLength = 0, expectedSessions = [] }) => {
    return this.app.client
      .waitForText(`${Selectors.OUTPUT_N(commandIndex)} .entity.session .entity-name .clickable`, 5000)
      .then(() =>
        this.app.client.getText(`${Selectors.OUTPUT_N(commandIndex)} .entity.session .entity-name .clickable`)
      )
      .then(sessions => (!Array.isArray(sessions) ? [sessions] : sessions)) // make sure we have an array
      .then(actualSessions => {
        if (expectedLength) {
          debug('acutal length', actualSessions.length)
          debug('expected length', expectedLength)
          assert.ok(actualSessions.length === expectedLength)
        }
        for (let index = 0; index < expectedSessions.length; index++) {
          debug('actual session', actualSessions[index])
          debug('exptect session', expectedSessions[index])
          assert.strictEqual(actualSessions[index], expectedSessions[index]) // expect session list to have exact order of expectedSessions
        }
        return actualSessions
      })
  }

  it(`should create app ${appName}`, () =>
    CLI.command(`wsk app create ${appName} @demos/hello.js`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(appName))
      .catch(Common.oops(this)))

  invokeApp(appName)

  it(`should show just ok in session list --limit 0`, () =>
    CLI.command(`wsk session list --limit 0`, this.app)
      .then(ReplExpect.justOK)
      .catch(Common.oops(this)))

  it(`should show session ${appName} in session list --limit 1`, () =>
    CLI.command(`wsk session list --limit 1`, this.app)
      .then(ReplExpect.okWithCustom({ passthrough: true }))
      .then(async commandIndex =>
        verifySessionList({
          commandIndex,
          expectedLength: 1,
          expectedSessions: [appName]
        })
      )
      .catch(Common.oops(this)))

  it(`should show session ${appName} in session list ${appName} --limit 1`, () =>
    CLI.command(`wsk session list ${appName} --limit 1`, this.app)
      .then(ReplExpect.okWithCustom({ passthrough: true }))
      .then(async commandIndex =>
        verifySessionList({
          commandIndex,
          expectedLength: 1,
          expectedSessions: [appName]
        })
      )
      .catch(Common.oops(this)))

  it(`should show session ${appName} in session list ${appName} --limit 2`, () =>
    CLI.command(`wsk session list ${appName} --limit 2`, this.app)
      .then(ReplExpect.okWithCustom({ passthrough: true }))
      .then(async commandIndex =>
        verifySessionList({
          commandIndex,
          expectedLength: 1,
          expectedSessions: [appName]
        })
      )
      .catch(Common.oops(this)))

  for (let round = 0; round < 5; round++) {
    invokeApp(appName)
  }

  it(`should show 5 ${appName} in session list ${appName} --limit 5`, () =>
    CLI.command(`wsk session list ${appName} --limit 5`, this.app)
      .then(ReplExpect.okWithCustom({ passthrough: true }))
      .then(async commandIndex =>
        verifySessionList({
          commandIndex,
          expectedLength: 5,
          expectedSessions: createSessionArray(appName, 5)
        })
      )
      .catch(Common.oops(this)))

  it(`should show 5 ${appName} in session list ${appName} --limit 5`, () =>
    CLI.command(`wsk session list ${appName} --skip 1 --limit 5`, this.app)
      .then(ReplExpect.okWithCustom({ passthrough: true }))
      .then(async commandIndex =>
        verifySessionList({
          commandIndex,
          expectedLength: 5,
          expectedSessions: createSessionArray(appName, 5)
        })
      )
      .catch(Common.oops(this)))

  it(`should show 6 ${appName} in session list ${appName} --limit 20`, () =>
    CLI.command(`wsk session list ${appName} --limit 20`, this.app)
      .then(ReplExpect.okWithCustom({ passthrough: true }))
      .then(async commandIndex =>
        verifySessionList({
          commandIndex,
          expectedLength: 6,
          expectedSessions: createSessionArray(appName, 6)
        })
      )
      .catch(Common.oops(this)))

  it(`should show 1 ${appName} in session list ${appName} --skip 5 --limit 20`, () =>
    CLI.command(`wsk session list ${appName} --skip 5 --limit 20`, this.app)
      .then(ReplExpect.okWithCustom({ passthrough: true }))
      .then(async commandIndex =>
        verifySessionList({
          commandIndex,
          expectedLength: 1,
          expectedSessions: [appName]
        })
      )
      .catch(Common.oops(this)))

  it(`should show 1 in session list ${appName} --skip 5 --limit 20 --count`, () =>
    CLI.command(`wsk session list ${appName} --skip 5 --limit 20 --count`, this.app)
      .then(ReplExpect.okWithString('1'))
      .catch(Common.oops(this)))
})
