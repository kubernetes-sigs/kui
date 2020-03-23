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

import { opts, commandPrefix } from '@kui-shell/plugin-ibmcloud/ks'
import { Arguments, Registrar, Table, i18n } from '@kui-shell/core'

import getRepoURL from './url'
import semver from '../semver'
import ListOptions from '../list-options'
import getInstalledPlugins from '../installed'
import { getAvailablePluginsSafe } from '../available'
import { PluginStatus, trafficLight } from '../../models/plugin'
import { isDeprecatedPattern, isDeprecated } from '../deprecated'

const strings = i18n('plugin-ibmcloud/plugin')

/**
 * `ibmcloud plugin repo-plugins`
 * `ibmcloud plugin repo available ls`
 *
 */
async function doList(args: Arguments<ListOptions>): Promise<Table> {
  const whichRepo = args.parsedOptions.r || args.parsedOptions.repo
  const repoURL = whichRepo ? await getRepoURL(args, whichRepo) : undefined

  // fetch installed plugins and available plugins
  const [{ Plugins: installedPlugins }, { plugins: availablePlugins }] = await Promise.all([
    getInstalledPlugins(args),
    getAvailablePluginsSafe(args.tab, repoURL)
  ])

  // format the table body
  const body = availablePlugins.map(availablePlugin => {
    const { name, description, versions } = availablePlugin

    const isInstalled = installedPlugins[name] !== undefined
    const installedVersion = isInstalled ? semver(installedPlugins[name].Version) : ''
    const latestVersion = versions[versions.length - 1].version
    const updateAvailable = isInstalled && installedVersion !== latestVersion

    const isItDeprecated = isDeprecated(availablePlugin)
    const descriptionForDisplay = description.replace(isDeprecatedPattern, '')

    const status: PluginStatus = isItDeprecated
      ? 'Deprecated'
      : isInstalled
      ? updateAvailable
        ? 'Update Available'
        : 'Ready'
      : 'Available'

    return {
      name,
      onclick: `ibmcloud plugin repo-plugin ${args.REPL.encodeComponent(name)}${
        whichRepo ? ' -r ' + args.REPL.encodeComponent(whichRepo) : ''
      }`,
      onclickSilence: true,
      attributes: [
        {
          key: strings('STATUS'),
          tag: 'badge',
          value: strings(status),
          css: trafficLight(status)
        },
        {
          key: strings('DESCRIPTION'),
          value: descriptionForDisplay,
          outerCSS: 'hide-with-sidecar'
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
  const cmd = registrar.listen(`/${commandPrefix}/ibmcloud/plugin/repo/available/list`, doList, opts)
  registrar.synonym(`/${commandPrefix}/ibmcloud/plugin/repo/available/ls`, doList, cmd, opts)
  registrar.listen(`/${commandPrefix}/ibmcloud/plugin/repo-plugins`, doList, opts)

  // here, we delegate "repo-plugin" to "plugin get"
  registrar.listen(
    `/${commandPrefix}/ibmcloud/plugin/repo-plugin`,
    (args: Arguments<ListOptions>) => {
      const pluginArg = args.REPL.encodeComponent(args.argvNoOptions[args.argvNoOptions.indexOf('repo-plugin') + 1])

      const whichRepo = args.parsedOptions.r || args.parsedOptions.repo
      const repoArg = whichRepo ? `-r ${args.REPL.encodeComponent(whichRepo)}` : ''

      const cmd = `${commandPrefix} ibmcloud plugin get ${pluginArg} ${repoArg}`
      return args.REPL.qexec(cmd)
    },
    opts
  )
}
