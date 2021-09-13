/*
 * Copyright 2020 The Kubernetes Authors
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

import { v4 } from 'uuid'
import { join } from 'path'
import { tmpdir } from 'os'
import { Common, CLI, ReplExpect, SidecarExpect, Util } from '@kui-shell/test'

import { setValue } from './common'

function expectText(res: ReplExpect.AppAndCount, expectedText: string) {
  let idx = 0
  return res.app.client.waitUntil(
    async () => {
      const actualText = await Util.getValueFromMonaco(res)
      if (++idx > 5) {
        console.error(`still waiting for actualText=${actualText} expectedText=${expectedText}`)
      }
      return actualText === expectedText
    },
    { timeout: CLI.waitTimeout }
  )
}

describe(`remove command output verify editor content is preserved ${process.env.MOCHA_RUN_TARGET ||
  ''}`, function(this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  let res1: ReplExpect.AppAndCount
  it('should echo hi', async () => {
    try {
      res1 = await CLI.command('echo hi', this.app)
      await ReplExpect.okWithPtyOutput('hi')(res1)
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })

  let res2: ReplExpect.AppAndCount
  const filepath = join(tmpdir(), v4())
  const typeThis = 'xxxxxxxxx'

  it('should open editor and type something', async () => {
    try {
      res2 = await CLI.command(`edit "${filepath}"`, this.app).then(SidecarExpect.open)

      await setValue(res2, typeThis)
      await expectText(res2, typeThis)
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })

  it('should remove the first block', () => Util.removeBlock(res1).catch(Common.oops(this, true)))

  // verify that we are back to the same number of blocks that we had after the first command (res1)
  ReplExpect.blockCount
    .bind(this)()
    .inSplit(1)
    .is(() => res1.count + 2) // N+1, but also +1 for the current active block, hence +2

  it('should still show the typed text in the editor', () => expectText(res1, typeThis).catch(Common.oops(this, true)))
})
