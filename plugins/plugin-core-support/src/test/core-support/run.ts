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

import * as fs from 'fs'
import {
  before as commonbefore,
  localDescribe,
  after as commonAfter,
  oops,
  ISuite
} from '@kui-shell/core/tests/lib/common'
import * as ui from '@kui-shell/core/tests/lib/ui'
const { cli, sidecar } = ui
import { theme as settings } from '@kui-shell/core/core/settings'

localDescribe('Evaluate shell commands in a given file', function(this: ISuite) {
  before(commonbefore(this))
  after(commonAfter(this))

  it('should write a .cmd file', () => {
    return new Promise((resolve, reject) => {
      fs.writeFile('tempTestRun.cmd', `about\nhistory`, err => {
        if (err) {
          reject(err)
        } else {
          resolve(true)
        }
      })
    })
  })

  it('should run tempTestRun.cmd file and get table', async () => {
    try {
      const selector = await cli.do(`run tempTestRun.cmd`, this.app).then(cli.expectOKWithCustom({ selector: 'table' }))

      await this.app.client.waitForExist(`${selector} .entity.run.header-row[data-name="COMMAND"]`)

      const about = '.entity.run[data-name="about"]'
      const history = '.entity.run[data-name="history"]'

      await this.app.client.waitForExist(`${selector} ${about}`)
      await this.app.client.waitForExist(`${selector} ${history}`)
      await this.app.client.waitForExist(`${selector} ${about} badge.green-background`)
      await this.app.client.waitForExist(`${selector} ${history} badge.green-background`)

      this.app.client.click(`${selector} ${about} .clickable`)
      await sidecar.expectOpen(this.app).then(sidecar.expectShowing(settings.productName))

      this.app.client.click(`${selector} ${history} .clickable`)
      await sidecar.expectOpen(this.app).then(sidecar.expectShowing('history'))
    } catch (err) {
      oops(this)(err)
    }
  })

  it('should delete tempTestRun.cmd', () => {
    return new Promise((resolve, reject) => {
      fs.unlink('tempTestRun.cmd', err => {
        if (err) {
          reject(err)
        } else {
          resolve(true)
        }
      })
    })
  })
})
