/*
 * Copyright 2018-19 IBM Corporation
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

import {
  i18n,
  Tab,
  Table,
  Row,
  RawResponse,
  Arguments,
  ExecOptions,
  Registrar,
  UsageModel,
  KResponse
} from '@kui-shell/core'

import flags from './flags'
import apiVersion from './apiVersion'
import commandPrefix from '../command-prefix'
import { doExecWithTable } from './exec'
import { KubeContext } from '../../lib/model/resource'
import { isUsage, doHelp } from '../../lib/util/help'

const strings = i18n('plugin-kubectl')

const usage = {
  context: (command: string): UsageModel => ({
    command,
    strict: command,
    docs: 'Print your current kubernetes context',
    example: 'kubectl context'
  }),
  contexts: (command: string): UsageModel => ({
    command,
    strict: command,
    docs: 'List your available kubernetes contexts',
    example: 'kubectl contexts'
  })
}

/**
 * Add click handlers to change context
 *
 */
const addClickHandlers = (table: Table, { REPL }: Arguments, execOptions: ExecOptions): Table => {
  const body = table.body.map(row => {
    const nameAttr = row.attributes.find(({ key }) => key === 'NAME')
    const { value: contextName } = nameAttr

    nameAttr.outerCSS += ' entity-name-group-narrow'

    const onclick = async () => {
      await REPL.qexec(
        `kubectl config use-context ${REPL.encodeComponent(contextName)}`,
        undefined,
        undefined,
        Object.assign({}, execOptions, { raw: true })
      )
      row.setSelected()
    }

    row.name = contextName
    row.onclick = onclick
    nameAttr.onclick = onclick

    return row
  })

  return new Table({
    header: table.header,
    body: body,
    title: strings('contextsTableTitle')
  })
}

function valueOf(key: 'NAME' | 'NAMESPACE' | 'AUTHINFO' | 'CLUSTER', row: Row) {
  const cell = row.attributes.find(_ => _.key === key)
  return cell ? cell.value : ''
}

/**
 * @return a `KubeContext` representing the current context
 *
 */
export async function getCurrentContext(tab: Tab): Promise<KubeContext> {
  // fetch both the current context name, and the list of KubeContext objects */
  const [currentContextName, { content: contexts }] = await Promise.all([
    tab.REPL.qexec<string>(`context`),
    tab.REPL.rexec<KubeContext[]>(`contexts`)
  ])

  // the KubeContext object matching the current context name
  return contexts.find(_ => _.metadata.name === currentContextName)
}

/**
 * List contets command handler
 *
 */
const listContexts = async (args: Arguments): Promise<RawResponse<KubeContext[]> | Table> => {
  const execOptions = Object.assign({}, args.execOptions, { render: false })

  const contexts = await args.REPL.qexec<Table>(`kubectl config get-contexts`, undefined, undefined, execOptions)

  if (args.execOptions.raw) {
    return {
      mode: 'raw',
      content: contexts.body.map(_ => ({
        apiVersion,
        kind: 'Context',
        originatingCommand: args.command,
        isKubeResource: true,
        metadata: {
          name: valueOf('NAME', _),
          namespace: valueOf('NAMESPACE', _)
        },
        spec: {
          user: valueOf('AUTHINFO', _),
          cluster: valueOf('CLUSTER', _)
        }
      }))
    }
  } else {
    return addClickHandlers(contexts, args, execOptions)
  }
}

/**
 * Register the commands
 *
 */
export default (commandTree: Registrar) => {
  commandTree.listen(
    `/${commandPrefix}/kubectl/config/get-contexts`,
    (args: Arguments): Promise<KResponse> => (isUsage(args) ? doHelp('kubectl', args) : doExecWithTable(args)),
    flags
  )

  commandTree.listen(
    `/${commandPrefix}/context`,
    async ({ REPL }) => {
      return (await REPL.qexec<string>('kubectl config current-context')).trim()
    },
    Object.assign(
      {
        usage: usage.context('context')
      },
      flags
    )
  )

  commandTree.listen(
    `/${commandPrefix}/contexts`,
    listContexts,
    Object.assign(
      {
        usage: usage.contexts('contexts')
      },
      flags
    )
  )
}
