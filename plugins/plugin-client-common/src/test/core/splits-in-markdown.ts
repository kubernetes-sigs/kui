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

import { strictEqual } from 'assert'
import { basename, dirname, join } from 'path'
import { encodeComponent, Util } from '@kui-shell/core'
import { Common, CLI, Selectors, Util as TestUtil } from '@kui-shell/test'

import { clickToExecuteBlock, Input } from './markdown-helpers'

const ROOT = join(dirname(require.resolve('@kui-shell/plugin-client-common/tests/data/splits1.md')), '..')
const ROOT2 = dirname(require.resolve('@kui-shell/plugin-client-common/notebooks/playground.md'))

const IN1: Input = {
  input: join(ROOT, 'data', 'splits1.md'),
  splits: [
    { position: Selectors.SPLIT_LEFT, content: 'This should appear in a left split.' },
    { position: Selectors.SPLIT_DEFAULT, content: 'This should appear in a default split.' },
    { position: Selectors.SPLIT_BOTTOM, content: 'This should appear in a bottom split.' }
  ]
}

const IN2: Input = {
  input: join(ROOT, 'data', 'splits2.md'),
  splits: [
    Object.assign({ blocks: [{ index: 0, output: 'LEFT' }] }, IN1.splits[0]),
    Object.assign({ blocks: [{ index: 1, output: 'DEFAULT' }] }, IN1.splits[1])
  ]
}

const IN3: Input = {
  title: 'Yoyoyo',
  input: join(ROOT, 'data', 'code-block3.md'),
  splits: [
    Object.assign(
      {
        blocks: [
          {
            index: 0,
            output: 'intentionalerror',
            status: { position: Selectors.SPLIT_LEFT, index: 0, status: 'error' }
          }
        ]
      },
      IN1.splits[1]
    ),
    Object.assign(
      { blocks: [{ index: 1, output: 'BBB', status: { position: Selectors.SPLIT_LEFT, index: 1, status: 'done' } }] },
      IN1.splits[1]
    )
  ]
}

const IN4: Input = {
  input: join(ROOT2, 'playground.md'),
  splits: [
    {
      position: Selectors.SPLIT_DEFAULT.bind(undefined, Selectors.SPLIT_N(1)),
      content: '# Welcome to the Kui Playground'
    },
    {
      position: Selectors.SPLIT_DEFAULT.bind(undefined, Selectors.SPLIT_N(2)),
      content: 'Welcome to the Kui Playground'
    }
  ]
}

async function verifySplit(this: Common.ISuite, { position, content }: typeof IN1['splits'][0]) {
  const split = await this.app.client.$(position())
  await split.waitForDisplayed({ timeout: CLI.waitTimeout })

  const result = await split.$(Selectors._RESULT)
  await result.waitForDisplayed({ timeout: CLI.waitTimeout })

  let n = 0
  await this.app.client.waitUntil(
    async () => {
      const actualContent = await result.getText()
      if (++n > 5) {
        console.error(`still waiting for actualContent=${actualContent} expectedContent=${content}`)
      }
      return actualContent.includes(content)
    },
    { timeout: CLI.waitTimeout }
  )
}

;[IN4, IN3, IN1, IN2].forEach(markdown => {
  ;['forward', 'reverse'].forEach(blockExecutionOrder => {
    describe(`open splits from markdown ${basename(markdown.input)} in ${blockExecutionOrder} order ${process.env
      .MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
      before(Common.before(this))
      after(Common.after(this))

      const clear = TestUtil.doClear.bind(this)

      it('should clear the console from scratch', () => clear())
      it(`should load the markdown and show ${IN1.splits.length} splits`, async () => {
        try {
          await CLI.command(`commentary -f ${encodeComponent(markdown.input)}`, this.app)

          // check Tab Title
          if (markdown.title) {
            await this.app.client.waitUntil(async () => {
              const tabTitle = await this.app.client.$(Selectors.CURRENT_TAB_TITLE)
              await tabTitle.waitForDisplayed({ timeout: CLI.waitTimeout })
              const actualTabTitle = await tabTitle.getText()
              return actualTabTitle === markdown.title
            })
          }

          await Util.promiseEach(markdown.splits, async split => {
            await verifySplit.bind(this)(split)

            if (split.blocks) {
              const nBlocksBeforeExecution = (await this.app.client.$$(Selectors._PROMPT_BLOCK)).length

              const blocks = blockExecutionOrder === 'forward' ? split.blocks : split.blocks.slice().reverse()

              const executeBlock = clickToExecuteBlock.bind(this, split.position)
              await Util.promiseEach(blocks, executeBlock)

              const nBlocksAfterExecution = (await this.app.client.$$(Selectors._PROMPT_BLOCK)).length
              strictEqual(
                nBlocksBeforeExecution,
                nBlocksAfterExecution,
                'after executing blocks, make sure we have as many blocks as we did initially in each split'
              )
            }
          })
        } catch (err) {
          await Common.oops(this, true)(err)
        }
      })
    })
  })
})
