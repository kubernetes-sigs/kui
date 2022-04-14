/*
 * Copyright 2020 The Kubernetes Authors
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

/**
 * Test that the Welcome to Kui tab is opened in the background
 *
 */

import { Common, CLI, ReplExpect, Selectors, Util } from '@kui-shell/test'

/** TODO could we extract this directly from welcome.json? */
const nSplitsInWelcomeNotebook = 2

describe(`Background tab open onload ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  it('should have a second tab named Welcome to Kui', async () => {
    try {
      let idx = 0
      await this.app.client.waitUntil(
        async () => {
          const [actualTitle1, actualTitle2] = await Promise.all([
            Util.getTabTitle(this, Selectors.CURRENT_TAB_TITLE), // intentional: check CURRENT, not N(1)
            Util.getTabTitle(this, Selectors.TAB_TITLE_N(2))
          ])
          if (++idx > 5) {
            console.error(`Still waiting for tab titles; actualTitle1=${actualTitle1} actualTitle2=${actualTitle2}`)
          }
          return /^Tab/.test(actualTitle1) && actualTitle2 === 'Welcome to Kui'
        },
        { timeout: CLI.waitTimeout }
      )
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })

  it('should switch to the second tab via command', () =>
    CLI.command('tab switch 2', this.app)
      .then(() => this.app.client.$(Selectors.TAB_SELECTED_N(2)))
      .then(_ => _.waitForDisplayed())
      .catch(Common.oops(this, true)))

  it(`should have ${nSplitsInWelcomeNotebook} splits`, () => ReplExpect.splitCount(nSplitsInWelcomeNotebook)(this.app))
})
