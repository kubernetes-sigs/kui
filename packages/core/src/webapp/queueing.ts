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

import { keys } from './keys'
import doCancel from './cancel'
import { getCurrentProcessingBlock } from './block'
import { Tab } from './tab'

import { isHeadless } from '../core/capabilities'

/**
 * Initiate input queueing
 *
 */
export function startInputQueueing(tab: Tab) {
  if (!isHeadless()) {
    // const invisibleHand = document.getElementById('invisible-global-input') as HTMLInputElement
    // invisibleHand.focus()

    tab.queueListener = (event: KeyboardEvent) => {
      const char = event.keyCode
      if (char === keys.C && event.ctrlKey) {
        // Ctrl+C, cancel
        try {
          const block = getCurrentProcessingBlock(tab)
          if (block) {
            doCancel(tab, block)
          }
        } catch (err) {
          console.error(err)
        }
      }
    }

    tab.addEventListener('keydown', tab.queueListener)
  }
}

/**
 * This API call allows plugins to disable input queueing while a
 * command is being processed.
 *
 * @return any queued input so far
 *
 */
let _invisibleHand: HTMLInputElement
export const disableInputQueueing = (tab: Tab): string => {
  if (isHeadless()) {
    return
  }

  const invisibleHand =
    _invisibleHand || (_invisibleHand = document.getElementById('invisible-global-input') as HTMLInputElement)

  if (tab.queueListener) {
    document.body.removeEventListener('keydown', tab.queueListener)
  }

  let queuedInput = ''

  if (invisibleHand) {
    // here is what might have queued up
    queuedInput = invisibleHand.value

    // reset the queueing state
    invisibleHand.value = ''

    // this can be expensive; callers MUST focus on their element if they want this behavior
    // invisibleHand.blur()
  }

  return queuedInput
}

/**
 * Handle any input that queued up during command processing
 *
 */
/* const handleQueuedInput = async (nextBlock: HTMLElement) => {
  const queuedInput = disableInputQueueing(getTabFromTarget(nextBlock))

  if (nextBlock && queuedInput && queuedInput.length > 0) {
    // adding queued input to nextBlock

    let nextPrompt = getPrompt(nextBlock)
    if (nextPrompt) {
      const lines = queuedInput.split(/[\n\r]/)

      const firstNonBlank = lines.findIndex(_ => _.length > 0)
      const nPrefixNewlines = firstNonBlank >= 0 ? firstNonBlank : lines.length === 0 ? -1 : lines.length

      // handle prefix newlines
      for (let idx = 0; idx < nPrefixNewlines; idx++) {
        // await doCancel()

        nextBlock = getCurrentBlock()
        nextPrompt = getCurrentPrompt()
      }

      // now handle any actual input
      if (firstNonBlank >= 0) {
        // for the first one, add it to the existing (preallocated) nextPrompt
        nextPrompt.value = lines[firstNonBlank]

        // if the user also hit a trailing newline, make sure to trigger a doEval
        if (lines.length - firstNonBlank > 1) {
          const { doEval } = await import('../repl/exec')
          await doEval(getTabFromTarget(nextBlock), nextBlock, nextPrompt.value.trim())

          // lastly, if the user typed more than one newline, handle
          // the rest via a doPaste
          const remainingLines = lines.slice(firstNonBlank + 1).join('\n')
          if (remainingLines.length > 0) {
            doPaste(remainingLines)
          }
        }
      }
    }
  }
} */

/**
 * Set the queued input model to the given value
 *
 */
/* export const pasteQueuedInput = (value: string) => {
  const invisibleHand = document.getElementById('invisible-global-input') as HTMLInputElement
  invisibleHand.value = value
} */
