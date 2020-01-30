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

/**
 * User has requested that we "cancel" whatever is currently happening.
 *
 * If there is nothing happening, then terminate the current prompt
 * and start a new one
 *
 * TODO cancel the actual command?
 *
 */

import { unlisten } from './listen'
import { getPrompt } from './prompt'
import { installBlock, removeAnyTemps, getCurrentProcessingBlock, getCurrentBlock } from './block'

export default () => {
  const block = removeAnyTemps(getCurrentProcessingBlock() || getCurrentBlock())

  if (block.restorePrompt) {
    // cancelling in-progress "prompt"
    block.restorePrompt()
  }

  // Note: clone after restorePrompt
  const nextBlock = block.cloneNode(true) as HTMLElement
  const nextBlockPrompt = getPrompt(nextBlock)
  removeAnyTemps(nextBlock, true)

  block.className = `${block.getAttribute('data-base-class')} cancelled`
  block.isCancelled = true
  nextBlockPrompt.value = ''
  nextBlockPrompt.readOnly = false // in case we cancelled a block in-progress - the cloneNode will pick up the readonly attribute, which we need to remove

  unlisten(getPrompt(block))
  installBlock(block.parentNode, block, nextBlock)()
}
