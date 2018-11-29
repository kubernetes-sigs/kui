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

import { ISuite } from '../../../../tests/lib/common'
import * as common from '../../../../tests/lib/common' // tslint:disable-line:no-duplicate-imports
import * as ui from '../../../../tests/lib/ui'
const { cli, selectors, sidecar } = ui

/**
 * Take a screenshot with the given "which" specification (e.g. "full"
 * or "sidecar")
 *
 */
const takeScreenshot = function (ctx, which = '') {
  return cli.do(`screenshot ${which}`, ctx.app)
    .then(res => ctx.app.client.waitForExist('#screenshot-captured')
      .then(() => ctx.app.client.waitForEnabled('#screenshot-captured .go-away-button'))
      .then(() => ctx.app.client.click('#screenshot-captured .sidecar-bottom-stripe-save'))
      .then(() => ctx.app.client.click('#screenshot-captured .sidecar-bottom-stripe-close'))
      .then(() => ctx.app.client.waitForExist('#screenshot-captured', 5000, true)) // false meaning better not be visible
      .then(() => res)
      .then(cli.expectOKWithCustom({ expect: 'Successfully captured a screenshot to the clipboard' })))
    .catch(common.oops(ctx))
}

describe('Take screenshot', function (this: ISuite) {
  before(common.before(this))
  after(common.after(this))

  it('should have an active repl', () => cli.waitForRepl(this.app))

  it('should fail take screenshot last as the first command', () => cli.do(`screenshot last`, this.app)
    .then(cli.expectError(0, 'You requested to screenshot the last REPL output, but this is the first command')))

  it('should fail to take screenshot with bogus arg', () => cli.do(`screenshot goober`, this.app)
    .then(cli.expectError(500, 'Capture a screenshot'))) // part of the usage message

  it('should take screenshot with no arguments', () => takeScreenshot(this))
  it('should take screenshot full', () => takeScreenshot(this, 'full'))
  it('should fail to screenshot sidecar', () => cli.do('screenshot sidecar', this.app)
    .then(cli.expectError(0, 'You requested to screenshot the sidecar, but it is not currently open')))
  it('should take screenshot repl', () => takeScreenshot(this, 'repl'))
  it('should take screenshot last', () => takeScreenshot(this, 'last'))
  it('should take screenshot last-full', () => takeScreenshot(this, 'last-full'))

  // create an entity, so we can open the sidecar
  const actionName = 'foo'
  it('should create an action via let', () => cli.do(`let ${actionName} = x=>x`, this.app)
    .then(cli.expectJustOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing(actionName))
    .catch(common.oops(this)))

  // now screenshot sidecar should work
  it('should take screenshot sidecar', () => takeScreenshot(this, 'sidecar'))
})
