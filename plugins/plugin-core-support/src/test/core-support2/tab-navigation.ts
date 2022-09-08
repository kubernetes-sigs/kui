/*
 * Copyright 2019 The Kubernetes Authors
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

import { ok } from 'assert'
import { Common, CLI, Keys, Selectors, Util } from '@kui-shell/test'
import { tabButtonSelector } from '../../lib/cmds/tab-management'

describe('tab navigation', function (this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))
  Util.closeAllExceptFirstTab.bind(this)()

  const waitForFocus = (selector: string, timeout?: number) => {
    return this.app.client.waitUntil(
      async () => {
        try {
          return await this.app.client['isActive'](selector)
        } catch (err) {
          console.error(err)
          throw err
        }
      },
      { timeout: timeout || CLI.waitTimeout }
    )
  }

  /** keep hitting tab until the given `selector` is focused */
  const tabAndWait = async (selector: string) => {
    while (true) {
      await this.app.client.keys(Keys.TAB)

      try {
        await waitForFocus(selector, 1000)
        break
      } catch (err) {
        console.error(`we may need to tab again to ${selector}`)
      }
    }
  }

  const testPromptIsSelected = (hitTab = false, waitForSessionInit = false) => {
    it('should focus on repl input since we just hit Enter', async () => {
      try {
        if (waitForSessionInit) {
          await CLI.waitForSession(this)
        }
        if (hitTab) {
          // hit tab until the prompt is enabled
          tabAndWait(Selectors.CURRENT_PROMPT)
        }
        await waitForFocus(Selectors.CURRENT_PROMPT)
      } catch (err) {
        await Common.oops(this, true)(err)
      }
    })
  }

  const testSelector = (selector: string, hitEnter = false, selectedSelector?: string, tabUntil = false) => {
    it(`should tab to the ${selector} hitEnter=${hitEnter}`, async () => {
      try {
        if (tabUntil) {
          await tabAndWait(selector)
        } else {
          await this.app.client.keys(Keys.TAB)
          await waitForFocus(selector)
        }

        if (hitEnter) {
          await this.app.client.keys(Keys.ENTER)

          if (selectedSelector) {
            await this.app.client.$(selectedSelector).then(_ => _.waitForEnabled({ timeout: 5000 }))
          }
        }
      } catch (err) {
        await Common.oops(this, true)(err)
      }
    })
  }

  /* const testAboutMode = (mode: string, hitEnter = false, tabUntil = false) => {
    testSelector(
      `${Selectors.SIDECAR_MODE_BUTTON_V2(mode)}`,
      hitEnter,
      Selectors.SIDECAR_MODE_BUTTON_SELECTED_V2(mode),
      tabUntil
    )
  } */

  const testNoTabNavigation = () => {
    it('should still focus on repl input if we hit tab while the input has content', async () => {
      try {
        const { count } = await CLI.command(' ', this.app, true, false, true)
        await this.app.client.keys(Keys.TAB)
        await this.app.client.$(Selectors.PROMPT_N(count)).then(_ => _.waitForEnabled())
      } catch (err) {
        await Common.oops(this, true)(err)
      }
    })
  }

  const hitBackspace = () => {
    it('should hit the backspace key once, to clear the repl input', () => {
      return this.app.client.keys(Keys.BACKSPACE)
    })
  }

  const TAB_BUTTON_N = Selectors.TOP_TAB_N_CLICKABLE

  const promptBetterBeFocused = async () => {
    const promptIsFocused = await this.app.client['isActive'](Selectors.CURRENT_PROMPT)
    ok(promptIsFocused)
  }

  const testFullCycle = () => {
    it('should be the beginning of a full cycle', promptBetterBeFocused)
    testSelector(TAB_BUTTON_N(1), undefined, undefined, true)
    testSelector(TAB_BUTTON_N(2))
    testSelector(tabButtonSelector)
    // testSelector('#help-button', false, undefined, true)
    testPromptIsSelected(true) // <-- true means we hit tab first
    it('should be the end of the full cycle', promptBetterBeFocused)
  }

  // when repl has content, tab navigation should not occur
  testPromptIsSelected(false, true)
  testNoTabNavigation()
  hitBackspace()

  // tab to new tab button and hit enter
  testSelector(TAB_BUTTON_N(1), undefined, undefined, true)
  testSelector(tabButtonSelector, true, Selectors.TAB_SELECTED_N(2))
  testPromptIsSelected(false, true)

  // test a full tab cycle
  testFullCycle()
  testFullCycle()
  testFullCycle()

  // tab to help button and hit enter
  /* testSelector(TAB_BUTTON_N(1))
  testSelector(TAB_BUTTON_N(2))
  testSelector(tabButtonSelector) */
  /* removing about button
  testSelector('#help-button', true, undefined, true)
  it('should have a new About Kui top tab', () =>
    this.app.client.$(Selectors.TOP_TAB_WITH_TITLE('Welcome to Kui')).then(_ => _.waitForDisplayed({ timeout: 5000 }))) */
})
