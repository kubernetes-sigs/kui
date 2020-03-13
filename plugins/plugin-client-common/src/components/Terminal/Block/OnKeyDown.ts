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

import { inBrowser, inElectron, KeyCodes, eventChannelUnsafe, doCancel, getTabId } from '@kui-shell/core'

import Input from './Input'
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

export default async function onKeyDown(this: Input, event: KeyboardEvent) {
  const tab = this.props.tab
  const block = this.props._block
  const prompt = this.state.prompt

  const char = event.keyCode

  if (this.state.tabCompletion) {
    this.state.tabCompletion.key(event)
    return
  } else if (event.key === 'Tab') {
    startTabCompletion(this, event)
  }

  if (char === KeyCodes.UP || (char === KeyCodes.P && event.ctrlKey)) {
    // go to previous command in history
    const historyModel = await (await import('@kui-shell/core')).History(tab)
    const newValue = (historyModel.previous() || { raw: '' }).raw
    if (newValue) {
      updateInputAndMoveCaretToEOL(prompt, newValue)
    }
  } else if (char === KeyCodes.D && event.ctrlKey) {
    if (prompt.value === '') {
      // <-- only if the line is blank
      debug('exit via ctrl+D')
      const { internalBeCarefulPExec: pexec } = await import('@kui-shell/core')
      pexec('exit')
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
  } else if (char === KeyCodes.C && event.ctrlKey) {
    // Ctrl+C, cancel
    doCancel(tab, block) // eslint-disable-line @typescript-eslint/no-use-before-define
  } else if (char === KeyCodes.U && event.ctrlKey) {
    // clear line
    prompt.value = ''
  } else if (
    (char === KeyCodes.L && (event.ctrlKey || (inElectron() && event.metaKey))) ||
    (process.platform === 'darwin' && char === KeyCodes.K && event.metaKey)
  ) {
    // clear screen; capture and restore the current
    // prompt value, in keeping with unix terminal
    // behavior
    eventChannelUnsafe.emit(`/terminal/clear/${getTabId(tab)}`)
    eventChannelUnsafe.emit(`/close/views/${getTabId(tab)}`)
    // restore the prompt cursor position
    // debug('restoring cursor position', currentCursorPosition)
    // getCurrentPrompt().setSelectionRange(currentCursorPosition, currentCursorPosition)
  } else if (char === KeyCodes.HOME) {
    // go to first command in history
    const historyModel = await (await import('@kui-shell/core')).History(tab)
    const newValue = historyModel.first().raw
    if (newValue) {
      updateInputAndMoveCaretToEOL(prompt, newValue)
    }
  } else if (char === KeyCodes.END) {
    // go to last command in history
    const historyModel = await (await import('@kui-shell/core')).History(tab)
    const newValue = (historyModel.last() || { raw: '' }).raw
    updateInputAndMoveCaretToEOL(prompt, newValue)
  } else if (char === KeyCodes.DOWN || (char === KeyCodes.N && event.ctrlKey)) {
    // going DOWN past the last history item will result in '', i.e. a blank line
    const historyModel = await (await import('@kui-shell/core')).History(tab)
    const newValue = (historyModel.next() || { raw: '' }).raw
    updateInputAndMoveCaretToEOL(prompt, newValue)
  }
}
