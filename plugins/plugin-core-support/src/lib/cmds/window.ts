/*
 * Copyright 2017 IBM Corporation
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

import { inBrowser, Registrar, tellMain } from '@kui-shell/core'

/**
 * This plugin introduces commands to control the window size.
 *
 */
export default (commandTree: Registrar) => {
  commandTree.subtree('/window', {
    docs: 'Window sizing commands, e.g. "window max" and "window unmax"'
  })

  // commandTree.listen('/window/bigger', () => tellMain('enlarge-window'))
  // commandTree.listen('/window/smaller', () => tellMain('reduce-window'))
  commandTree.listen('/window/max', () => tellMain('maximize-window'), {
    docs: 'Maximize the window',
    noAuthOk: true
  })
  commandTree.listen('/window/unmax', () => tellMain('unmaximize-window'), {
    docs: 'Unmaximize the window',
    noAuthOk: true
  })

  // register a window close command handler
  commandTree.listen(
    '/window/close',
    () => {
      if (inBrowser()) {
        throw new Error('Unsupported operation')
      } else {
        const remote = require('electron').remote
        const w = remote.getCurrentWindow()
        w.close()
        return true
      }
    },
    { noAuthOk: true }
  )
}
