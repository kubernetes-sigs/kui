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

import { Commands } from '@kui-shell/core'

// const getSources = `oc get opsrc -o json --all-namespaces ${parsedOptions.config ? `--config ${parsedOptions.config}` : ''}`

const config = [
  {
    name: '--config',
    docs: 'An OpenShift config file',
    file: true
  }
]

const catalog = {
  command: 'catalog',
  strict: 'catalog',
  docs: 'List available operators',
  optional: config
}

const installed = {
  command: 'installed',
  strict: 'installed',
  docs: 'List installed operators',
  optional: config
}

export default async (commandTree: Commands.Registrar) => {
  commandTree.subtree('/olm', {
    usage: {
      command: 'olm',
      commandPrefix: 'olm',
      available: [catalog, installed]
    }
  })

  commandTree.listen(
    '/olm/catalog',
    async ({ block, parsedOptions, execOptions, REPL }) => {
      const namespace = parsedOptions.n || parsedOptions.namespace
      const getSources = `oc get OperatorSources ${
        namespace ? `-n ${namespace}` : '--all-namespaces'
      } -o=custom-columns=NAME:.metadata.name,PACKAGES:.status.packages ${
        parsedOptions.config ? `--config ${parsedOptions.config}` : ''
      }`

      return REPL.qexec(getSources, block, undefined, execOptions)
    },
    {
      noAuthOk: true,
      usage: catalog
    }
  )

  commandTree.listen(
    '/olm/installed',
    async ({ block, parsedOptions, execOptions, REPL }) => {
      const namespace = parsedOptions.n || parsedOptions.namespace
      const getSources = `oc get ClusterServiceVersions -n ${namespace || 'default'} ${
        parsedOptions.config ? `--config ${parsedOptions.config}` : ''
      } -o=custom-columns=NAME:.metadata.name,DISPLAY:.spec.displayName,VERSION:.spec.version,STATUS:.status.phase`

      return REPL.qexec(getSources, block, undefined, execOptions)
    },
    {
      noAuthOk: true,
      usage: installed
    }
  )
}
