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

import apiVersion from '../apiVersion'
import getInstalledPlugins from '../installed'
import { IBMCloudPluginCommand } from '../../models/plugin'

const strings = i18n('plugin-ibmcloud/plugin')

/**
 * `ibmcloud plugin command get`
 *
 */
async function doGet(args: Arguments<KubeOptions>): Promise<MultiModalResponse<IBMCloudPluginCommand>> {
  const idx = args.argvNoOptions.indexOf('get') + 1
  const whichPlugin = args.argvNoOptions[idx]
  const whichCommand = args.argvNoOptions[idx + 1]
  const whichNamespace = args.parsedOptions.namespace

  const { Plugins: installed } = await getInstalledPlugins(args)

  const installedEntry = installed[whichPlugin]
  if (!installedEntry) {
    const err: CodedError = new Error(strings('Plugin not installed'))
    err.code = 404
    throw err
  }

  const installedCommand = installedEntry.Commands.find(
    _ => _.Name === whichCommand && (!whichNamespace || _.Namespace === whichNamespace)
  )
  if (!installedCommand) {
    console.error('command not found', whichCommand, whichNamespace, installedEntry)
    const err: CodedError = new Error(strings('Specified command not found in this plugin'))
    err.code = 404
    throw err
  }

  const firstNewlineOfUsage = installedCommand.Usage.indexOf('\n')
  const usageLine1 = installedCommand.Usage.substring(
    0,
    firstNewlineOfUsage === -1 ? installedCommand.Usage.length : firstNewlineOfUsage
  )
  const usageRest =
    firstNewlineOfUsage === -1 ? '' : `### Notes:\n\n> ${installedCommand.Usage.substring(firstNewlineOfUsage + 1)}`

  // markdown-formatted summary
  const summary = `## Description\n\n${installedCommand.Description}\n\n## Usage\n\n\`\`\`\n${usageLine1}\n\`\`\`\n${usageRest}`

  return {
    apiVersion,
    kind: 'Command',
    isSimulacrum: true,
    metadata: {
      name: whichCommand,
      namespace: whichNamespace
    },
    prettyName: `ibmcloud${installedCommand.Namespace ? ' ' + installedCommand.Namespace : ''} ${
      installedCommand.Name
    }`,
    toolbarText: {
      type: 'info',
      text: strings('This command is part of the plugin', installedEntry.Name)
    },
    modes: [],
    content: installedEntry,
    spec: {
      usage: installedCommand.Usage
    },
    summary: {
      content: summary,
      contentType: 'text/markdown'
    }
  }
}

export default (registrar: Registrar) => {
  registrar.listen(`/${commandPrefix}/ibmcloud/plugin/command/get`, doGet, opts)
}
