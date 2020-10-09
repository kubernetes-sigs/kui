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
async function doLs(args: Arguments<KubeOptions>): Promise<string | Table> {
  const raw = await doJSONWithStdout(args)
  try {
    const response: IBMCloudClusterRaw[] = JSON.parse(raw)

    const header = {
      name: 'Name',
      attributes: [{ value: 'State' }, { value: 'Version', outerCSS: 'hide-with-sidecar' }, { value: 'Location' }]
    }

    const body = response.map(_ => ({
      name: _.name,
      onclick: `ibmcloud ks cluster get ${args.REPL.encodeComponent(_.name)}`,
      attributes: [
        { key: 'State', value: capitalize(_.state), tag: 'badge', css: stateToCSS[_.state] },
        { key: 'Version', value: _.masterKubeVersion, outerCSS: 'hide-with-sidecar' },
        { key: 'Location', value: _.location }
      ]
    }))

    return {
      header,
      body
    }
  } catch (err) {
    console.error('error parsing output', err)
    return raw
  }
}

/**
 * `ibmcloud ks cluster list`
 *
 */
function doList(args: Arguments<KubeOptions>): Promise<string | Table> {
  args.command = args.command.replace(/ks\s+cluster(s?)\s+list/, 'ks cluster ls')

  const idx1 = args.argv.indexOf('cluster')
  args.argv[idx1 + 1] = 'ls'

  const idx2 = args.argvNoOptions.indexOf('cluster')
  args.argvNoOptions[idx2 + 1] = 'ls'

  return doLs(args)
}

export default (registrar: Registrar) => {
  const cmd = registrar.listen(`/${commandPrefix}/ibmcloud/ks/cluster/list`, doList, opts)
  registrar.synonym(`/${commandPrefix}/ibmcloud/ks/clusters/list`, doList, cmd, opts)
  registrar.synonym(`/${commandPrefix}/ibmcloud/ks/cluster/ls`, doLs, cmd, opts)
  registrar.synonym(`/${commandPrefix}/ibmcloud/ks/clusters/ls`, doLs, cmd, opts)
  registrar.listen(`/${commandPrefix}/ibmcloud/ks/clusters`, doLs, opts)
}
