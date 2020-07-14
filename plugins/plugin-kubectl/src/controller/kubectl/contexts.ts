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
  REPL as REPLType,
  RadioTable,
  RadioTableRow,
  radioTableCellToString,
  radioTableAddHint,
  CellShould,
  Table,
  isTable,
  Row,
  RawResponse,
  Arguments,
  Registrar,
  UsageModel,
  KResponse
} from '@kui-shell/core'

import flags from './flags'
import apiVersion from './apiVersion'
import { t2rt } from './get-namespaces'
import { KubeOptions } from './options'
import { doExecWithTable } from './exec'
import commandPrefix from '../command-prefix'
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
    optional: [{ name: '-o', docs: 'Output format', allowed: ['wide'] }],
    example: 'kubectl contexts'
  })
}

/** Exclude the CURRENT column. */
function rtRowsFor(row: Row, wide: boolean): RadioTableRow {
  const rtRow = t2rt(row)
  rtRow.cells = rtRow.cells.slice(1)

  // hide the name column unless the user asked for -o wide
  if (!wide) {
    rtRow.cells = rtRow.cells.map(_ =>
      typeof _ === 'string'
        ? _
        : Object.assign(_, {
            value: _.value.replace(/^(.+)\/[a-z0-9]+$/, '$1').replace(/^IAM#(.*)\/.*$/, '$1'),
            title: _.value
          })
    )

    radioTableAddHint(rtRow, rtRow.nameIdx, [CellShould.BeHidden])
    rtRow.nameIdx = 1
  }

  return rtRow
}

/**
 * Add click handlers to change context
 *
 */
const asRadioTable = (args: Arguments, { header, body }: Table): RadioTable => {
  /* const header = t2rt(table.header)
  const body = table.body.map(row => {
    const nameAttr = row.attributes.find(({ key }) => key === 'NAME')
    const { value: contextName } = nameAttr

    return {
      nameIdx: 0,
      cells: [
        contextName,
        ...row.attributes.map(({ value, outerCSS, css }) => ({
          value,
          hints: hintsFor(outerCSS, css),
          onSelect: () => REPL.pexec(`kubectl config use-context ${REPL.encodeComponent(contextName)}`)
        }))
      ]
    }
  }) */

  // leftover from old model bad choices
  const defaultSelectedIdx = body.findIndex(_ => _.rowCSS[0] === 'selected-row')

  // did the user ask for a wide table (i.e. table without processing)?
  const wide = args.parsedOptions.o === 'wide'

  return {
    apiVersion: 'kui-shell/v1',
    kind: 'RadioTable',
    title: strings('contextsTableTitle'),
    defaultSelectedIdx,

    header: rtRowsFor(header, wide),
    body: body
      .map(row => rtRowsFor(row, wide))
      .map(rtRow =>
        Object.assign(rtRow, {
          onSelect: async () => {
            const context = radioTableCellToString(rtRow.cells[0], true) // true: use title if we have it
            await args.REPL.qexec(`kubectl config use-context ${context}`)
          }
        })
      )
  }
}

function valueOf(key: 'NAME' | 'NAMESPACE' | 'AUTHINFO' | 'CLUSTER', row: Row) {
  const cell = row.attributes.find(_ => _.key === key)
  return cell ? cell.value : ''
}

/**
 * @return a `KubeContext` representing the current context
 *
 */
export async function getCurrentContext({ REPL }: { REPL: REPLType }): Promise<KubeContext> {
  // fetch both the current context name, and the list of KubeContext objects */
  const [currentContextName, { content: contexts }] = await Promise.all([
    REPL.qexec<string>(`context`),
    REPL.rexec<KubeContext[]>(`contexts`)
  ])

  // the KubeContext object matching the current context name
  return contexts.find(_ => _.metadata.name === currentContextName)
}

export async function getCurrentContextName({ REPL }: { REPL: REPLType }) {
  const context = await REPL.qexec<string>('kubectl config current-context')
  return context ? context.trim() : context
}

/** Extract the namespace from the current context */
export async function getCurrentDefaultNamespace({ REPL }: { REPL: REPLType }) {
  const ns = await REPL.qexec<string>(`kubectl config view --minify --output "jsonpath={..namespace}"`).catch(err => {
    console.error('error determining default namespace', err)
    return 'default'
  })

  if (typeof ns !== 'string') {
    // e.g. microk8s
    return 'default'
  } else {
    return ns ? ns.trim() : ns
  }
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
    return contexts
  }
}

// addClickHandlers(contexts, args)
/** Table -> RadioTable view transformer */
function viewTransformer(args: Arguments<KubeOptions>, response: Table) {
  if (isTable(response)) {
    return asRadioTable(args, response)
  } else {
    return response
  }
}

/**
 * Command registration flags for commands that we want to present as
 * a RadioTable.
 *
 */
const rtFlags = Object.assign({}, flags, { viewTransformer })

/**
 * Register the commands
 *
 */
export default (commandTree: Registrar) => {
  commandTree.listen(
    `/${commandPrefix}/kubectl/config/get-contexts`,
    (args: Arguments): Promise<KResponse> => (isUsage(args) ? doHelp('kubectl', args) : doExecWithTable(args)),
    rtFlags
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
      rtFlags
    )
  )
}
