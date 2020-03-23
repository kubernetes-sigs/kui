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

import * as prettyMilliseconds from 'pretty-ms'
import { opts, commandPrefix } from '@kui-shell/plugin-ibmcloud/ks'
import { Arguments, Registrar, MultiModalResponse, i18n } from '@kui-shell/core'

import semver from './semver'
import getRepoURL from './repo/url'
import apiVersion from './apiVersion'
import ListOptions from './list-options'
import { isDeprecated } from './deprecated'
import getAvailablePlugins from './available'
import getInstalledPlugins from './installed'
import trimSolitaryTrailingDots from './trim'
import { IBMCloudPlugin } from '../models/plugin'

const strings = i18n('plugin-ibmcloud/plugin')
const ksStrings = i18n('plugin-ibmcloud/ks')

function prettyPrintDuration(delta: number): string {
  return prettyMilliseconds(delta, { compact: true })
}

/**
 * `ibmcloud plugin get/show`
 *
 */
const doGet = (cmd: string) => async (args: Arguments<ListOptions>): Promise<MultiModalResponse<IBMCloudPlugin>> => {
  const whichRepo = args.parsedOptions.r || args.parsedOptions.repo
  const repoURL = whichRepo ? await getRepoURL(args, whichRepo) : undefined
  const which = args.argvNoOptions[args.argvNoOptions.indexOf(cmd) + 1]

  const [{ Plugins: installed }, { plugins: available }, { safeDump }] = await Promise.all([
    getInstalledPlugins(args),
    getAvailablePlugins(args.tab, repoURL),
    import('js-yaml')
  ])

  const installedEntry = installed[which]
  const isInstalled = installedEntry !== undefined
  /* if (!installedEntry) {
    const err: CodedError = new Error(strings('Plugin not installed', which))
    err.code = 404
    throw err
    } */

  const currentVersion = isInstalled ? semver(installedEntry.Version) : ''

  const availableEntry = available.find(_ => _.name === which)
  const latest = availableEntry && availableEntry.versions[availableEntry.versions.length - 1]
  const updateAvailable = isInstalled && latest && latest.version !== currentVersion

  const toolbarText = updateAvailable
    ? {
        type: 'warning' as const,
        text: strings('An update is available for this plugin')
      }
    : undefined

  return {
    apiVersion,
    kind: 'Plugin',
    metadata: {
      name: which,
      namespace: availableEntry.company,
      creationTimestamp: availableEntry.updated
    },
    toolbarText,
    data: safeDump(isInstalled ? installedEntry : availableEntry),
    version: `v${isInstalled ? currentVersion : latest.version}`,
    modes: [
      {
        mode: 'Compatibility',
        content: safeDump({
          'Plugin SDK Version': currentVersion || latest.version,
          'Minimal IBM Cloud CLI version required':
            (isInstalled ? semver(installedEntry) : latest.min_cli_version) || strings('N/A')
        }),
        contentType: 'yaml'
      },
      {
        mode: 'Versions',
        content: {
          header: {
            name: strings('VERSION'),
            attributes: [{ value: strings('RELEASE DATE') }]
          },
          body: availableEntry.versions.map(_ => ({
            name: _.version,
            attributes: [
              {
                key: 'RELEASE DATE',
                value: ksStrings('ago', prettyPrintDuration(new Date().getTime() - new Date(_.updated).getTime()))
              }
            ]
          }))
        }
      }
    ],
    content: installedEntry,
    isSimulacrum: true,
    spec: {
      updateAvailable,
      status: isDeprecated(availableEntry)
        ? 'Deprecated'
        : isInstalled
        ? updateAvailable
          ? 'Update Available'
          : 'Ready'
        : 'Available'
    },
    summary: {
      content: `## ${strings('Description')}\n\n${trimSolitaryTrailingDots(availableEntry.description) ||
        strings('N/A')}\n\n## Status\n\n- ${strings(
        'Initially created',
        prettyPrintDuration(new Date().getTime() - new Date(availableEntry.created).getTime())
      )}\n\n- ${strings(
        'Last updated',
        prettyPrintDuration(new Date().getTime() - new Date(availableEntry.updated).getTime())
      )}\n\n${
        isDeprecated(availableEntry)
          ? '- <strong class="red-text">' + strings('This plugin has been deprecated') + '</strong>'
          : !updateAvailable
          ? ''
          : '- **' + strings('Available Update') + ': ' + currentVersion + ' \u2192 ' + latest.version + '**'
      }`,
      contentType: 'text/markdown'
    }
  }
}

export default (registrar: Registrar) => {
  const cmd = registrar.listen(`/${commandPrefix}/ibmcloud/plugin/show`, doGet('show'), opts)
  registrar.synonym(`/${commandPrefix}/ibmcloud/plugin/get`, doGet('get'), cmd, opts)
}
