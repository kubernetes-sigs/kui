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

import { inBrowser, inElectron, KeyCodes, eventChannelUnsafe, doCancel, HistoryLine } from '@kui-shell/core'

import { InputProvider as Input } from './Input'
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

/** Update the given input to reflect the given HistoryLine */
const updateInputAndMoveCaretToEOL = (input: Input, entry: HistoryLine) => {
  if (entry) {
    input.state.prompt.value = entry.raw
    setTimeout(() => setCaretPositionToEnd(input.state.prompt), 0)
  } else {
    input.state.prompt.value = ''
  }
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
    const entry = historyModel.previous()
    if (entry) {
      updateInputAndMoveCaretToEOL(this, entry)
    }
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
    } else if (this.props.isPartOfMiniSplit) {
      // in minisplits, pageup means navigate to previous Block
      this.props.navigateTo('previous')
    }
  } else if (char === KeyCodes.PAGEDOWN) {
    if (inBrowser()) {
      debug('pagedown')
      const { height } = document.body.getBoundingClientRect()
      document.querySelector('.kui--tab-content.visible .repl-inner').scrollBy(0, +height)
    } else if (this.props.isPartOfMiniSplit) {
      // in minisplits, pageup means navigate to next Block
      this.props.navigateTo('next')
    }
  } else if (char === KeyCodes.C && event.ctrlKey) {
    // Ctrl+C, cancel
    doCancel(tab, block, prompt.value)
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
    eventChannelUnsafe.emit('/terminal/clear')
    eventChannelUnsafe.emit(`/terminal/clear/${this.props.uuid}`)
    eventChannelUnsafe.emit(`/close/views/${this.props.uuid}`)
    // restore the prompt cursor position
    // debug('restoring cursor position', currentCursorPosition)
    // getCurrentPrompt().setSelectionRange(currentCursorPosition, currentCursorPosition)
  } else if (char === KeyCodes.HOME) {
    // go to first command in history
    const historyModel = await (await import('@kui-shell/core')).History(tab)
    const entry = historyModel.first()
    if (entry) {
      updateInputAndMoveCaretToEOL(this, entry)
    }
  } else if (char === KeyCodes.END) {
    // go to last command in history
    const historyModel = await (await import('@kui-shell/core')).History(tab)
    const entry = historyModel.last()
    updateInputAndMoveCaretToEOL(this, entry)
  } else if (char === KeyCodes.DOWN || (char === KeyCodes.N && event.ctrlKey)) {
    // going DOWN past the last history item will result in '', i.e. a blank line
    const historyModel = await (await import('@kui-shell/core')).History(tab)
    const entry = historyModel.next()
    updateInputAndMoveCaretToEOL(this, entry)
  } else if (event.key === 'w' && event.ctrlKey) {
    const { prompt } = this.state
    const idx = prompt.value.lastIndexOf(
      ' ',
      prompt.value.charAt(prompt.value.length - 1) === ' ' ? prompt.value.length - 2 : prompt.value.length - 1
    )
    this.state.prompt.value = this.state.prompt.value.slice(0, idx + 1)
  }
}
