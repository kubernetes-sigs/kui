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
import { safeLoadAll } from 'js-yaml'
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

interface Step {
  name: string
  image: string
  command: string
  args: string[]
}

interface KubeResource {
  apiversion: string
  kind: string
  metadata: {
    name: string
  }
}

interface Task extends KubeResource {
  spec: {
    inputs: {
      resources: { name: string, type: string, targetPath: string }[],
      params: { name: string, description: string, default: string }[]
    }
    steps: Step[]
  }
}

interface TaskRef {
  name: TaskName
  taskRef?: {
    name: TaskName
  }
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
  tooltipColor?: string
  prettyCode?: string
  fullFunctionCode?: string
  multiLineLabel?: string
  repeatCount?: string
  retryCount?: string
  width?: number
  height?: number
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
  children: INode[]
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

const knownKinds = /PipelineResource|Pipeline|Task/

/**
 * @return a blank IGraph instance with optional "children" subgraphs
 *
 */
const makeGraph = (label = 'root', { children, tooltip, tooltipColor, type }: { children: INode[], tooltip?: string, tooltipColor?: string, type?: string } = { children: [] }): IGraph => {
  return {
    id: label,
    label,
    children,
    edges: [],
    nParents: 0,
    nChildren: 0,
    type,
    tooltip,
    tooltipColor,
    properties: {
      maxLabelLength: 24,
      fontSize: '5px'
    }
  }
}

/** graph node id for a given Step located in a given Task */
const stepId = (taskRef: TaskRef, step: Step): string => `__step__${taskRef.name}__${step.name}`

/**
 * Turn a raw yaml form of a tekton pipeline into a graph model that
 * is compatible with the ELK graph layout toolkit.
 *
 */
function tekton2graph (raw: string): IGraph {
  const jsons = safeLoadAll(raw)
    .filter(_ => knownKinds.test(_.kind))

  const pipeline = jsons.find(_ => _.kind === 'Pipeline')

  const graph: IGraph = makeGraph()

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

  // map from Task.metadata.name to Task
  const taskName2Task: SymbolTable<Task> = jsons
    .filter(_ => _.kind === 'Task')
    .reduce((symtab: SymbolTable<Task>, task: Task) => {
      symtab[task.metadata.name] = task
      return symtab
    }, {})

  // map from Pipeline.Task.name to Task
  const taskRefName2Task: SymbolTable<Task> = pipeline.spec.tasks
    .reduce((symtab: SymbolTable<Task>, taskRef: TaskRef) => {
      symtab[taskRef.name] = taskName2Task[taskRef.taskRef.name]
      return symtab
    }, {})

  // map from Pipeline.Task.name to Pipeline.Task
  const taskRefName2TaskRef: SymbolTable<TaskRef> = pipeline.spec.tasks
    .reduce((symtab: SymbolTable<TaskRef>, taskRef: TaskRef) => {
      symtab[taskRef.name] = taskRef
      return symtab
    }, {})

  const symbolTable: SymbolTable<INode> = pipeline.spec.tasks
    .reduce((symtab: SymbolTable<INode>, taskRef: TaskRef) => {
      const task = taskName2Task[taskRef.taskRef.name]
      debug('TaskRef', taskRef.name, task)

      let node: INode
      if (task && task.spec.steps && task.spec.steps.length > 0) {
        // make a subgraph for the steps
        const resources = task.spec.inputs.resources || []
        const resourceList = `${resources.map(_ => `<span class='color-base0A'>${_.type}</span>:${_.name}`).join(', ')}`

        const params = task.spec.inputs.params || []
        const paramList = `(${params.map(_ => _.name).join(', ')})`

        const subgraph = makeGraph(taskRef.name, {
          type: 'Tekton Task',
          tooltip: `<table><tr><td><strong>Resources</strong></td><td>${resourceList}</td></tr><tr><td><strong>Params</strong></td><td>${paramList}</td></tr></table>`,
          tooltipColor: '0C',
          children: task.spec.steps.map(step => {
            const stepNode: INode = {
              id: stepId(taskRef, step),
              label: step.name,
              width: step.name.length * defaultCharWidth,
              height: defaultHeight,
              nChildren: 0,
              nParents: 0,
              deployed: false,
              type: 'Tekton Step',
              tooltip: `<strong>Image</strong>: ${step.image}`,
              tooltipColor: '0E'
            }

            symtab[stepNode.id] = stepNode
            return stepNode
          })
        })

        subgraph.children.slice(1).reduce((cur: INode, next: INode) => {
          addEdge(subgraph, cur, next)
          return next
        }, subgraph.children[0])

        node = subgraph
      } else {
        node = {
          id: taskRef.name,
          label: taskRef.name,
          width: taskRef.name.length * defaultCharWidth,
          height: defaultHeight,
          nChildren: 0,
          nParents: 0,
          type: 'Tekton Task',
          tooltip: 'test'
        }
      }

      symtab[taskRef.name] = node
      graph.children.push(node)

      return symtab
    }, {})

  const lastStepOf = (node: INode): INode => {
    const taskRef = taskRefName2TaskRef[node.id]
    const task = taskRefName2Task[node.id]

    return task &&
      symbolTable[stepId(taskRef, task.spec.steps[task.spec.steps.length - 1])]
  }

  const firstStepOf = (node: INode): INode => {
    const taskRef = taskRefName2TaskRef[node.id]
    const task = taskRefName2Task[node.id]

    return task &&
      symbolTable[stepId(taskRef, task.spec.steps[0])]
  }

  const _addEdge = (parent: INode, child: INode, opts: IEdgeOptions = {}) => {
    const lastStepOfParentTask = lastStepOf(parent)
    const firstStepOfChildTask = firstStepOf(child)

    if (lastStepOfParentTask && firstStepOfChildTask) {
      addEdge(graph, lastStepOfParentTask, firstStepOfChildTask, { singletonSource: true, singletonTarget: true })
      parent.nChildren++
      child.nParents++
      return
    } else if (!lastStepOfParentTask && firstStepOfChildTask) {
      addEdge(graph, parent, firstStepOfChildTask, { singletonSource: opts.singletonSource || false, singletonTarget: true })
      child.nParents++
      return
    } else if (lastStepOfParentTask && !firstStepOfChildTask) {
      addEdge(graph, lastStepOfParentTask, child, { singletonSource: true, singletonTarget: opts.singletonTarget || false })
      parent.nChildren++
      return
    } else {
      addEdge(graph, parent, child, opts)
    }
  }

  /**
   * Simple wrapper around addEdge that interfaces with the symbol
   * table to turn names into tasks
   *
   */
  const wire = (parentTaskRefName: TaskName, childTaskRef: TaskRef) => {
    const parent = symbolTable[parentTaskRefName]
    const child = symbolTable[childTaskRef.name]

    if (parent) {
      _addEdge(parent, child)
    } else {
      console.error('parent not found', childTaskRef)
    }
  }

  pipeline.spec.tasks.forEach((task: TaskRef) => {
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

  // link start node
  graph.children
    .filter(child => child.nParents === 0)
    .forEach(child => _addEdge(start, child, { singletonSource: true }))

  // link end node
  graph.children
    .filter(parent => parent.nChildren === 0)
    .forEach(parent => _addEdge(parent, end, { singletonTarget: true }))

  // add the start and end nodes after we've done the linking
  graph.children.push(start)
  graph.children.push(end)

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

interface IEdgeOptions {
  singletonSource?: boolean
  singletonTarget?: boolean
}

/**
 * Add an edge between parent and child nodes
 *
 */
function addEdge (graph: IGraph, parent: INode, child: INode, { singletonSource, singletonTarget }: IEdgeOptions = {}) {
  debug('addEdge', parent.id, child.id)

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

    const content = document.createElement('div')
    content.classList.add('padding-content')
    content.style.flex = '1'
    content.style.display = 'flex'

    const graph2doms = (await import('@kui-shell/plugin-wskflow/lib/graph2doms')).default
    const doms = await graph2doms(graph, content, undefined, {
      layoutOptions: {
        'elk.separateConnectedComponents': false,
        'elk.spacing.nodeNode': 10,
        'elk.padding': '[top=7.5,left=7.5,bottom=7.5,right=7.5]',
        hierarchyHandling: 'INCLUDE_CHILDREN' // since we have hierarhical edges, i.e. that cross-cut subgraphs
      }
    })
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
