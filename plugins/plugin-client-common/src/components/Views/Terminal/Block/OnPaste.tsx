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

import { Tab as KuiTab } from '@kui-shell/core'
import { isClipboardTransferString } from '../ClipboardTransfer'
import { InputElement, InputProvider as Input } from './Input'
import { isMultiLineHereDoc } from '../../util/multiline-input'

export const doPaste = (text: string, tab: KuiTab, prompt: InputElement) => {
  // const prompt = event.currentTarget
  const lines = text.split(/[\n\r]/)

  const pasteLooper = async (idx: number) => {
    if (idx === lines.length) {
      // all done...
      return Promise.resolve()
      /* } else if (lines[idx] === '') {
      // then this is a blank line, so skip it
      return pasteLooper(idx + 1) */
    } else if (lines[idx].length === 0) {
      // skip
    } else if (idx <= lines.length - 2) {
      // then this is a command line with a trailing newline
      await tab.REPL.pexec(prompt.value + lines[idx], { tab })
      pasteLooper(idx + 1)
    } else {
      // then this is the last line, but without a trailing newline.
      // here, we add this command line to the current prompt, without executing it

      // paste the line with respect to the current prompt's
      // selection range; if there is no selection range, then
      // prompt.selectionStart will be the current caret position
      // (which is precisely what we want, i.e. to paste the given
      // text at the current caret position); if there is a
      // selectionEnd, then we will *also* replace the selection
      // range

      // and, then, when we are done, will position the caret just
      // after the pasted text:
      const newCaretPosition = prompt.selectionStart + lines[idx].length

      // note how this will either place the new text at the caret
      // position, or replace the selected text (if selectionEnd !==
      // selectionStart)
      prompt.value =
        prompt.value.substring(0, prompt.selectionStart) + lines[idx] + prompt.value.substring(prompt.selectionEnd)

      // restore the caret position
      prompt.setSelectionRange(newCaretPosition, newCaretPosition)

      return Promise.resolve()
    }
  }

  return pasteLooper(0)
}

/**
 * User has requested that we paste something from the
 * clipboard.
 *
 * @return a Promise of when we will be done.
 *
 */
export function onPasteAsync(this: Input, event: ClipboardEvent, tab: KuiTab, prompt: InputElement): Promise<void> {
  const text = event.clipboardData.getData('text')
  if (text) {
    // we'll handle it from here!
    event.preventDefault()

    if (isClipboardTransferString(text)) {
      // it'll be handled in ScrollableTerminal
      return
    }

    if (isMultiLineHereDoc(text)) {
      this.setState({ multiline: true, pasteMultiLineTexts: text })
    } else {
      return doPaste(text, tab, prompt)
    }
  }
}

/**
 * User has requested that we paste something from the clipboard
 *
 */
export default function onPaste(this: Input, event: ClipboardEvent, tab: KuiTab, prompt: InputElement) {
  onPasteAsync.bind(this)(event, tab, prompt)
}
