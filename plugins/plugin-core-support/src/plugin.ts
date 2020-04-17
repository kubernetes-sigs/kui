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

import { isHeadless, Registrar } from '@kui-shell/core'

// import help from './lib/cmds/help'
import quit from './lib/cmds/quit'
import clear from './lib/cmds/clear'
import base64 from './lib/cmds/base64'
import prompt from './lib/cmds/prompt'
import sleep from './lib/cmds/sleep'
import history from './lib/cmds/history/history'
import tabManagement from './lib/cmds/tab-management'

// import updater from './lib/admin/updater'

/**
 * This is the module
 *
 */
export default async (commandTree: Registrar) => {
  await Promise.all([
    // help(commandTree, options),
    quit(commandTree),
    clear(commandTree),
    base64(commandTree),
    prompt(commandTree),
    sleep(commandTree),
    history(commandTree),
    tabManagement(commandTree)
  ])

  if (!isHeadless()) {
    await Promise.all([
      import('./lib/cmds/zoom').then(_ => _.plugin(commandTree)),
      import('./lib/cmds/window').then(_ => _.default(commandTree)),
      import('./lib/cmds/theme').then(_ => _.plugin(commandTree))
    ])
  }

  // updater(commandTree) <-- disabled for now
}
