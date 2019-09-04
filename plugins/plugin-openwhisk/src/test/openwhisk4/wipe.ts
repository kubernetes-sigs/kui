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

import * as common from '@kui-shell/core/tests/lib/common'
import * as ui from '@kui-shell/core/tests/lib/ui'
import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

import { dirname } from 'path'
const { cli, keys } = ui
const ROOT = dirname(require.resolve('@kui-shell/plugin-openwhisk/tests/package.json'))

describe('wipe command', function(this: common.ISuite) {
  before(openwhisk.before(this))
  after(common.after(this))

  it('should create a package', () =>
    cli
      .do('wsk package create ppp', this.app)
      .then(cli.expectOK)
      .catch(common.oops(this)))

  it('should create a trigger', () =>
    cli
      .do('wsk trigger create ttt', this.app)
      .then(cli.expectOK)
      .catch(common.oops(this)))

  it('should create an action', () =>
    cli
      .do(`wsk action create aaa ${ROOT}/data/openwhisk/foo.js`, this.app)
      .then(cli.expectOK)
      .catch(common.oops(this)))

  it('should create a rule', () =>
    cli
      .do('wsk rule create rrr ttt aaa', this.app)
      .then(cli.expectOK)
      .catch(common.oops(this)))

  it('should successfully execute the wipe command', () =>
    cli
      .do('wsk wipe', this.app)
      .then(async res => {
        await this.app.client.keys(`yes${keys.ENTER}`)
        return res
      })
      .then(cli.expectOK)
      .catch(common.oops(this)))

  it('should find no entities with list all', () =>
    cli
      .do('wsk list', this.app)
      .then(cli.expectBlank)
      .catch(common.oops(this)))

  it('should successfully cancel the wipe command', () =>
    cli
      .do('wsk wipe', this.app)
      .then(async res => {
        await this.app.client.keys(`no${keys.ENTER}`)
        return res
      })
      .then(cli.expectError(0))
      .catch(common.oops(this)))

  // make sure we can still execute repl commands after cancelling the wipe
  // here we intentionally reuse the aaa name we did before, with a CREATE
  // to double check that aaa is truly gone
  it('should create another action after cancelling wipe', () =>
    cli
      .do(`wsk action create aaa ${ROOT}/data/openwhisk/foo.js`, this.app)
      .then(cli.expectOK)
      .catch(common.oops(this)))

  it('should successfully cancel the wipe command again', () =>
    cli
      .do('wsk wipe', this.app)
      .then(async res => {
        // just enter this time
        await this.app.client.keys(`${keys.ENTER}`)
        return res
      })
      .then(cli.expectError(0))
      .catch(common.oops(this)))

  // try to create action aaa one more time, this time expect 409,
  // i.e. conflict, because we didn't wipe anything
  it('should create another action after cancelling wipe', () =>
    cli
      .do(`wsk action create aaa ${ROOT}/data/openwhisk/foo.js`, this.app)
      .then(cli.expectError(409))
      .catch(common.oops(this)))

  // create a bunch of actions
  for (let idx = 0; idx < 10; idx++) {
    it(`should create action ${idx}`, () =>
      cli
        .do(`wsk action create aaa${idx} ${ROOT}/data/openwhisk/foo.js`, this.app)
        .then(cli.expectOK)
        .catch(common.oops(this)))
  }

  // now try to cover the 404 race between our wipe and some other concurrent deletions
  it('should handle concurrent deletions', () =>
    Promise.all([
      // the repl wipe
      cli.do('wsk wipe', this.app).then(async res => {
        await this.app.client.keys(`yes${keys.ENTER}`)
        return res
      }),

      // start up a wipe on our side, with a bit of a delay, 200ms
      new Promise((resolve, reject) =>
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
      .then(cli.expectOK) // confirm the repl's wipe was ok
      .catch(common.oops(this)))
})
