/*
 * Copyright 2021 The Kubernetes Authors
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

import { Common, CLI, ReplExpect, Selectors, Util } from '@kui-shell/test'

const TIMEOUT = 10000

Common.localDescribe('toggle edit mode', function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))
  Util.closeAllExceptFirstTab.bind(this)()

  const openNotebook = () => {
    it('should open a notebook using a CLI command', () =>
      CLI.command('replay /kui/welcome.json', this.app).catch(Common.oops(this, true)))
  }

  const argvCountCLICommandCheck = () => {
    it('should verify behavior for incorrect number of arguments', async () => {
      await CLI.command('tab edit toggle', this.app).then(
        ReplExpect.error('Not enough arguments. Expected: tab edit toggle tabIndexNum')
      )
    })
  }

  const tabNotANumCheck = () => {
    it('should make sure tab index num entered is a number', async () => {
      await CLI.command('tab edit toggle NaN', this.app).then(
        ReplExpect.error('4th argument is not a number. Expected type number')
      )
    })
  }

  const tabInvalidNumCheck = () => {
    it('should make sure tab index num entered is a valid tab', async () => {
      // we assume there are only two tabs available right now: 'Tab1' and 'Welcome to Kui'. Thus, only 1 or 2 should work
      const invalidTabNum = 3 // Cannot read property 'uuid' of null ??
      await CLI.command('tab edit toggle ' + invalidTabNum, this.app).then(
        ReplExpect.error('Could not find tab with give index ' + invalidTabNum)
      )
    })
  }

  const successfulToggles = () => {
    it('should create a new tab to perform the toggles', () =>
      Util.clickNewTabButton(this, 3).catch(Common.oops(this, true)))

    it('should successfully toggle tab 2', () =>
      CLI.command('tab edit toggle 2', this.app)
        .then(ReplExpect.okWithString('Successfully toggled edit mode'))
        .catch(Common.oops(this, true)))

    it('should successfully toggle tab 1', () =>
      CLI.command('tab edit toggle 1', this.app)
        .then(ReplExpect.okWithString('Successfully toggled edit mode'))
        .catch(Common.oops(this, true)))
  }

  const blockActionsNonNotebook = () => {
    it('should verify that only replay block action is available', async () => {
      try {
        const splitIndex = 1
        const N = (await CLI.lastBlock(this.app, splitIndex)).count

        // Only the replay block action button should be showing
        await this.app.client.$(Selectors.BLOCK_REMOVE_BUTTON(N)).then(_ => {
          _.waitForDisplayed({ timeout: TIMEOUT, reverse: true })
          _.moveTo()
        })
        await this.app.client.$(Selectors.BLOCK_LINK_BUTTON(N)).then(_ => {
          _.waitForDisplayed({ timeout: TIMEOUT, reverse: true })
          _.moveTo()
        })
        await this.app.client.$(Selectors.COMMAND_COPY_BUTTON(N)).then(_ => {
          _.waitForDisplayed({ timeout: TIMEOUT, reverse: true })
          _.moveTo()
        })
        await this.app.client.$(Selectors.COMMAND_RERUN_BUTTON(N, splitIndex)).then(_ => {
          _.waitForDisplayed()
          _.moveTo()
        })
      } catch (err) {
        return Common.oops(this, true)(err)
      }
    })
  }

  const doubleClickNonNotebook = () => {
    it('should verify that commentary blocks cannot enter edit mode when clicked', async () => {
      try {
        const notClickedInputSelector = Selectors._PROMPT_BLOCK_N(0) + ' .repl-input-element'
        await this.app.client.$(notClickedInputSelector).then(_ => _.click())
        const clickedInputSelector = '.repl-block:nth-child(1) .repl-input-element-wrapper[data-is-reedit="true"]'
        await this.app.client.$(clickedInputSelector).then(_ => _.waitForDisplayed({ timeout: TIMEOUT, reverse: true }))
      } catch (err) {
        return Common.oops(this, true)(err)
      }
    })
  }

  const splitHeadersCheck = () => {
    it('should verify that split headers are showing', async () => {
      try {
        await this.app.client.$(Selectors.TOP_TAB_N(2)).then(_ => _.click())
        await this.app.client.$('.kui--split-header').then(_ => _.waitForDisplayed({ timeout: TIMEOUT }))
      } catch (err) {
        return Common.oops(this, true)(err)
      }
    })
  }

  const blockActionsAvailable = () => {
    it('should verify that all block actions are available', async () => {
      try {
        // For notebooks being used for this test, the block at split index 2 will be used
        const splitIndex = 2
        const N = (await CLI.lastBlock(this.app, splitIndex)).count

        // All of the following block action buttons should be showing
        await this.app.client.$(Selectors.BLOCK_REMOVE_BUTTON(N)).then(_ => {
          _.waitForDisplayed()
          _.moveTo()
        })
        await this.app.client.$(Selectors.BLOCK_LINK_BUTTON(N)).then(_ => {
          _.waitForDisplayed()
          _.moveTo()
        })
        await this.app.client.$(Selectors.COMMAND_COPY_BUTTON(N)).then(_ => {
          _.waitForDisplayed()
          _.moveTo()
        })
        await this.app.client.$(Selectors.COMMAND_RERUN_BUTTON(N, splitIndex)).then(_ => {
          _.waitForDisplayed()
          _.moveTo()
        })
      } catch (err) {
        return Common.oops(this, true)(err)
      }
    })
  }

  const doubleClick = () => {
    it('should verify that commentary blocks can enter edit mode when double clicked', async () => {
      try {
        await this.app.client.$('.kui--commentary-card').then(_ => _.doubleClick())
        await this.app.client.$(Selectors.COMMENTARY_EDITOR).then(_ => _.waitForDisplayed({ timeout: TIMEOUT }))
        await this.app.client.$(Selectors.TOP_TAB_N(1)).then(_ => _.click())
      } catch (err) {
        return Common.oops(this, true)(err)
      }
    })
  }

  // Tests begin here
  openNotebook()
  it('should switch to tab 1', () => Util.switchToTopLevelTabViaClick(this, 1))
  argvCountCLICommandCheck()
  tabNotANumCheck()
  tabInvalidNumCheck()

  // where we actually toggle to readonly mode
  successfulToggles()

  // The following tests are for non-notebook tabs
  it('should switch to tab 1', () => Util.switchToTopLevelTabViaClick(this, 1))
  blockActionsNonNotebook()
  doubleClickNonNotebook()

  // The following tests are for notebooks
  it('should switch to tab 2', () => Util.switchToTopLevelTabViaClick(this, 2))
  splitHeadersCheck()
  blockActionsAvailable()
  doubleClick()
})
