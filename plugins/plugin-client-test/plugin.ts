/*
 * Copyright 2019 The Kubernetes Authors
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

import { Registrar } from '@kui-shell/core'

import sayHello from './lib/cmds/say-hello'
import streamHello from './lib/cmds/stream-hello'
import style from './lib/cmds/style'
import mmrName from './lib/cmds/mmr-name'
import mmrNamespace from './lib/cmds/mmr-namespace'
import mmrKind from './lib/cmds/mmr-kind'
import mmrMode from './lib/cmds/mmr-mode'
import mmrModeViaRegistration from './lib/cmds/mmr-mode-via-registration'
import nav from './lib/cmds/NavResponse'
import table from './lib/cmds/table'

export default async (commandTree: Registrar) => {
  // commands
  await Promise.all([
    sayHello(commandTree),
    streamHello(commandTree),
    style(commandTree),
    mmrName(commandTree),
    mmrNamespace(commandTree),
    mmrKind(commandTree),
    mmrMode(commandTree),
    mmrModeViaRegistration(commandTree),
    nav(commandTree),
    table(commandTree)
  ])
}
