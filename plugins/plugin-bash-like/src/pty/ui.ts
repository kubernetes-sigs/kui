/*
 * Copyright 2019 IBM Corporation
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

import { topTabButtonExists, topTabAddIcon, topTabRemoveIcon } from '@kui-shell/core'

const debug = Debug('plugins/bash-like/pty/ui')

/** class designation for our offline indicator */
const buttonDesignation = 'kui--plugin-bash-like--pty-offline-indicator'

/**
 * Are we currently presenting as offline or online?
 *
 */
function presentation(): 'offline' | 'online' {
  if (topTabButtonExists(buttonDesignation)) {
    return 'offline'
  } else {
    return 'online'
  }
}

/**
 * Update the UI to inform the user that the connection to the proxy is offline
 *
 */
export function setOffline() {
  if (presentation() === 'online') {
    debug('setOffline')

    const tmp = document.createElement('span')
    tmp.innerHTML =
      '<svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" aria-hidden="true"><path d="M30 28.59L3.41 2 2 3.41l6.4 6.41L7 15.77A1 1 0 0 0 8 17h4.83L11 28.85a1 1 0 0 0 .6 1.07 1.09 1.09 0 0 0 .4.08 1 1 0 0 0 .79-.39l6.68-8.73L28.59 30zm-7.47-11.72l3.26-4.26a1 1 0 0 0 .11-1A1 1 0 0 0 25 11h-4.75L22 3.22a1 1 0 0 0-.2-.85A1 1 0 0 0 21 2H11a1 1 0 0 0-1 .77l-.3 1.3z"></path></svg>'

    const offlineIcon = tmp.querySelector('svg') as SVGElement

    topTabAddIcon(offlineIcon, buttonDesignation).classList.add('red-text')
  }
}

/**
 * Update the UI to inform the user that the connection to the proxy is online
 *
 */
export function setOnline() {
  try {
    debug('setOnline')
    topTabRemoveIcon(buttonDesignation)
  } catch (err) {
    console.error(err)
  }
}
