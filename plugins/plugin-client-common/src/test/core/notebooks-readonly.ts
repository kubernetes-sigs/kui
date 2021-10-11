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

import { Common, CLI, Selectors, Util } from '@kui-shell/test'

const TIMEOUT = 1000

Common.localDescribe('notebooks read only mode', function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))
  Util.closeAllExceptFirstTab.bind(this)

  const openNotebook = () => {
    it('should open a notebook using a CLI command', () =>
      CLI.command('replay /kui/welcome.json', this.app).catch(Common.oops(this, true)))
  }

  const splitHeadersCheck = () => {
    it('should verify that split headers are not showing', async () => {
      try {
        await this.app.client.$('.kui--split-header').then(_ => _.waitForDisplayed({ timeout: TIMEOUT, reverse: true }))
      } catch (err) {
        return Common.oops(this, true)(err)
      }
    })
  }

  const doubleClick = () => {
    it('should verify that commentary blocks cannot enter edit mode when double clicked', async () => {
      try {
        await this.app.client.$('.kui--commentary-card').then(_ => _.doubleClick())
        await this.app.client
          .$(Selectors.COMMENTARY_EDITOR)
          .then(_ => _.waitForDisplayed({ timeout: TIMEOUT, reverse: true }))
      } catch (err) {
        return Common.oops(this, true)(err)
      }
    })
  }

  const blockActionsAvailable = () => {
    it('should verify that only the replay button is available for block actions', async () => {
      try {
        // For notebooks being used for this test, the block at split index 2 will be used
        const splitIndex = 2

        const N = (await CLI.lastBlock(this.app, splitIndex, 1, true)).count

        // the replay button should be showing
        await this.app.client
          .$(Selectors.COMMAND_RERUN_BUTTON(N, splitIndex))
          .then(_ => _.waitForDisplayed({ timeout: TIMEOUT }))

        // any other block action button should not be showing
        await this.app.client
          .$(Selectors.BLOCK_REMOVE_BUTTON(N))
          .then(_ => _.waitForDisplayed({ timeout: TIMEOUT, reverse: true }))
        await this.app.client
          .$(Selectors.BLOCK_LINK_BUTTON(N))
          .then(_ => _.waitForDisplayed({ timeout: TIMEOUT, reverse: true }))
        await this.app.client
          .$(Selectors.COMMAND_COPY_BUTTON(N))
          .then(_ => _.waitForDisplayed({ timeout: TIMEOUT, reverse: true }))
      } catch (err) {
        return Common.oops(this, true)(err)
      }
    })
  }

  // Tests begin here
  openNotebook()
  splitHeadersCheck()
  doubleClick()
  blockActionsAvailable()
})
