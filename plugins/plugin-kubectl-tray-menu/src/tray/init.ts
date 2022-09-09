/*
 * Copyright 2018 The Kubernetes Authors
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

import { Capabilities } from '@kui-shell/core'

/** [Renderer Process] Preloader to initialize tray menu */
export default async function initTray() {
  if (Capabilities.inElectron() && !process.env.KUI_NO_TRAY_MENU) {
    const { ipcRenderer } = await import('electron')
    import('./renderer')
      .then(_ => _.default(ipcRenderer))
      .catch(err => {
        console.error('Error initializing tray menu', err)
      })

    // rebroadcast renderer-side config change events to the main process
    const { onKubectlConfigChangeEvents } = await import('@kui-shell/plugin-kubectl')
    onKubectlConfigChangeEvents(async () => {
      import('./events').then(_ => _.emitRefreshFromRenderer())
    })
  }
}
