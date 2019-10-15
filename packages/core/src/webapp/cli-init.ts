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

import { keys } from './keys'
import { paste } from './paste'
import { listen } from './listen'
import { getCurrentTab } from './tab'
import { isPopup } from './popup-core'
import { getInitialBlock } from './block'
import { installContext, getCurrentPrompt, getInitialPrompt } from './prompt'

import { inElectron } from '../core/capabilities'
import { inBottomInputMode } from '../core/settings'

export default async () => {
  const tab = getCurrentTab()
  installContext(getInitialBlock(tab))
  listen(getInitialPrompt(tab))

  // in popup mode, cmd/ctrl+L should focus the repl input
  if (isPopup()) {
    document.body.addEventListener('keydown', async (event: KeyboardEvent) => {
      const char = event.keyCode
      if (char === keys.L && (event.ctrlKey || (inElectron() && event.metaKey))) {
        const { getSidecar } = await import('./views/sidecar')
        const input = getSidecar(getCurrentTab()).querySelector('.repl-input input') as HTMLInputElement
        input.focus()
        input.setSelectionRange(0, input.value.length)
      }
    })
  }

  if (inBottomInputMode) {
    getCurrentPrompt(tab).onpaste = paste
  }
}
