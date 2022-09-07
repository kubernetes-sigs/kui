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

/**
 * This is the logic that will execute in the *electron-renderer*
 * process for tray menu registration. This will be called by our,
 * `preload.ts` i.e. whenever a new electron window opens.
 *
 * We ask the *electron-main* process to handle things. We do this by
 * invoking the Kui `/exec/invoke` IPC API. See our
 * `electron-main.ts`, and note how it has an `initTray` method. Here,
 * we specify the plugin (`plugin-codeflare`), and the method to
 * invoke (`initTray`), and the parameters to pass to that method
 * invocation.
 */
export default async function renderer(ipcRenderer: import('electron').IpcRenderer) {
  if (ipcRenderer) {
    ipcRenderer.send(
      '/exec/invoke',
      JSON.stringify({
        module: 'plugin-kubectl-tray-menu',
        main: 'initTray',
        args: {
          command: '/tray/init'
        }
      })
    )
  }
}
