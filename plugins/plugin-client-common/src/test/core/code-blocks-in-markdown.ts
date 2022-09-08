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
import { Common, CLI, Selectors } from '@kui-shell/test'

import {
  Block,
  hasCleanup,
  hasValidation,
  checkBlockCleanup,
  checkBlockValidation,
  clickToExecuteBlock
} from './markdown-helpers'

const ROOT = join(dirname(require.resolve('@kui-shell/plugin-client-common/tests/data/code-block1.md')), '..')

interface Input {
  input: string
  blocks: Block[]
}

// with validation inline with the code block
const IN1a: Input = {
  input: join(ROOT, 'data', 'code-block1.md'),
  blocks: [{ index: 0, output: 'hi', valid: true }]
}

// with validation in the topmatter, in the same file
const IN1b: Input = {
  input: join(ROOT, 'data', 'code-block1-validate-in-topmatter.md'),
  blocks: IN1a.blocks
}

// with validation in the topmatter, in a separate file
const IN1c: Input = {
  input: join(ROOT, 'data', 'code-block1-validate-in-topmatter-via-snippet.md'),
  blocks: IN1a.blocks
}

const IN2: Input = {
  input: join(ROOT, 'data', 'code-block2.md'),
  blocks: [
    { index: 0, output: 'AAA' },
    { index: 1, output: 'BBB' },
    { index: 2, output: 'CCC' },
    // skipping 3 since it's in a second tab, not initially visible
    { index: 4, output: 'EEE' }
  ]
}

// with cleanup logic
const IN3a: Input = {
  input: join(ROOT, 'data', 'cleanup1.md'),
  blocks: [{ index: 0, output: 'YYY', cleanup: true }]
}

const IN3b: Input = {
  input: join(ROOT, 'data', 'cleanup2.md'),
  blocks: IN3a.blocks
}
;[IN3a, IN3b, IN1a, IN1b, IN1c, IN2].forEach(markdown => {
  ;['forward', 'reverse'].forEach(blockExecutionOrder => {
    describe(`execute code blocks in markdown ${basename(markdown.input)} in ${blockExecutionOrder} order ${
      process.env.MOCHA_RUN_TARGET || ''
    }`, function (this: Common.ISuite) {
      before(Common.before(this))
      after(Common.after(this))

      it(`should load the markdown and execute them, showing the results`, async () => {
        try {
          await CLI.command(`commentary -f ${encodeComponent(markdown.input)}`, this.app)

          // check validation bits on initial render
          await Util.promiseEach(markdown.blocks, block => {
            if (hasValidation(block)) {
              return checkBlockValidation(this, Selectors.SPLIT_DEFAULT, block)
            }
          })

          // now click to execute the blocks
          const blocks = blockExecutionOrder === 'forward' ? markdown.blocks : markdown.blocks.slice().reverse()
          await Util.promiseEach(blocks, clickToExecuteBlock.bind(this, Selectors.SPLIT_DEFAULT))

          // check cleanup bits after execution
          await Util.promiseEach(markdown.blocks, block => {
            if (hasCleanup(block)) {
              return checkBlockCleanup(this, Selectors.SPLIT_DEFAULT, block)
            }
          })
        } catch (err) {
          await Common.oops(this, true)(err)
        }
      })
    })
  })
})
