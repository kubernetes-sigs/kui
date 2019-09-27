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

const debug = Debug('tests/apache-composer/session-list-scan-limit')

describe('session list --scan-limit --skip', function(this: Common.ISuite) {
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

  const createSessionArray = (name, count) => {
    const sessionArray = []
    for (let index = 0; index < count; index++) {
      sessionArray.push(name)
    }
    return sessionArray
  }

  it(`should create app ${appName}`, () =>
    CLI.command(`wsk app create ${appName} @demos/hello.js`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(appName))
      .catch(Common.oops(this)))

  invokeApp(appName)

  it(`should show just ok in session list --scan-limit 0`, () =>
    CLI.command(`wsk session list --scan-limit 0`, this.app)
      .then(ReplExpect.justOK)
      .catch(Common.oops(this)))

  it(`should show session ${appName} in session list --scan-limit 1`, () =>
    CLI.command(`wsk session list --scan-limit 1`, this.app)
      .then(ReplExpect.okWithCustom({ passthrough: true }))
      .then(async commandIndex =>
        verifySessionList({
          commandIndex,
          expectedLength: 1,
          expectedSessions: [appName]
        })
      )
      .catch(Common.oops(this)))

  it(`should create app if`, () =>
    CLI.command(`wsk app create if @demos/if.js`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('if'))
      .catch(Common.oops(this)))

  invokeApp('if')

  it(`should not show session ${appName} in session list --scan-limit 1`, () =>
    CLI.command(`wsk session list --scan-limit 1`, this.app)
      .then(ReplExpect.okWithCustom({ passthrough: true }))
      .then(async commandIndex =>
        verifySessionList({
          commandIndex,
          expectedLength: 1,
          expectedSessions: ['if']
        })
      )
      .catch(Common.oops(this)))

  it(`should show session ${appName} in session list ${appName} --scan-limit 1`, () =>
    CLI.command(`wsk session list ${appName} --scan-limit 1`, this.app)
      .then(ReplExpect.okWithCustom({ passthrough: true }))
      .then(async commandIndex =>
        verifySessionList({
          commandIndex,
          expectedLength: 1,
          expectedSessions: [appName]
        })
      )
      .catch(Common.oops(this)))

  for (let round = 0; round < 10; round++) {
    invokeApp(appName)
  }

  it(`should show session 11 ${appName} in session list ${appName} --scan-limit 11`, () =>
    CLI.command(`wsk session list ${appName} --scan-limit 11`, this.app)
      .then(ReplExpect.okWithCustom({ passthrough: true }))
      .then(async commandIndex =>
        verifySessionList({
          commandIndex,
          expectedLength: 11,
          expectedSessions: createSessionArray(appName, 11)
        })
      )
      .catch(Common.oops(this)))

  it(`should show session 11 in session list ${appName} --scan-limit 11 --count`, () =>
    CLI.command(`wsk session list ${appName} --scan-limit 11 --count`, this.app)
      .then(ReplExpect.okWithString('11'))
      .catch(Common.oops(this)))

  it(`should show session 10 ${appName} in session list ${appName} --skip 1 --scan-limit 10`, () =>
    CLI.command(`wsk session list ${appName} --skip 1 --scan-limit 10`, this.app)
      .then(ReplExpect.okWithCustom({ passthrough: true }))
      .then(async commandIndex =>
        verifySessionList({
          commandIndex,
          expectedLength: 10,
          expectedSessions: createSessionArray(appName, 10)
        })
      )
      .catch(Common.oops(this)))

  it(`should show session 10 ${appName} in session list ${appName} --skip 1 --scan-limit 11`, () =>
    CLI.command(`wsk session list ${appName} --skip 1 --scan-limit 11`, this.app)
      .then(ReplExpect.okWithCustom({ passthrough: true }))
      .then(async commandIndex =>
        verifySessionList({
          commandIndex,
          expectedLength: 10,
          expectedSessions: createSessionArray(appName, 10)
        })
      )
      .catch(Common.oops(this)))

  for (let round = 0; round < 10; round++) {
    invokeApp(appName)
  }

  it(`should show session 21 ${appName} in session list ${appName} --scan-limit 21`, () =>
    CLI.command(`wsk session list ${appName} --scan-limit 21`, this.app)
      .then(ReplExpect.okWithCustom({ passthrough: true }))
      .then(async commandIndex =>
        verifySessionList({
          commandIndex,
          expectedLength: 21,
          expectedSessions: createSessionArray(appName, 21)
        })
      )
      .catch(Common.oops(this)))

  // Note: this test may take longer than expected, since it's trying to find 21 sessions in all activations
  it(`should show session 21 ${appName} in session list ${appName} --scan-limit 30`, () =>
    CLI.command(`wsk session list ${appName} --scan-limit 30`, this.app)
      .then(ReplExpect.okWithCustom({ passthrough: true }))
      .then(async commandIndex =>
        verifySessionList({
          commandIndex,
          expectedLength: 21,
          expectedSessions: createSessionArray(appName, 21)
        })
      )
      .catch(Common.oops(this)))
})
