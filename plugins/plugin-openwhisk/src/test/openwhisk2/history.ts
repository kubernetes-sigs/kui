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

import * as common from '@kui-shell/core/tests/lib/common'
import * as ui from '@kui-shell/core/tests/lib/ui'
import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

import { dirname } from 'path'
const { cli, sidecar } = ui
const ROOT = dirname(require.resolve('@kui-shell/plugin-openwhisk/tests/package.json'))

describe('History', function(this: common.ISuite) {
  before(openwhisk.before(this))
  after(common.after(this))

  const entityName = 'foo'
  const createCommand = `wsk action create ${entityName} ${ROOT}/data/openwhisk/foo.js`
  const listCommand = 'wsk action list'

  it('should create an action', () =>
    cli
      .do(createCommand, this.app)
      .then(cli.expectJustOK)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(entityName))
      .catch(common.oops(this)))

  it(`should list history with filter 1`, () =>
    cli.do(`history 1 create`, this.app).then(cli.expectOKWithOnly(createCommand))) // 1 says it better be the last command we executed
  it(`should list history 2 and show the action creation`, () =>
    cli.do(`history 2`, this.app).then(cli.expectOKWith(createCommand)))

  // get something on the screen
  it(`should list actions`, () => cli.do(listCommand, this.app).then(cli.expectOKWithOnly(entityName)))

  it('should delete the action', () =>
    cli
      .do(`wsk action delete ${entityName}`, this.app)
      .then(cli.expectOK)
      .then(sidecar.expectClosed))

  it('should re-execute from history', () =>
    cli
      .do('history 5 create', this.app)
      .then(cli.expectOKWithCustom({ passthrough: true }))
      .then(N => this.app.client.click(`${ui.selectors.LIST_RESULTS_N(N)}:first-child .entity-name`))
      .then(() => this.app)
      .then(sidecar.expectOpen)
      .then(sidecar.expectShowing(entityName))
      .catch(common.oops(this)))

  it(`should list history and show the action creation`, () =>
    cli.do(`history`, this.app).then(cli.expectOKWith(createCommand)))
  it(`should list history and show the action list`, () =>
    cli.do(`history`, this.app).then(cli.expectOKWith(listCommand)))

  it(`should list history with filter, expect nothing`, () => cli.do(`history gumbogumbo`, this.app).then(cli.expectOK)) // some random string that won't be in the command history
})
