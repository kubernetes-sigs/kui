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

import { REPL, UI } from '@kui-shell/core'

const debug = Debug('plugins/editor/readonly')

/**
 * Enter read-only mode
 *
 */
export const gotoReadonlyLocalFile = ({ getEntity }) => async (tab: UI.Tab) => {
  const entity = await getEntity(tab)
  debug('readonly', entity.name, entity)
  return REPL.pexec(`open ${REPL.encodeComponent(entity.filepath)}`)
}

/**
 * Enter edit mode
 *
 */
export const edit = ({ getEntity, lock = undefined }) => async (tab: UI.Tab) => {
  const { namespace, name } = await getEntity(tab)

  return REPL.qexec(`edit "/${namespace}/${name}"`, undefined, undefined, {
    custom: { getEntity, lock }
  })
}

/**
 * Render a lock/unlock icon as a mode button
 *
 */
export const lockIcon = ({
  getEntity,
  mode = 'lock', // doesn't need to be translated, as we use an icon
  label = 'Done Editing',
  // icon = 'fas fa-unlock-alt',
  tooltip = 'Return to read-only mode', // TODO externalize string
  direct = gotoReadonlyLocalFile({ getEntity })
}) => ({
  mode,
  label,
  flush: 'weak', // if we have only flush:right buttons, don't let this keep us from snapping them left
  actAsButton: true,
  // fontawesome: icon,
  balloon: tooltip,
  direct
})
