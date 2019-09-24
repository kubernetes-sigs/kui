/*
 * Copyright 2017,2019 IBM Corporation
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

import { start, end } from './lib/wrk'
import init from './lib/init'
import { last, show } from './lib/replay'
import { list } from './lib/history-table'
import { del } from './lib/history'
import { script } from './lib/scriptgen'

const opts = { noAuthOk: true }

/**
 * This is the module
 *
 */
export default async (commandTree: Commands.Registrar) => {
  if (!Capabilities.inBrowser()) {
    await Promise.all([
      commandTree.listen('/wrk', start, opts), // start a new load run
      init(commandTree),
      commandTree.listen('/wrk/end', end, opts), // end any ongoing load run
      commandTree.listen('/wrk/last', last, opts), // show last run, from history
      commandTree.listen('/wrk/history', list, opts), // show recent history
      commandTree.listen('/wrk/delete', del, opts), // delete selected historical run
      //    commandTree.listen('/wrk/clear', clear), // clear history
      commandTree.listen('/wrk/show', show, opts), // show a given historical run
      commandTree.listen('/wrk/script', script, opts) // generate a wrk script file
    ])
  }
}
