/*
 * Copyright 2021 The Kubernetes Authors
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
import { encodeComponent, Util } from '@kui-shell/core'
import { Common, CLI, ReplExpect, Selectors } from '@kui-shell/test'

// import { clickToExecuteBlock } from './markdown-helpers'

const ROOT = join(dirname(require.resolve('@kui-shell/plugin-client-common/tests/data/splits1.md')), '..')

const IN1 = {
  input: join(ROOT, 'data', 'splits1.md'),
  splits: [
    { position: 'left', content: 'This should appear in a left split.' },
    { position: 'bottom', content: 'This should appear in a bottom split.' }
  ]
}

async function verifySplit(this: Common.ISuite, { position, content }: typeof IN1['splits'][0]) {
  const splitSelector =
    position === 'left'
      ? Selectors.SPLIT_LEFT()
      : position === 'bottom'
      ? Selectors.SPLIT_BOTTOM()
      : position === 'default'
      ? Selectors.SPLIT_DEFAULT()
      : undefined

  if (!splitSelector) {
    throw new Error(`Cannot find split in position ${position}`)
  }

  const split = await this.app.client.$(splitSelector)
  await split.waitForDisplayed({ timeout: CLI.waitTimeout })

  const result = await split.$(Selectors._RESULT)
  await result.waitForDisplayed({ timeout: CLI.waitTimeout })

  await this.app.client.waitUntil(async () => {
    const actualContent = await result.getText()
    return actualContent === content
  })
}

;[IN1].forEach(markdown => {
  describe(`open splits from markdown ${basename(markdown.input)} ${process.env.MOCHA_RUN_TARGET ||
    ''}`, function(this: Common.ISuite) {
    before(Common.before(this))
    after(Common.after(this))

    it(`should load the markdown and show ${IN1.splits.length} splits`, async () => {
      try {
        await CLI.command(`commentary -f ${encodeComponent(markdown.input)}`, this.app).then(ReplExpect.ok)

        await Util.promiseEach(markdown.splits, verifySplit.bind(this))
      } catch (err) {
        await Common.oops(this, true)(err)
      }
    })
  })
})
