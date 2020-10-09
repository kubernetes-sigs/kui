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

import { KubeOptions } from '@kui-shell/plugin-kubectl'
import { opts, commandPrefix } from '@kui-shell/plugin-ibmcloud/ks'
import { Arguments, Registrar, Table, i18n } from '@kui-shell/core'

import getInstalledRepos from './raw'
import getInstalledPlugins from '../installed'
import { getAvailablePluginsSafe } from '../available'

const strings = i18n('plugin-ibmcloud/plugin')

/**
 * `ibmcloud plugin repos/repo list`
 *
 */
async function doList(args: Arguments<KubeOptions>): Promise<Table> {
  // fetch installed repos
  const installed = await getInstalledRepos(args)

  // fetch installed plugins and available plugins
  const [{ Plugins: installedPlugins }, availablePlugins] = await Promise.all([
    getInstalledPlugins(args),
    Promise.all(installed.map(_ => _.URL).map(_ => getAvailablePluginsSafe(args.tab, _)))
  ])

  // format the table body
  const body = installed.map(({ Name: name }, idx) => {
    return {
      name,
      onclick: `ibmcloud plugin repo get ${args.REPL.encodeComponent(name)}`,
      attributes: [
        {
          key: strings('INSTALLED'),
          value: availablePlugins[idx].plugins.filter(_ => installedPlugins[_.name] !== undefined).length.toString(),
          outerCSS: ''
        },
        {
          key: strings('AVAILABLE'),
          value: availablePlugins[idx].plugins.length.toString(),
          outerCSS: ''
        }
      ]
    }
  })

  const header = {
    name: 'NAME',
    attributes: body[0].attributes.map(_ => ({ value: _.key, outerCSS: _.outerCSS }))
  }

  return {
    header,
    body
  }
}

export default (registrar: Registrar) => {
  registrar.listen(`/${commandPrefix}/ibmcloud/plugin/repos`, doList, opts)
  registrar.listen(`/${commandPrefix}/ibmcloud/repos`, doList, opts)

  const cmd1 = registrar.listen(`/${commandPrefix}/ibmcloud/plugin/repo/list`, doList, opts)
  registrar.synonym(`/${commandPrefix}/ibmcloud/plugin/repo/ls`, doList, cmd1, opts)

  const cmd2 = registrar.listen(`/${commandPrefix}/ibmcloud/repo/list`, doList, opts)
  registrar.synonym(`/${commandPrefix}/ibmcloud/repo/ls`, doList, cmd2, opts)
}
