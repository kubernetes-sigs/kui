/*
 * Copyright 2017-18 IBM Corporation
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

import { Capabilities, Commands } from '@kui-shell/core'

import commands from './controller/commands'
import compile from './controller/compile'
import install from './controller/install'
import get from './controller/get'
import list from './controller/list'
import home from './controller/home'
import remove from './controller/remove'
import version from './controller/version'

export default async (commandTree: Commands.Registrar) => {
  if (!Capabilities.inBrowser()) {
    await Promise.all([
      commands(commandTree),
      compile(commandTree),
      install(commandTree),
      get(commandTree),
      list(commandTree),
      home(commandTree),
      remove(commandTree),
      version(commandTree)
    ])
  }
}
