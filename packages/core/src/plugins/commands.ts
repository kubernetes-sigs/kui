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

import Tables from '../api/tables'
import Errors from '../api/errors'
import { prescanModel } from './plugins'

/**
 * Return a table view of the commands offered by the given plugin
 *
 * @param plugin the name of an installed plugin, e.g. plugin-core-support
 *
 */
export default async function commandsOffered(plugin?: string): Promise<Tables.Table> {
  const { commandToPlugin, flat, usage, docs } = prescanModel()

  const commands: string[] = []
  const pluginIsInstalled = !!flat.find(({ route }) => route === plugin)

  if (!pluginIsInstalled) {
    const err = new Error(`Plugin ${plugin} is not installed`)
    err['code'] = 404
    throw err
  }

  for (const command in commandToPlugin) {
    const hostingPlugin = commandToPlugin[command]
    if (plugin && hostingPlugin === plugin) {
      commands.push(command)
    }
  }

  commands.sort((a, b) => -a.localeCompare(b))

  /* commands.filter(
    (command, idx) => !commands.find((other, otherIdx) => idx !== otherIdx && command.endsWith(other))
  ) */

  function find(
    command: string,
    A = command.split('/'),
    idx = 2,
    prefix = `/${A[1]}`,
    subtree = usage[prefix]
  ): Errors.UsageModel {
    if (!subtree) {
      return
    }
    if (A.length - idx === 0) {
      return subtree.usage
    } else if (!subtree.children) {
    } else {
      const prefixPlus = `${prefix}/${A[idx]}`
      return find(command, A, idx + 1, prefixPlus, subtree.children[prefixPlus])
    }
  }

  return {
    header: {
      name: 'command',
      attributes: [{ value: 'About' }]
    },
    body: commands
      .map(command => ({ command, usage: find(command), name: command.replace(/^\//, '').replace(/\//g, ' ') }))
      .filter(_ => !_.usage || (!_.usage.synonymFor && !_.usage.children))
      .map(({ command, name }) => ({
        type: 'command',
        name,
        attributes: [{ value: docs[command] }],
        onclick: name
      }))
  }
}
