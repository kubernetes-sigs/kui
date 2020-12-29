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

import { Common, CLI, Keys, ReplExpect } from '@kui-shell/test'

import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

import { dirname } from 'path'

const ROOT = dirname(require.resolve('@kui-shell/plugin-openwhisk/tests/package.json'))

describe('wipe command', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  it('should create a package', () =>
    CLI.command('wsk package create ppp', this.app)
      .then(ReplExpect.ok)
      .catch(Common.oops(this)))

  it('should create a trigger', () =>
    CLI.command('wsk trigger create ttt', this.app)
      .then(ReplExpect.ok)
      .catch(Common.oops(this)))

  it('should create an action', () =>
    CLI.command(`wsk action create aaa ${ROOT}/data/openwhisk/foo.js`, this.app)
      .then(ReplExpect.ok)
      .catch(Common.oops(this)))

  it('should create a rule', () =>
    CLI.command('wsk rule create rrr ttt aaa', this.app)
      .then(ReplExpect.ok)
      .catch(Common.oops(this)))

  it('should successfully execute the wipe command', () =>
    CLI.command('wsk wipe', this.app)
      .then(async res => {
        await this.app.client.keys(`yes${Keys.ENTER}`)
        return res
      })
      .then(ReplExpect.ok)
      .catch(Common.oops(this)))

  it('should find no entities with list all', () =>
    CLI.command('wsk list', this.app)
      .then(ReplExpect.blank)
      .catch(Common.oops(this)))

  it('should successfully cancel the wipe command', () =>
    CLI.command('wsk wipe', this.app)
      .then(async res => {
        await this.app.client.keys(`no${Keys.ENTER}`)
        return res
      })
      .then(ReplExpect.error(0))
      .catch(Common.oops(this)))

  // make sure we can still execute repl commands after cancelling the wipe
  // here we intentionally reuse the aaa name we did before, with a CREATE
  // to double check that aaa is truly gone
  it('should create another action after cancelling wipe', () =>
    CLI.command(`wsk action create aaa ${ROOT}/data/openwhisk/foo.js`, this.app)
      .then(ReplExpect.ok)
      .catch(Common.oops(this)))

  it('should successfully cancel the wipe command again', () =>
    CLI.command('wsk wipe', this.app)
      .then(async res => {
        // just enter this time
        await this.app.client.keys(`${Keys.ENTER}`)
        return res
      })
      .then(ReplExpect.error(0))
      .catch(Common.oops(this)))

  // try to create action aaa one more time, this time expect 409,
  // i.e. conflict, because we didn't wipe anything
  it('should create another action after cancelling wipe', () =>
    CLI.command(`wsk action create aaa ${ROOT}/data/openwhisk/foo.js`, this.app)
      .then(ReplExpect.error(409))
      .catch(Common.oops(this)))

  // create a bunch of actions
  for (let idx = 0; idx < 10; idx++) {
    it(`should create action ${idx}`, () =>
      CLI.command(`wsk action create aaa${idx} ${ROOT}/data/openwhisk/foo.js`, this.app)
        .then(ReplExpect.ok)
        .catch(Common.oops(this)))
  }

  // now try to cover the 404 race between our wipe and some other concurrent deletions
  it('should handle concurrent deletions', () =>
    Promise.all([
      // the repl wipe
      CLI.command('wsk wipe', this.app).then(async res => {
        await this.app.client.keys(`yes${Keys.ENTER}`)
        return res
      }),

      // start up a wipe on our side, with a bit of a delay, 200ms
      new Promise<void>((resolve, reject) =>
        setTimeout(async () => {
          try {
            await openwhisk.cleanAll(process.env.AUTH)
            resolve()
          } catch (err) {
            reject(err)
          }
        }, 200)
      )
    ])
      .then(([res]) => res) // project out the repl response
      .then(ReplExpect.ok) // confirm the repl's wipe was ok
      .catch(Common.oops(this)))
})
