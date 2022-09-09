/*
 * Copyright 2022 The Kubernetes Authors
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
import { EventEmitter } from 'events'

const refreshEvents = new EventEmitter()

/**
 * [Main Process] Emit a kubernetes config change event. Called from
 * electron-main, which is the touchpoint for calls from the renderer
 * process (below).
 */
export function emitRefresh() {
  Debug('plugin-kubectl-tray-menu/events')('emitRefreshFromMain')
  refreshEvents.emit('/refresh')
}

/**
 * [Main Process] This is how tray menu watchers register for
 * kubernetes config change event .
 */
export function onRefresh(cb: () => void) {
  refreshEvents.on('/refresh', cb)
}

/** [Renderer Process] */
export async function emitRefreshFromRenderer() {
  try {
    Debug('plugin-kubectl-tray-menu/events')('emitRefreshFromRenderer')
    const { ipcRenderer } = await import('electron')
    ipcRenderer.send(
      '/exec/invoke',
      JSON.stringify({
        module: 'plugin-kubectl-tray-menu',
        main: 'initTray',
        args: {
          command: '/tray/refresh'
        }
      })
    )
  } catch (err) {
    console.error('Error sending kubernetes config refresh event from renderer to main', err)
  }
}
