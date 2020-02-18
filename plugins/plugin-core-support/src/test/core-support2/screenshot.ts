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

import { Common, CLI, ReplExpect, SidecarExpect } from '@kui-shell/test'

/**
 * Take a screenshot with the given "which" specification (e.g. "full"
 * or "sidecar")
 *
 */
const takeScreenshot = function(ctx, which = '') {
  return CLI.command(`screenshot ${which}`, ctx.app)
    .then(res =>
      ctx.app.client
        .waitForExist('#screenshot-captured')
        .then(() => ctx.app.client.click('#screenshot-captured .screenshot-save-button'))
        .then(() => ctx.app.client.click('#screenshot-captured .screenshot-close-botton'))
        .then(() => ctx.app.client.waitForExist('#screenshot-captured', 10000, true)) // false meaning better not be visible
        .then(() => res)
        .then(
          ReplExpect.okWithCustom({
            expect: 'Successfully captured a screenshot to the clipboard'
          })
        )
    )
    .catch(Common.oops(ctx, true))
}

Common.localDescribe('screenshot', function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  it('should fail take screenshot last as the first command', () =>
    CLI.command(`screenshot last`, this.app).then(
      ReplExpect.error(500, 'You requested to screenshot the last command line output, but this is the first command')
    ))

  it('should fail to take screenshot with bogus arg', () =>
    CLI.command(`screenshot goober`, this.app).then(ReplExpect.error(500))) // part of the usage message

  it('should take screenshot with no arguments', () => takeScreenshot(this))
  it('should take screenshot full', () => takeScreenshot(this, 'full'))
  it('should fail to screenshot sidecar', () => {
    return CLI.command('screenshot sidecar', this.app)
      .then(ReplExpect.error(500, 'You requested to screenshot the sidecar, but it is not currently open'))
      .catch(Common.oops(this, true))
  })
  it('should take screenshot repl', () => takeScreenshot(this, 'repl'))
  it('should take screenshot last', () => takeScreenshot(this, 'last'))
  it('should take screenshot last-full', () => takeScreenshot(this, 'last-full'))

  // create an entity, so we can open the sidecar
  it('should open README.md', () =>
    CLI.command(`open ../../README.md`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('README.md'))
      .catch(Common.oops(this, true)))

  // now screenshot sidecar should work
  it('should take screenshot sidecar', () => takeScreenshot(this, 'sidecar'))
})
