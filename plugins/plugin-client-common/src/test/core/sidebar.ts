/*
 * Copyright 2022 The Kubernetes Authors
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

const timeout = { timeout: CLI.waitTimeout }
const guidebookTitle = 'Welcome to Kui'

describe(`sidebar ${process.env.MOCHA_RUN_TARGET || ''}`, function (this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  Util.closeAllExceptFirstTab.bind(this)()

  it('should have a sidebar hamburger menu button', () =>
    this.app.client
      .$(Selectors.Sidebar.hamburgerButton)
      .then(_ => _.waitForExist(timeout))
      .catch(Common.oops(this, true)))

  it('should have a hidden sidebar on load', () =>
    this.app.client
      .$(Selectors.Sidebar.contentContainerVisible(false))
      .then(_ => _.waitForExist(timeout))
      .catch(Common.oops(this, true)))

  it('should show the sidebar on click of the hamburger', async () => {
    try {
      await this.app.client.$(Selectors.Sidebar.hamburgerButton).then(_ => _.click())
      await this.app.client.$(Selectors.Sidebar.contentContainerVisible(true)).then(_ => _.waitForExist(timeout))
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })

  it(`should have an sidebar item for ${guidebookTitle}`, async () => {
    try {
      const item = await this.app.client.$(Selectors.Sidebar.item(guidebookTitle))
      await item.waitForExist(timeout)
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })

  it(`should show the ${guidebookTitle} guidebook on click`, async () => {
    try {
      const item = await this.app.client.$(Selectors.Sidebar.item(guidebookTitle))
      await item.waitForExist(timeout)
      await item.click()

      await this.app.client.$(Selectors.TOP_TAB_WITH_TITLE(guidebookTitle)).then(_ => _.waitForExist(timeout))

      // confirm it is the current tab
      await Util.expectCurrentTabTitle(this, guidebookTitle)
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })
})
