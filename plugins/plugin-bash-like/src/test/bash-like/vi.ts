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
const { cli, keys, selectors, sidecar } = ui
const { localDescribe } = common

import * as assert from 'assert'
import { readFileSync } from 'fs'
import { fileSync as tmpFile } from 'tmp'

/** sleep for the given number of milliseconds */
const sleep = (millis: number) => new Promise(resolve => setTimeout(resolve, millis))

localDescribe('xterm vi', function (this: common.ISuite) {
  before(common.before(this))
  after(common.after(this))

  const typeThisText = 'hello there'

  it('use vi to create a new file', async () => {
    try {
      const file = tmpFile()
      const res = cli.do(`vi ${file.name}`, this.app)

      // selectors
      const rows = `${selectors.PROMPT_BLOCK_N(0)} .xterm-container .xterm-rows`
      const lastRow = `${rows} > div:last-child`

      // wait for vi to come up
      await this.app.client.waitForExist(rows)

      // hmm.. for some reason we can't type 'i' right away
      await sleep(1000)

      // enter insert mode, and wait for INSERT to appear at the bottom
      await this.app.client.keys('i')
      await this.app.client.waitUntil(async () => {
        const txt = await this.app.client.getText(lastRow)
        return /INSERT/i.test(txt)
      })

      // type our input
      await this.app.client.keys(typeThisText)
      await this.app.client.keys(keys.ESCAPE)
      await this.app.client.waitUntil(async () => {
        const txt = await this.app.client.getText(lastRow)
        return txt.length === 0
      })

      await this.app.client.keys(':wq')
      await this.app.client.keys(keys.ENTER)

      await res.then(cli.expectBlank)

      const contents = readFileSync(file.name).toString()
      assert.strictEqual(contents.replace(/[\n\r]$/, ''), 'hello there')
    } catch (err) {
      common.oops(this)(err)
    }
  })
})
