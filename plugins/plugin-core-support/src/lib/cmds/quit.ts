/*
 * Copyright 2017 The Kubernetes Authors
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
 * This plugin introduces /quit, which causes the program to exit
 *
 */

import { Arguments, Capabilities, Registrar } from '@kui-shell/core'

const doQuit = ({ REPL }: Arguments) => REPL.qexec('tab close')

const usage = (command: string) => ({
  command,
  strict: command,
  docs: 'Quit the program'
})

export default (commandTree: Registrar) => {
  if (!Capabilities.inBrowser()) {
    // register a window close command handler
    commandTree.listen('/window/close', () => {
      const remote = require('electron').remote
      const w = remote.getCurrentWindow()
      w.close()
      return true
    })
  }

  commandTree.listen('/exit', doQuit, {
    usage: usage('exit')
  })
}
