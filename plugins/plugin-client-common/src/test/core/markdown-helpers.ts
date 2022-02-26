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

import { Common, CLI, Selectors } from '@kui-shell/test'

type Position = typeof Selectors.SPLIT_DEFAULT | typeof Selectors.SPLIT_LEFT | typeof Selectors.SPLIT_BOTTOM

interface Validation {
  /** Is the block expected to show as valid/invalid (true/false) on initial render? */
  valid?: boolean
}

interface Cleanup {
  /** Does this code block have cleanup logic */
  cleanup?: boolean
}

export type Block = Partial<Validation> &
  Partial<Cleanup> & {
    index: number
    output: string

    /** If we have an ossociated ProgressStepper UI? */
    status?: {
      /** Split position in which the ProgressStepper UI is rendered */
      position: Position

      /** index in ProgressStepper UI */
      index: number

      /** Expected execution status of the block, after execution... */
      status: 'done' | 'error'
    }
  }

export function hasValidation(block: Block): block is Block & Required<Validation> {
  return typeof block.valid === 'boolean'
}

export function hasCleanup(block: Block): block is Block & Required<Cleanup> {
  return typeof block.cleanup === 'boolean'
}

export interface Input {
  /** Path to input file */
  input: string

  /** Expected title of tab after loading that input file */
  title?: string

  /** Specification of expected splits after loading that input file */
  splits: {
    position: Position
    content: string
    contentBlockIndex?: number
    blocks?: Block[]
  }[]
}

export async function checkBlockValidation(
  ctx: Common.ISuite,
  split: Position,
  block: Block & Required<Validation>,
  reverse = false
) {
  const codeBlock = await ctx.app.client.$(`${split()} ${Selectors.Markdown.codeBlock(block.index)}`)
  await codeBlock.waitForDisplayed({ timeout: CLI.waitTimeout })

  const icon = await codeBlock.$(`.kui--code-block-status [icon="${block.valid ? 'Checkmark' : 'Error'}"]`)
  await icon.waitForDisplayed({ timeout: CLI.waitTimeout, reverse })
}

export async function checkBlockCleanup(ctx: Common.ISuite, split: Position, block: Block & Required<Cleanup>) {
  const codeBlock = await ctx.app.client.$(`${split()} ${Selectors.Markdown.codeBlock(block.index)}`)
  await codeBlock.waitForDisplayed({ timeout: CLI.waitTimeout })

  const icon = await codeBlock.$(Selectors.Markdown.cleanupButton)
  await icon.waitForDisplayed({ timeout: CLI.waitTimeout })
  await icon.click()

  await checkBlockValidation(ctx, split, Object.assign({}, block, { valid: true }), true)
}

export async function clickToExecuteBlock(this: Common.ISuite, split: Position, block: Block) {
  const codeBlockSelector = `${split()} ${Selectors.Markdown.codeBlock(block.index)}`
  const codeBlock = await this.app.client.$(codeBlockSelector)
  await codeBlock.waitForDisplayed({ timeout: CLI.waitTimeout })

  const runAction = await codeBlock.$(Selectors.Markdown.runButton)
  await codeBlock.moveTo()
  await runAction.waitForDisplayed({ timeout: CLI.waitTimeout })

  await runAction.click()

  const result = await codeBlock.$(Selectors._RESULT)
  await result.waitForDisplayed({ timeout: CLI.waitTimeout })

  await this.app.client.waitUntil(async () => {
    const actualText = await result.getText()
    return actualText.includes(block.output)
  })

  // check ProgressStepper UI?
  if (block.status) {
    const stepper = await this.app.client.$(`${block.status.position()} .kui--progress-stepper`)
    await stepper.waitForDisplayed({ timeout: CLI.waitTimeout })

    const step = await stepper.$(`li:nth-child(${block.status.index + 1})`)
    await step.waitForDisplayed({ timeout: CLI.waitTimeout })

    const icon = block.status.status === 'done' ? 'Checkmark' : 'Error'
    const status = await step.$(`.kui--progress-step-status-icon [icon="${icon}"]`)
    await status.waitForDisplayed({ timeout: CLI.waitTimeout })
  }
}
