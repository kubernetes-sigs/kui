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

import { Common, CLI, ReplExpect, SidecarExpect, Selectors } from '@kui-shell/test'

import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

import { dirname } from 'path'

const ROOT = dirname(require.resolve('@kui-shell/plugin-openwhisk/tests/package.json'))

describe('History', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  const entityName = 'foo'
  const createCommand = `wsk action create ${entityName} ${ROOT}/data/openwhisk/foo.js`
  const listCommand = 'wsk action list'

  it('should create an action', () =>
    CLI.command(createCommand, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(entityName))
      .catch(Common.oops(this)))

  it(`should list history with filter 1`, () =>
    CLI.command(`history 1 create`, this.app).then(ReplExpect.okWithOnly(createCommand))) // 1 says it better be the last command we executed
  it(`should list history 2 and show the action creation`, () =>
    CLI.command(`history 2`, this.app).then(ReplExpect.okWith(createCommand)))

  // get something on the screen
  it(`should list actions`, () => CLI.command(listCommand, this.app).then(ReplExpect.okWithOnly(entityName)))

  it('should delete the action', () =>
    CLI.command(`wsk action delete ${entityName}`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.closed))

  it('should re-execute from history', async () => {
    try {
      const res = await CLI.command('history 5 create', this.app)

      await ReplExpect.okWithCustom({ passthrough: true })(res).then(N =>
        this.app.client.click(`${Selectors.LIST_RESULTS_N(N)}:first-child .entity-name`)
      )

      await SidecarExpect.open(res).then(SidecarExpect.showing(entityName))
    } catch (err) {
      Common.oops(this)(err)
    }
  })

  it(`should list history and show the action creation`, () =>
    CLI.command(`history`, this.app).then(ReplExpect.okWith(createCommand)))
  it(`should list history and show the action list`, () =>
    CLI.command(`history`, this.app).then(ReplExpect.okWith(listCommand)))

  it(`should list history with filter, expect nothing`, () =>
    CLI.command(`history gumbogumbo`, this.app).then(ReplExpect.ok)) // some random string that won't be in the command history
})
