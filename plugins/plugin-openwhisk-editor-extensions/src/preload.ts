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

import * as repl from '@kui-shell/core/core/repl'
import { inBrowser, isHeadless } from '@kui-shell/core/core/capabilities'
import { PluginRequire, PreloadRegistration } from '@kui-shell/core/models/plugin'

import { persisters } from './lib/cmds/new'

debug('done loading prereqs')

/**
 * A preloaded plugin that enhances the view modes for actions
 *
 */
const registration: PreloadRegistration = async (commandTree, prequire: PluginRequire) => {
  debug('initializing')

  if (!isHeadless()) {
    const { lockIcon, edit } = await import('@kui-shell/plugin-editor/lib/readonly')
    const { currentSelection } = await import('@kui-shell/core/webapp/views/sidecar')

    const getEntity = () => {
      const entity = currentSelection()
      entity.persister = persisters.actions
      debug('getEntity', entity)
      return entity
    }

    const { registerFetcher } = await import('@kui-shell/plugin-editor/lib/fetchers')

    const { addActionMode } = await import('@kui-shell/plugin-openwhisk/lib/models/modes')
    const { gotoReadonlyView, fetchAction } = await import('./lib/cmds/new')

    registerFetcher(fetchAction())

    const unlock = lockIcon({
      getEntity,
      mode: 'unlock',
      icon: 'fas fa-lock',
      tooltip: 'You are in read-only mode.\u000aClick to edit.', // TODO externalize string
      direct: edit({ getEntity, lock: ({ getEntity }) => lockIcon({ getEntity, direct: gotoReadonlyView({ getEntity }) }) })
    })

    addActionMode(unlock, 'unshift')
  }
}

export default registration

debug('finished loading')
