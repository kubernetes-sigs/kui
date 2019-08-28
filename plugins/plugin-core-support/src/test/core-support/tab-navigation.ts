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
import { theme } from '@kui-shell/core/core/settings'
const { cli, selectors, keys } = ui

import { tabButtonSelector } from '@kui-shell/plugin-core-support/lib/new-tab'

describe('tab navigation', function(this: common.ISuite) {
  before(common.before(this))
  after(common.after(this))

  it('should focus on repl input', async () => {
    try {
      await this.app.client.waitForEnabled(selectors.CURRENT_PROMPT_BLOCK)
    } catch (err) {
      await common.oops(err)
    }
  })

  it('should still focus on repl input with whitespace', async () => {
    try {
      const { count } = await cli.do(' ', this.app, true, false, true)
      await this.app.client.keys('Tab')
      await this.app.client.waitForEnabled(selectors.PROMPT_N(count))
    } catch (err) {
      await common.oops(err)
    }
  })

  it('should delete the whitespace and tab to the first tab', async () => {
    try {
      await this.app.client.keys(keys.BACKSPACE)
      await this.app.client.keys('Tab')
      await this.app.client.waitForEnabled(selectors.CURRENT_TAB)
    } catch (err) {
      await common.oops(err)
    }
  })

  it('should tab on the new tab button and open a new tab', async () => {
    try {
      await this.app.client.keys('Tab')
      await this.app.client.keys('Enter')
      this.app.client.waitForVisible(selectors.TAB_SELECTED_N(2))
      common.waitForSession(this)
    } catch (err) {
      common.oops(this)
    }
  })

  it('should focus on repl input since we just hit Enter', async () => {
    try {
      await this.app.client.waitForEnabled(selectors.CURRENT_PROMPT_BLOCK)
    } catch (err) {
      await common.oops(err)
    }
  })

  it('should tab and focus on the first tab', async () => {
    try {
      await this.app.client.keys('Tab')
      await this.app.client.waitForEnabled(selectors.TAB_N(1))
    } catch (err) {
      await common.oops(err)
    }
  })

  it('should tab and focus on the second tab', async () => {
    try {
      await this.app.client.keys('Tab')
      await this.app.client.waitForEnabled(selectors.CURRENT_TAB)
    } catch (err) {
      await common.oops(err)
    }
  })

  it('should tab and focus on the new tab button', async () => {
    try {
      await this.app.client.keys('Tab')
      await this.app.client.waitForEnabled(tabButtonSelector)
    } catch (err) {
      await common.oops(err)
    }
  })

  it('should tab and focus on the help button, and hit Enter', async () => {
    try {
      await this.app.client.keys('Tab')
      await this.app.client.waitForEnabled('#help-button')
      await this.app.client.keys('Enter')
      await this.app.client.waitForVisible(selectors.SIDECAR)
      await this.app.client.waitForVisible(selectors.SIDECAR_MODE_BUTTON_SELECTED('about'))
    } catch (err) {
      await common.oops(err)
    }
  })

  it('should focus on repl input since we just hit Enter', async () => {
    try {
      await this.app.client.waitForEnabled(selectors.CURRENT_PROMPT_BLOCK)
    } catch (err) {
      await common.oops(err)
    }
  })

  it('should tab the first tab', async () => {
    try {
      await this.app.client.keys('Tab')
      await this.app.client.waitForEnabled(selectors.TAB_N(1))
    } catch (err) {
      await common.oops(err)
    }
  })

  it('should tab the second tab', async () => {
    try {
      await this.app.client.keys('Tab')
      await this.app.client.waitForEnabled(selectors.TAB_N(2))
    } catch (err) {
      await common.oops(err)
    }
  })

  it('should tab the new tab button', async () => {
    try {
      await this.app.client.keys('Tab')
      await this.app.client.waitForEnabled(tabButtonSelector)
    } catch (err) {
      await common.oops(err)
    }
  })

  it('should tab the new help button', async () => {
    try {
      await this.app.client.keys('Tab')
      await this.app.client.waitForEnabled('#help-button')
    } catch (err) {
      await common.oops(err)
    }
  })

  it('should tab to the Sidecar About Tab', async () => {
    try {
      await this.app.client.keys('Tab')
      await this.app.client.waitForEnabled(`${selectors.SIDECAR_MODE_BUTTON_SELECTED('about')}`)
    } catch (err) {
      await common.oops(err)
    }
  })

  it('should tab to the Sidecar GettingStarted Tab', async () => {
    try {
      await this.app.client.keys('Tab')
      await this.app.client.waitForEnabled(`${selectors.SIDECAR_MODE_BUTTON_SELECTED('gettingStarted')}`)
    } catch (err) {
      await common.oops(err)
    }
  })

  it('should tab to the Sidcar Configure Tab', async () => {
    try {
      await this.app.client.keys('Tab')
      await this.app.client.waitForEnabled(`${selectors.SIDECAR_MODE_BUTTON_SELECTED('configure')}`)
    } catch (err) {
      await common.oops(err)
    }
  })

  it('should tab to the Sidcar Version Tab', async () => {
    try {
      await this.app.client.keys('Tab')
      await this.app.client.waitForEnabled(`${selectors.SIDECAR_MODE_BUTTON_SELECTED('version')}`)
    } catch (err) {
      await common.oops(err)
    }
  })

  it('should tab through other Sidcar Tabs', async () => {
    const about = theme.about
    if (about) {
      about.forEach(async tab => {
        const mode = tab.mode
        try {
          await this.app.client.keys('Tab')
          await this.app.client.waitForEnabled(selectors.SIDECAR_MODE_BUTTON_SELECTED(mode))
        } catch (err) {
          await common.oops(err)
        }
      })
    }
  })
})
