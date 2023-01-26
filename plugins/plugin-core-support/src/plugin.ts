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

import { Capabilities, Registrar } from '@kui-shell/core'

// import help from './lib/cmds/help'
import echo from './lib/cmds/echo'
import quit from './lib/cmds/quit'
import clear from './lib/cmds/clear'
import dopar from './lib/cmds/dopar'
import watch from './lib/cmds/watch'
import base64 from './lib/cmds/base64'
import mutable from './lib/cmds/toggle-editability'
import prompt from './lib/cmds/prompt'
import replay from './lib/cmds/replay'
import sleep from './lib/cmds/sleep'
import history from './lib/cmds/history/history'
import kuiConfig from './lib/cmds/kui-config'
import tabManagement from './lib/cmds/tab-management'

// import updater from './lib/admin/updater'

/**
 * This is the module
 *
 */
export default async (commandTree: Registrar) => {
  await Promise.all([
    // help(commandTree, options),
    echo(commandTree),
    quit(commandTree),
    clear(commandTree),
    commandTree.listen('/dopar', dopar),
    watch(commandTree),
    base64(commandTree),
    mutable(commandTree),
    prompt(commandTree),
    replay(commandTree),
    sleep(commandTree),
    history(commandTree),
    kuiConfig(commandTree),
    tabManagement(commandTree)
  ])

  if (!Capabilities.isHeadless()) {
    await Promise.all([
      import('./lib/cmds/zoom').then(_ => _.plugin(commandTree)),
      import('./lib/cmds/theme').then(_ => _.plugin(commandTree))
    ])
  }

  // updater(commandTree) <-- disabled for now
}
