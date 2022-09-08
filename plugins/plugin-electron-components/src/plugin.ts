/*
 * Copyright 2020 The Kubernetes Authors
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

import { KResponse, Registrar } from '@kui-shell/core'

export default function (registrar: Registrar) {
  registrar.listen<KResponse, { title: string }>(
    '/replay-electron',
    async args => {
      const filepath = args.argvNoOptions[1]
      const { ipcRenderer } = await import('electron')
      ipcRenderer.send(
        'synchronous-message',
        JSON.stringify({
          operation: 'new-window',
          argv: ['replay', filepath, '--close-current-tab', '--status-stripe', 'blue']
        })
      )
      return true
    },
    { usage: { optional: [{ name: '--title', alias: '-t', docs: 'Set tab title' }] } }
  )
}
