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

import doCancel from './cancel'
import { doPaste } from './paste'
import { getCurrentBlock } from './block'
import { getPrompt, getCurrentPrompt } from './prompt'

import { isHeadless } from '../core/capabilities'

/**
 * Initiate input queueing
 *
 */
export const startInputQueueing = () => {
  if (!isHeadless()) {
    const invisibleHand = document.getElementById('invisible-global-input') as HTMLInputElement
    invisibleHand.focus()
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
export const disableInputQueueing = (): string => {
  if (isHeadless()) {
    return
  }

  const invisibleHand =
    _invisibleHand || (_invisibleHand = document.getElementById('invisible-global-input') as HTMLInputElement)

  // here is what might have queued up
  const queuedInput = invisibleHand.value

  // reset the queueing state
  invisibleHand.value = ''

  // this can be expensive; callers MUST focus on their element if they want this behavior
  // invisibleHand.blur()

  return queuedInput
}

/**
 * Handle any input that queued up during command processing
 *
 */
export const handleQueuedInput = async (nextBlock: HTMLElement) => {
  const queuedInput = disableInputQueueing()

  if (nextBlock && queuedInput && queuedInput.length > 0) {
    // adding queued input to nextBlock

    let nextPrompt = getPrompt(nextBlock)
    if (nextPrompt) {
      const lines = queuedInput.split(/[\n\r]/)

      const firstNonBlank = lines.findIndex(_ => _.length > 0)
      const nPrefixNewlines = firstNonBlank >= 0 ? firstNonBlank : lines.length === 0 ? -1 : lines.length

      // handle prefix newlines
      for (let idx = 0; idx < nPrefixNewlines; idx++) {
        await doCancel() // eslint-disable-line @typescript-eslint/no-use-before-define

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
          await doEval({ block: nextBlock, prompt: nextPrompt })

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
}

/**
 * Set the queued input model to the given value
 *
 */
export const pasteQueuedInput = (value: string) => {
  const invisibleHand = document.getElementById('invisible-global-input') as HTMLInputElement
  invisibleHand.value = value
}
