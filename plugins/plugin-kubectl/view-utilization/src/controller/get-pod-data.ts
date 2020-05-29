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

import { Arguments, Table, i18n, isTable } from '@kui-shell/core'
import {
  KubeItems,
  KubeOptions,
  Pod,
  getNamespace,
  getLabelForArgv,
  isForAllNamespaces
} from '@kui-shell/plugin-kubectl'

import { strip, getSystemOverhead } from './get-node-data'
import { formatAsBytes, formatAsCpu, cpuShare, memShare } from '../lib/parse'
// import { parseAsTime, parseAsSize } from '../lib/parse'

const strings = i18n('plugin-kubectl', 'view-utilization-table')

/**
 *
 */
/* function parse(data: string, raw = false): Table {
  const header = {
    name: 'Container',
    attributes: [
      { value: 'Pod' },
      { value: 'Namespace' },
      { value: 'Node IP' },
      { value: 'CPU Requests' },
      { value: 'Memory Requests' },
      { value: 'CPU Limits' },
      { value: 'Memory Limits' }
    ]
  }

  const body = data.split(/\n/).map(line => {
    const [name, ns, container, ip, cpuRequests, memoryRequests, cpuLimits, memoryLimits] = line.split(/\t/)

    const row: Row = {
      type: 'pod',
      name: container,
      attributes: [
        { key: 'Pod', value: name },
        { key: 'Namespace', value: ns },
        { key: 'Node IP', value: ip },
        { key: 'cpu requests', value: raw ? cpuRequests : parseAsTime(cpuRequests) },
        { key: 'memory requests', value: raw ? memoryRequests : parseAsSize(memoryRequests) },
        { key: 'cpu limits', value: raw ? cpuLimits : parseAsTime(cpuLimits) },
        { key: 'memory limits', value: raw ? memoryLimits : parseAsSize(memoryLimits) }
      ]
    }

    return row
  })

  return {
    title: 'Pods',
    header,
    body
  }
} */

/* async function getNodeData(args: Arguments, raw = false): Promise<Table> {
  const { parsedOptions: options, REPL } = args

  const namespaceOption = options.n || options.namespace
  const namespace = namespaceOption ? `--namespace=${namespaceOption}` : '--all-namespaces'

  const context = options.context ? `--context=${options.context}` : ''

  //
  // for each container, the following go-template emits a table,
  // where rows are newline-separated, and columns are tab-separated;
  // the columns are:
  //
  // 1) containerName
  // 2) namespace
  // 3) podName
  // 4) nodeName
  // 5) resources.requests.cpu || namespaceDefault || 50m
  // 6) resources.requests.memory || namespaceDefault || 50Mi
  // 7) resources.limits.cpu || namespaceDefault || 100m
  // 8) resources.limits.memory || namespaceDefault || 100Mi
  //

  const defaultCpuReq = '1m'
  const defaultCpuLim = '10m'
  const defaultMemReq = '10Mi'
  const defaultMemLim = '50Mi'

  // TODO get namespace defaults

  const template = `{{range.items}}{{$podName:=.metadata.name}}{{$namespace:=.metadata.namespace}}{{$node:=.spec.nodeName}}{{range.spec.containers}}{{$podName}}{{"\\\\t"}}{{$namespace}}{{"\\\\t"}}{{.name}}{{"\\\\t"}}{{$node}}{{"\\\\t"}}{{if.resources.requests.cpu}}{{.resources.requests.cpu}}{{else}}${defaultCpuReq}{{end}}{{"\\\t"}}{{if.resources.requests.memory}}{{.resources.requests.memory}}{{else}}${defaultMemReq}{{end}}{{"\\\\t"}}{{if.resources.limits.cpu}}{{.resources.limits.cpu}}{{else}}${defaultCpuLim}{{end}}{{"\\t"}}{{if.resources.limits.memory}}{{.resources.limits.memory}}{{else}}${defaultMemLim}{{end}}{{"\\\\n"}}{{end}}{{end}}`

  const cmd = `kubectl ${context} get pod ${namespace} --field-selector=status.phase=Running -o=go-template --template=${template}`
  return parse(await REPL.qexec<string>(cmd), raw)
} */

interface PodOptions extends KubeOptions {
  node?: string
  containers?: boolean
}

/**
 * @return an indicator of whether a given pod name is in a given
 * node, subject to any namespace or label filters in the given args
 *
 */
async function getPodsInNode(args: Arguments<KubeOptions>, forNode: string): Promise<Record<string, boolean>> {
  const { content } = await args.REPL.rexec<KubeItems<Pod>>(
    `kubectl get pods -o json -n ${await getNamespace(args)} ${getLabelForArgv(args)}`
  )

  const empty = {} as Record<string, boolean>

  if (content && content.items) {
    return content.items
      .filter(_ => _.spec.nodeName === forNode)
      .map(_ => _.metadata.name) // name versus fqn?
      .reduce((M, fqn) => {
        M[fqn] = true
        return M
      }, empty)
  } else {
    return empty
  }
}

function withAllNamespaces(args: Arguments<KubeOptions>) {
  const args2 = Object.assign({}, args)
  args2.command = args2.command + ' -A'
  args2.argv = args2.argv.slice(0).concat(['-A'])

  return args2
}

const lighterText = ['processing-text', 'semi-bold']

function addRow(
  forThisNS: Table,
  key: string,
  cpu: number,
  mem: number,
  css?: string[],
  formatAs: 'share' | 'percent' = 'share'
) {
  const row = JSON.parse(JSON.stringify(forThisNS.body[0]))
  row.onclick = false
  row.rowKey = key
  row.name = strings(key)
  row.attributes[0].value = formatAs === 'share' ? formatAsCpu(cpu) : (100 * cpu).toFixed(0) + '%'
  row.attributes[1].value = formatAs === 'share' ? formatAsBytes(mem) : (100 * mem).toFixed(0) + '%'

  if (css) {
    row.css = css
    row.attributes[0].css = css.join(' ')
    row.attributes[1].css = css.join(' ')
  }

  forThisNS.body.push(row)
}

async function addAllNSRow(args: Arguments<KubeOptions>, forThisNS: Table, forAllNS: Table) {
  if (forThisNS.body && forThisNS.body.length > 0) {
    const cpuTotal = forThisNS.body.reduce((total, row) => total + cpuShare(row.attributes[0].value), 0)
    const memTotal = forThisNS.body.reduce((total, row) => total + memShare(row.attributes[1].value), 0)
    addRow(forThisNS, 'Total', cpuTotal, memTotal)

    if (forAllNS.body && forAllNS.body.length > 0) {
      const thisNS = await getNamespace(args)
      const otherNS = forAllNS.body.filter(_ => _.name !== thisNS)

      const cpuTotal = otherNS.reduce((total, row) => total + cpuShare(row.attributes[1].value), 0)
      const memTotal = otherNS.reduce((total, row) => total + memShare(row.attributes[2].value), 0)
      addRow(forThisNS, 'Other Namespaces', cpuTotal, memTotal, lighterText)
    }
  }

  return forThisNS
}

/**
 * Command handler for `kubectl top pod` default handler
 *
 */
async function getPodDataForAllNodes(
  args: Arguments<PodOptions>,
  top: (args: Arguments<KubeOptions>) => Promise<Table>
): Promise<Table> {
  if (isForAllNamespaces(args.parsedOptions) || args.parsedOptions.containers) {
    return top(args)
  } else {
    const [forThisNS, forAllNS] = await Promise.all([top(args), top(withAllNamespaces(args))])

    return addAllNSRow(args, forThisNS, forAllNS)
  }
}

/**
 * Command handler for `kubectl top pod --node <node>`
 *
 */
async function getPodDataForOneNode(
  args: Arguments<PodOptions>,
  top: (args: Arguments<KubeOptions>) => Promise<Table>
): Promise<Table> {
  const forNode = args.parsedOptions.node

  // strip off the --node <node> option
  strip(args, '--node', 1) // 1 means --node takes 1 arg

  if (isForAllNamespaces(args.parsedOptions) || args.parsedOptions.containers) {
    const [podTable, pods] = await Promise.all([top(args), getPodsInNode(args, forNode)])

    if (podTable.body) {
      podTable.body = podTable.body.filter(row => pods[row.name])
    }
    return podTable
  } else {
    const [podTable, pods, podTableInAllNS] = await Promise.all([
      top(args),
      getPodsInNode(args, forNode),
      top(withAllNamespaces(args))
    ])

    if (podTable.body) {
      podTable.body = podTable.body.filter(row => pods[row.name])
    }
    if (podTableInAllNS.body) {
      podTableInAllNS.body = podTableInAllNS.body.filter(row => pods[row.attributes[0].value])
    }
    return addAllNSRow(args, podTable, podTableInAllNS)
  }
}

/**
 * Command handler for `kubectl top pod` (overrides built-in functionality)
 *
 */
export async function topPod(
  args: Arguments<PodOptions>,
  top: (args: Arguments<KubeOptions>) => Promise<Table>
): Promise<Table> {
  const overheads = getSystemOverhead(args, args.parsedOptions.node)

  // without a --node <node> filter, we use the underlying `top pod` impl
  const table = !args.parsedOptions.node
    ? await getPodDataForAllNodes(args, top)
    : await getPodDataForOneNode(args, top)

  if (!isTable(table)) {
    return table
  } else if (table.body.length === 0) {
    throw new Error(strings('No pods found'))
  }

  const ns = await getNamespace(args)

  table.body.forEach(row => {
    // don't need to filter by node: ${args.parsedOptions.node ? `--node ${args.REPL.encodeComponent(args.parsedOptions.node)}` : ''}
    if (row.onclick) {
      row.onclick = `kubectl top container ${args.REPL.encodeComponent(row.name)} -n ${ns} ${getLabelForArgv(args)}`
      row.onclickSilence = false
    }
  })

  const { cpuOverhead, memOverhead /* , cpuCapacity, memCapacity */ } = await overheads
  addRow(table, 'System Overheads', cpuOverhead, memOverhead, lighterText)

  const totalRow = table.body.find(_ => _.rowKey === 'Total')
  const otherNSRow = table.body.find(_ => _.rowKey === 'Other Namespaces')
  if (totalRow && otherNSRow) {
    const totalCPU: number =
      cpuShare(totalRow.attributes[0].value) + cpuShare(otherNSRow.attributes[0].value) + cpuOverhead
    const totalMem: number =
      memShare(totalRow.attributes[1].value) + memShare(otherNSRow.attributes[1].value) + memOverhead
    // addRow(table, strings('Free Capacity'), 1 - totalCPU / cpuCapacity, 1 - totalMem / memCapacity, lighterText, 'percent')
    addRow(table, strings('Overall Total'), totalCPU, totalMem, lighterText)
  }

  return table
}

/**
 * Command handler for `kubectl top container`
 *
 */
export async function topContainer(args: Arguments<PodOptions>): Promise<Table> {
  const cmd = args.command.replace('top container', 'top pod').replace(/(-A|--all-namespaces)/, '') + ' --containers'
  const allContainers = await args.REPL.qexec<Table>(cmd)

  // filter for the given pod name
  const pod = args.argvNoOptions[args.argvNoOptions.indexOf('container') + 1]

  if (allContainers.body) {
    allContainers.body = allContainers.body.filter(_ => _.name === pod)

    allContainers.body.forEach(row => {
      row.onclick = `kubectl get pod ${args.REPL.encodeComponent(row.name)} -o yaml`
    })
  }

  return allContainers
}
