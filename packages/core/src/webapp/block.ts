/*
 * Copyright 2017-19 IBM Corporation
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

import { Tab, getCurrentTab } from './tab'
import { Block } from './models/block'

export const getInitialBlock = (tab: Tab): HTMLElement => {
  return tab.querySelector('.repl .repl-block.repl-initial')
}

export const getCurrentBlock = (tab = getCurrentTab()): Block => {
  return tab.querySelector('.repl .repl-active')
}

export const getCurrentProcessingBlock = (tab = getCurrentTab()): HTMLElement => {
  return tab.querySelector('.repl .repl-block.processing')
}

/**
 * Remove any .repl-temporary structures from the given dom
 *
 */
export const removeAnyTemps = (block: Block, fullClean = false): Block => {
  const temps = block.querySelectorAll('.repl-temporary')
  for (let idx = 0; idx < temps.length; idx++) {
    const temp = temps[idx]
    if (temp.parentNode) {
      temp.parentNode.removeChild(temp)
    }
  }

  if (fullClean) {
    const streamingOutput = block.querySelector('[data-stream="data-stream"]')
    if (streamingOutput) {
      if (streamingOutput.parentNode) {
        streamingOutput.parentNode.removeChild(streamingOutput)
      }
    }
  }

  block.classList.remove('using-custom-prompt')

  return block
}

/**
 * Install a sub-block of output in the given block
 *
 */
export function subblock() {
  const block = document.createElement('div')
  const blockResult = document.createElement('div')

  blockResult.classList.add('repl-result')
  block.classList.add('processing')
  block.classList.add('kui--repl-subblock')
  block.appendChild(blockResult)

  return block
}

function getCount(block: Block) {
  return parseInt(block.getAttribute('data-input-count'))
}

/**
 * Reset input count for the given block
 *
 */
export const resetCount = (block: HTMLElement) => {
  block.setAttribute('data-input-count', '0')
}

/**
 * Allow commands to take charge of the cursor/caret/block rendering
 *
 */
export const setCustomCaret = (block: HTMLElement) => {
  block.classList.add('custom-caret')
}

/**
 * Is the given `block` either the current active block in the given
 * `tab`, or the output of the previous command execution?
 *
 */
export function isMostRecentBlock(tab: Tab, block: Block) {
  const lastBlock = tab.querySelector('.repl .repl-block:last-child') as Block
  const lastCount = getCount(lastBlock)
  const ourCount = getCount(block)

  // either the given block is the last block, or it is the
  // penultimate block, and the last block isn't executing a command
  return lastCount === ourCount || (lastBlock.classList.contains('repl-active') && lastCount === ourCount + 1)
}
