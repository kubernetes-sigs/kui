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
import { Arguments, DescriptionList, Registrar, MultiModalResponse, i18n } from '@kui-shell/core'
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
  response: string
): Promise<MultiModalResponse> => {
  // start fetching the associated resources
  const resourcesP = args.REPL.qexec<string>(withKubeconfigFrom(args, `helm get manifest ${name}`, 'kube-context'))
  const valuesP = args.REPL.qexec<string>(withKubeconfigFrom(args, `helm get values ${name}`, 'kube-context'))

  const [headerString] = response.split(/RESOURCES:|(?=NOTES:)/)

  const namespaceMatch = response.match(/^NAMESPACE:\s+(.*)$/m) || []
  const namespaceFromHelmStatusOutput = namespaceMatch[1]
  debug('namespace', namespaceFromHelmStatusOutput)

  const revisionMatch = response.match(/^REVISION:\s+(.*)$/m) || []
  const revisionFromHelmStatusOutput = revisionMatch[1]
  debug('revision', revisionFromHelmStatusOutput)

  // -l app.kubernetes.io/managed-by: Helm
  // meta.helm.sh/release-name: ray-myapp-7820e072-7e3e-4b46-829e-28a4a28a7457

  // Status description list
  const statusMatch = headerString.match(/LAST DEPLOYED: (.*)\nNAMESPACE: (.*)\nSTATUS: (.*)/)
  const statusDL: DescriptionList = {
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
  const status = {
    mode: 'Status',
    content: statusDL
  }

  const resources = {
    mode: 'Managed Resources',
    contentType: 'yaml',
    content: (await resourcesP).replace(/^\s*---\s+/, '')
  }

  const values = {
    mode: 'Values',
    contentType: 'yaml',
    content: (await valuesP).replace(/^\s*USER-SUPPLIED VALUES:\s+/, '')
  }

  const drilldown = {
    mode: 'Show Managed Resources',
    kind: 'drilldown' as const,
    showRelatedResource: true,
    command: withKubeconfigFrom(
      args,
      `kubectl get all -l app.kubernetes.io/managed-by=Helm,app.kubernetes.io/name=${name}`
    )
  }

  const mmr: MultiModalResponse = {
    apiVersion: 'kui-shell/v1',
    kind: 'HelmChart',
    metadata: {
      name
    },
    onclick: {
      kind: withKubeconfigFrom(args, 'helm ls', 'kube-context'),
      name: withKubeconfigFrom(args, `helm ls ${name}`, 'kube-context')
    },
    buttons: [drilldown],
    modes: [status, resources, values]
  }

  return mmr
}

async function doStatus(args: Arguments<KubeOptions>) {
  if (isUsage(args, 'status')) {
    return doHelp('helm', args)
  }

  const name = args.argvNoOptions[args.argvNoOptions.indexOf('status') + 1]
  const response = await doExecWithStdout(args)

  try {
    return format(name, args, response)
  } catch (err) {
    console.error('error formatting status', err)
    return response
  }
}

export default (registrar: Registrar) => {
  registrar.listen('/helm/status', doStatus)
}
