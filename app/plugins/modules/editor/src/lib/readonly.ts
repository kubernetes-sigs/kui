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

import { showCustom, showEntity } from '@kui/webapp/views/sidecar'
import * as repl from '@kui/core/repl'

/**
 * Enter read-only mode
 *
 */
export const readonly = ({ getEntity }) => () => Promise.resolve(getEntity())
  .then(({ namespace, name }) => repl.qexec(`action get "/${namespace}/${name}"`))
  .then(showEntity)

/**
 * Enter edit mode
 *
 */
export const edit = ({ getEntity }) => () => Promise.resolve(getEntity())
  .then(({ namespace, name }) => repl.qexec(`edit "/${namespace}/${name}"`))
  .then(entity => showCustom(entity, {}))

/**
 * Render a lock/unlock icon as a mode button
 *
 */
export const lockIcon = ({ getEntity,
  mode = 'lock', // doesn't need to be translated, as we use an icon
  icon = 'fas fa-unlock-alt',
  tooltip = 'You are in edit mode.\u000aClick to return to view mode.', // TODO externalize string
  direct = exports.readonly({ getEntity })
}) => ({
  mode,
  actAsButton: true,
  fontawesome: icon,
  data: { 'data-balloon': tooltip,
    'data-balloon-break': true,
    'data-balloon-pos': 'up-left' },
  direct
})
