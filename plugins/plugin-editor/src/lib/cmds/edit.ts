/*
 * Copyright 2018 IBM Corporation
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

import * as Debug from 'debug'
const debug = Debug('plugins/editor/cmds/edit-amd')

import { respondToRepl } from '../util'
import { fetchEntity } from '../fetchers'
import * as usage from '../../usage'
import { lockIcon } from '../readonly'
import { applyOverrides } from '../overrides'
import { openEditor } from '../open'

import * as repl from '@kui-shell/core/core/repl'

/**
 * Command handler for `edit <entity>`
 *
 */
const edit = (prequire) => async ({ argvNoOptions, parsedOptions, execOptions }) => {
  debug('edit command execution started')

  const name = argvNoOptions[argvNoOptions.indexOf('edit') + 1]

  //
  // fetch the entity and open the editor in parallel
  // then update the editor to show the entity
  // then send a response back to the repl
  //
  debug('name', name)
  const [entity, injectEntityIntoView] = await Promise.all([
    fetchEntity(name, parsedOptions, execOptions), // fetch the entity model
    openEditor(name, parsedOptions, execOptions) // prepare the editor view
  ])

  // apply any command line overrides of the default behaviors
  applyOverrides(parsedOptions)([entity])

  // now we're ready to inject the entity into the editor view
  const model = await injectEntityIntoView(entity)

  // respond with a repl-compatible data model
  return respondToRepl([ lockIcon ])(model)
}

export default async (commandTree, prequire) => {
  // command registration: edit an existing entity
  commandTree.listen('/editor/edit', edit(prequire), { usage: usage.editUsage('edit'), noAuthOk: true, needsUI: true })
}
