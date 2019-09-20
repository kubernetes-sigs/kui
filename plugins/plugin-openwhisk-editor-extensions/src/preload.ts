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
const debug = Debug('plugins/openwhisk-editor-extensions/preload')
debug('loading')

import { Tab } from '@kui-shell/core/webapp/cli'
import { isHeadless } from '@kui-shell/core/core/capabilities'

import { lockIcon, edit, registerFetcher } from '@kui-shell/plugin-editor'
import { addActionMode } from '@kui-shell/plugin-openwhisk'

debug('done loading prereqs')

/**
 * A preloaded plugin that enhances the view modes for actions
 *
 */
export default async () => {
  debug('initializing')

  if (!isHeadless()) {
    const { currentSelection } = await import('@kui-shell/core/webapp/views/sidecar')

    const { persisters } = await import('./lib/cmds/new')

    const getEntity = (tab: Tab) => {
      const entity = currentSelection(tab)
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
