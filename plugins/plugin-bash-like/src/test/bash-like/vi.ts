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

import * as assert from 'assert'
import { dirname, join } from 'path'
import { readFileSync, unlink } from 'fs'
import { fileSync as tmpFile } from 'tmp'
import { promisify } from 'util'

import * as common from '@kui-shell/core/tests/lib/common'
import * as ui from '@kui-shell/core/tests/lib/ui'

const { cli, keys, selectors } = ui
const { localDescribe } = common

/** helpful selectors */
const rows = selectors.xtermRows(0)
const lastRow = `${rows} > div:last-child`

/** we have a custom vimrc, to make sure INSERT shows up */
const vimrc = join(dirname(require.resolve('@kui-shell/plugin-bash-like/tests/data/marker.json')), 'vimrc')

localDescribe('xterm vi 1', function(this: common.ISuite) {
  before(common.before(this))
  after(common.after(this))

  const typeThisText = 'hello there'

  it('use vi to create a new file', async () => {
    const file = tmpFile()

    try {
      const res = cli.do(`vi -u "${vimrc}" ${file.name}`, this.app)

      // wait for vi to come up
      await this.app.client.waitForExist(rows)

      // wait for vi to come up in alt buffer mode
      await this.app.client.waitForExist(`tab.visible.xterm-alt-buffer-mode`)

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

      await cli.do(`cat ${file.name}`, this.app).then(cli.expectOKWithString('hello there'))

      const contents = readFileSync(file.name).toString()
      assert.strictEqual(contents.replace(/[\n\r]$/, ''), 'hello there')
    } catch (err) {
      return common.oops(this)(err)
    } finally {
      // DO NOT return a promise here; see https://github.com/mochajs/mocha/issues/3555
      await promisify(unlink)(file.name)
    }
  })
})

localDescribe('xterm vi 2', function(this: common.ISuite) {
  before(common.before(this))
  after(common.after(this))
  it('open vi :wq then :q, and expect no error', async () => {
    try {
      const res = cli.do(`vi -u "${vimrc}"`, this.app)

      // wait for vi to come up
      await this.app.client.waitForExist(rows)

      // wait for vi to come up in alt buffer mode
      await this.app.client.waitForExist(`tab.visible.xterm-alt-buffer-mode`)

      // :wq
      await this.app.client.keys(':wq')
      await this.app.client.keys(keys.ENTER)
      /* await this.app.client.waitUntil(async () => {
        const txt = await ui.getTextContent(this.app, lastRow)
        console.error('txt %s', txt)
        return /No file name/i.test(txt)
      }) */

      // :q
      await this.app.client.keys(':q')
      await this.app.client.keys(keys.ENTER)

      // expect a clean exit, i.e. no error output on the console
      await res.then(cli.expectBlank)
    } catch (err) {
      return common.oops(this)(err)
    }
  })
})
