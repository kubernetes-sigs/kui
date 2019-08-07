/*
 * Copyright 2019 IBM Corporation
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

import * as ui from '@kui-shell/core/tests/lib/ui'
import * as common from '@kui-shell/core/tests/lib/common'
const { cli, selectors } = ui

describe('Confirm dialog', function(this: common.ISuite) {
  before(common.before(this))
  after(common.after(this))

  it('should fail to exec if the command is missing', () => cli.do(`confirm`, this.app).then(cli.expectError(497)))

  it('should not do anything if user cancels', () => {
    return cli
      .do(`confirm "echo hello"`, this.app)
      .then(() => this.app.client.waitForExist('#confirm-dialog'))
      .then(() => this.app.client.click('#confirm-dialog .close-button'))
      .then(() =>
        cli.expectOKWithCustom({
          expect: 'Confirmation modal pop up'
        })
      )
  })

  it('should execute if user confirms', () => {
    return cli
      .do(`confirm "echo hello"`, this.app)
      .then(() => this.app.client.waitForExist('#confirm-dialog'))
      .then(() => this.app.client.click('#confirm-dialog .bx--btn--danger'))
      .then(() => this.app.client.waitForExist(`${selectors.OUTPUT_LAST}`))
      .then(() => cli.expectOKWithCustom({ selector: selectors.BY_NAME('hello') }))
      .catch(common.oops(this))
  })
})
