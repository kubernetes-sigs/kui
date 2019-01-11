/*
 * Copyright 2018 IBM Corporation
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

import { isHeadless } from '@kui/core/capabilities'
import { getCurrentPrompt } from '@kui/webapp/cli'

/**
 * We want to focus the current "active" repl <input> element when the
 * user clicks in the repl zone. However, the logic for supporting
 * this behavior is a bit convoluted, due to the way mouse events are
 * ordered by browsers.
 *
 * First issue: we don't want to focus the <input> on double click or
 * mouse drags which result in a text selection. This is why we keep
 * track of startX and startY on mousedown. Because double-click
 * events come *after* single-click events, we need to install a
 * deferred handler onclick, which the double-click event handler can
 * then cancel.
 *
 */
export default () => {
  if (isHeadless()) {
    // headless mode
    return
  }

  const repl = document.querySelector('tab.visible .repl') as HTMLElement

  // some state
  let startX
  let startY
  let currentFinishAsync

  // to disambiguate single and double click events, we need to defer
  // handling click events, to give us time not to see a dblclick
  // event
  const finishClick = evt => () => {
    if (evt.screenX === startX && evt.screenY === startY // not a drag
        && noCurrentTextSelection() // not a double-click text selection
       ) {
      // finally! if those conditions hold, then we can focus the current <input>
      getCurrentPrompt().focus()
    }
  }

  // mousedown comes first
  repl.addEventListener('mousedown', evt => {
    startX = evt.screenX
    startY = evt.screenY
    currentFinishAsync = undefined
  })

  // click comes second
  repl.addEventListener('click', evt => {
    currentFinishAsync = setTimeout(finishClick(evt), 100)
  })

  // dblclick comes third
  repl.addEventListener('dblclick', evt => {
    if (noCurrentTextSelection()) {
      clearTimeout(currentFinishAsync)
    }
  })
}

/**
 * Is no text currently selected?
 *
 */
const noCurrentTextSelection = () => window.getSelection().toString().trim().length === 0
