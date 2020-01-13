/*
 * Copyright 2019 IBM Corporation
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
import { Common, CLI, Keys, Selectors } from '@kui-shell/test'
import { tabButtonSelector } from '../../lib/new-tab'

describe('tab navigation', function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  const waitForFocus = (selector: string, timeout?: number) => {
    return this.app.client.waitUntil(async () => {
      try {
        return await this.app.client.hasFocus(selector)
      } catch (err) {
        console.error(err)
        throw err
      }
    }, timeout || CLI.waitTimeout)
  }

  const testPromptIsSelected = (hitTab = false, waitForSessionInit = false) => {
    it('should focus on repl input since we just hit Enter', async () => {
      try {
        if (waitForSessionInit) {
          await CLI.waitForSession(this)
        }
        if (hitTab) {
          // hit tab until the prompt is enabled
          while (true) {
            await this.app.client.keys(Keys.TAB)

            try {
              await waitForFocus(Selectors.CURRENT_PROMPT, 1000)
              break
            } catch (err) {
              console.error('we may need to tab again to restore prompt focus')
            }
          }
        }
        await waitForFocus(Selectors.CURRENT_PROMPT)
      } catch (err) {
        await Common.oops(this)(err)
      }
    })
  }

  const testSelector = (selector: string, hitEnter = false, selectedSelector?: string) => {
    it(`should tab to the ${selector} hitEnter=${hitEnter}`, async () => {
      try {
        await this.app.client.keys(Keys.TAB)
        await waitForFocus(selector)

        if (hitEnter) {
          await this.app.client.keys(Keys.ENTER)
          await this.app.client.waitForEnabled(selectedSelector)
        }
      } catch (err) {
        await Common.oops(this)(err)
      }
    })
  }

  const testAboutMode = (mode: string, hitEnter = false) => {
    testSelector(
      `${Selectors.SIDECAR_MODE_BUTTON(mode)} .kui--tab-navigatable`,
      hitEnter,
      Selectors.SIDECAR_MODE_BUTTON_SELECTED(mode)
    )
  }

  const testNoTabNavigation = () => {
    it('should still focus on repl input if we hit tab while the input has content', async () => {
      try {
        const { count } = await CLI.command(' ', this.app, true, false, true)
        await this.app.client.keys(Keys.TAB)
        await this.app.client.waitForEnabled(Selectors.PROMPT_N(count))
      } catch (err) {
        await Common.oops(this)(err)
      }
    })
  }

  const hitBackspace = () => {
    it('should hit the backspace key once, to clear the repl input', () => {
      return this.app.client.keys(Keys.BACKSPACE)
    })
  }

  const TAB_BUTTON_N = (N: number) => `.kui-tab:nth-child(${N})`

  const promptBetterBeFocused = async () => {
    const promptIsFocused = await this.app.client.hasFocus(Selectors.CURRENT_PROMPT)
    ok(promptIsFocused)
  }

  const testFullCycle = () => {
    it('should be the beginning of a full cycle', promptBetterBeFocused)
    testSelector(TAB_BUTTON_N(1))
    testSelector(TAB_BUTTON_N(2))
    testSelector(tabButtonSelector)
    testSelector('#help-button')
    testPromptIsSelected(true) // <-- true means we hit tab first
    it('should be the end of the full cycle', promptBetterBeFocused)
  }

  // when repl has content, tab navigation should not occur
  testPromptIsSelected(false, true)
  testNoTabNavigation()
  hitBackspace()

  // tab to new tab button and hit enter
  testSelector(TAB_BUTTON_N(1))
  testSelector(tabButtonSelector, true, Selectors.TAB_SELECTED_N(2))
  testPromptIsSelected(false, true)

  // test a full tab cycle
  testFullCycle()
  testFullCycle()
  testFullCycle()

  // tab to help button and hit enter
  testSelector(TAB_BUTTON_N(1))
  testSelector(TAB_BUTTON_N(2))
  testSelector(tabButtonSelector)
  testSelector('#help-button', true, Selectors.SIDECAR_MODE_BUTTON_SELECTED('about'))
  testPromptIsSelected()

  // now the sidecar is open, so cycle through the sidecar tabs
  testSelector(TAB_BUTTON_N(1))
  testSelector(TAB_BUTTON_N(2))
  testSelector(tabButtonSelector)
  testSelector('#help-button')
  testAboutMode('about')
  testAboutMode('gettingStarted')
  testAboutMode('configure')
  testAboutMode('version', true) // hit enter on the Version tab
  testPromptIsSelected() // because we just hit enter
})
