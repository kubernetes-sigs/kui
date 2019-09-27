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
import { copyFile, unlink, writeFile } from 'fs'

import { Common, CLI, ReplExpect, SidecarExpect } from '@kui-shell/test'

/** modify the top-level README.md, so that we can exhibit a git diff */
const modifyTopLevelReadme = () =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise(async (resolve, reject) => {
    try {
      const copy = new Promise((resolve, reject) => {
        copyFile('../../README.md', '../../README-bak.md', err => {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        })
      })

      await copy
    } catch (err) {
      reject(err)
    }

    writeFile('../../README.md', 'hello there', err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })

/** restore the top-level README.md from our backup copy */
const restoreTopLevelReadme = () =>
  new Promise((resolve, reject) => {
    copyFile('../../README-bak.md', '../../README.md', err => {
      if (err) {
        reject(err)
      } else {
        unlink('../../README-bak.md', err => {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        })
      }
    })
  })

Common.localDescribe('git diff', function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  it('should show no diffs', () =>
    CLI.command('git diff package.json', this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.closed)
      .catch(Common.oops(this)))

  it('should show a diff', async () => {
    try {
      await modifyTopLevelReadme()

      await CLI.command('git diff', this.app)
        .then(res => res.app)
        .then(SidecarExpect.open)
      // .then(sidecar.expectFullscreen)

      await restoreTopLevelReadme()
    } catch (err) {
      await restoreTopLevelReadme()
      return Common.oops(this)(err)
    }
  })
})
