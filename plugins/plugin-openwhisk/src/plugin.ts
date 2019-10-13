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

import { Commands } from '@kui-shell/core'

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
import on from './lib/cmds/rules/on'
import every from './lib/cmds/rules/every'
import modes from './lib/views/mode'
import core from './lib/cmds/openwhisk-core'

import activationList from './lib/cmds/activations/list'

import registerViews from './views'

export default async (commandTree: Commands.Registrar) => {
  const wsk = await core(commandTree)

  // commands
  await cp(commandTree)
  await mv(commandTree)
  await rm(commandTree)
  await auth(commandTree)
  await wipe(commandTree)
  await context(commandTree)
  await listAll(commandTree)
  await loadTest(commandTree)
  await addParameter(commandTree)

  // action extensions
  await letCommand(commandTree)
  await invoke(commandTree)
  await webbify(commandTree)

  // activation extensions
  await activationList(commandTree, wsk)
  await awaitCommand(commandTree)
  await last(commandTree)

  // rule extension
  await on(commandTree)
  await every(commandTree)

  // views
  await modes(commandTree)
  await registerViews()

  return wsk
}
