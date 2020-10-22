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
      await this.app.client.$('#kui--settings-button').then(_ => _.click())

      // better have a new tab
      await this.app.client.$(Selectors.TOP_TAB_N(2)).then(_ => _.waitForExist())

      await this.app.client.waitUntil(
        async () => {
          const actualTabTitle = await this.app.client.$(Selectors.CURRENT_TAB_TITLE).then(_ => _.getText())
          return actualTabTitle === 'Kui Settings'
        },
        { timeout: CLI.waitTimeout }
      )
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })

  it('should click on the settings status stripe button AGAIN and NOT show a new tab', async () => {
    try {
      await this.app.client.$('#kui--settings-button').then(_ => _.click())
      await new Promise(resolve => setTimeout(resolve, 1000))
      await this.app.client.$('#kui--settings-button').then(_ => _.click())
      await new Promise(resolve => setTimeout(resolve, 1000))
      await this.app.client.$('#kui--settings-button').then(_ => _.click())
      await new Promise(resolve => setTimeout(resolve, 1000))

      // better not have a third tab
      await this.app.client.$(Selectors.TOP_TAB_N(3)).then(_ => _.waitForExist({ timeout: 5000, reverse: true }))
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })
})
