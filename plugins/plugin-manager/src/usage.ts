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

/** breadcrumb parents */
const parents = [{ command: 'plugin' }]

/** required parameter: name of installed plugin */
const installedPlugin = [{ name: 'plugin', docs: 'the name of an installed plugin', entity: 'plugin' }]

/**
 * Usage model for plugin commands
 *
 */
export const commands = {
  strict: 'commands',
  command: 'commands',
  breadcrumb: 'offered commands',
  docs: 'list commands offered by an installed shell plugin',
  example: 'plugin commands <plugin>',
  required: installedPlugin,
  related: ['plugin install', 'plugin list'],
  parents
}

/**
 * Usage model for plugin install
 *
 */
export const install = {
  strict: 'install',
  command: 'install',
  breadcrumb: 'Install plugin',
  docs: 'install a plugin',
  example: 'plugin install <plugin>',
  detailedExample: {
    command: 'plugin install shell-sample-plugin',
    docs: 'a simple example plugin'
  },
  required: [{ name: 'plugin', docs: 'an npm module or github link' }],
  parents
}

/**
 * Usage model for plugin list
 *
 */

/**
 * Format usage message
 *
 */
export const list = {
  strict: 'list',
  command: 'list',
  breadcrumb: 'List plugins',
  docs: 'list installed plugins',
  example: 'plugin list',
  optional: [{ name: '--limit', hidden: true }], // to make tab completion happy
  parents
}

/**
 * Usage model for plugin remove
 *
 */
export const remove = (command: string) => ({
  strict: command,
  command,
  breadcrumb: 'Remove plugin',
  docs: 'remove an installed plugin',
  example: 'plugin remove <plugin>',
  required: installedPlugin,
  parents
})
