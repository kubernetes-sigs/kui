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

import * as assert from 'assert'
import { Common, CLI, ReplExpect, SidecarExpect, Selectors, Util } from '@kui-shell/test'
import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

import { dirname } from 'path'

import { verifyNodeExists, verifyTheBasicStuff } from '@kui-shell/plugin-apache-composer/tests/lib/composer-viz-util'

const ROOT = dirname(require.resolve('@kui-shell/plugin-apache-composer/tests/package.json'))

const actionName1 = 'foo1'
const actionName2 = 'foo2'
const actionName3 = 'foo3'
const seqName1 = 'seq1'
const packageName1 = 'ppp1'

describe('app create and sessions', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  /** expected return value */
  const expect = (key, value, extraExpect, expectIsIt) => {
    if (expectIsIt) {
      return extraExpect
    } else {
      const expect = {}
      expect[key] = value
      return Object.assign(expect, extraExpect)
    }
  }

  /** invoke a composition */
  const invoke = (
    _name,
    key: string,
    value: string | number,
    extraExpect: Record<string, string | number>,
    expectIsIt = false,
    cmd = 'wsk app invoke'
  ) => {
    const name = typeof _name === 'string' ? _name : _name.action
    const packageName = _name.package
    const fullName = packageName ? `${packageName}/${name}` : name

    it(`should invoke via ${cmd} the composition ${fullName} with ${key}=${value}`, () =>
      CLI.command(`${cmd} ${fullName} -p ${key} ${value}`, this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(seqName1))
        .then(() => this.app.client.getText(Selectors.SIDECAR_ACTIVATION_RESULT))
        .then(Util.expectStruct(expect(key, value, extraExpect, expectIsIt)))
        .then(() => this.app.client.click(Selectors.SIDECAR_TITLE)) // click on the name part in the sidecar header
        .then(() => this.app)
        .then(SidecarExpect.showing(seqName1, undefined, undefined, packageName))
        .catch(Common.oops(this)))
  }

  /** make a plain openwhisk action */
  const makeAction = (name: string, key: string, value: string | number, body = 'x=>x') => {
    it('should create an action via let', () =>
      CLI.command(`let ${name} = ${body} -p ${key} ${value}`, this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(name))
        .catch(Common.oops(this)))

    it('should switch to parameters mode', () =>
      CLI.command('wsk action parameters', this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(name))
        .then(app => app.client.getText(`${Selectors.SIDECAR_CONTENT} .action-source`))
        .then(Util.expectStruct(expect(key, value, undefined, undefined)))
        .catch(Common.oops(this)))
  }

  /** regular action get */
  const getAction = (name: string) =>
    it(`should get regular action ${name}`, () =>
      CLI.command(`wsk action get ${name}`, this.app)
        .then(ReplExpect.ok)
        .then(SidecarExpect.open)
        .then(SidecarExpect.showing(name))
        .catch(Common.oops(this)))

  /** sessions */
  const doGetSessions = (cmd: string, nLive: number, nDone: number) =>
    new Promise((resolve, reject) => {
      const once = (iter: number) => {
        return CLI.command(cmd, this.app)
          .then(ReplExpect.okWithCustom({ passthrough: true }))
          .then(async (N: number) => {
            const list = await this.app.client.elements(`${Selectors.OUTPUT_N(N)} .entity.session`)
            if (list.value.length < nDone) {
              console.error('done does not match ' + list.value.length + ' < ' + nDone)
              if (iter < 3) {
                // let's retry
                setTimeout(() => once(iter + 1), 5000)
              } else {
                // fail fast
                assert.strictEqual(list.value.length, nDone)
              }
            } else {
              resolve(true)
            }
          })
          .catch(reject)
      }
      once(0)
    })

  const getSessions = (cmd: string, nLive: number, nDone: number) =>
    it(`should list sessions via "${cmd}" nLive=${nLive} nDone=${nDone}`, () => doGetSessions(cmd, nLive, nDone))

  //
  // start of test suite
  //
  makeAction(actionName1, 'aa', 11, 'x=>x')
  makeAction(actionName2, 'bb', 22, 'x=>x')
  makeAction(actionName3, 'cc', 22, 'x=>x') // "x=>new Promise(resolve => setTimeout(() => resolve(x), 20000))") // sleep, so we can get async and "live" session list

  /* it('should initialize composer', () => CLI.command(`wsk app init --url ${sharedURL} --cleanse`, this.app) // cleanse important here for counting sessions in `sessions`
        .then(ReplExpect.okWithCustom({expect: 'Successfully initialized and reset the required services. You may now create compositions.'}))
       .catch(Common.oops(this))) */

  it('should throw a usage message for incomplete app create', () =>
    CLI.command(`wsk app create ${seqName1}`, this.app)
      .then(ReplExpect.error(497)) // 497 insufficient required parameters
      .catch(Common.oops(this)))

  it('should throw a usage message for incomplete app create v2', () =>
    CLI.command(`wsk app create`, this.app)
      .then(ReplExpect.error(497)) // 497 insufficient required parameters
      .catch(Common.oops(this)))

  it('should throw a usage message for incomplete app create v3', () =>
    CLI.command(`wsk app create ${ROOT}/data/composer/fsm.json`, this.app)
      .then(ReplExpect.error(497)) // 497 insufficient required parameters
      .catch(Common.oops(this)))

  it('should create a composer sequence', () =>
    CLI.command(`wsk app create ${seqName1} ${ROOT}/data/composer/fsm.json`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(seqName1))
      .catch(Common.oops(this)))

  it('should create a package', () =>
    CLI.command(`wsk package create ${packageName1}`, this.app)
      .then(ReplExpect.ok)
      .catch(Common.oops(this)))

  it('should create a packaged composer sequence', () =>
    CLI.command(`wsk app create ${packageName1}/${seqName1} ${ROOT}/data/composer/fsm.json`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(seqName1, undefined, undefined, packageName1))
      .catch(Common.oops(this)))
  invoke({ package: packageName1, action: seqName1 }, 'x', 3, {
    aa: 11,
    bb: 22,
    cc: 22
  })

  it('should create a composer sequence via app update', () =>
    CLI.command(`wsk app update ${seqName1} ${ROOT}/data/composer/fsm.json`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(seqName1))
      .catch(Common.oops(this)))

  it(`should create wookiechat and dependent actions with implicit entity`, () =>
    CLI.command('wsk app update wookie @demos/wookie/app.js', this.app)
      .then(verifyTheBasicStuff('wookie'))
      .then(verifyNodeExists('swapi', false)) // expect not to be deployed
      .then(verifyNodeExists('stapi', false)) // expect not to be deployed
      .then(verifyNodeExists('validate-swapi', false)) // expect not to be deployed
      .then(verifyNodeExists('validate-stapi', false)) // expect not to be deployed
      .then(verifyNodeExists('report-swapi', false)) // expect not to be deployed
      .then(verifyNodeExists('report-stapi', false)) // expect not to be deployed
      .then(verifyNodeExists('report-empty', false)) // expect not to be deployed
      .catch(Common.oops(this)))

  getSessions('wsk sessions list', 0, 0) // no sessions, yet
  // diable pagination tests
  /* getSessions('wsk session list --skip 0', 0, 0) // no sessions, yet (intentional variant sessions->session)
  getSessions('wsk session list --skip 0', 0, 0) // no sessions, yet */
  getSessions('wsk sessions list', 0, 0) // no sessions, yet (intentional variant session->sessions)
  getSessions('wsk sess list', 0, 0) // no sessions, yet
  getSessions('wsk ses list', 0, 0) // no sessions, yet */

  // get some regular action, so we can test switching back to the composer action
  getAction(actionName1)

  it('should get the composer sequence via "app get"', () =>
    CLI.command(`wsk app get ${seqName1}`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(seqName1))
      .then(() => this.app.client.getText(`${Selectors.SIDECAR_MODE_BUTTONS}`))
      .then(
        (buttons: string | string[]) =>
          Array.isArray(buttons) &&
          buttons.length > 0 &&
          buttons
            .filter(x => x)
            .reduce((M, button) => {
              // filter removes blanks due to image icons
              if (M[button]) {
                // duplicate button!!
                assert.fail('Duplicate mode button ' + button)
              } else {
                M[button] = true
              }
              return M
            }, {})
      )
      .catch(Common.oops(this)))

  it('should get the composer sequence via "action get"', () =>
    CLI.command(`wsk action get ${seqName1}`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(seqName1))
      .then(() => this.app.client.waitForVisible(`${Selectors.SIDECAR_MODE_BUTTON('visualization')}`))
      .catch(Common.oops(this)))

  // get some regular action, so we can test switching back to the composer action
  getAction(actionName1)

  it('should throw a usage message for incomplete app get', () =>
    CLI.command(`wsk app get`, this.app)
      .then(ReplExpect.error(497)) // 497 insufficient required parameters
      .catch(Common.oops(this)))

  invoke(seqName1, 'x', 3, { aa: 11, bb: 22, cc: 22 })
  getSessions('wsk session list', 0, 1) // 1 "done" session
  invoke(seqName1, 'x', 3, { aa: 11, bb: 22, cc: 22 }, false)
  getSessions('wsk sessions list', 0, 2) // 2 "done" session
  // disable pagination tests
  /* getSessions('wsk sessions list --skip 1', 0, 0) // expect empty, if we skip 1 (since we expect 1 in total)
  getSessions('wsk sess list', 0, 1)    //  1 "done" session */

  invoke(seqName1, 'x', 3, { aa: 11, bb: 22, cc: 22 })

  getSessions('wsk sessions list', 0, 3) // 3 "done" sessions
  getSessions('wsk ses list', 0, 3) // 3 "done" sessions (testing aliases here)*/

  // disable pagination tests
  /* getSessions('wsk session list --skip 1', 0, 1) // expect 1, if we skip 1 (since we expect 2 in total)
  getSessions('wsk sessions list --skip 2', 0, 0) // expect 0, if we skip 2 (since we expect 2 in total)
  getSessions('wsk sessions list --limit 0', 0, 0) // expect 0, if we limit 0 (since we expect 2 in total)
  getSessions('wsk sessions list --limit 1', 0, 1) // expect 1, if we limit 1 (since we expect 2 in total)
  getSessions('wsk sessions list --limit 2', 0, 2) // expect 2, if we limit 2 (since we expect 2 in total) */
  getSessions('wsk sess list', 0, 3) //  3 "done" session

  invoke(seqName1, 'x', 3, { aa: 11, bb: 22, cc: 22 })
  getSessions('wsk session list', 0, 4) // 4 "done" sessions
  // disable pagination tests
  /* getSessions('wsk sessions list --skip 1', 0, 2) // expect 2, if we skip 1 (since we expect 3 in total)
  getSessions('wsk sessions list --limit 2', 0, 2) // expect 2, if we limit 2 (since we expect 3 in total) */
})
