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

import { ISuite } from '@kui-shell/core/tests/lib/common'
import * as common from '@kui-shell/core/tests/lib/common'
import * as ui from '@kui-shell/core/tests/lib/ui'
const { cli, selectors, sidecar } = ui

import { theme as settings } from '@kui-shell/core/core/settings'

describe('About command', function (this: ISuite) {
  before(common.before(this))
  after(common.after(this))

  it('should open the about window via command execution', () => cli.do('about', this.app)
     .then(cli.expectJustOK)
     .then(sidecar.expectOpen)
     .then(sidecar.expectShowing(settings.productName))
     .catch(common.oops(this)))

  it('should open the about window via button click', async () => {
    try {
      await this.app.client.refresh()
      await this.app.client.click('#help-button')

      await Promise.all([
        sidecar.expectOpen(this.app),
        sidecar.expectShowing(settings.productName)(this.app)
      ])
    } catch (err) {
      common.oops(this)(err)
    }
  })
})
