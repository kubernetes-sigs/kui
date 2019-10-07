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

import { Commands, i18n, Plugins, Tables } from '@kui-shell/core'
import { installedPlugin } from '../util/usage-common'

const strings = i18n('plugin-manager')

const usage = {
  strict: 'commands',
  command: 'commands',
  breadcrumb: strings('offered commands'),
  docs: strings('list commands offered by an installed shell plugin'),
  example: 'plugin commands <plugin>',
  required: installedPlugin,
  related: ['plugin install', 'plugin list']
}

const doList = ({ argvNoOptions }: Commands.Arguments): Promise<Tables.Table> => {
  const plugin = argvNoOptions[argvNoOptions.indexOf('commands') + 1]
  return Plugins.commandsOffered(plugin)
}

export default (commandTree: Commands.Registrar) => {
  commandTree.listen('/plugin/commands', doList, {
    usage
  })
}
