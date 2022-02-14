/*
 * Copyright 2019 The Kubernetes Authors
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
const debug = Debug('core/api/client')

import loadClientNotebooksMenuDefinition, { isMenu, isLeaf } from '../main/load'

/** Is the current client running in offline/disconnected mode? */
export function isOfflineClient(): boolean {
  try {
    const { offline, readonly, executable } = require('@kui-shell/client/config.d/client.json')

    if (offline === undefined && readonly !== undefined && executable !== undefined) {
      return readonly && !executable
    } else {
      return offline
    }
  } catch (err) {
    debug('Client did not define an offline status, assuming not offline')
    return false
  }
}

export function isOffline() {
  return isOfflineClient()
}

/** Is the current client running in readonly mode? */
export function isReadOnlyClient(): boolean {
  try {
    const { offline, readonly } = require('@kui-shell/client/config.d/client.json')

    if (offline) {
      return true
    } else {
      return readonly
    }
  } catch (err) {
    debug('Client did not define a readonly status, assuming not readonly')
    return false
  }
}

export function isReadOnly() {
  return isReadOnlyClient()
}

/** Is the current client running in an executable mode? */
export function isExecutableClient(): boolean {
  try {
    const { offline, executable } = require('@kui-shell/client/config.d/client.json')

    if (offline) {
      return false
    } else {
      return executable === undefined ? true : executable
    }
  } catch (err) {
    debug('Client did not define an executable status, assuming executable')
    return true
  }
}

export function isExecutable() {
  return isExecutableClient()
}

export function hideReplayOutput(): boolean {
  try {
    const { hideReplayOutput } = require('@kui-shell/client/config.d/client.json')
    return hideReplayOutput
  } catch (err) {
    debug('Client did not define a hideReplayOutput status, assuming no')
    return false
  }
}

/** @return the model specified by `@kui-shell/client/config.d/notebooks.json` */
export function guidebooksMenu() {
  const model = loadClientNotebooksMenuDefinition()
  if (model) {
    return model.submenu
  }
}

/** @return first guidebook from Client.guidebooksMenu() with an `open` property */
export function firstOpenGuidebook(): string {
  const scan = (menu: ReturnType<typeof guidebooksMenu>): string => {
    for (let idx = 0; idx < menu.length; idx++) {
      const item = menu[idx]
      if (isLeaf(item) && item.open) {
        return item.filepath
      } else if (isMenu(item)) {
        const found = scan(item.submenu)
        if (found) {
          return found
        }
      }
    }

    return undefined
  }

  return scan(guidebooksMenu())
}

/** @return a list of guidebook filepaths that `@kui-shell/client` offers */
export function clientGuidebooks(): string[] {
  try {
    const guidebooks = require('@kui-shell/build/client-guidebooks.json')
    if (!Array.isArray(guidebooks) || !guidebooks.every(_ => typeof _ === 'string')) {
      debug('Client did not properly define guidebooks', guidebooks)
    } else {
      return guidebooks
    }
  } catch (err) {
    debug('Client did not define any guidebooks')
    return []
  }
}

/** @return whether to show the Sidebar onload */
export function showGuidebooksSidebar(): boolean {
  try {
    return require('@kui-shell/client/config.d/client.json').showGuidebooksSidebar
  } catch (err) {
    return false
  }
}

/** @return whether to present guidebooks one-at-a-time */
export function singletonGuidebooks(): boolean {
  try {
    return require('@kui-shell/client/config.d/client.json').singletonGuidebooks
  } catch (err) {
    return false
  }
}
