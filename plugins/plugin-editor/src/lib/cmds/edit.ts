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

import { ExecOptions, ParsedOptions, Registrar, Tab } from '@kui-shell/core'

import EditorEntity from '../entity'
import { editUsage } from '../../usage'
import { CommandResponse } from '../response'

interface Options extends ParsedOptions {
  language?: string
}

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
  parsedOptions: Options
  execOptions: ExecOptions
}): Promise<CommandResponse> => {
  const [openEditor, applyOverrides, respondToRepl, { fetchEntity }, { persisters }] = await Promise.all([
    import(/* webpackMode: "lazy" */ '../open').then(_ => _.default),
    import(/* webpackMode: "lazy" */ '../overrides').then(_ => _.default),
    import(/* webpackMode: "lazy" */ '../util').then(_ => _.default),
    import(/* webpackMode: "lazy" */ '../fetchers'),
    import('../persisters')
  ])

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
      kind: parsedOptions.language,
      code: programmaticArgs[positionalName.slice(1)]
    }
  }

  //
  // fetch the entity and open the editor in parallel
  // then update the editor to show the entity
  // then send a response back to the repl
  //
  const [entity, injectEntityIntoView] = await Promise.all([
    programmaticArgs || fetchEntity(tab, name, parsedOptions, execOptions), // fetch the entity model
    openEditor(tab, name, parsedOptions, execOptions) // prepare the editor view
  ])

  // apply any command line overrides of the default behaviors
  applyOverrides(parsedOptions)(entity)

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
export const edit = (tab: Tab, entity: EditorEntity, options: Options, execOptions: ExecOptions) =>
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

export default async (commandTree: Registrar) => {
  // command registration: edit an existing entity
  commandTree.listen('/edit', editCmd, {
    usage: editUsage('edit'),
    noAuthOk: true,
    inBrowserOk: true,
    needsUI: true
  })
}
