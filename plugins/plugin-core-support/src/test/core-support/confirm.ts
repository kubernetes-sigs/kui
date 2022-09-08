/*
 * Copyright 2019 The Kubernetes Authors
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

describe('Confirm dialog', function (this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  it('should fail to exec if the command is missing', () =>
    CLI.command(`confirm`, this.app).then(ReplExpect.error(497)))

  it('should not do anything if user cancels', () => {
    return CLI.command('confirm "echo hello"', this.app)
      .then(() => this.app.client.$(Selectors.CONFIRM_DIALOG))
      .then(_ => _.waitForExist())
      .then(() => this.app.client.$(Selectors.CONFIRM_DIALOG_CANCEL_BUTTON))
      .then(_ => _.click())
      .then(() =>
        ReplExpect.okWithCustom({
          expect: 'Confirmation modal pop up'
        })
      )
  })

  it('should execute if user confirms', () => {
    return CLI.command('confirm "echo hello"', this.app)
      .then(() => this.app.client.$(Selectors.CONFIRM_DIALOG))
      .then(_ => _.waitForExist())
      .then(() => this.app.client.$(Selectors.CONFIRM_DIALOG_CONFIRM_BUTTON))
      .then(_ => _.click())
      .then(() => this.app.client.$(Selectors.OUTPUT_LAST))
      .then(_ => _.waitForExist())
      .then(() => ReplExpect.okWithCustom({ selector: Selectors.BY_NAME('hello') })) // <-- FIXME this does not seem correct
      .catch(Common.oops(this))
  })
})
