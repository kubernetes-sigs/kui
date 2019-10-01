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

import Debug from 'debug'
const debug = Debug('plugins/openwhisk-editor-extensions/preload')
debug('loading')

import { Capabilities, UI } from '@kui-shell/core'

import { lockIcon, edit, registerFetcher } from '@kui-shell/plugin-editor'
import { addActionMode } from '@kui-shell/plugin-openwhisk'

debug('done loading prereqs')

/**
 * A preloaded plugin that enhances the view modes for actions
 *
 */
export default async () => {
  debug('initializing')

  if (!Capabilities.isHeadless()) {
    const { Models } = await import('@kui-shell/core')

    const { persisters } = await import('./lib/cmds/new')

    const getEntity = (tab: UI.Tab) => {
      const entity = Models.Selection.current(tab)
      entity['persister'] = persisters.actions
      debug('getEntity', entity)
      return entity
    }

    const { gotoReadonlyView, fetchAction } = await import('./lib/cmds/new')

    registerFetcher(fetchAction())

    const unlock = lockIcon({
      getEntity,
      mode: 'unlock',
      label: 'Edit',
      // icon: 'fas fa-lock',
      tooltip: 'Click to edit', // TODO externalize string
      direct: edit({
        getEntity,
        lock: ({ getEntity }) => lockIcon({ getEntity, direct: gotoReadonlyView({ getEntity }) })
      })
    })

    addActionMode(unlock, 'unshift')
  }
}

debug('finished loading')
