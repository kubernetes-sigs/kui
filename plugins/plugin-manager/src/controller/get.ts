/*
 * Copyright 2017 IBM Corporation
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

import Commands from '@kui-shell/core/api/commands'
import { i18n } from '@kui-shell/core/api/i18n'
import { MultiModalResponse } from '@kui-shell/core/api/ui-lite'

import { getVersion } from './version'

const strings = i18n('plugin-manager')

/**
 * This is the command handler for `plugin get`
 *
 */
const doGet = async ({ argvNoOptions }: Commands.Arguments): Promise<MultiModalResponse> => {
  argvNoOptions = argvNoOptions.slice(argvNoOptions.indexOf('get') + 1)
  const name = argvNoOptions.shift()
  const { installedOn, version } = await getVersion(name)

  const response: MultiModalResponse = {
    kind: 'plugin',
    metadata: {
      name
    },
    version,
    toolbarText: {
      type: 'info',
      text: strings('Installed on', installedOn.toLocaleString())
    },
    modes: [{ mode: 'commands', content: `plugin commands ${name}`, contentType: 'command' }],
    buttons: [{ mode: 'uninstall', label: 'Remove', command: `confirm "plugin remove ${name}"` }]
  }

  return response
}

export default (commandTree: Commands.Registrar) => {
  commandTree.listen('/plugin/get', doGet)
}
