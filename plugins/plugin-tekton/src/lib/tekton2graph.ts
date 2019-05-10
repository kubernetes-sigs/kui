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

import * as Debug from 'debug'
const debug = Debug('plugins/wskflow/tekton2graph')

import { readFile } from 'fs'
import { promisify } from 'util'
import { safeLoad } from 'js-yaml'
import { basename, dirname, join } from 'path'
import * as expandHomeDir from 'expand-home-dir'

import { CommandRegistrar } from '@kui-shell/core/models/command'
import Presentation from '@kui-shell/core/webapp/views/presentation'
import { findFile } from '@kui-shell/core/core/find-file'

import injectCSS from '@kui-shell/plugin-wskflow/lib/inject'

type TaskName = string

interface Port {
  name: string
  resource: string
  from?: TaskName[]
}

interface Task {
  name: TaskName
  taskRef?: { name: TaskName }
  runAfter?: TaskName[]
  resources?: {
    inputs?: Port[]
    outputs?: Port[]
  }
}

interface IPort {
  id: string
}

interface INode {
  readonly id: string
  readonly label: string
  readonly name?: string
  readonly value?: string
  readonly type?: string
  readonly taskIndex?: number
  tooltip?: string
  tooltipHeader?: string
  prettyCode?: string
  fullFunctionCode?: string
  multiLineLabel?: string
  repeatCount?: string
  retryCount?: string
  width?: number
  height?: number
  layoutOptions?: any
  properties?: any
  ports?: IPort[]
  readonly visited?: string[]
  children?: readonly INode[]
  edges?: readonly IEdge[]
  deployed?: boolean,
  nChildren: number,
  nParents: number
}

interface IGraph extends INode {
  readonly edges: IEdge[]
  readonly children: INode[]
}

interface IEdge {
  readonly id: string
  readonly source: string
  readonly sourcePort: string
  readonly target: string
  readonly targetPort: string
  readonly properties?: any
  readonly visited?: boolean
}

type SymbolTable<N> = { [key: string]: N }

const maxWidth = 100
const defaultHeight = 20
const defaultCharWidth = 5
const defaultCharHeight = 10

/**
 * Turn a raw yaml form of a tekton pipeline into a graph model that
 * is compatible with the ELK graph layout toolkit.
 *
 */
function tekton2graph (raw: string): IGraph {
  const json = safeLoad(raw)

  const graph: IGraph = {
    id: 'root',
    label: 'root',
    children: [],
    edges: [],
    nParents: 0,
    nChildren: 0,
    properties: {
      maxLabelLength: 24,
      fontSize: '5px'
    }
  }

  const symbolTable: SymbolTable<INode> = json.spec.tasks
    .reduce((symtab: SymbolTable<INode>, task: Task) => {
      const node = {
        id: task.name,
        label: task.name,
        width: task.name.length * defaultCharWidth + 10,
        height: defaultHeight,
        nChildren: 0,
        nParents: 0
      }

      symtab[task.name] = node
      graph.children.push(node)

      return symtab
    }, {})

  /**
   * Simple wrapper around addEdge that interfaces with the symbol
   * table to turn names into tasks
   *
   */
  const wire = (parentTaskName: TaskName, task: Task) => {
    const parent = symbolTable[parentTaskName]
    const child = symbolTable[task.name]

    if (parent) {
      addEdge(graph, parent, child)
    } else {
      console.error('parent not found', task.runAfter)
    }
  }

  json.spec.tasks.forEach((task: Task) => {
    if (task.runAfter) {
      task.runAfter.forEach(parentTaskName => {
        wire(parentTaskName, task)
      })
    }

    if (task.resources) {
      const wirePorts = (ports?: Port[]) => {
        if (ports) {
          ports.forEach(port => {
            if (port.from) {
              port.from.forEach(parentTaskName => {
                wire(parentTaskName, task)
              })
            }
          })
        }
      }

      wirePorts(task.resources.inputs)
      wirePorts(task.resources.outputs)
    }
  })

  return graph
}

const usage = {
  command: 'view',
  strict: 'view',
  docs: 'Preview a Tekton pipeline',
  required: [
    { name: 'pipeline.yml', file: true, docs: 'path to a pipeline description file' }
  ]
}

/**
 * Add an edge between parent and child nodes
 *
 */
function addEdge (graph: IGraph, parent: INode, child: INode, { singletonSource = false, singletonTarget = true } = {}) {
  if (!parent.ports) {
    parent.ports = []
  }
  if (!child.ports) {
    child.ports = []
  }

  const targetPort = `${child.id}-` + (singletonTarget ? 'pTargetSingleton' : `p${child.ports.length}`)
  if (!child.ports.find(_ => _.id === targetPort)) {
    child.ports.push({ id: targetPort })
  }

  const sourcePort = `${parent.id}-` + (singletonSource ? 'pSourceSingleton' : `p${parent.ports.length}`)
  if (!parent.ports.find(_ => _.id === sourcePort)) {
    parent.ports.push({ id: sourcePort })
  }

  graph.edges.push({
    id: `${parent.id}-${child.id}`,
    source: parent.id,
    sourcePort,
    target: child.id,
    targetPort
  })

  child.nParents++
  parent.nChildren++
}

/** promisey readFile */
const read = promisify(readFile)

export default (commandTree: CommandRegistrar) => {
  commandTree.listen('/tekton/view', async ({ command, argvNoOptions }) => {
    const filepath = argvNoOptions[argvNoOptions.indexOf('view') + 1]
    const raw = (await read(findFile(expandHomeDir(filepath)))).toString()
    const graph = tekton2graph(raw)
    debug('graph', graph)

    const start: INode = {
      id: 'Entry',
      label: 'start',
      type: 'Entry',
      width: 18,
      height: 18,
      nChildren: 0,
      nParents: 0,
      properties: {
        title: 'The flow starts here'
      }
    }

    const end: INode = {
      id: 'Exit',
      label: 'end',
      type: 'Exit',
      width: 18,
      height: 18,
      nChildren: 0,
      nParents: 0,
      properties: {
        title: 'The flow starts here'
      }
    }

    const content = document.createElement('div')
    content.classList.add('padding-content')
    content.style.flex = '1'
    content.style.display = 'flex'

    // link start and end nodes
    graph.children
      .filter(child => child.nParents === 0)
      .forEach(child => addEdge(graph, start, child, { singletonSource: true }))
    graph.children
      .filter(parent => parent.nChildren === 0)
      .forEach(parent => addEdge(graph, parent, end))
    graph.children.push(start)
    graph.children.push(end)

    const graph2doms = (await import('@kui-shell/plugin-wskflow/lib/graph2doms')).default
    const doms = await graph2doms(graph, content)
    debug('content', content)

    injectCSS()

    return {
      type: 'custom',
      isEntity: true,
      name: basename(filepath),
      packageName: dirname(filepath),
      prettyType: 'Pipeline',
      badges: [
        'Tekton'
      ],
      presentation: Presentation.FixedSize,
      content,
      modes: [
        { mode: 'flow', direct: command, defaultMode: true, execOptions: { exec: 'pexec' } },
        {
          mode: 'Raw',
          leaveBottomStripeAlone: true,
          direct: {
            type: 'custom',
            isEntity: true,
            contentType: 'yaml',
            content: raw
          }
        }
      ]
    }
  }, { usage, noAuthOk: true })
}
