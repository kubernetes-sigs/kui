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

import Debug from 'debug'
import { isTable, Arguments, Registrar, Tab, Table, Row, Cell, ExecType } from '@kui-shell/core'

import flags from './flags'
import { getCurrentContext } from './contexts'
import commandPrefix from '../command-prefix'
import { doGet, doGetAsTable, rawGet } from './get'
import { KubeOptions, isTableRequest, isWatchRequest } from './options'

const debug = Debug('plugin-kubectl/controller/kubectl/get/namespace')

/**
 * Special table for namespaces
 *
 */
async function doGetNamespaceTable(command: string, args: Arguments<KubeOptions>) {
  const [
    baseTable,
    {
      metadata: { namespace: currentNamespace }
    }
  ] = await Promise.all([doGetAsTable(command, args, await rawGet(args)), getCurrentContext(args.tab)])

  // user asked for a table, and *did not* ask for a watchable table?
  // then decorate the table as a row-selectable table
  if (isTable(baseTable)) {
    const augmentedTable = Object.assign({}, baseTable, {
      title: 'Namespaces',
      header: {
        name: '',
        css: baseTable.header.css,
        outerCSS: `${baseTable.header.outerCSS} not-a-name`,
        attributes: [
          {
            key: baseTable.header.key,
            value: baseTable.header.name,
            css: baseTable.header.css,
            outerCSS: baseTable.header.outerCSS
          } as Cell
        ].concat(baseTable.header.attributes)
      },
      body: baseTable.body.map(row => {
        const ns = row.name
        const isSelected = ns === currentNamespace
        const nameAttr: Cell = {
          key: 'NAME',
          value: ns,
          outerCSS: 'entity-name-group',
          css: 'entity-name',
          onclick: `${command} get ns ${ns} -o yaml`
        }

        const newRow: Row = {
          key: 'NAME',
          css: 'selected-entity',
          name: isSelected ? '*' : '',
          fontawesome: 'fas fa-check',
          attributes: [nameAttr].concat(row.attributes),
          outerCSS: 'not-a-name',
          rowCSS: isSelected ? 'selected-row' : ''
        }

        newRow.onclick = () => {
          args.REPL.pexec(`namespace switch ns ${ns}`)
        }

        return newRow
      })
    })

    // place current namespace at the top of the top (even above default)
    const selectedIdx = baseTable.body.findIndex(row => row.name === currentNamespace)
    if (selectedIdx >= 0) {
      const selectedRow = augmentedTable.body[selectedIdx]
      augmentedTable.body[selectedIdx] = augmentedTable.body[0]
      augmentedTable.body[0] = selectedRow
    }

    // place default at the top of the table
    const rowIdxForDefaultNS = baseTable.body.findIndex(_ => _.name === 'default')
    if (rowIdxForDefaultNS !== 1 && rowIdxForDefaultNS !== selectedIdx && baseTable.body.length > 2) {
      const swapRow = augmentedTable.body[1]
      augmentedTable.body[1] = augmentedTable.body[rowIdxForDefaultNS]
      augmentedTable.body[rowIdxForDefaultNS] = swapRow
    }

    return augmentedTable
  } else {
    return baseTable
  }
}

/**
 * Small wrapper to determine whether to use our special namespace
 * table, or the default get impl.
 *
 */
const doGetNamespace = (command: string) => (args: Arguments<KubeOptions>) => {
  if (isTableRequest(args) && !isWatchRequest(args) && args.execOptions.type !== ExecType.Nested) {
    return doGetNamespaceTable(command, args)
  } else {
    return doGet(command)(args)
  }
}

/**
 * Summarize the resources in the namespace indicated by the last
 * positional argument into a table, where resources are histogrammed
 * by kind.
 *
 */
export async function doSummarizeNamedNamespace(tab: Tab, ns: string): Promise<Table> {
  // otherwise, summarize resource count by kind in a table
  const response = await tab.REPL.qexec<Table>(`kubectl get all -n ${ns} -o custom-columns=KIND:.kind`)

  const resources = response.body
  const histogram = resources.reduce((M, { name: kind }) => {
    M[kind] = (M[kind] || 0) + 1
    return M
  }, {} as Record<string, number>)

  const header = {
    name: 'KIND',
    attributes: [{ key: 'COUNT', value: 'COUNT' }]
  }

  const body = Object.keys(histogram).map(kind => ({
    name: kind,
    onclick: `kubectl get ${kind} -n ${ns}`,
    attributes: [
      {
        key: 'COUNT',
        value: histogram[kind].toLocaleString()
      }
    ]
  }))

  return {
    header,
    body
  }
}

/**
 * Summarize the resources in the namespace indicated by the last
 * positional argument into a table, where resources are histogrammed
 * by kind.
 *
 */
function doSummarizeNamespace(args: Arguments<KubeOptions>): Promise<Table> {
  // summarize this namespace
  const ns = args.argvNoOptions[args.argvNoOptions.length - 1]
  return doSummarizeNamedNamespace(args.tab, ns)
}

/**
 * Switch to the namespace indicated by the last positional argument,
 * then summarize the resources in that namespace in a table.
 *
 */
async function doSwitchNamespace(args: Arguments<KubeOptions>): Promise<true | Table> {
  // switch to this namespace
  const ns = args.argvNoOptions[args.argvNoOptions.length - 1]

  // this does the actual switch
  await args.REPL.qexec(`kubectl config set-context --current --namespace=${ns}`)

  let summarizeNamespaceOnSwitch = false
  try {
    summarizeNamespaceOnSwitch = require('@kui-shell/client/config.d/kubectl.json').summarizeNamespaceOnSwitch
  } catch (err) {
    debug('using default value for summarizeNamespaceOnSwitch', err)
  }

  if (!summarizeNamespaceOnSwitch) {
    // client config told us not to summarize namespace on switch
    return true
  }

  return doSummarizeNamespace(args)
}

/**
 * @return the currently active namespace in the currently selected context
 *
 */
async function doGetCurrentNamespace({ tab }: Arguments<KubeOptions>) {
  return (await getCurrentContext(tab)).metadata.namespace
}

export default (commandTree: Registrar) => {
  commandTree.listen(`/${commandPrefix}/kubectl/get/namespaces`, doGetNamespace('kubectl'), flags)
  commandTree.listen(`/${commandPrefix}/k/get/namespaces`, doGetNamespace('k'), flags)
  commandTree.listen(`/${commandPrefix}/kubectl/get/namespace`, doGetNamespace('kubectl'), flags)
  commandTree.listen(`/${commandPrefix}/k/get/namespace`, doGetNamespace('k'), flags)
  commandTree.listen(`/${commandPrefix}/kubectl/get/ns`, doGetNamespace('kubectl'), flags)
  commandTree.listen(`/${commandPrefix}/k/get/ns`, doGetNamespace('k'), flags)

  commandTree.listen(`/${commandPrefix}/namespace/current`, doGetCurrentNamespace, flags)
  commandTree.listen(`/${commandPrefix}/namespace/summarize`, doSummarizeNamespace, flags)
  commandTree.listen(`/${commandPrefix}/namespace/switch`, doSwitchNamespace, flags)
  commandTree.listen(`/${commandPrefix}/ns/switch`, doSwitchNamespace, flags)
}
