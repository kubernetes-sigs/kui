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

const ROOT = join(dirname(require.resolve('@kui-shell/plugin-client-common/tests/data/code-block1.md')), '..')

const IN1 = {
  input: join(ROOT, 'data', 'code-block1.md'),
  blocks: [{ index: 0, output: 'hi' }]
}

const IN2 = {
  input: join(ROOT, 'data', 'code-block2.md'),
  blocks: [
    { index: 0, output: 'AAA' },
    { index: 1, output: 'BBB' },
    { index: 2, output: 'CCC' },
    // skipping 3 since it's in a second tab, not initially visible
    { index: 4, output: 'EEE' }
  ]
}

async function clickToExecuteBlock(this: Common.ISuite, res: ReplExpect.AppAndCount, block: typeof IN1['blocks'][0]) {
  const codeBlockSelector = `${Selectors.OUTPUT_N(
    res.count,
    res.splitIndex
  )} .kui--code-block-in-markdown[data-code-index="${block.index}"]`
  await this.app.client.$(codeBlockSelector).then(_ => _.waitForDisplayed({ timeout: CLI.waitTimeout }))

  const runAction = await this.app.client.$(`${codeBlockSelector} .kui--block-action-run`)
  await runAction.waitForDisplayed({ timeout: CLI.waitTimeout })

  await runAction.click()

  const result = await this.app.client.$(`${codeBlockSelector} ${Selectors._RESULT}`)
  await result.waitForDisplayed({ timeout: CLI.waitTimeout })

  await this.app.client.waitUntil(async () => {
    const actualText = await result.getText()
    return actualText === block.output
  })
}

;[IN1, IN2].forEach(markdown => {
  ;['forward', 'reverse'].forEach(blockExecutionOrder => {
    describe(`execute code blocks in markdown ${basename(markdown.input)} in ${blockExecutionOrder} order ${process.env
      .MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
      before(Common.before(this))
      after(Common.after(this))

      it(`should load the markdown and execute them, showing the results`, async () => {
        try {
          const res = await CLI.command(`commentary -f ${encodeComponent(markdown.input)}`, this.app).then(
            ReplExpect.ok
          )
          const executeBlock = clickToExecuteBlock.bind(this, res)

          const blocks = blockExecutionOrder === 'forward' ? markdown.blocks : markdown.blocks.slice().reverse()

          await Util.promiseEach(blocks, executeBlock)
        } catch (err) {
          await Common.oops(this, true)(err)
        }
      })
    })
  })
})
