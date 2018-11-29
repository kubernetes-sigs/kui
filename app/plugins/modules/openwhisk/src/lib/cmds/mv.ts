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

import repl = require('../../../../../../build/core/repl')

/**
 * Print usage/docs information
 *
 */
const usage = () => {
  return 'Usage: mv name new_name'
}

/**
 * This is the core logic
 *
 */
const mv = type => ({ argvNoOptions: argv, parsedOptions: options }) => {
  const idx = argv.indexOf('rename') + 1
  const oldName = argv[idx]
  const newName = argv[idx + 1]

  if (!oldName || !newName || options.help) {
    return usage()
  } else {
    return repl.qfexec(`${type} cp "${oldName}" "${newName}"`)
        .then(resp => repl.qexec(`wsk ${type} delete "${oldName}"`).then(() => resp))
  }
}

/**
 * Register commands
 *
 */
export default async (commandTree, wsk) => {
  // Install the routes. for now, no renaming of packages or triggers or rules
  ['actions'].forEach(type => {
    const handler = mv(type)
    wsk.synonyms(type).forEach(syn => {
      commandTree.listen(`/wsk/${syn}/rename`, handler, { docs: `Rename OpenWhisk ${type}` })
    })
  })
}
