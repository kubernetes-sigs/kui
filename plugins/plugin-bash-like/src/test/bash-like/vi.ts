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

import { unlink } from 'fs'
import { fileSync as tmpFile } from 'tmp'
import { promisify } from 'util'

import * as common from '@kui-shell/core/tests/lib/common'
import * as ui from '@kui-shell/core/tests/lib/ui'

const { cli, keys, selectors } = ui
const { pit, refresh } = common

/** helpful selectors */
const rows = (N: number) => selectors.xtermRows(N)
const lastRow = (N: number) => `${rows(N)} > div:last-child`

describe(`xterm vi ${process.env.MOCHA_RUN_TARGT || ''}`, function(this: common.ISuite) {
  before(common.before(this))
  after(common.after(this))

  const typeThisText = 'hello there'

  const file = tmpFile()

  pit('use vi to create a new file', async () => {
    try {
      const res = await cli.do(`vim ${file.name}`, this.app)

      // wait for vi to come up
      await this.app.client.waitForExist(rows(res.count))

      // wait for vi to come up in alt buffer mode
      await this.app.client.waitForExist(`tab.visible.xterm-alt-buffer-mode`)

      // enter insert mode, and wait for INSERT to appear at the bottom
      let iter = 0
      await this.app.client.keys('i')
      await this.app.client.waitUntil(async () => {
        const txt = await this.app.client.getText(lastRow(res.count))
        if (++iter > 5) {
          console.error('xterm vi still waiting for Insert mode', txt)
        }
        return /INSERT/i.test(txt)
      })

      // type our input
      await this.app.client.keys(typeThisText)

      // exit from insert mode
      iter = 0
      await this.app.client.keys(keys.ESCAPE)
      await this.app.client.waitUntil(async () => {
        const txt = await lastRow(res.count)
        if (++iter > 5) {
          console.error('xterm vi still waiting to exit insert mode', txt)
        }
        return !/INSERT/i.test(txt)
      })

      await this.app.client.keys(':wq')
      await this.app.client.keys(keys.ENTER)

      await cli.expectBlank(res)

      await cli.do(`cat ${file.name}`, this.app).then(cli.expectOKWithString('hello there'))
    } catch (err) {
      return common.oops(this)(err)
    }
  })

  pit('should cat the file contents', () =>
    cli
      .do(`cat "${file.name}"`, this.app)
      .then(cli.expectOKWithString('hello there'))
      .catch(common.oops(this))
  )

  pit('should remove the temp file', async () => {
    // DO NOT return a promise here; see https://github.com/mochajs/mocha/issues/3555
    await promisify(unlink)(file.name)
  })

  pit('should reload', () => refresh(this).catch(common.oops(this)))

  pit('open vi :wq then :q, and expect no error', async () => {
    try {
      const res = await cli.do(`vim`, this.app)

      // wait for vi to come up
      await this.app.client.waitForExist(rows(res.count))

      // wait for vi to come up in alt buffer mode
      await this.app.client.waitForExist(`tab.visible.xterm-alt-buffer-mode`)

      // :wq
      await this.app.client.keys(':wq')
      await this.app.client.keys(keys.ENTER)
      /* await this.app.client.waitUntil(async () => {
        const txt = await ui.getTextContent(this.app, lastRow(res.count))
        console.error('txt %s', txt)
        return /No file name/i.test(txt)
      }) */

      // :q
      await this.app.client.keys(':q')
      await this.app.client.keys(keys.ENTER)

      // expect a clean exit, i.e. no error output on the console
      await cli.expectBlank(res)
    } catch (err) {
      return common.oops(this)(err)
    }
  })
})
