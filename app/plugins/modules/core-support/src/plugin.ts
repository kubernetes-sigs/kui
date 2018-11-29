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

import run from './lib/cmds/run'
import echo from './lib/cmds/echo'
import quit from './lib/cmds/quit'
import clear from './lib/cmds/clear'
import about from './lib/cmds/about/about'
import base64 from './lib/cmds/base64'
import openui from './lib/cmds/open-ui-from-terminal'
import window from './lib/cmds/window'
import history from './lib/cmds/history/history'
import beautify from './lib/cmds/beautify'
import screenshot from './lib/cmds/screenshot'

// import updater from './lib/admin/updater'

/**
 * This is the module
 *
 */
export default async (commandTree, prequire, options) => {
  await window(commandTree, prequire)
  await openui(commandTree, prequire)

  return Promise.all([
    run(commandTree, prequire),
    echo(commandTree, prequire),
    quit(commandTree, prequire),
    clear(commandTree, prequire),
    about(commandTree, prequire),
    base64(commandTree, prequire),
    history(commandTree, prequire),
    beautify(commandTree, prequire),
    screenshot(commandTree, prequire)

    // updater(commandTree, prequire) <-- disabled for now
  ])
}
