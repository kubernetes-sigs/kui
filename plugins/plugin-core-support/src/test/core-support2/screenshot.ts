/*
 * Copyright 2017, 2020 IBM Corporation
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

import { Common, CLI, ReplExpect, Selectors, SidecarExpect } from '@kui-shell/test'

/**
 * Take a screenshot with the given "which" specification (e.g. "full"
 * or "sidecar")
 *
 */
async function takeScreenshot(ctx: Common.ISuite, which: string) {
  try {
    await ctx.app.client.click('.kui--screenshot-button')
    await ctx.app.client.waitForExist('body.kui--screenshot-active')

    await ctx.app.client.click(which)

    await ctx.app.client.waitForExist('#screenshot-captured')

    await ctx.app.client.click('#screenshot-captured .screenshot-save-button')
    await ctx.app.client.click('#screenshot-captured .bx--toast-notification__close-button')
    await ctx.app.client.waitForExist('#screenshot-captured', 10000, true)
    await ctx.app.client.waitForExist('body.kui--screenshot-active', 10000, true)
  } catch (err) {
    Common.oops(ctx, true)
  }
}

Common.localDescribe('screenshot', function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  // now screenshot sidecar should work
  it('should take screenshot of first block', () => takeScreenshot(this, Selectors.PROMPT_BLOCK_N(0)))

  // create an entity, so we can open the sidecar
  it('should open README.md', () =>
    CLI.command(`open ../../README.md`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('README.md'))
      .catch(Common.oops(this, true)))

  // now screenshot sidecar should work
  it('should take screenshot of sidecar', () => takeScreenshot(this, Selectors.SIDECAR))
})
