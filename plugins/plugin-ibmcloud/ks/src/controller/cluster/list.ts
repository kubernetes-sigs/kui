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
import { KubeOptions } from '@kui-shell/plugin-kubectl'

import opts from '../opts'
import doJSONWithStdout from '../exec'
import { capitalize, stateToCSS } from '../../views/css'
import commandPrefix from '../command-prefix'
import { IBMCloudClusterRaw } from '../../models/cluster'

/**
 * `ibmcloud ks cluster ls`
 *
 */
async function doLs(args: Arguments<KubeOptions>): Promise<Table> {
  const response: IBMCloudClusterRaw[] = JSON.parse(await doJSONWithStdout(args))

  const header = {
    name: 'NAME',
    attributes: [{ value: 'STATE' }, { value: 'VERSION', outerCSS: 'hide-with-sidecar' }, { value: 'LOCATION' }]
  }

  const body = response.map(_ => ({
    name: _.name,
    onclick: `ibmcloud ks cluster get ${args.REPL.encodeComponent(_.name)}`,
    onclickSilence: true,
    attributes: [
      { key: 'STATE', value: capitalize(_.state), tag: 'badge', css: stateToCSS[_.state] },
      { key: 'VERSION', value: _.masterKubeVersion, outerCSS: 'hide-with-sidecar' },
      { key: 'LOCATION', value: _.location }
    ]
  }))

  return {
    header,
    body
  }
}

/**
 * `ibmcloud ks cluster list`
 *
 */
function doList(args: Arguments<KubeOptions>): Promise<Table> {
  args.command = args.command.replace(/ibmcloud\s+ks\s+cluster(s?)\s+list/, 'ibmcloud ks cluster ls')

  const idx1 = args.argv.indexOf('ibmcloud')
  args.argv[idx1 + 3] = 'ls'

  const idx2 = args.argvNoOptions.indexOf('ibmcloud')
  args.argvNoOptions[idx2 + 3] = 'ls'

  return doLs(args)
}

export default (registrar: Registrar) => {
  const cmd = registrar.listen(`/${commandPrefix}/ibmcloud/ks/cluster/list`, doList, opts)
  registrar.synonym(`/${commandPrefix}/ibmcloud/ks/clusters/list`, doList, cmd, opts)
  registrar.synonym(`/${commandPrefix}/ibmcloud/ks/cluster/ls`, doLs, cmd, opts)
  registrar.synonym(`/${commandPrefix}/ibmcloud/ks/clusters/ls`, doLs, cmd, opts)
  registrar.listen(`/${commandPrefix}/ibmcloud/ks/clusters`, doLs, opts)
}
