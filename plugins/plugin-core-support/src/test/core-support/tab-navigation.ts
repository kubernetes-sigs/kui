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

import * as common from '@kui-shell/core/tests/lib/common'
import * as ui from '@kui-shell/core/tests/lib/ui'
const { cli, selectors, keys } = ui

import { tabButtonSelector } from '@kui-shell/plugin-core-support/lib/new-tab'

describe('tab navigation', function(this: common.ISuite) {
  before(common.before(this))
  after(common.after(this))

  const testPromptIsSelected = (hitTab = false, waitForSessionInit = false) => {
    it('should focus on repl input since we just hit Enter', async () => {
      try {
        if (waitForSessionInit) {
          await common.waitForSession(this)
        }
        if (hitTab) {
          await this.app.client.keys(keys.TAB)
        }
        await this.app.client.waitForEnabled(selectors.CURRENT_PROMPT_BLOCK)
      } catch (err) {
        await common.oops(this)(err)
      }
    })
  }
  const waitForFocus = (selector: string) => {
    return this.app.client.waitUntil(async () => {
      try {
        return this.app.client.hasFocus(selector)
      } catch (err) {
        console.error(err)
        throw err
      }
    }, 20000)
  }

  const testSelector = (selector: string, hitEnter = false, selectedSelector?: string) => {
    it(`should tab to the ${selector} hitEnter=${hitEnter}`, async () => {
      try {
        await this.app.client.keys(keys.TAB)
        await waitForFocus(selector)

        if (hitEnter) {
          await this.app.client.keys(keys.ENTER)
          await this.app.client.waitForEnabled(selectedSelector)
        }
      } catch (err) {
        await common.oops(this)(err)
      }
    })
  }

  const testAboutMode = (mode: string, hitEnter = false) => {
    testSelector(
      `${selectors.SIDECAR_MODE_BUTTON(mode)} .kui--tab-navigatable`,
      hitEnter,
      selectors.SIDECAR_MODE_BUTTON_SELECTED(mode)
    )
  }

  const testNoTabNavigation = () => {
    it('should still focus on repl input if we hit tab while the input has content', async () => {
      try {
        const { count } = await cli.do(' ', this.app, true, false, true)
        await this.app.client.keys(keys.TAB)
        await this.app.client.waitForEnabled(selectors.PROMPT_N(count))
      } catch (err) {
        await common.oops(this)(err)
      }
    })
  }

  const hitBackspace = () => {
    it('should hit the backspace key once, to clear the repl input', () => {
      return this.app.client.keys(keys.BACKSPACE)
    })
  }

  const TAB_BUTTON_N = (N: number) => `.kui-tab:nth-child(${N})`

  const testFullCycle = () => {
    testSelector(TAB_BUTTON_N(1))
    testSelector(TAB_BUTTON_N(2))
    testSelector(tabButtonSelector)
    testSelector('#help-button')
    testPromptIsSelected(true) // <-- true means we hit tab first
    it('should be the end of the full cycle', () => true)
  }

  // when repl has content, tab navigation should not occur
  testPromptIsSelected(false, true)
  testNoTabNavigation()
  hitBackspace()

  // tab to new tab button and hit enter
  testSelector(TAB_BUTTON_N(1))
  testSelector(tabButtonSelector, true, selectors.TAB_SELECTED_N(2))
  testPromptIsSelected(false, true)

  // test a full tab cycle
  testFullCycle()
  testFullCycle()
  testFullCycle()

  // tab to help button and hit enter
  testSelector(TAB_BUTTON_N(1))
  testSelector(TAB_BUTTON_N(2))
  testSelector(tabButtonSelector)
  testSelector('#help-button', true, selectors.SIDECAR_MODE_BUTTON_SELECTED('about'))
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
