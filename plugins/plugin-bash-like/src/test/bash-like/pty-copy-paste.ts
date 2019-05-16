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
const { cli, keys, selectors, sidecar, sleep } = ui
const { localDescribe } = common

import * as assert from 'assert'
import { dirname, join } from 'path'
import { readFileSync, unlink } from 'fs'
import { fileSync as tmpFile } from 'tmp'
import { promisify } from 'util'

/** helpful selectors */
const rows = (N: number) => selectors.xtermRows(N)
const firstRow = (N: number) => `${rows(N)} > div:first-child`
const lastRow = (N: number) => `${rows(N)} > div:last-child`

/** we have a custom vimrc, to make sure INSERT shows up */
const vimrc = join(dirname(require.resolve('@kui-shell/plugin-bash-like/tests/data/marker.json')), 'vimrc')

localDescribe('xterm copy paste', function (this: common.ISuite) {
  before(common.before(this))
  after(common.after(this))

  const emittedText = 'roadhouse'

  it(`should echo ${emittedText}`, async () => {
    try {
      const res = cli.do(`echo ${emittedText}`, this.app)

      // wait for the output to appear
      await this.app.client.waitForExist(rows(0))

      await this.app.client.waitUntil(async () => {
        const actualText = await this.app.client.getText(firstRow(0))
        return actualText === emittedText
      })
    } catch (err) {
      return common.oops(this)(err)
    }
  })

  it('should copy from xterm output and paste outside of xterm', async () => {
    try {
      await this.app.client.doubleClick(`${firstRow(0)} > span:first-child`)
      await this.app.client.execute(() => document.execCommand('copy'))

      await this.app.client.click(selectors.CURRENT_PROMPT_BLOCK)
      await this.app.client.execute(() => document.execCommand('paste'))

      await this.app.client.waitUntil(async () => {
        const [ actualValue, expectedValue ] = await Promise.all([
          this.app.client.getValue(selectors.CURRENT_PROMPT),
          this.app.client.getText(firstRow(0))
        ])

        return expectedValue === actualValue
      })
    } catch (err) {
      return common.oops(this)(err)
    }
  })

  it('should copy outside of xterm and paste inside of xterm', async () => {
    const text = 'hello'
    const file = tmpFile()

    try {
      // clear things out
      await this.app.restart()

      // emit some characters to the current prompt
      await this.app.client.keys(text)

      // copy the content of the current prompt
      await this.app.client.doubleClick(selectors.CURRENT_PROMPT)
      await this.app.client.execute(() => document.execCommand('copy'))

      // cancel out the current prompt so we can execute vi
      await this.app.client.keys(ui.ctrlC)

      // open vi, so we have an xterm to receive a paste event
      const res = cli.do(`vi -u "${vimrc}" ${file.name}`, this.app)

      // wait for vi to come up in alt buffer mode
      await this.app.client.waitForExist(`tab.visible.xterm-alt-buffer-mode`)

      // enter insert mode, and wait for INSERT to appear at the bottom
      await this.app.client.keys('i')
      await this.app.client.waitUntil(async () => {
        const txt = await this.app.client.getText(lastRow(1))
        return /INSERT/i.test(txt)
      })

      // now paste into the xterm vi
      await this.app.client.execute(() => document.execCommand('paste'))

      // escape then :wq
      await this.app.client.keys(keys.ESCAPE)
      await this.app.client.waitUntil(async () => {
        const txt = await this.app.client.getText(lastRow(1))
        return txt.length === 0
      })

      await this.app.client.keys(':wq')
      await this.app.client.keys(keys.ENTER)

      await res.then(cli.expectBlank)

      await cli.do(`cat ${file.name}`, this.app)
        .then(cli.expectOKWithString(text))

      const contents = readFileSync(file.name).toString()
      assert.strictEqual(contents.replace(/[\n\r]$/, ''), text)
    } catch (err) {
      common.oops(this)(err)
    } finally {
      // DO NOT return a promise here; see https://github.com/mochajs/mocha/issues/3555
      await promisify(unlink)(file.name)
    }
  })
})
