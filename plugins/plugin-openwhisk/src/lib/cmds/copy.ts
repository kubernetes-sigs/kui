/*
 * Copyright 2017, 2019 IBM Corporation
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
 * This plugin copies an OpenWhisk entity.
 *
 */

import Debug from 'debug'

import { Commands } from '@kui-shell/core'

import { synonyms } from '../models/synonyms'

const debug = Debug('plugins/openwhisk/cmds/copy')

/** name for the command */
export const CMD = 'copy'

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
      docs: 'Name of the deployed entity to copy',
      entity: `wsk ${type}`
    },
    { name: 'newName', docs: 'Name of the copied entity' }
  ],
  docs: 'Copy an OpenWhisk action',
  example: `${command} name newName`
})

/**
 * This is the core logic
 *
 */
const copy = (type: string) => (op: string) => (command: Commands.Arguments, retryOK = true) => {
  debug(`${type} ${op}`)

  const { argvNoOptions: argv, REPL } = command

  const idx = argv.indexOf(op) + 1
  const oldName = argv[idx]
  const newName = argv[idx + 1]

  /**
   * If the copy failed, maybe this is because the destination package does not exist?
   *
   */
  const packageAutoCreate = name => err => {
    if (err.statusCode === 404 && retryOK) {
      // create failure with 404, maybe package not found?
      const path = name.split('/')
      const packageName = path.length === 2 ? path[0] : path.length === 3 ? path[1] : undefined
      if (packageName) {
        return REPL.qexec(`wsk package update "${packageName}"`).then(() => {
          // false: don't retry again
          return copy(type)(op)(command, false)
        })
      }
    }

    // otherwise, it wasn't a package existence issue
    throw err
  }

  return REPL.qexec(`wsk ${type} update --copy "${newName}" "${oldName}"`).catch(packageAutoCreate(newName))
}

/**
 * Register commands
 *
 */
export default async (commandTree: Commands.Registrar) => {
  // Install the routes. for now, no copying of packages or triggers or rules
  ;['actions'].forEach(type => {
    const handler = copy(type)
    synonyms(type).forEach(syn => {
      commandTree.listen(`/wsk/${syn}/${CMD}`, handler(CMD), {
        usage: usage(type, CMD)
      })
    })
  })
}
