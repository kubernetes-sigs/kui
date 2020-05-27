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
import { doExecWithStdout } from './exec'
import commandPrefix from '../command-prefix'
import { isUsage, doHelp } from '../../lib/util/help'
import { KubeOptions, getNamespace, getNamespaceForArgv } from './options'
import { KubeResource, KubeItems, isKubeItems } from '../../lib/model/resource'

const strings = i18n('plugin-kubectl')
const strings2 = i18n('plugin-client-common', 'editor')

export function doEdit(cmd: string) {
  return async (args: Arguments<KubeOptions>) => {
    if (isUsage(args)) {
      // special case: get --help/-h
      return doHelp(cmd, args)
    }

    const idx = args.argvNoOptions.indexOf('edit')
    const kindForQuery = args.argvNoOptions[idx + 1] || ''
    const nameForQuery = args.argvNoOptions[idx + 2] || ''
    const ns = getNamespaceForArgv(args)

    const getCommand = `${cmd} get ${kindForQuery} ${nameForQuery} ${ns} -o yaml`
    const resource = await args.REPL.qexec<KubeResource | KubeItems>(getCommand)

    // isKubeItems: did the user ask to edit a collection of resources?
    const kind = isKubeItems(resource) ? resource.items[0].kind : resource.kind
    const metadata = isKubeItems(resource) ? resource.items[0].metadata : resource.metadata
    const name =
      !isKubeItems(resource) || resource.items.length === 1 ? metadata.name : strings('nItems', resource.items.length)
    const namespace = metadata.namespace

    return {
      apiVersion: 'kui-shell/v1',
      kind,
      metadata: {
        name,
        namespace
      },
      spec: {
        readOnly: false,
        clearable: false,
        save: {
          label: strings('Apply Changes'),
          onSave: async (data: string) => {
            const tmp = `/tmp/kui-${uuid()}`
            await args.REPL.rexec(`fwrite ${tmp}`, { data })

            const ns = getNamespace(args) || 'default'
            const argv = [cmd, 'apply', '-n', ns, '-f', tmp]
            const applyArgs = Object.assign({}, args, {
              command: argv.join(' '),
              argv,
              argvNoOptions: [cmd, 'apply'],
              parsedOptions: { n: ns, f: tmp }
            })

            // execute the apply command, making sure to report any
            // validation or parse errors to the user
            await doExecWithStdout(applyArgs, undefined, cmd).catch(err => {
              console.error('error in apply for edit', err)

              // was this a validation error?
              const msg = err.message.match(/ValidationError\(.*\): ([^]+) in/)
              if (msg && msg.length === 2) {
                throw new Error(msg[1])
              } else {
                // maybe this was a syntax error?
                const msg = err.message.match(/error parsing.*(line .*)/)
                if (msg && msg.length === 2) {
                  throw new Error(msg[1])
                } else {
                  // hmm, some other random error
                  throw new Error(err.message.replace(tmp, '').slice(0, 40))
                }
              }
            })

            return {
              type: 'success' as const,
              text: strings('Successfully Applied')
            }
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
        }
      ]
    }
  }
}

export default (commandTree: Registrar) => {
  commandTree.listen(`/${commandPrefix}/kubectl/edit`, doEdit('kubectl'), flags)
  commandTree.listen(`/${commandPrefix}/k/edit`, doEdit('kubectl'), flags)
}
