/*
 * Copyright 2020 IBM Corporation
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

describe('settings notebook', function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))
  Util.closeAllExceptFirstTab.bind(this)()

  it('should click on the settings status stripe button and show a new tab', async () => {
    try {
      await this.app.client.click('#kui--settings-button')

      // better have a new tab
      await this.app.client.waitForExist(Selectors.TOP_TAB_N(2))

      await this.app.client.waitUntil(async () => {
        const actualTabTitle = await this.app.client.getText(Selectors.CURRENT_TAB_TITLE)
        return actualTabTitle === 'Kui Settings'
      }, CLI.waitTimeout)
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })

  it('should click on the settings status stripe button AGAIN and NOT show a new tab', async () => {
    try {
      await this.app.client.click('#kui--settings-button')
      await new Promise(resolve => setTimeout(resolve, 1000))
      await this.app.client.click('#kui--settings-button')
      await new Promise(resolve => setTimeout(resolve, 1000))
      await this.app.client.click('#kui--settings-button')
      await new Promise(resolve => setTimeout(resolve, 1000))

      // better not have a third tab
      await this.app.client.waitForExist(Selectors.TOP_TAB_N(3), 5000, true)
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })
})
