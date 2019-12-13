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

import { Common, CLI, ReplExpect, Selectors } from '@kui-shell/test'

describe('command history', function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  Common.proxyIt('should cd to the test dir', () =>
    CLI.command(`cd ${process.env.TEST_ROOT}`, this.app)
      .then(ReplExpect.okWithString('packages/test'))
      .catch(Common.oops(this, true))
  )

  const listCommand = 'ls ../..'
  it('should list local files', () =>
    CLI.command(listCommand, this.app)
      .then(ReplExpect.okWith('README.md'))
      .catch(Common.oops(this)))

  // 1 says it better be the last command we executed
  it(`should list history with filter 1`, () =>
    CLI.command(`history 1 ls`, this.app)
      .then(ReplExpect.okWithOnly(listCommand))
      .catch(Common.oops(this)))

  it(`should list history 2 and show the list command`, () =>
    CLI.command(`history 2`, this.app)
      .then(ReplExpect.okWith(listCommand))
      .catch(Common.oops(this)))

  // get something on the screen
  it(`should list local files again`, () =>
    CLI.command(listCommand, this.app)
      .then(ReplExpect.okWith('README.md'))
      .catch(Common.oops(this)))

  it('should re-execte from history via mouse click', async () => {
    try {
      const res = await CLI.command('history 5 ls', this.app)
      const N = await ReplExpect.okWithCustom({ passthrough: true })(res)
      const selector = `${Selectors.LIST_RESULTS_N(N)}:first-child .entity-name`
      await this.app.client.click(selector)
      return ReplExpect.okWith('README.md')({ app: this.app, count: N + 1 })
    } catch (err) {
      Common.oops(this)(err)
    }
  })

  it(`should list history with no arguments and show the list command`, () =>
    CLI.command(`history`, this.app).then(ReplExpect.okWith(listCommand)))

  it(`should list history with filter, expect nothing`, () =>
    CLI.command(`history gumbogumbo`, this.app)
      .then(ReplExpect.justOK) // some random string that won't be in the command history
      .catch(Common.oops(this)))

  it(`should delete command history`, () =>
    CLI.command(`history -c`, this.app)
      .then(ReplExpect.justOK)
      .catch(Common.oops(this)))

  it(`should list history with no args after delete and expect nothing`, () =>
    CLI.command(`history`, this.app)
      .then(ReplExpect.justOK)
      .catch(Common.oops(this)))

  it(`should list history with idx arg after delete and expect only the previous`, () =>
    CLI.command(`history 10`, this.app)
      .then(ReplExpect.okWithOnly('history'))
      .catch(Common.oops(this)))

  it(`should delete command history again`, () =>
    CLI.command(`history -c`, this.app)
      .then(ReplExpect.justOK)
      .catch(Common.oops(this)))

  it(`should list history with idx and filter args after delete and expect nothing`, () =>
    CLI.command(`history 10 ls`, this.app)
      .then(ReplExpect.justOK) // some random string that won't be in the command history
      .catch(Common.oops(this)))
})
