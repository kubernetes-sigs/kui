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

import { keys } from '../keys'
import { isPopup } from '../popup-core'
import { getTabFromTarget } from '../tab'
import { scrollIntoView } from '../scroll'
import sidecarSelector from './sidecar-selector'

import { isVisible, toggle } from './sidecar-visibility'

/**
 * One-time initialization of sidecar view
 *
 */
export default async () => {
  // command-left go back
  document.addEventListener('keydown', async (event: KeyboardEvent) => {
    if (event.keyCode === keys.LEFT_ARROW && (event.ctrlKey || (process.platform === 'darwin' && event.metaKey))) {
      const { css: bottomStripeCSS } = await import('../bottom-stripe')

      const tab = getTabFromTarget(event.srcElement)
      const back = bottomStripeCSS.backButton(tab)
      const clickEvent = document.createEvent('Events')
      clickEvent.initEvent('click', true, false)
      back.dispatchEvent(clickEvent)
    }
  })

  // escape key toggles sidecar visibility
  document.addEventListener('keyup', (evt: KeyboardEvent) => {
    if (
      document.activeElement &&
      !(
        document.activeElement === document.body ||
        document.activeElement.classList.contains('inputarea') || // monaco-editor
        document.activeElement.classList.contains('repl-input-element')
      )
    ) {
      // not focused on repl
      return
    }

    if (evt.keyCode === keys.ESCAPE) {
      if (!isPopup()) {
        const tab = getTabFromTarget(evt.srcElement)
        const closeButton = sidecarSelector(tab, '.sidecar-bottom-stripe-close')
        if (isVisible(tab)) {
          closeButton.classList.add('hover')
          setTimeout(() => closeButton.classList.remove('hover'), 500)
        }
        toggle(tab)
        scrollIntoView()
      }
    }
  })
}
