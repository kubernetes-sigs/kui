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

import { v4 as uuid } from 'uuid'

import { Common, CLI, Keys, ReplExpect, Selectors } from '@kui-shell/test'

/** helpful selectors */
const rows = (N: number) => Selectors.xtermRows(N)

describe('xterm focus', function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  const tmpFile = `/tmp/kui-${uuid()}`

  it(`should touch ${tmpFile}`, () =>
    CLI.command(`touch ${tmpFile}`, this.app)
      .then(ReplExpect.justOK)
      .catch(Common.oops(this, true)))

  it(`should rm -i ${tmpFile}`, async () => {
    try {
      const res = await CLI.command(`rm -i ${tmpFile}`, this.app)

      // wait for the output to appear
      await this.app.client.waitForExist(rows(res.count))

      // type "y" to confirm the rm
      await this.app.client.keys(`y${Keys.ENTER}`)

      // wait for the command to finish with blank output
      await ReplExpect.blank(res)
    } catch (err) {
      return Common.oops(this, true)(err)
    }
  })

  it('should now give an 404 error on the removed file', () =>
    CLI.command(`cat ${tmpFile}`, this.app)
      .then(ReplExpect.error(404))
      .catch(Common.oops(this, true)))
})
