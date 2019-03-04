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

import { inBrowser } from '@kui-shell/core/core/capabilities'

import { start, end } from './lib/wrk'
import init from './lib/init'
import { last, show } from './lib/replay'
import { list } from './lib/history-table'
import { del, clear } from './lib/history'
import { script } from './lib/scriptgen'

/**
 * This is the module
 *
 */
export default async (commandTree, prequire, options) => {
  if (!inBrowser()) {
    await Promise.all([
      commandTree.listen('/wrk', start), // start a new load run
      init(commandTree),
      commandTree.listen('/wrk/end', end), // end any ongoing load run
      commandTree.listen('/wrk/last', last), // show last run, from history
      commandTree.listen('/wrk/history', list), // show recent history
      commandTree.listen('/wrk/delete', del), // delete selected historical run
      //    commandTree.listen('/wrk/clear', clear), // clear history
      commandTree.listen('/wrk/show', show), // show a given historical run
      commandTree.listen('/wrk/script', script(prequire)) // generate a wrk script file
    ])
  }
}
