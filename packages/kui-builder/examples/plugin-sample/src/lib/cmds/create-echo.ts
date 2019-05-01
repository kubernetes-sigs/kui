/*
 * Copyright 2019 IBM Corporation
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
 * This sample plugin creates an openwhisk echo action.
 *
 */

import { qexec as $ } from '@kui-shell/core/core/repl'
import { CommandRegistrar, IEvaluatorArgs } from '@kui-shell/core/models/command'

/**
 * This is the command handler. Handlers can return plain strings,
 * which will then be printed in the CLI portion of the UI.
 *
 * More sophisticated examples can return Promises of values. If the
 * value, or promise thereof, evaluates to a whisk entity, then the
 * sidecar will be opened to show it.
 *
 * If you want the repl only to print "ok", then return true
 *
 * If you want the repl to print an error string in red text, then throw new Error("error message")
 *
 */
const createEcho = ({ argv, command, argvNoOptions, parsedOptions }: IEvaluatorArgs) => {
  return $('wsk action let echo = x => x')
}

const usage = {
  command: 'action',
  docs: 'Create an OpenWhisk action'
}

/**
 * This is the exported module. It registers a handler for "sample create action" commands
 *
 */
export default (commandTree: CommandRegistrar) => {
  commandTree.listen('/sample/create/action', createEcho, { usage, noAuthOk: true })
}
