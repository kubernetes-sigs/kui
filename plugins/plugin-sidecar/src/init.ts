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
const debug = Debug('webapp/views/sidecar-init')

import { isPopup, scrollIntoView, getTabFromTarget, KeyCodes as keys, REPL } from '@kui-shell/core'

import Sidecar from './sidecar'
import { isVisible, toggle, toggleMaximization, clearSelection } from './visibility'

/**
 * Escape key toggles sidecar visibility
 *
 */
function registerGlobalEscapeKeyHandler() {
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
        const closeButton = tab.querySelector('sidecar .sidecar-bottom-stripe-close')
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

/**
 * Initialize any global key or click handlers
 *
 */
export function oneTimeInit() {
  registerGlobalEscapeKeyHandler()
}

/**
 * Add onclick handlers to Sidecar Buttons
 *
 */
export function perSidecarInit(sidecar: Sidecar, { pexec }: REPL) {
  // maximize button
  ;(sidecar.querySelector('.toggle-sidecar-maximization-button') as HTMLElement).onclick = () => {
    // indicate that the user requested maximization
    toggleMaximization(getTabFromTarget(sidecar), 'user')
  }

  // close button
  ;(sidecar.querySelector('.toggle-sidecar-button') as HTMLElement).onclick = () => {
    toggle(getTabFromTarget(sidecar))
  }

  // quit button
  ;(sidecar.querySelector('.sidecar-bottom-stripe-quit') as HTMLElement).onclick = () => {
    try {
      if (isPopup()) {
        debug('quit button click')
        window.close()
      } else {
        debug('close sidecar button click')
        clearSelection(getTabFromTarget(sidecar))
      }
    } catch (err) {
      console.error('error handling quit button click', err)
    }
  }

  // screenshot button
  ;(sidecar.querySelector('.sidecar-screenshot-button') as HTMLElement).onclick = () => {
    pexec('screenshot sidecar')
  }
}

// command-left go back
/* document.addEventListener('keydown', async (event: KeyboardEvent) => {
    if (event.keyCode === keys.LEFT_ARROW && (event.ctrlKey || (process.platform === 'darwin' && event.metaKey))) {
      const { css: bottomStripeCSS } = await import('./bottom-stripe')

      const tab = getTabFromTarget(event.srcElement)
      const back = bottomStripeCSS.backButton(tab)
      const clickEvent = document.createEvent('Events')
      clickEvent.initEvent('click', true, false)
      back.dispatchEvent(clickEvent)
    }
  }) */
