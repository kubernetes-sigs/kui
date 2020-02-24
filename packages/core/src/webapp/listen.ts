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

import { inBrowser, inElectron } from '../core/capabilities'

import { keys } from './keys'
import doCancel from './cancel'
import eventBus from '../core/events'
import { Tab, getTabId } from './tab'
import { Block } from './models/block'
import { Prompt } from './prompt'

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

export function onKeyPress(tab: Tab, block: Block, prompt: Prompt) {
  return async (event: KeyboardEvent) => {
    const char = event.keyCode
    if (char === keys.ENTER) {
      // user typed Enter; we've finished Reading, now Evalute
      const { doEval } = await import('../repl/exec')
      doEval(tab, block, prompt)
    }
  }
}

export function onKeyDown(tab: Tab, block: Block, prompt: Prompt) {
  return async (event: KeyboardEvent) => {
    const char = event.keyCode

    if (char === keys.UP || (char === keys.P && event.ctrlKey)) {
      // go to previous command in history
      const historyModel = (await import('../models/history')).default
      const newValue = (historyModel.previous() || { raw: '' }).raw
      if (newValue) {
        updateInputAndMoveCaretToEOL(prompt, newValue)
      }
    } else if (char === keys.D && event.ctrlKey) {
      if (prompt.value === '') {
        // <-- only if the line is blank
        debug('exit via ctrl+D')
        const { pexec } = await import('../repl/exec')
        pexec('exit')
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
      doCancel(tab, block) // eslint-disable-line @typescript-eslint/no-use-before-define
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
      eventBus.emit(`/terminal/clear/${getTabId(tab)}`)
      eventBus.emit(`/close/views/${getTabId(tab)}`)
      // restore the prompt cursor position
      // debug('restoring cursor position', currentCursorPosition)
      // getCurrentPrompt().setSelectionRange(currentCursorPosition, currentCursorPosition)
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
      const historyModel = (await import('../models/history')).default
      const newValue = (historyModel.next() || { raw: '' }).raw
      updateInputAndMoveCaretToEOL(prompt, newValue)
    }
  }
}
