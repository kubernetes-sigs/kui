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

import { Tab as KuiTab } from '@kui-shell/core'

export const doPaste = (text: string, tab: KuiTab, prompt: HTMLInputElement) => {
  // const prompt = event.currentTarget
  const lines = text.split(/[\n\r]/)

  const pasteLooper = async (idx: number) => {
    if (idx === lines.length) {
      // all done...
      return Promise.resolve()
      /* } else if (lines[idx] === '') {
      // then this is a blank line, so skip it
      return pasteLooper(idx + 1) */
    } else if (idx <= lines.length - 2) {
      // then this is a command line with a trailing newline
      const { internalBeCarefulPExec: pexec } = await import('@kui-shell/core')
      await pexec(prompt.value + lines[idx], { tab })
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
export function onPasteAsync(event: ClipboardEvent, tab: KuiTab, prompt: HTMLInputElement): Promise<void> {
  const text = event.clipboardData.getData('text')
  if (text) {
    // we'll handle it from here!
    event.preventDefault()

    return doPaste(text, tab, prompt)
  }
}

/**
 * User has requested that we paste something from the clipboard
 *
 */
export default function onPaste(event: ClipboardEvent, tab: KuiTab, prompt: HTMLInputElement) {
  onPasteAsync(event, tab, prompt)
}
