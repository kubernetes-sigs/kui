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
import { CodedError, Arguments, Registrar, MultiModalResponse, i18n } from '@kui-shell/core'

import getRepoURL from './url'
import getInstalledRepos from './raw'
import apiVersion from '../apiVersion'
import getAvailablePlugins from '../available'
import getInstalledPlugins from '../installed'
import { AvailablePluginRaw } from '../../models/plugin'
import IBMCloudRepository from '../../models/repository'

const strings = i18n('plugin-ibmcloud/plugin')

/**
 * `ibmcloud plugin repo get`
 *
 */
async function doGet(args: Arguments<KubeOptions>): Promise<MultiModalResponse<IBMCloudRepository>> {
  const idx = args.argvNoOptions.indexOf('get') + 1
  const whichRepo = args.argvNoOptions[idx]
  const repoURL = await getRepoURL(args, whichRepo)

  const [installed, { Plugins: installedPlugins }, { plugins: availablePlugins }] = await Promise.all([
    getInstalledRepos(args),
    getInstalledPlugins(args),
    getAvailablePlugins(args.tab, repoURL)
  ])

  const installedEntry = installed.find(_ => _.Name === whichRepo)

  const installedPluginsFromRepo = availablePlugins.filter(_ => installedPlugins[_.name] !== undefined)

  if (!installedEntry) {
    const err: CodedError = new Error(strings('Repository not installed'))
    err.code = 404
    throw err
  }

  // const toList = (L: AvailablePluginRaw[]) => L.map(_ => _.name).reduce((str, name) => str + '\n - ' + name, '')
  const toList = (L: AvailablePluginRaw[]) => L.map(_ => _.name).join(' <strong class="sub-text">|</strong> ')

  const summary = `## ${strings('Installed Plugins')}\n${toList(installedPluginsFromRepo)}\n\n## ${strings(
    'Available Plugins'
  )}\n${toList(availablePlugins)}`

  return {
    apiVersion,
    kind: 'Repository',
    isSimulacrum: true,
    metadata: {
      name: whichRepo
    },
    toolbarText: {
      type: 'info',
      text: strings('Home URL', installedEntry.URL)
    },
    modes: [],
    content: installedEntry,
    summary: {
      content: summary,
      contentType: 'text/markdown'
    }
  }
}

export default (registrar: Registrar) => {
  registrar.listen(`/${commandPrefix}/ibmcloud/plugin/repo/get`, doGet, opts)
}
