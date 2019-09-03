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

import { ISuite, before as commonBefore, after as commonAfter, oops, proxyIt } from '@kui-shell/core/tests/lib/common'
import * as ui from '@kui-shell/core/tests/lib/ui'

const { cli } = ui

describe('command history', function(this: ISuite) {
  before(commonBefore(this))
  after(commonAfter(this))

  proxyIt('should cd to the test dir', () =>
    cli
      .do(`cd ${process.env.TEST_ROOT}`, this.app)
      .then(cli.expectOKWithString('packages/tests'))
      .catch(oops(this, true))
  )

  const listCommand = 'ls ../..'
  it('should list local files', () =>
    cli
      .do(listCommand, this.app)
      .then(cli.expectOKWith('README.md'))
      .catch(oops(this)))

  // 1 says it better be the last command we executed
  it(`should list history with filter 1`, () =>
    cli
      .do(`history 1 ls`, this.app)
      .then(cli.expectOKWithOnly(listCommand))
      .catch(oops(this)))

  it(`should list history 2 and show the list command`, () =>
    cli
      .do(`history 2`, this.app)
      .then(cli.expectOKWith(listCommand))
      .catch(oops(this)))

  // get something on the screen
  it(`should list local files again`, () =>
    cli
      .do(listCommand, this.app)
      .then(cli.expectOKWith('README.md'))
      .catch(oops(this)))

  it('should re-execte from history via mouse click', async () => {
    try {
      const res = await cli.do('history 5 ls', this.app)
      const N = await cli.expectOKWithCustom({ passthrough: true })(res)
      const selector = `${ui.selectors.LIST_RESULTS_N(N)}:first-child .entity-name`
      await this.app.client.click(selector)
      return cli.expectOKWith('README.md')({ app: this.app, count: N + 1 })
    } catch (err) {
      oops(this)(err)
    }
  })

  it(`should list history with no arguments and show the list command`, () =>
    cli.do(`history`, this.app).then(cli.expectOKWith(listCommand)))

  it(`should list history with filter, expect nothing`, () =>
    cli
      .do(`history gumbogumbo`, this.app)
      .then(cli.expectJustOK) // some random string that won't be in the command history
      .catch(oops(this)))

  it(`should delete command history`, () =>
    cli
      .do(`history -c`, this.app)
      .then(cli.expectJustOK)
      .catch(oops(this)))

  it(`should list history with no args after delete and expect nothing`, () =>
    cli
      .do(`history`, this.app)
      .then(cli.expectJustOK)
      .catch(oops(this)))

  it(`should list history with idx arg after delete and expect only the previous`, () =>
    cli
      .do(`history 10`, this.app)
      .then(cli.expectOKWithOnly('history'))
      .catch(oops(this)))

  it(`should delete command history again`, () =>
    cli
      .do(`history -c`, this.app)
      .then(cli.expectJustOK)
      .catch(oops(this)))

  it(`should list history with idx and filter args after delete and expect nothing`, () =>
    cli
      .do(`history 10 ls`, this.app)
      .then(cli.expectJustOK) // some random string that won't be in the command history
      .catch(oops(this)))
})
