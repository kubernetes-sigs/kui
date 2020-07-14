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

import { Arguments, Registrar, MultiModalResponse, i18n } from '@kui-shell/core'

import opts from '../opts'
import WorkerOptions from './options'
import apiVersion from '../apiVersion'
import doJSONWithStdout from '../exec'
import commandPrefix from '../command-prefix'
import { hasAvailableUpdates, IBMCloudWorkerRaw, IBMCloudWorker } from '../../models/worker'

const strings = i18n('plugin-ibmcloud/ks')

/**
 * id is like kube-dal13-crf3ec154925a041f39389f895a203c513-w1
 * and capture the hash and the "w1" suffix
 *
 */
const idPattern = /[^-]+-[^-]+-([^-]+)-([^-]+)/

/**
 * Split a worker id into a `{ name, nameHash }` pair.
 *
 */
function parseWorkerName(id: string): { name: string; nameHash: string } {
  const [, nameHash, name] = id.match(idPattern)
  return { name, nameHash }
}

/**
 * `ibmcloud ks worker get`
 *
 */
async function doGet(args: Arguments<WorkerOptions>): Promise<MultiModalResponse<IBMCloudWorker>> {
  const { safeDump } = await import('js-yaml')
  const raw: IBMCloudWorkerRaw = JSON.parse(await doJSONWithStdout(args))

  const toolbarText = hasAvailableUpdates(raw)
    ? {
        type: 'warning' as const,
        text: strings('An update is available for this worker')
      }
    : undefined

  const updateSummary = hasAvailableUpdates(raw)
    ? {
        'Available Update': `${raw.kubeVersion} \u2192 ${raw.targetVersion}`
      }
    : {}

  const { name, nameHash } = parseWorkerName(raw.id)

  return {
    apiVersion,
    kind: 'Worker',
    metadata: {
      name: raw.id,
      namespace: raw.poolName
    },
    spec: {
      cluster: args.parsedOptions.cluster
    },
    prettyName: name,
    nameHash,
    toolbarText,
    kuiRawData: safeDump(raw),
    version: raw.kubeVersion,
    modes: [],
    raw,
    isSimulacrum: true,
    summary: {
      content: safeDump(
        Object.assign(
          {
            'Public IP': raw.publicIP,
            'Private IP': raw.privateIP
          },
          updateSummary
        )
      ),
      contentType: 'yaml'
    }
  }
}

export default (registrar: Registrar) => {
  registrar.listen(`/${commandPrefix}/ibmcloud/ks/worker/get`, doGet, opts)
}
