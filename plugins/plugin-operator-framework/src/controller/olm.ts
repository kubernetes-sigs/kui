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

import { qexec as $ } from '@kui-shell/core/core/repl'
import { getPreference, setPreference } from '@kui-shell/core/core/userdata'
import { CommandRegistrar, ParsedOptions } from '@kui-shell/core/models/command'

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

export default async (commandTree: CommandRegistrar) => {
  commandTree.subtree('/olm', {
    usage: {
      command: 'olm',
      commandPrefix: 'olm',
      available: [catalog, installed]
    }
  })

  // experiment: remember the last used --config, to avoid having to retype it
  const configKey = '/kui/plugin-operator-framework/olm/config'
  let rememberedConfig: string
  async function remember(parsedOptions: ParsedOptions) {
    if (parsedOptions.config) {
      rememberedConfig = parsedOptions.config
      setPreference(configKey, rememberedConfig)
    } else {
      if (!rememberedConfig) {
        rememberedConfig = await getPreference(configKey)
      }
      if (rememberedConfig) {
        parsedOptions.config = rememberedConfig
      }
    }
  }

  commandTree.listen(
    '/olm/catalog',
    async ({ block, parsedOptions, execOptions }) => {
      // await remember(parsedOptions)

      const namespace = parsedOptions.n || parsedOptions.namespace
      const getSources = `oc get OperatorSources ${
        namespace ? `-n ${namespace}` : '--all-namespaces'
      } -o=custom-columns=NAME:.metadata.name,PACKAGES:.status.packages ${
        parsedOptions.config ? `--config ${parsedOptions.config}` : ''
      }`

      return $(getSources, block, undefined, execOptions)
    },
    {
      noAuthOk: true,
      usage: catalog
    }
  )

  commandTree.listen(
    '/olm/installed',
    async ({ block, parsedOptions, execOptions }) => {
      // await remember(parsedOptions)

      const namespace = parsedOptions.n || parsedOptions.namespace
      const getSources = `oc get ClusterServiceVersions -n ${namespace || 'default'} ${
        parsedOptions.config ? `--config ${parsedOptions.config}` : ''
      } -o=custom-columns=NAME:.metadata.name,DISPLAY:.spec.displayName,VERSION:.spec.version,STATUS:.status.phase`

      return $(getSources, block, undefined, execOptions)
    },
    {
      noAuthOk: true,
      usage: installed
    }
  )
}
