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

import Debug from 'debug'
const debug = Debug('webapp/cli')
debug('loading')

import { setStatus } from './status'
export { setStatus }

import doCancel from './cancel'
export { doCancel }

import { disableInputQueueing, pasteQueuedInput } from './queueing'
export { disableInputQueueing, pasteQueuedInput }

import { isPopup } from './popup-core'
export { isPopup }

import { listen } from './listen'
export { listen }

import { Tab, isTab, getTabId, sameTab, getTabFromTarget, getCurrentTab } from './tab'
export { Tab, isTab, getTabId, sameTab, getTabFromTarget, getCurrentTab }

import {
  Prompt,
  getBlockOfPrompt,
  getPrompt,
  getBottomPrompt,
  getInitialPrompt,
  getCurrentPrompt,
  getPromptFromTarget,
  getPromptLeft,
  getCurrentPromptLeft
} from './prompt'
export {
  Prompt,
  getBlockOfPrompt,
  getPrompt,
  getBottomPrompt,
  getInitialPrompt,
  getCurrentPrompt,
  getPromptFromTarget,
  getPromptLeft,
  getCurrentPromptLeft
}

import { installBlock, getInitialBlock, getCurrentBlock, getCurrentProcessingBlock } from './block'
export { installBlock, getInitialBlock, getCurrentBlock, getCurrentProcessingBlock }

import { registerListView, registerEntityView, ViewHandler, ok } from './print'
export { registerListView, registerEntityView, ViewHandler, ok }

debug('finished loading modules')

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
 * Clear current text selection
 *
 */
export const clearTextSelection = () => {
  try {
    window.getSelection().removeAllRanges()
  } catch (err) {
    debug('unable to clear text selection', err)
  }
}

/**
 * Allow for plugins to self-manage text selection
 *
 */
let pendingTextSelection: string
export const clearPendingTextSelection = () => {
  pendingTextSelection = undefined
}
export const setPendingTextSelection = (str: string) => {
  pendingTextSelection = str
  if (!document.oncopy) {
    document.addEventListener('select', () => {
      pendingTextSelection = undefined
    })
    document.addEventListener('copy', (evt: ClipboardEvent) => {
      if (pendingTextSelection) {
        evt.clipboardData.setData('text', pendingTextSelection)
        evt.preventDefault()
      }
    })
  }
}
