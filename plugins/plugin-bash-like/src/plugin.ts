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

import ls from './lib/cmds/ls'
import open from './lib/cmds/open'
import bash from './lib/cmds/bash-like'
import ptyServer from './pty/server'
import exportCommand from './lib/cmds/export'
import { registerCommands as sessionReady } from './pty/session'

import { Registrar } from '@kui-shell/core'

/**
 * This is the module
 *
 */
export default async (commandTree: Registrar) => {
  return Promise.all([
    ls(commandTree),
    open(commandTree),
    bash(commandTree),
    ptyServer(commandTree),
    sessionReady(commandTree),
    exportCommand(commandTree)
  ])
}
