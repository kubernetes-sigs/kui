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
import WorkerPoolOptions from './options'
import apiVersion from '../apiVersion'
import doJSONWithStdout from '../exec'
import commandPrefix from '../command-prefix'
import { kind, IBMCloudWorkerPoolRaw, IBMCloudWorkerPool } from '../../models/worker-pool'

const strings = i18n('plugin-ibmcloud/ks')

/**
 * `ibmcloud ks worker get`
 *
 */
async function doGet(args: Arguments<WorkerPoolOptions>): Promise<MultiModalResponse<IBMCloudWorkerPool>> {
  const { safeDump } = await import('js-yaml')
  const content: IBMCloudWorkerPoolRaw = JSON.parse(await doJSONWithStdout(args))

  const toolbarText = {
    type: 'info' as const,
    text: strings('Using machine type', content.machineType)
  }

  return {
    apiVersion,
    kind,
    metadata: {
      name: content.name
    },
    spec: {
      cluster: args.parsedOptions.cluster
    },
    nameHash: content.id,
    toolbarText,
    data: safeDump(content),
    modes: [],
    content,
    isSimulacrum: true,
    summary: {
      content: safeDump({
        'Workers per Zone': content.sizePerZone,
        Labels: content.labels,
        Zones: content.zones.map(_ => _.id)
      }),
      contentType: 'yaml'
    }
  }
}

export default (registrar: Registrar) => {
  registrar.listen(`/${commandPrefix}/ibmcloud/ks/worker-pool/get`, doGet, opts)
}
