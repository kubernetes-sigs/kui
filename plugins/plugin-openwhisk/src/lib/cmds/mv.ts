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
 * This plugin renames an OpenWhisk entity.
 *
 */

import { CommandRegistrar, EvaluatorArgs } from '@kui-shell/core/models/command'

import { synonyms } from '@kui-shell/plugin-openwhisk/lib/models/synonyms'

import { CMD as copy } from './copy'
import * as repl from '@kui-shell/core/core/repl'

/** name for the command */
export const CMD = 'rename'

/**
 * usage model
 *
 */
const usage = (type: string, command: string) => ({
  command,
  strict: command,
  required: [
    {
      name: 'name',
      docs: 'Name of the deployed entity to rename',
      entity: `wsk ${type}`
    },
    { name: 'newName', docs: 'The replacement name to use' }
  ],
  docs: 'Rename an Openwhisk entity',
  example: `${command} name newName`
})

/**
 * This is the core logic
 *
 */
const mv = (type: string) => (op: string) => ({ argvNoOptions: argv }: EvaluatorArgs) => {
  const idx = argv.indexOf(op) + 1
  const oldName = argv[idx]
  const newName = argv[idx + 1]

  return repl
    .qfexec(`wsk ${type} ${copy} "${oldName}" "${newName}"`)
    .then(resp => repl.qexec(`wsk ${type} delete "${oldName}"`).then(() => resp))
}

/**
 * Register commands
 *
 */
export default async (commandTree: CommandRegistrar) => {
  // Install the routes. for now, no renaming of packages or triggers or rules
  ;['actions'].forEach(type => {
    const handler = mv(type)
    synonyms(type).forEach(syn => {
      commandTree.listen(`/wsk/${syn}/${CMD}`, handler(CMD), {
        usage: usage(type, CMD)
      })
    })
  })
}
