/*
 * Copyright 2018 IBM Corporation
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

import cp from './lib/cmds/copy'
import mv from './lib/cmds/mv'
import rm from './lib/cmds/rm'
import auth from './lib/cmds/auth'
import wipe from './lib/cmds/wipe'
import context from './lib/cmds/context'
import listAll from './lib/cmds/list-all'
import loadTest from './lib/cmds/load-test'
import addParameter from './lib/cmds/add-parameter'
import letCommand from './lib/cmds/actions/let'
import invoke from './lib/cmds/actions/invoke'
import webbify from './lib/cmds/actions/webbify'
import awaitCommand from './lib/cmds/activations/await'
import last from './lib/cmds/activations/last'
import roots from './lib/cmds/activations/roots'
import on from './lib/cmds/rules/on'
import every from './lib/cmds/rules/every'
import modes from './lib/views/mode'
import beautify from './lib/cmds/beautify'
import core from './lib/cmds/openwhisk-core'
import editorBits from './lib/cmds/editor-extensions'

import activationList from './lib/cmds/activations/list'

import registerViews from './views'

export default async (commandTree, prequire) => {
  const wsk = await core(commandTree)

  // commands
  await cp(commandTree, wsk)
  await mv(commandTree, wsk)
  await rm(commandTree, wsk)
  await auth(commandTree, wsk, prequire)
  await wipe(commandTree, wsk, prequire)
  await context(commandTree, prequire)
  await listAll(commandTree)
  await loadTest(commandTree, wsk)
  await addParameter(commandTree, wsk)
  await beautify(commandTree, wsk)
  await editorBits(commandTree, wsk)

  // action extensions
  await letCommand(commandTree, wsk)
  await invoke(commandTree, wsk)
  await webbify(commandTree, wsk)

  // activation extensions
  await activationList(commandTree, wsk)
  await awaitCommand(commandTree, wsk)
  await last(commandTree, wsk)
  await roots(commandTree, wsk)

  // rule extension
  await on(commandTree)
  await every(commandTree, wsk)

  // views
  await modes(commandTree, wsk, prequire)
  await registerViews()

  return wsk
}
