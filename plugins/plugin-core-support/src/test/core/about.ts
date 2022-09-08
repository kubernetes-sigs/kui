/*
 * Copyright 2018 The Kubernetes Authors
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

/** xdescribe because the default client does show the <?> icon (`noHelp`) */
xdescribe(`about command ${process.env.MOCHA_RUN_TARGET || ''}`, function (this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))
  Util.closeAllExceptFirstTab.bind(this)()

  it('should open the about window via command execution with comment', async () => {
    try {
      await CLI.command('about #About Kui', this.app)
      await this.app.client.$(Selectors.TAB_SELECTED_N(2)).then(_ => _.waitForDisplayed())
      await this.app.client.waitUntil(async () => {
        const actualTitle = await this.app.client.$(Selectors.TAB_TITLE_N(2)).then(_ => _.getText())
        return actualTitle === 'Welcome to Kui'
      })
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })

  Util.closeAllExceptFirstTab.bind(this)()

  it('should open the about via button click', async () => {
    try {
      await Common.refresh(this)
      await this.app.client.$('#help-button').then(_ => _.waitForDisplayed())

      await CLI.command('sleep 1', this.app).then(ReplExpect.blank)

      await this.app.client.$('#help-button').then(_ => _.click())

      await this.app.client.$(Selectors.TAB_SELECTED_N(2)).then(_ => _.waitForDisplayed())
      await this.app.client.waitUntil(
        async () => {
          const actualTitle = await this.app.client.$(Selectors.TAB_TITLE_N(2)).then(_ => _.getText())
          return actualTitle === 'Welcome to Kui'
        },
        { timeout: CLI.waitTimeout }
      )
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })
})
