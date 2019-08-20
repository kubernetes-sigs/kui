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

/**
 * This plugin introduces /wsk/rules/on, to simplify the syntax of
 * creating rules. Triggers will be created if they don't yet exist.
 *
 *   on t do foo
 *
 */

import * as repl from '@kui-shell/core/core/repl'

/**
 * on <trigger> do <action>
 *
 */
const on = ({ argvNoOptions: argv, parsedOptions }) => {
  const idx = argv.indexOf('on') + 1

  const trigger = argv[idx]
  const action = argv[idx + 2]
  const rule = parsedOptions.name || `on_${trigger}_do_${action.replace(/\//g, '_')}`

  return repl
    .qexec(`wsk trigger get ${trigger}`, null, null, { noRetry: true })
    .catch(err => {
      if (err.statusCode === 404) {
        return repl.qexec(`wsk trigger update ${trigger}`)
      } else {
        throw err
      }
    })
    .then(() => repl.qexec(`wsk rule update ${rule} ${trigger} ${action}`))
    .then(() => repl.qexec(`wsk rule enable ${rule}`))
    .then(() => repl.qfexec(`wsk rule get ${rule}`))
}

/**
 * Register command handlers
 *
 */
export default commandTree => {
  commandTree.listen(`/wsk/on`, on, { docs: 'Create an OpenWhisk rule' })
}
