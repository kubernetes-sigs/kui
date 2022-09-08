/*
 * Copyright 2022 The Kubernetes Authors
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

import { basename, dirname, join } from 'path'
import { Common, CLI } from '@kui-shell/test'
import { encodeComponent } from '@kui-shell/core'

const ROOT = join(dirname(require.resolve('@kui-shell/plugin-client-common/tests/data/kbdtag1.md')), '..')

const IN1 = {
  input: join(ROOT, 'data/kbdtag1.md'),
  kbds: ['.']
}

const IN2 = {
  input: join(ROOT, 'data/kbdtag2.md'),
  kbds: IN1.kbds
}

const IN3 = {
  input: join(ROOT, 'data/kbdtag3.md'),
  kbds: ['Ctrl', 'Alt', 'Delete']
}
;[IN1, IN2, IN3].forEach(markdown => {
  describe(`kbd tags in markdown ${basename(markdown.input)} ${
    process.env.MOCHA_RUN_TARGET || ''
  }`, function (this: Common.ISuite) {
    before(Common.before(this))
    after(Common.after(this))

    it(`should load markdown and show ${markdown.kbds.length} kbd tags`, async () => {
      try {
        await CLI.command(`commentary -f ${encodeComponent(markdown.input)}`, this.app)
        await this.app.client.waitUntil(async () => {
          const kbds = await this.app.client.$$('kbd')
          return kbds.length === markdown.kbds.length
        })

        await Promise.all(
          markdown.kbds.map(async kbd => {
            await this.app.client.waitUntil(async () => {
              const kbds = await this.app.client.$$('kbd')
              const texts = await Promise.all(kbds.map(_ => _.getText()))
              return texts.includes(kbd)
            })
          })
        )
      } catch (err) {
        await Common.oops(this, true)(err)
      }
    })
  })
})
