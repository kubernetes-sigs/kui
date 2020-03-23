/*
 * Copyright 2019 IBM Corporation
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

import { PreloadRegistrar } from '@kui-shell/core'

// buttons
import update from './modes/update'
import commands from './modes/commands'
import tryCommand from './modes/try-command'
import showAllCommands from './modes/show-all-commands'
import showInstalledPlugins from './modes/show-installed-plugins'
import showInstalledPluginsForRepo from './modes/show-installed-plugins-for-repo'
import showAvailablePluginsForRepo from './modes/show-available-plugins-for-repo'

import statusBadge from './modes/status'

/**
 * Notes: buttons and modes and badges will be presented in the order
 * they are registered, unless they specify an `order` attribute.
 *
 */
export default async (registrar: PreloadRegistrar) => {
  registrar.registerModes(
    commands,
    update,
    tryCommand,
    showAllCommands,
    showInstalledPlugins,
    showInstalledPluginsForRepo,
    showAvailablePluginsForRepo
  )

  registrar.registerBadges(statusBadge)
}
