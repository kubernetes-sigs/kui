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

import { Arguments, Registrar } from '@kui-shell/core'
import { Rule, Trigger } from '../../models/resource'

/**
 * on <trigger> do <action>
 *
 */
const on = ({ argvNoOptions: argv, parsedOptions, REPL }: Arguments) => {
  const idx = argv.indexOf('on') + 1

  const trigger = argv[idx]
  const action = argv[idx + 2]
  const rule = parsedOptions.name || `on_${trigger}_do_${action.replace(/\//g, '_')}`

  return REPL.qexec<Trigger>(`wsk trigger get ${trigger}`, null, null, { noRetry: true })
    .catch(err => {
      if (err.statusCode === 404) {
        return REPL.qexec(`wsk trigger update ${trigger}`)
      } else {
        throw err
      }
    })
    .then(() => REPL.qexec(`wsk rule update ${rule} ${trigger} ${action}`))
    .then(() => REPL.qexec(`wsk rule enable ${rule}`))
    .then(() => REPL.qexec<Rule>(`wsk rule get ${rule}`))
}

/**
 * Register command handlers
 *
 */
export default (registrar: Registrar) => {
  registrar.listen(`/wsk/on`, on, { docs: 'Create an OpenWhisk rule' })
}
