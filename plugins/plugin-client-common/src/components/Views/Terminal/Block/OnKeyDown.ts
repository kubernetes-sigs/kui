/*
 * Copyright 2017 The Kubernetes Authors
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

import { inBrowser, inElectron, KeyCodes, eventChannelUnsafe, doCancel, HistoryLine, splitFor } from '@kui-shell/core'

import { isHTMLInputElement, InputElement, InputProvider as Input } from './Input'
import startTabCompletion from './TabCompletion'

const debug = Debug('Terminal/Block/OnKeyDown')

interface MSIETextRange {
  collapse: (val: boolean) => void
  moveEnd: (which: string, pos: number) => void
  moveStart: (which: string, pos: number) => void
  select: () => void
}
interface MSIEControl extends HTMLInputElement {
  createTextRange: () => MSIETextRange
}
function isMSIEControl(ctrl: InputElement): ctrl is MSIEControl {
  return Object.prototype.hasOwnProperty.call(ctrl, 'createTextRange')
}

/**
 * Update the caret position in an html INPUT field
 *
 */
const setCaretPosition = (ctrl: InputElement, pos: number) => {
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

const setCaretPositionToStart = (input: InputElement) => setCaretPosition(input, 0)
const setCaretPositionToEnd = (input: InputElement) => setCaretPosition(input, input.value.length)
export const setCaretPositionToLineStart = (input: InputElement) => setCaretPosition(input, input.selectionStart)

/** Update the given input to reflect the given HistoryLine */
const updateInputAndMoveCaretToEOL = (input: Input, entry: HistoryLine) => {
  if (entry) {
    input.state.prompt.value = entry.raw
    setTimeout(() => setCaretPositionToEnd(input.state.prompt), 0)
  } else {
    input.state.prompt.value = ''
  }
}

/**
 *
 * "hello wor<userHitsCtrl+Delete>" -> "hello "
 * "hello world <userHitsCtrl+Delete>" -> "hello world"
 * "hello.world<userHitsCtrl+Delete>" -> "hello"
 *
 */
function deleteThisWord(prompt: InputElement) {
  const start = prompt.selectionStart
  const end = prompt.selectionEnd

  if (start === end) {
    let idx = start
    for (; idx >= 0; idx--) {
      if (/\W/.test(prompt.value[idx])) {
        break
      }
    }
    idx++ // back up the last idx--
    if (idx < start) {
      // another +1 here because the browser will delete one for us
      prompt.value = prompt.value.substring(0, idx + 1)
      return true
    }
  }
  return false
}

export default function onKeyDown(this: Input, event: KeyboardEvent) {
  const tab = splitFor(this.props.tab)
  const block = this.props._block
  const prompt = this.state.prompt

  const char = event.keyCode

  if (this.state.tabCompletion) {
    this.state.tabCompletion.key(event)
    return
  } else if (event.key === 'Tab') {
    startTabCompletion(this, event)
  }

  if (event.key === 'Backspace' && event.ctrlKey) {
    deleteThisWord(prompt)
  } else if (char === KeyCodes.C && event.ctrlKey) {
    // block could be undefined for bottom-input mode
    if (block) {
      // Ctrl+C, cancel
      doCancel(tab, block, prompt.value)
    }
  } else if (char === KeyCodes.U && event.ctrlKey) {
    // clear line
    prompt.value = ''
  } else if (event.key === 'Home' && event.shiftKey && process.platform === 'darwin') {
    // go to beginning of line
    setCaretPositionToStart(prompt)
  } else if (event.key === 'End' && event.shiftKey && process.platform === 'darwin') {
    // go to end of line
    setCaretPositionToEnd(prompt)
  }

  // keydown handler for HTMLInputElement
  if (isHTMLInputElement(this.state.prompt)) {
    if (char === KeyCodes.UP || (char === KeyCodes.P && event.ctrlKey)) {
      // go to previous command in history
      setTimeout(async () => {
        const historyModel = await (await import('@kui-shell/core')).History(tab)
        const entry = historyModel.previous()
        if (entry) {
          updateInputAndMoveCaretToEOL(this, entry)
        }
      })
    } else if (char === KeyCodes.D && event.ctrlKey) {
      if (prompt.value === '') {
        // <-- only if the line is blank
        debug('exit via ctrl+D')
        tab.REPL.pexec('exit', { tab })
      }
    } else if (char === KeyCodes.PAGEUP) {
      if (inBrowser()) {
        debug('pageup')
        const { height } = document.body.getBoundingClientRect()
        document.querySelector('.kui--tab-content.visible .repl-inner').scrollBy(0, -height)
      }
    } else if (char === KeyCodes.PAGEDOWN) {
      if (inBrowser()) {
        debug('pagedown')
        const { height } = document.body.getBoundingClientRect()
        document.querySelector('.kui--tab-content.visible .repl-inner').scrollBy(0, +height)
      }
    } else if (
      (char === KeyCodes.L && (event.ctrlKey || (inElectron() && event.metaKey))) ||
      (process.platform === 'darwin' && char === KeyCodes.K && event.metaKey)
    ) {
      // clear screen; capture and restore the current
      // prompt value, in keeping with unix terminal
      // behavior
      eventChannelUnsafe.emit('/terminal/clear')
      eventChannelUnsafe.emit(`/terminal/clear/${this.props.uuid}`)
      eventChannelUnsafe.emit(`/close/views/${this.props.uuid}`)
      // restore the prompt cursor position
      // debug('restoring cursor position', currentCursorPosition)
      // getCurrentPrompt().setSelectionRange(currentCursorPosition, currentCursorPosition)
    } else if (char === KeyCodes.DOWN || (char === KeyCodes.N && event.ctrlKey)) {
      // going DOWN past the last history item will result in '', i.e. a blank line
      setTimeout(async () => {
        const historyModel = await (await import('@kui-shell/core')).History(tab)
        const entry = historyModel.next()
        updateInputAndMoveCaretToEOL(this, entry)
      })
    } else if (event.key === 'w' && event.ctrlKey) {
      const { prompt } = this.state
      const idx = prompt.value.lastIndexOf(
        ' ',
        prompt.value.charAt(prompt.value.length - 1) === ' ' ? prompt.value.length - 2 : prompt.value.length - 1
      )
      this.state.prompt.value = this.state.prompt.value.slice(0, idx + 1)
    }
  }
}
