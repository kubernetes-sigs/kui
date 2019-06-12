/*
 * Copyright 2018 IBM Corporation
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

import * as assert from 'assert'

import { ISuite, before as commonBefore, after as commonAfter, oops } from '@kui-shell/core/tests/lib/common'
import * as ui from '@kui-shell/core/tests/lib/ui'
import { theme as settings } from '@kui-shell/core/core/settings'

const { cli, sidecar } = ui

describe('About command', function (this: ISuite) {
  before(commonBefore(this))
  after(commonAfter(this))

  it('should open the about window via command execution', () => cli.do('about', this.app)
    .then(cli.expectJustOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing(settings.productName))
    .catch(oops(this)))

  it('should open the getting started tutor via button click', async () => {
    try {
      await this.app.client.refresh()
      await this.app.client.click('#help-button')

      await this.app.client.waitForVisible('#tutorialPane')

      const tutorialName = await this.app.client.getText('#tutorialPane .tutorial-header .tutorial-header-tutorial-name')
      assert.strict.equal(tutorialName.toLowerCase(), 'getting started')
    } catch (err) {
      oops(this)(err)
    }
  })
})
