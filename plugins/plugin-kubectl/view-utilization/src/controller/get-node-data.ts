/*
 * Copyright 2019 The Kubernetes Authors
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

import { Arguments, Table, Row, RawResponse, i18n } from '@kui-shell/core'
import { KubeOptions, Parser } from '@kui-shell/plugin-kubectl'

import slash from '../view/slash'
import { BarColor, singletonBar as bar } from '../view/bar'

const strings = i18n('plugin-kubectl', 'view-utilization-table')

//
// For a primer on terminology, look at the README.md for this plugin.
//

function parse(data: string, nodeLabel: string, context: string): Table {
  const header = {
    name: 'Node',
    attributes: [{ value: 'CPU' }, { value: 'Memory' }]
  }

  const body = data.split(/\n/).map(line => {
    const [name, cpuAllocatable, memoryAllocatable, cpuCapacity, memoryCapacity] = line.split(/\t/)

    const row: Row = {
      name,
      onclick: `kubectl get node ${name} -o yaml ${context} ${nodeLabel}`,
      attributes: [
        { key: 'cpuAllocatable', value: cpuAllocatable },
        { key: 'memoryAllocatable', value: memoryAllocatable },
        { key: 'cpuCapacity', value: cpuCapacity },
        { key: 'memoryCapacity', value: memoryCapacity }
      ]
    }

    return row
  })

  return {
    title: 'Nodes',
    header,
    body
  }
}

export async function getNodeData(args: Arguments<KubeOptions>, onlySchedulable = false, forNode = ''): Promise<Table> {
  const { parsedOptions: options, REPL } = args

  const nodeOption = options.l || options.selector || options.label
  const nodeLabel = nodeOption ? `-l ${nodeOption}` : ''

  const context = options.context ? `--context ${options.context}` : ''

  //
  // for each node, the following jsonpath emits a table, where rows
  // are newline-separated, and columns are tab-separated; the columns
  // are:
  //
  // 1) nodeName
  // 2) status.allocatable.cpu
  // 3) status.allocatable.memory
  //

  const TAB = `{'\\\\t'}`
  const NEWLINE = `{'\\\\n'}`
  const namePart = '{range .items[*]}{.metadata.name}'
  const cpuAllocatablePart = `{.status.allocatable.cpu}`
  const memoryAllocatablePart = `{.status.allocatable.memory}`
  const cpuCapacityPart = `{.status.capacity.cpu}`
  const memoryCapacityPart = `{.status.capacity.memory}`

  const filter =
    (onlySchedulable ? '--field-selector=spec.unschedulable=false' : '') +
    (forNode ? (onlySchedulable ? '' : '--field-selector' + `=metadata.name=${forNode}`) : '')

  const cmd = `kubectl ${context} get nodes ${nodeLabel} ${filter} -o=jsonpath=${namePart}${TAB}${cpuAllocatablePart}${TAB}${memoryAllocatablePart}${TAB}${cpuCapacityPart}${TAB}${memoryCapacityPart}${NEWLINE}{end}`

  return parse(await REPL.qexec<string>(cmd), nodeLabel, context)
}

interface Overheads {
  cpuOverhead: number
  memOverhead: number
  cpuCapacity: number
  memCapacity: number
}
export async function getSystemOverhead(
  args: Arguments<KubeOptions>,
  forNode: string,
  onlySchedulable = false
): Promise<Overheads> {
  const detail = await getNodeData(args, onlySchedulable, forNode)

  const cpuOverhead = detail.body.reduce((total, row) => {
    return total + Parser.cpuShare(row.attributes[2].value) - Parser.cpuShare(row.attributes[0].value)
  }, 0)
  const cpuCapacity = detail.body.reduce((total, row) => {
    return total + Parser.cpuShare(row.attributes[2].value)
  }, 0)

  const memOverhead = detail.body.reduce((total, row) => {
    return total + Parser.memShare(row.attributes[3].value) - Parser.memShare(row.attributes[1].value)
  }, 0)
  const memCapacity = detail.body.reduce((total, row) => {
    return total + Parser.memShare(row.attributes[3].value)
  }, 0)

  return { cpuOverhead, memOverhead, cpuCapacity, memCapacity }
}

/**
 * Allows for `kubectl top node --summary`
 *
 */
export interface NodeOptions extends KubeOptions {
  summary?: boolean
}

/**
 * Summary of resource consumption, averaged across nodes.
 *
 */
export interface NodeSummary {
  cpuFrac: number
  memFrac: number
}

export function strip(args: Arguments, flag: string, nargs = 0) {
  if (nargs === 0) {
    args.command = args.command.replace(flag, '')
  } else {
    args.command = args.command.replace(new RegExp(`${flag}\\s+\\S+`), '')
  }

  args.argv.splice(args.argv.indexOf(flag), nargs + 1)
}

/**
 * Special case of `kubectl top node --summary`, where the caller
 * needs only the fractional consumption, averaged across nodes.
 *
 */
async function summary(
  args: Arguments<NodeOptions>,
  top: (args: Arguments<KubeOptions>) => Promise<Table>
): Promise<RawResponse<NodeSummary>> {
  // strip off the --summary bits, and then pass the command to the
  // underlying top impl
  strip(args, '--summary')

  // call the underlying top impl that we are overriding
  const nodeTable = await top(args)

  // extract the summary statistics
  const cpuFrac =
    nodeTable.body.reduce((total, row) => total + Parser.cpuFraction(row.attributes[1].value), 0) /
    nodeTable.body.length /
    100
  const memFrac =
    nodeTable.body.reduce((total, row) => total + Parser.cpuFraction(row.attributes[3].value), 0) /
    nodeTable.body.length /
    100

  // return as a RawResponse
  return { mode: 'raw', content: { cpuFrac, memFrac } }
}

/**
 * Command handler for `kubectl top node` (overrides built-in functionality)
 *
 */
export async function topNode(
  args: Arguments<NodeOptions>,
  top: (args: Arguments<KubeOptions>) => Promise<Table>
): Promise<RawResponse<NodeSummary> | Table> {
  // special case for callers that need only fractional consumption,
  // averaged across nodes
  if (args.parsedOptions.summary) {
    return summary(args, top)
  }

  const [nodeTable, detailTable] = await Promise.all([top(args), getNodeData(args, true)])

  nodeTable.header.attributes.push({
    outerCSS: 'hide-with-sidecar not-displayed',
    key: 'Allocatable CPU',
    value: strings('Allocatable CPU')
  })
  nodeTable.header.attributes.push({
    outerCSS: 'hide-with-sidecar not-displayed',
    key: 'Allocatable Memory',
    value: strings('Allocatable Memory')
  })

  // hide-with-sidecar the memory and cpu columns
  const cpuIdx = nodeTable.header.attributes.findIndex(_ => _.key === 'CPU(cores)')
  if (cpuIdx >= 0) {
    nodeTable.header.attributes[cpuIdx].outerCSS = `${
      nodeTable.header.attributes[cpuIdx].outerCSS || ''
    } hide-with-sidecar`
  }
  const memIdx = nodeTable.header.attributes.findIndex(_ => _.key === 'MEMORY(bytes)')
  if (memIdx >= 0) {
    nodeTable.header.attributes[memIdx].outerCSS = `${
      nodeTable.header.attributes[memIdx].outerCSS || ''
    } hide-with-sidecar`
  }

  // don't hide-with-sidecar the mem% column
  const memPercentIdx = nodeTable.header.attributes.findIndex(_ => _.key === 'MEMORY%')
  nodeTable.header.attributes[memPercentIdx].outerCSS = nodeTable.header.attributes[memPercentIdx].outerCSS.replace(
    /hide-with-sidecar/,
    ''
  )

  nodeTable.body.forEach(row => {
    row.onclick = `kubectl top pod --node ${args.REPL.encodeComponent(row.name)}`

    const cpuAttr = row.attributes.find(_ => _.key === 'CPU(cores)')
    if (cpuAttr) {
      cpuAttr.outerCSS = `${cpuAttr.outerCSS || ''} hide-with-sidecar`
    }

    const cpuPercentAttr = row.attributes.find(_ => _.key === 'CPU%')
    if (cpuPercentAttr) {
      cpuPercentAttr.valueDom = bar({ color: BarColor.CPU, fractionString: cpuPercentAttr.value, text: true })
    }

    const memoryPercentAttr = row.attributes.find(_ => _.key === 'MEMORY%')
    if (memoryPercentAttr) {
      memoryPercentAttr.valueDom = bar({ color: BarColor.Memory, fractionString: memoryPercentAttr.value, text: true })
    }

    const allocatableInfo = detailTable.body.find(_ => _.name === row.name)
    if (allocatableInfo) {
      row.attributes[0].valueDom = slash(row.attributes[0].value, allocatableInfo.attributes[2].value)
      row.attributes[2].valueDom = slash(
        row.attributes[2].value,
        Parser.formatAsBytes(Parser.memShare(allocatableInfo.attributes[3].value))
      )

      // don't hide-with-sidecar the mem% column
      row.attributes[3].outerCSS = row.attributes[2].outerCSS.replace(/hide-with-sidecar/, '')

      row.attributes.push({
        outerCSS: 'not-displayed',
        key: 'Allocatable CPU',
        value: allocatableInfo === undefined ? '&emdash;' : allocatableInfo.attributes[2].value
      })
      row.attributes.push({
        outerCSS: 'not-displayed',
        key: 'Allocatable Memory',
        value:
          allocatableInfo === undefined
            ? '&emdash;'
            : Parser.formatAsBytes(Parser.memShare(allocatableInfo.attributes[3].value))
      })
    }
  })

  // if we have more than one node, then add a total row
  /* if (nodeTable.body.length > 1) {
    const totalRow = JSON.parse(JSON.stringify(nodeTable.body[0]))
    totalRow.name = strings('Total')

    const cpuTotal = nodeTable.body.reduce((total, row) => total + Parser.cpuShare(row.attributes[0].value), 0)
    const cpuFrac = nodeTable.body.reduce((total, row) => total + Parser.cpuFraction(row.attributes[1].value), 0)
    const memTotal = nodeTable.body.reduce((total, row) => total + Parser.memShare(row.attributes[2].value), 0)
    const memFrac = nodeTable.body.reduce((total, row) => total + Parser.cpuFraction(row.attributes[3].value), 0)
    const cpuAllocTotal = nodeTable.body.reduce((total, row) => total + Parser.cpuShare(row.attributes[4].value), 0)
    const memAllocTotal = nodeTable.body.reduce((total, row) => total + Parser.memShare(row.attributes[5].value), 0)

    totalRow.onclick = false
    totalRow.attributes[0].value = formatAsCpu(cpuTotal)
    totalRow.attributes[1].value = cpuFrac / nodeTable.body.length + '%'
    totalRow.attributes[1].valueDom = bar({ color: BarColor.CPU, fractionString: totalRow.attributes[1].value })
    totalRow.attributes[2].value = formatAsBytes(memTotal)
    totalRow.attributes[3].value = memFrac / nodeTable.body.length + '%'
    totalRow.attributes[3].valueDom = bar({ color: BarColor.Memory, fractionString: totalRow.attributes[3].value })
    totalRow.attributes[4].value = formatAsCpu(cpuAllocTotal)
    totalRow.attributes[5].value = formatAsBytes(memAllocTotal)
    totalRow.attributes[0].valueDom = slash(totalRow.attributes[0].value, totalRow.attributes[4].value)
    totalRow.attributes[2].valueDom = slash(totalRow.attributes[2].value, totalRow.attributes[5].value)

    if (args.parsedOptions.nodes === false) {
      return {
        header: nodeTable.header,
        body: [totalRow]
      }
    } else {
      // lighten up the node rows
      totalRow.rowCSS = 'semi-bold'
      nodeTable.body.forEach(row => {
        row.rowCSS = 'lighter-text'
        row.attributes.forEach(cell => {
          cell.css = (cell.css || '') + 'even-lighter-text'
        })
      })

      nodeTable.body.push(totalRow)
    }
  } */

  return nodeTable
}
