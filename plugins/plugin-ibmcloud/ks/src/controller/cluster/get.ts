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
import { KubeOptions } from '@kui-shell/plugin-kubectl'
import { Arguments, Registrar, MultiModalResponse, i18n } from '@kui-shell/core'

import opts from '../opts'
import apiVersion from '../apiVersion'
import doJSONWithStdout from '../exec'
import commandPrefix from '../command-prefix'
import { hasAvailableUpdates, IBMCloudClusterRaw, IBMCloudCluster } from '../../models/cluster'

const strings = i18n('plugin-ibmcloud/ks')

function prettyPrintDuration(delta: number): string {
  return prettyMilliseconds(delta, { compact: true })
}
function workerSummary(content: IBMCloudClusterRaw): string {
  const nWorkers = content.workerCount
  const nZones = content.workerZones.length

  if (nWorkers === 1 && nZones === 1) {
    return strings('one worker in zone', ...content.workerZones, content.location)
  } else if (nWorkers === 1) {
    return strings('one worker in zonez', ...content.workerZones, content.location)
  } else if (nZones === 1) {
    return strings('N workers in zone', content.workerCount, ...content.workerZones, content.location)
  } else {
    return strings('N workers in zones', content.workerCount, ...content.workerZones, content.location)
  }
}

/**
 * `ibmcloud ks cluster get`
 *
 */
async function doGet(args: Arguments<KubeOptions>): Promise<MultiModalResponse<IBMCloudCluster>> {
  const { safeDump } = await import('js-yaml')
  const content: IBMCloudClusterRaw = JSON.parse(await doJSONWithStdout(args))

  const toolbarText = hasAvailableUpdates(content)
    ? {
        type: 'warning' as const,
        text: strings('An update is available for the cluster')
      }
    : undefined

  const updateSummary = hasAvailableUpdates(content)
    ? {
        'Available Update': `${content.masterKubeVersion} \u2192 ${content.targetVersion}`
      }
    : {}

  return {
    apiVersion,
    kind: 'Cluster',
    metadata: {
      name: content.name,
      namespace: content.resourceGroupName,
      creationTimestamp: content.createdDate
    },
    nameHash: content.id,
    toolbarText,
    data: safeDump(content),
    version: content.masterKubeVersion,
    modes: [],
    content,
    isSimulacrum: true,
    summary: {
      content: safeDump(
        Object.assign(
          {
            Age: prettyPrintDuration(new Date().getTime() - new Date(content.createdDate).getTime()),
            'Last Modified': strings(
              'ago',
              prettyPrintDuration(new Date().getTime() - new Date(content.modifiedDate).getTime())
            ),
            Workers: workerSummary(content),
            'Ingress Hostname': content.ingressHostname
          },
          updateSummary
        )
      ),
      contentType: 'yaml'
    }
  }
}

export default (registrar: Registrar) => {
  registrar.listen(`/${commandPrefix}/ibmcloud/ks/cluster/get`, doGet, opts)
}
