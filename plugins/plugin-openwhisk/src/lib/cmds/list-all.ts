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

/**
 * This plugin introduces /wsk/list, which lists entities across all entity types.
 *
 */

import { wsk } from './openwhisk-usage'
import repl = require('@kui-shell/core/core/repl')

/** usage model */
const usage = cmd => ({
  strict: cmd, // enforce no positional or optional arguments
  title: 'List all',
  header: `${wsk.available.find(({ command }) => command === 'list').docs}.`,
  example: `wsk ${cmd}`,
  parents: [{ command: 'wsk' }]
})

/** construct a struct that informs the command tree of our usage model */
const docs = cmd => ({ usage: usage(cmd) })

/** list all of these entity types: */
const types = [ 'actions', 'packages', 'triggers', 'rules' ]

/** list the entities of a given type */
const list = type => repl.qexec(`wsk ${type} list`, undefined, undefined, { showHeader: true })

/** the command handler */
const doList = cmd => () => Promise.all(types.map(list)).then(L => {
  return L.map(_ => _[0] || []).filter(x => x.length > 0)
})

/**
 * Here is the module, where we register command handlers
 *
 */
export default (commandTree) => {
  commandTree.listen(`/wsk/list`, doList('list'), docs('list'))
}
