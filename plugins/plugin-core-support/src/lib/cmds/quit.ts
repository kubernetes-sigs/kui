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

/**
 * This plugin introduces /quit, which causes the program to exit
 *
 */

import { qexec as $$ } from '@kui-shell/core/core/repl'
import { CommandRegistrar } from '@kui-shell/core/models/command'

const doQuit = () => $$('tab close')

const usage = (command: string) => ({
  command,
  strict: command,
  docs: 'Quit the program'
})

export default (commandTree: CommandRegistrar) => {
  const quitCmd = commandTree.listen('/quit', doQuit, {
    usage: usage('quit'),
    inBrowserOk: true,
    noAuthOk: true
  })

  // just for fun, make /exit a synonym for /quit
  commandTree.synonym('/exit', doQuit, quitCmd, {
    usage: usage('exit'),
    inBrowserOk: true,
    noAuthOk: true
  })
}
