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

import { Arguments, Registrar, Table } from '@kui-shell/core'

import opts from '../opts'
import WorkerOptions from './options'
import doJSONWithStdout from '../exec'
import { capitalize, stateToCSS } from '../../views/css'
import commandPrefix from '../command-prefix'
import { IBMCloudWorkerRaw } from '../../models/worker'

/**
 * `ibmcloud ks worker ls`
 *
 */
async function doLs(args: Arguments<WorkerOptions>): Promise<Table> {
  const response: IBMCloudWorkerRaw[] = JSON.parse(await doJSONWithStdout(args))

  if (response.length === 0) {
    return {
      body: []
    }
  }

  const body = response.map(_ => ({
    name: _.id,
    onclick: `ibmcloud ks worker get ${args.REPL.encodeComponent(_.id)} --cluster ${args.parsedOptions.cluster}`,
    onclickSilence: true,
    attributes: [
      { key: 'STATE', value: capitalize(_.state.toString()), tag: 'badge', css: stateToCSS[_.state] },
      { key: 'STATUS', value: capitalize(_.status.toString()) },
      { key: 'PUBLIC IP', value: _.publicIP, outerCSS: 'hide-with-sidecar' },
      // { key: 'PRIVATE IP', value: _.privateIP, outerCSS: 'hide-with-sidecar' },
      { key: 'FLAVOR', value: _.machineType, outerCSS: 'hide-with-sidecar' },
      // { key: 'ZONE', value: _.location, outerCSS: 'hide-with-sidecar' },
      // { key: 'VERSION', value: _.kubeVersion, outerCSS: 'hide-with-sidecar' },
      { key: 'MESSAGE', value: _.statusDetails, outerCSS: 'hide-with-sidecar' }
    ]
  }))

  const header = {
    name: 'NAME',
    attributes: body[0].attributes.map(_ => ({ value: _.key, outerCSS: _.outerCSS }))
  }

  return {
    header,
    body
  }
}

/**
 * `ibmcloud ks worker list`
 *
 */
function doList(args: Arguments<WorkerOptions>): Promise<Table> {
  args.command = args.command.replace(/ibmcloud\s+ks\s+worker\s+list/, 'ibmcloud ks worker ls')

  const idx1 = args.argv.indexOf('ibmcloud')
  args.argv[idx1 + 3] = 'ls'

  const idx2 = args.argvNoOptions.indexOf('ibmcloud')
  args.argvNoOptions[idx2 + 3] = 'ls'

  return doLs(args)
}

export default (registrar: Registrar) => {
  const cmd = registrar.listen(`/${commandPrefix}/ibmcloud/ks/worker/list`, doList, opts)
  registrar.synonym(`/${commandPrefix}/ibmcloud/ks/workers/list`, doList, cmd, opts)
  registrar.synonym(`/${commandPrefix}/ibmcloud/ks/worker/ls`, doLs, cmd, opts)
  registrar.synonym(`/${commandPrefix}/ibmcloud/ks/workers/ls`, doLs, cmd, opts)
  registrar.listen(`/${commandPrefix}/ibmcloud/ks/workers`, doLs, opts)
}
