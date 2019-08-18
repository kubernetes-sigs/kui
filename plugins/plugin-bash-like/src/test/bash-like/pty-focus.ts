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

import * as common from '@kui-shell/core/tests/lib/common'
import * as ui from '@kui-shell/core/tests/lib/ui'

import { v4 as uuid } from 'uuid'

const { cli, keys, selectors } = ui

/** helpful selectors */
const rows = (N: number) => selectors.xtermRows(N)

describe('xterm focus', function(this: common.ISuite) {
  before(common.before(this))
  after(common.after(this))

  const tmpFile = `/tmp/kui-${uuid()}`

  it(`should touch ${tmpFile}`, () =>
    cli
      .do(`touch ${tmpFile}`, this.app)
      .then(cli.expectJustOK)
      .catch(common.oops(this, true)))

  it(`should rm -i ${tmpFile}`, async () => {
    try {
      const res = await cli.do(`rm -i ${tmpFile}`, this.app)

      // wait for the output to appear
      await this.app.client.waitForExist(rows(res.count))

      // type "y" to confirm the rm
      await this.app.client.keys(`y${keys.ENTER}`)

      // wait for the command to finish with blank output
      await cli.expectBlank(res)
    } catch (err) {
      return common.oops(this, true)(err)
    }
  })

  it('should now give an 404 error on the removed file', () =>
    cli
      .do(`cat ${tmpFile}`, this.app)
      .then(cli.expectError(404))
      .catch(common.oops(this, true)))
})
