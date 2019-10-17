/*
 * Copyright 2017-19 IBM Corporation
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
import { pathExists, readJSON } from 'fs-extra'
import { join } from 'path'

import Commands from '@kui-shell/core/api/commands'
import Errors from '@kui-shell/core/api/errors'
import { i18n } from '@kui-shell/core/api/i18n'
import Plugins from '@kui-shell/core/api/plugins'
import Tables from '@kui-shell/core/api/tables'

import { getVersion } from './version'

const strings = i18n('plugin-manager')
const debug = Debug('plugins/plugin-manager/cmd/list')

/**
 * Format usage message
 *
 */
const usage: Errors.UsageModel = {
  strict: 'list',
  command: 'list',
  breadcrumb: strings('List plugins'),
  docs: strings('list installed plugins'),
  example: 'plugin list'
}

const doList = async (): Promise<Tables.Table> => {
  const moduleDir = await Plugins.userHome()
  debug('command execution started', moduleDir)

  const pjson = join(moduleDir, 'package.json')
  if (!(await pathExists(pjson))) {
    throw new Error(strings('No user-installed plugins found'))
  }

  const { dependencies } = (await readJSON(pjson)) as { dependencies: Record<string, string> }
  debug('dependencies', dependencies)

  // read the top-level directory contents, then extract plugin versions
  const installedPlugins = await Promise.all(Object.keys(dependencies).map(dependence => getVersion(dependence))).catch(
    err => {
      console.error(err)
      throw new Error('Internal Error')
    }
  )

  if (installedPlugins.length > 0) {
    //
    // make a list of records that includes more than just
    // the plugin name, so that the REPL can format them
    //
    return {
      header: {
        name: 'plugin',
        attributes: [{ value: 'version' }]
      },
      body: installedPlugins.map(({ name, version }) => ({
        type: 'plugin',
        name,
        attributes: [{ key: 'version', value: version }],
        onclick: `plugin get ${name}`
      }))
    }
  } else {
    throw new Error(strings('No user-installed plugins found'))
  }
}

export default (commandTree: Commands.Registrar) => {
  commandTree.listen('/plugin/list', doList, {
    usage
  })
}
