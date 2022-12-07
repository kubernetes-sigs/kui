/*
 * Copyright 2018 The Kubernetes Authors
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
import { Arguments, DescriptionList, ExecOptions, Registrar, Menu, NavResponse, i18n } from '@kui-shell/core'
import { doHelp, withKubeconfigFrom, KubeOptions } from '@kui-shell/plugin-kubectl'

import isUsage from './usage'
import doExecWithStdout from './exec'

const strings = i18n('plugin-kubectl')
const strings2 = i18n('plugin-kubectl', 'helm')
const debug = Debug('plugin-kubectl/helm/controller/helm/status')

/**
 * Format the output of a helm status command
 *
 */
export const format = async (
  name: string,
  args: Arguments<KubeOptions>,
  response: string,
  execOptions: ExecOptions
): Promise<NavResponse> => {
  const command = 'kubectl'
  const verb = 'get'

  debug('nested?', execOptions.nested)
  debug('command', command)
  debug('verb', verb)

  const [headerString] = response.split(/RESOURCES:|(?=NOTES:)/)

  const namespaceMatch = response.match(/^NAMESPACE:\s+(.*)$/m) || []
  const namespaceFromHelmStatusOutput = namespaceMatch[1]
  debug('namespace', namespaceFromHelmStatusOutput)

  const revisionMatch = response.match(/^REVISION:\s+(.*)$/m) || []
  const revisionFromHelmStatusOutput = revisionMatch[1]
  debug('revision', revisionFromHelmStatusOutput)

  const statusMatch = headerString.match(/LAST DEPLOYED: (.*)\nNAMESPACE: (.*)\nSTATUS: (.*)/)
  const status: DescriptionList = {
    apiVersion: 'kui-shell/v1',
    kind: 'DescriptionList',
    spec: {
      groups: [
        { term: strings2('Last Deployed'), description: statusMatch[1] },
        { term: strings2('Revision'), description: revisionFromHelmStatusOutput },
        { term: strings('status'), description: statusMatch[3] }
      ]
    }
  }

  const summary = ''

  const notesMatch = response.match(/NOTES:\n([\s\S]+)?/)
  const notes = notesMatch && notesMatch[1]

  const overviewMenu: Menu = {
    label: 'Overview',
    items: []
  }

  overviewMenu.items.push({
    mode: 'status',
    label: strings('status'),
    content: status
  })

  if (summary) {
    overviewMenu.items.push({
      mode: 'summary',
      label: strings('summary'),
      content: summary,
      contentType: 'text/markdown'
    })
  }

  if (notes) {
    overviewMenu.items.push({
      mode: 'notes',
      label: strings2('Notes'),
      content: `\`\`\`${notes}\`\`\``,
      contentType: 'text/markdown'
    })
  }

  return {
    apiVersion: 'kui-shell/v1',
    kind: 'NavResponse',
    breadcrumbs: [
      { label: 'helm' },
      { label: 'release', command: withKubeconfigFrom(args, `helm ls`) },
      { label: name }
    ],
    menus: [overviewMenu]
  }
}

async function doStatus(args: Arguments<KubeOptions>) {
  if (isUsage(args, 'status')) {
    return doHelp('helm', args)
  }

  const name = args.argvNoOptions[args.argvNoOptions.indexOf('status') + 1]
  const response = await doExecWithStdout(args)

  try {
    return format(name, args, response, args.execOptions)
  } catch (err) {
    console.error('error formatting status', err)
    return response
  }
}

export default (registrar: Registrar) => {
  registrar.listen('/helm/status', doStatus)
}
