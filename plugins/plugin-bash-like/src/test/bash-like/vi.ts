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

import { unlink } from 'fs'
import { fileSync as tmpFile } from 'tmp'
import { promisify } from 'util'

import { Common, CLI, Keys, ReplExpect, Selectors } from '@kui-shell/test'

/** helpful selectors */
const rows = (N: number) => Selectors.xtermRows(N)
const lastRow = (N: number) => `${rows(N)} > div:last-child`

describe(`xterm vi 1 ${process.env.MOCHA_RUN_TARGET || ''}`, function (this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  const typeThisText = 'hello there'

  const file = tmpFile()

  Common.pit('use vi to create a new file', async () => {
    try {
      const res = await CLI.command(`vim -i NONE ${file.name}`, this.app)

      // wait for vi to come up
      await this.app.client.$(rows(res.count)).then(_ => _.waitForExist())

      // wait for vi to come up in alt buffer mode
      await this.app.client.$(Selectors.ALT_BUFFER_N(1)).then(_ => _.waitForExist())

      // enter insert mode, and wait for INSERT to appear at the bottom
      let iter = 0
      await this.app.client.keys('i')
      await this.app.client.waitUntil(
        async () => {
          const txt = await this.app.client.$(lastRow(res.count)).then(_ => _.getText())
          if (++iter > 5) {
            console.error('xterm vi still waiting for Insert mode', txt)
          }
          return /INSERT/i.test(txt)
        },
        { timeout: CLI.waitTimeout }
      )

      // type our input
      await this.app.client.keys(typeThisText)

      // exit from insert mode
      iter = 0
      await this.app.client.keys(Keys.ESCAPE)
      await this.app.client.waitUntil(
        async () => {
          const txt = await lastRow(res.count)
          if (++iter > 5) {
            console.error('xterm vi still waiting to exit insert mode', txt)
          }
          return !/INSERT/i.test(txt)
        },
        { timeout: CLI.waitTimeout }
      )

      await this.app.client.keys(':wq')
      await this.app.client.keys(Keys.ENTER)

      await ReplExpect.blank(res)

      await CLI.command(`cat ${file.name}`, this.app).then(ReplExpect.okWithPtyOutput('hello there'))
    } catch (err) {
      return Common.oops(this, false)(err)
    }
  })

  Common.pit('should cat the file contents', () =>
    CLI.command(`cat "${file.name}"`, this.app)
      .then(ReplExpect.okWithPtyOutput('hello there'))
      .catch(Common.oops(this, false))
  )

  Common.pit('should remove the temp file', async () => {
    // DO NOT return a promise here; see https://github.com/mochajs/mocha/issues/3555
    await promisify(unlink)(file.name)
  })
})

describe(`xterm vi 2 ${process.env.MOCHA_RUN_TARGET || ''}`, function (this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  Common.pit('open vi :wq then :q, and expect no error', async () => {
    try {
      const res = await CLI.command(`vim -i NONE`, this.app)

      // wait for vi to come up
      await this.app.client.$(rows(res.count)).then(_ => _.waitForExist())

      // wait for vi to come up in alt buffer mode
      await this.app.client.$(Selectors.ALT_BUFFER_N(1)).then(_ => _.waitForExist())

      // :wq
      await this.app.client.keys(':wq')
      await this.app.client.keys(Keys.ENTER)

      // :q
      await this.app.client.keys(':q')
      await this.app.client.keys(Keys.ENTER)

      // expect a clean exit, i.e. no error output on the console
      await ReplExpect.blank(res)
    } catch (err) {
      return Common.oops(this, false)(err)
    }
  })
})
