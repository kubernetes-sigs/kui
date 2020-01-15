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
const debug = Debug('webapp/cli/listen')
debug('loading')

import { promptPlaceholder } from '@kui-shell/client/config.d/style.json'

import { inBrowser, inElectron } from '../core/capabilities'

import { keys } from './keys'
import doCancel from './cancel'
import { paste } from './paste'
import { getCurrentTab } from './tab'
import { isPopup } from './popup-core'
import { getCurrentPrompt, getBottomPrompt, isUsingCustomPrompt } from './prompt'

import { inBottomInputMode } from '../core/settings'

import { getSidecar } from './views/sidecar-core'

interface MSIETextRange {
  collapse: (val: boolean) => void
  moveEnd: (which: string, pos: number) => void
  moveStart: (which: string, pos: number) => void
  select: () => void
}
interface MSIEControl extends HTMLInputElement {
  createTextRange: () => MSIETextRange
}
function isMSIEControl(ctrl: HTMLInputElement): ctrl is MSIEControl {
  return Object.prototype.hasOwnProperty.call(ctrl, 'createTextRange')
}

/**
 * Update the caret position in an html INPUT field
 *
 */
const setCaretPosition = (ctrl: HTMLInputElement, pos: number) => {
  if (ctrl.setSelectionRange) {
    ctrl.focus()
    ctrl.setSelectionRange(pos, pos)
  } else if (isMSIEControl(ctrl)) {
    const range = (ctrl as MSIEControl).createTextRange()
    range.collapse(true)
    range.moveEnd('character', pos)
    range.moveStart('character', pos)
    range.select()
  }
}

const setCaretPositionToEnd = (input: HTMLInputElement) => setCaretPosition(input, input.value.length)

const updateInputAndMoveCaretToEOL = (input: HTMLInputElement, newValue: string) => {
  input.value = newValue
  setTimeout(() => setCaretPositionToEnd(input), 0)
}

export const unlisten = (prompt: HTMLInputElement) => {
  if (inBottomInputMode) {
    prompt = getBottomPrompt()
  }

  if (prompt) {
    prompt.readOnly = true
    prompt.onkeypress = null
    prompt.onkeydown = null
    prompt.onpaste = null
  }

  if (prompt && !prompt.classList.contains('sidecar-header-input')) {
    prompt.onkeypress = null
    prompt.tabIndex = -1 // don't tab through old inputs
  }
}
export const listen = (prompt: HTMLInputElement) => {
  if (inBottomInputMode) {
    const bottomPrompt = getBottomPrompt()
    bottomPrompt.readOnly = false
    bottomPrompt.tabIndex = 1
  }
  prompt.readOnly = false
  prompt.placeholder = promptPlaceholder
  prompt.tabIndex = 1

  const grandparent = prompt.parentNode.parentNode as Element
  grandparent.className = `${grandparent.getAttribute('data-base-class')} repl-active`

  if (inBottomInputMode) {
    prompt = getBottomPrompt()
    prompt.value = ''
  }

  if (
    !prompt.classList.contains('sidecar-header-input') &&
    !document.activeElement.classList.contains('grab-focus') &&
    document.activeElement !== prompt
  ) {
    prompt.focus()
  }

  prompt.onkeypress = async (event: KeyboardEvent) => {
    const char = event.keyCode
    if (char === keys.ENTER) {
      // user typed Enter; we've finished Reading, now Evalute
      const { doEval } = await import('../repl/exec')
      doEval({ prompt })
    }
  }

  prompt.onkeydown = async (event: KeyboardEvent) => {
    const char = event.keyCode

    if (char === keys.UP || (char === keys.P && event.ctrlKey)) {
      // go to previous command in history
      if (!isUsingCustomPrompt(prompt)) {
        const historyModel = (await import('../models/history')).default
        const newValue = (historyModel.previous() || { raw: '' }).raw
        if (newValue) {
          updateInputAndMoveCaretToEOL(prompt, newValue)
        }
      } else {
        // squash the up arrow if we are in custom prompt mode;
        // otherwise, e.g. the browser may change the caret position
        event.preventDefault()
      }
    } else if (char === keys.PAGEUP) {
      if (inBrowser()) {
        debug('pageup')
        const { height } = document.body.getBoundingClientRect()
        document.querySelector('tab.visible .repl-inner').scrollBy(0, -height)
      }
    } else if (char === keys.PAGEDOWN) {
      if (inBrowser()) {
        debug('pagedown')
        const { height } = document.body.getBoundingClientRect()
        document.querySelector('tab.visible .repl-inner').scrollBy(0, +height)
      }
    } else if (char === keys.C && event.ctrlKey) {
      // Ctrl+C, cancel
      doCancel() // eslint-disable-line @typescript-eslint/no-use-before-define
    } else if (char === keys.U && event.ctrlKey) {
      // clear line
      prompt.value = ''
    } else if (
      (char === keys.L && (event.ctrlKey || (inElectron() && event.metaKey))) ||
      (process.platform === 'darwin' && char === keys.K && event.metaKey)
    ) {
      // clear screen; capture and restore the current
      // prompt value, in keeping with unix terminal
      // behavior
      if (isPopup()) {
        // see init() below; in popup mode, cmd/ctrl+L does something different
      } else {
        const current = getCurrentPrompt().value
        const { pexec } = await import('../repl/exec')
        const currentCursorPosition = getCurrentPrompt().selectionStart // also restore the cursor position
        await pexec('clear')
        if (current) {
          // restore the prompt value
          getCurrentPrompt().value = current

          // restore the prompt cursor position
          debug('restoring cursor position', currentCursorPosition)
          getCurrentPrompt().setSelectionRange(currentCursorPosition, currentCursorPosition)
        }
      }
    } else if (char === keys.HOME) {
      // go to first command in history
      const historyModel = (await import('../models/history')).default
      const newValue = historyModel.first().raw
      if (newValue) {
        updateInputAndMoveCaretToEOL(prompt, newValue)
      }
    } else if (char === keys.END) {
      // go to last command in history
      const historyModel = (await import('../models/history')).default
      const newValue = (historyModel.last() || { raw: '' }).raw
      updateInputAndMoveCaretToEOL(prompt, newValue)
    } else if (char === keys.DOWN || (char === keys.N && event.ctrlKey)) {
      // going DOWN past the last history item will result in '', i.e. a blank line
      if (!isUsingCustomPrompt(prompt)) {
        const historyModel = (await import('../models/history')).default
        const newValue = (historyModel.next() || { raw: '' }).raw
        updateInputAndMoveCaretToEOL(prompt, newValue)
      } else {
        // squash the up arrow if we are in custom prompt mode;
        // otherwise, e.g. the browser may change the caret position
        event.preventDefault()
      }
    }
  }

  prompt.onpaste = paste
}
export const popupListen = (
  text = getSidecar(getCurrentTab()).querySelector('.sidecar-header-text'),
  previousCommand?: string
) => {
  if (previousCommand) {
    // emit the previous command on the repl
    const nameContainer = getSidecar(getCurrentTab()).querySelector('.sidecar-header-input') as HTMLInputElement
    nameContainer.value = previousCommand
  }

  const input = text.querySelector('.sidecar-header-input') as HTMLInputElement
  listen(input)
}
