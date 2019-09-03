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

/* eslint-disable @typescript-eslint/explicit-member-accessibility */

import * as Debug from 'debug'

import { respondToRepl } from '../util'
import { Entity as EditorEntity, fetchEntity } from '../fetchers'
import * as usage from '../../usage'
import { applyOverrides } from '../overrides'
import { openEditor } from '../open'
import { persisters } from '../persisters'

import { Tab } from '@kui-shell/core/webapp/cli'
import { CommandRegistrar, ParsedOptionsFull } from '@kui-shell/core/models/command'

import { ExecOptions } from '@kui-shell/core/models/execOptions'
const debug = Debug('plugins/editor/cmds/edit')

// so that users of the exported `edit` command have access to our
// IEntity model
export type EditorEntity = EditorEntity

/**
 * Command handler for `edit <entity>`
 *
 */
const editCmd = async ({
  tab,
  argvNoOptions = [],
  parsedOptions = {},
  execOptions
}: {
  tab: Tab
  argvNoOptions: string[]
  parsedOptions: ParsedOptionsFull
  execOptions: ExecOptions
}) => {
  debug('edit command execution started', execOptions)

  // maybe the caller is passing us the name and entity programmatically?
  const { parameters: programmaticArgs } = execOptions

  const positionalName = argvNoOptions[argvNoOptions.indexOf('edit') + 1]
  const name = (programmaticArgs && programmaticArgs.name) || positionalName

  // for a programmatic entity, the name of the field is e.g. `edit !source`
  if (positionalName && positionalName.charAt(0) === '!') {
    if (programmaticArgs.filepath) {
      programmaticArgs.persister = persisters.files
    }
    programmaticArgs.exec = {
      kind: parsedOptions['language'],
      code: programmaticArgs[positionalName.slice(1)]
    }
  }

  //
  // fetch the entity and open the editor in parallel
  // then update the editor to show the entity
  // then send a response back to the repl
  //
  debug('name', name)
  const [entity, injectEntityIntoView] = await Promise.all([
    programmaticArgs || fetchEntity(name, parsedOptions, execOptions), // fetch the entity model
    openEditor(tab, name, parsedOptions, execOptions) // prepare the editor view
  ])

  // apply any command line overrides of the default behaviors
  applyOverrides(parsedOptions)([entity])

  // now we're ready to inject the entity into the editor view
  const model = await injectEntityIntoView(entity)

  // respond with a repl-compatible data model
  const custom = execOptions.custom
  const lock = (custom && custom.lock) || (entity.lock !== undefined ? entity.lock : entity.gotoReadonlyView)
  return respondToRepl(lock ? [lock] : [])(model)
}

/**
 * Open editor to a given entity, passed programmatically
 *
 */
export const edit = (tab: Tab, entity: EditorEntity, options: ParsedOptionsFull, execOptions: ExecOptions) =>
  editCmd({
    tab,
    argvNoOptions: [],
    parsedOptions: options,
    execOptions: Object.assign({}, execOptions, {
      parameters: entity,
      custom: undefined,
      noSidecarHeader: true
    })
  })

export default async (commandTree: CommandRegistrar) => {
  // command registration: edit an existing entity
  commandTree.listen('/editor/edit', editCmd, {
    usage: usage.editUsage('edit'),
    noAuthOk: true,
    inBrowserOk: true,
    needsUI: true
  })
}
