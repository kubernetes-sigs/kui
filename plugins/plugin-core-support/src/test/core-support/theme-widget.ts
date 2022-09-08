/*
 * Copyright 2020 The Kubernetes Authors
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

import { Common, CLI, ReplExpect, Selectors } from '@kui-shell/test'
import { resetTheme } from './theme-common'

const altTheme = 'Carbon Gray90'

describe('theme switching via status stripe widget', function (this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  resetTheme(this)

  it(`should click on the theme widget and switch to ${altTheme}`, async () => {
    try {
      const widget = await this.app.client.$('#kui--settings-widget button')
      await widget.click()

      const menuItem = await this.app.client.$(
        `${Selectors.STATUS_STRIPE} ${Selectors.DROPDOWN_MENU_ITEM_NAMED(altTheme)}`
      )
      await menuItem.click()
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })

  it('should sleep a bit for things to settle', () => new Promise(resolve => setTimeout(resolve, 3000)))

  it(`should show that we are using the ${altTheme} theme`, () =>
    CLI.command('theme current', this.app).then(ReplExpect.okWithString(altTheme)).catch(Common.oops(this, true)))

  resetTheme(this)
})
