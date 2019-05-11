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
const debug = Debug('plugins/tekton/lib/tekton2graph')

import { encodeComponent } from '@kui-shell/core/core/repl'

import { Task, Step } from '../model/resource'

type TaskName = string

interface Port {
  name: string
  resource: string
  from?: TaskName[]
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
  readonly onclick?: string

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

interface SymbolTable<N> { [key: string]: N }

const maxWidth = 100
const defaultHeight = 20
const defaultCharWidth = 5
const defaultCharHeight = 10

/**
 * @return a blank IGraph instance with optional "children" subgraphs
 *
 */
const makeGraph = (label = 'root', { children, tooltip, tooltipColor, type, onclick }: { children: INode[], tooltip?: string, tooltipColor?: string, type?: string, onclick?: string } = { children: [] }): IGraph => {
  return {
    id: label,
    label,
    onclick,
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

/** find the pipeline in a given set of resource definitions */
const getPipeline = (jsons: Record<string, any>): Record<string, any> => {
  const declaredPipeline = jsons.find(_ => _.kind === 'Pipeline')

  if (declaredPipeline) {
    return declaredPipeline
  } else {
    const tasks = jsons.filter(_ => _.kind === 'Task')
    if (tasks.length === 0) {
      throw new Error('No pipeline defined, and no Tasks defined')
    } else {
      const pipeline = {
        apiVersion: 'tekton.dev/v1alpha1',
        kind: 'Pipeline',
        metadata: {
          name: 'pipeline'
        },
        spec: {
          tasks: tasks.map(task => ({
            name: task.metadata.name,
            taskRef: {
              name: task.metadata.name
            }
          }))
        }
      }

      return pipeline
    }
  }
}

/**
 * Turn a raw yaml form of a tekton pipeline into a graph model that
 * is compatible with the ELK graph layout toolkit.
 *
 */
export default async function (jsons: Record<string, any>[], filepath: string): Promise<IGraph> {
  debug('jsons', jsons)
  const pipeline = getPipeline(jsons)
  debug('pipeline', pipeline)

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

      // -f file argument for drilldowns, if we have one
      const filearg = filepath ? `-f ${encodeComponent(filepath)}` : ''

      let node: INode
      if (task && task.spec.steps && task.spec.steps.length > 0) {
        //
        // in this case, we do have a full Task definition, which
        // includes Steps; we will make a subgraph for the steps
        //
        const resources = (task.spec.inputs && task.spec.inputs.resources) || []
        const resourceList = `${resources.map(_ => `<span class='color-base0A'>${_.type}</span>:${_.name}`).join(', ')}`

        const params = (task.spec.inputs && task.spec.inputs.params) || []
        const paramList = `(${params.map(_ => _.name).join(', ')})`

        const subgraph = makeGraph(taskRef.name, {
          type: 'Tekton Task',
          tooltip: `<table><tr><td><strong>Resources</strong></td><td>${resourceList}</td></tr><tr><td><strong>Params</strong></td><td>${paramList}</td></tr></table>`,
          tooltipColor: '0C',
          onclick: `tekton get task ${encodeComponent(pipeline.metadata.name)} ${encodeComponent(task.metadata.name)} ${filearg}`,
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
              tooltipColor: '0E',
              onclick: `tekton get step ${encodeComponent(pipeline.metadata.name)} ${encodeComponent(task.metadata.name)} ${encodeComponent(step.name)} ${filearg}`
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
        //
        // we don't have a full Task definition for this pipeline
        // task, or the Task definition for some reason does not
        // specify Steps
        //
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
