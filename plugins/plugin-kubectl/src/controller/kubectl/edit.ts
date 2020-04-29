/*
 * Copyright 2020 IBM Corporation
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

import { v4 as uuid } from 'uuid'
import { Arguments, Registrar, i18n } from '@kui-shell/core'

import flags from './flags'
import commandPrefix from '../command-prefix'
import { KubeResource } from '../../lib/model/resource'
import { KubeOptions, getNamespaceForArgv } from './options'

const strings = i18n('plugin-kubectl')
const strings2 = i18n('plugin-client-common', 'editor')

export function doEdit(cmd: string) {
  return async (args: Arguments<KubeOptions>) => {
    const idx = args.argvNoOptions.indexOf('edit')
    const kind = args.argvNoOptions[idx + 1]
    const name = args.argvNoOptions[idx + 2]
    const ns = getNamespaceForArgv(args)

    const getCommand = `${cmd} get ${kind} ${name} ${ns} -o yaml`
    const resource = await args.REPL.qexec<KubeResource>(getCommand)

    return {
      apiVersion: 'kui-shell/v1',
      kind: resource.kind,
      metadata: resource.metadata,
      spec: {
        readOnly: false,
        clearable: false,
        save: {
          label: strings('Apply Changes'),
          onSave: async (data: string) => {
            const tmp = `/tmp/kui-${uuid()}`
            await args.REPL.rexec(`fwrite ${tmp}`, { data })
            await args.REPL.qexec(`${cmd} apply ${ns} -f ${tmp}`)
          }
        },
        revert: {
          onRevert: () => resource.kuiRawData
        }
      },
      modes: [
        {
          mode: 'edit',
          label: strings2('Edit'),
          contentType: 'yaml',
          content: resource.kuiRawData
        },
        {
          mode: 'cancel',
          label: strings2('Cancel'),
          order: 100,
          kind: 'drilldown' as const,
          command: getCommand
        }
      ]
    }
  }
}

export default (commandTree: Registrar) => {
  commandTree.listen(`/${commandPrefix}/kubectl/edit`, doEdit('kubectl'), flags)
  commandTree.listen(`/${commandPrefix}/k/edit`, doEdit('kubectl'), flags)
}
