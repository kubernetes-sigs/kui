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

import Debug from 'debug'

import { encodeComponent } from '@kui-shell/core'
import { KubeResource } from '@kui-shell/plugin-kubectl'
import { ActivationLike, FlowNode, Edge } from '@kui-shell/plugin-wskflow'

import success from './success'
import { PipelineRun, Pipeline, isPipeline, Task, TaskName, TaskRef, Step, Port } from '../model/resource'

const debug = Debug('plugins/tekton/lib/tekton2graph')

interface TektonNode extends FlowNode {
  nChildren: number
  nParents: number
}

interface Graph extends TektonNode {
  readonly edges: Edge[]
  children: TektonNode[]
  runs: ActivationLike[]
}

interface SymbolTable<N> {
  [key: string]: N
}

const defaultHeight = 13
const defaultCharWidth = 3.25

/**
 * @return a blank IGraph instance with optional "children" subgraphs
 *
 */
const makeSubGraph = (
  label = 'root',
  {
    visited,
    children,
    tooltip,
    tooltipColor,
    type,
    onclick
  }: {
    visited?: number[]
    children: TektonNode[]
    tooltip?: string
    tooltipColor?: string
    type?: string
    onclick?: string
  } = { children: [] }
): TektonNode => {
  return {
    id: label,
    label,
    onclick,
    children,
    visited,
    edges: [],
    nParents: 0,
    nChildren: 0,
    type,
    tooltip,
    tooltipColor
  }
}

/** graph node id for a given Step located in a given Task */
const stepId = (taskRef: TaskRef, step: Step): string => `__step__${taskRef.name}__${step.name}`

/** find the pipeline in a given set of resource definitions */
const getPipeline = (jsons: KubeResource[]): Pipeline => {
  const declaredPipeline = jsons.find(_ => _.kind === 'Pipeline')

  if (isPipeline(declaredPipeline)) {
    return declaredPipeline
  } else {
    const tasks = jsons.filter(_ => _.kind === 'Task')
    if (tasks.length === 0) {
      throw new Error('No pipeline defined, and no Tasks defined')
    } else {
      const pipeline: Pipeline = {
        apiVersion: 'tekton.dev/v1alpha1',
        kind: 'Pipeline',
        metadata: {
          name: 'pipeline'
        },
        originatingCommand: undefined,
        isKubeResource: true,
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
 * Add an edge between parent and child nodes
 *
 */
function addEdge(
  graph: TektonNode,
  parent: TektonNode,
  child: TektonNode,
  { singletonSource, singletonTarget, hasRuns }: EdgeOptions
) {
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
    targetPort,
    visited: !hasRuns ? undefined : !!(parent.visited && child.visited)
  })

  child.nParents++
  parent.nChildren++
}

/**
 * Turn a raw yaml form of a tekton pipeline into a graph model that
 * is compatible with the ELK graph layout toolkit.
 *
 */
export default async function(jsons: KubeResource[], filepath?: string, run?: PipelineRun): Promise<Graph> {
  debug('jsons', jsons)
  const pipeline = getPipeline(jsons)
  debug('pipeline', pipeline)

  // map from Task.metadata.name to Task
  const taskName2Task: SymbolTable<Task> = jsons
    .filter(_ => _.kind === 'Task')
    .reduce((symtab: SymbolTable<Task>, task: Task) => {
      symtab[task.metadata.name] = task
      return symtab
    }, {})

  // map from Pipeline.Task.name to Task
  const taskRefName2Task: SymbolTable<Task> = pipeline.spec.tasks.reduce(
    (symtab: SymbolTable<Task>, taskRef: TaskRef) => {
      symtab[taskRef.name] = taskName2Task[taskRef.taskRef.name]
      return symtab
    },
    {}
  )

  // map from Pipeline.Task.name to Pipeline.Task
  const taskRefName2TaskRef: SymbolTable<TaskRef> = pipeline.spec.tasks.reduce(
    (symtab: SymbolTable<TaskRef>, taskRef: TaskRef) => {
      symtab[taskRef.name] = taskRef
      return symtab
    },
    {}
  )

  // do we have TaskRun information? if so, construct a map from
  // TaskName to an index into the taskRuns array
  const runs = run && run.status.taskRuns
  const startVisit: ActivationLike[] =
    (run && [
      {
        start: new Date(run.status.startTime).getTime(),
        duration: 0,
        response: {
          success: true
        }
      }
    ]) ||
    []
  const endVisit: ActivationLike[] =
    (run &&
      run.status.completionTime && [
        {
          start: new Date(run.status.completionTime).getTime(),
          duration: 0,
          response: {
            success: success(run.status.conditions)
          }
        }
      ]) ||
    []
  const runInfo: ActivationLike[] =
    runs &&
    Object.keys(runs).reduce((M, _: string) => {
      const taskRun = runs[_]
      const taskRefName = taskRun.pipelineTaskName
      const task = taskRefName2Task[taskRefName]

      if (task) {
        const start = new Date(taskRun.status.startTime).getTime()

        task.visitedIdx = M.length
        M.push({
          start,
          duration: taskRun.status.completionTime ? new Date(taskRun.status.completionTime).getTime() - start : 0,
          response: {
            success: success(taskRun.status.conditions)
          }
        })

        taskRun.status.steps.forEach(stepRun => {
          const start = new Date(stepRun.terminated.startedAt).getTime()
          const end = new Date(stepRun.terminated.finishedAt).getTime()
          const success = stepRun.terminated.reason !== 'Error'

          const step = task.spec.steps.find(_ => _.name === stepRun.name)
          if (step) {
            step.visitedIdx = M.length
            M.push({
              start,
              duration: end - start,
              response: {
                success
              }
            })
          }
        })
      }
      return M
    }, startVisit.concat(endVisit))

  const graph: Graph = {
    id: 'root',
    label: 'root',
    edges: [],
    children: [],
    nChildren: 0,
    nParents: 0,
    runs: runInfo,
    properties: {
      maxLabelLength: 24,
      fontSize: '4px'
    }
  }

  const start: TektonNode = {
    id: 'Entry',
    label: 'start',
    type: 'Entry',
    width: 18,
    height: 18,
    nChildren: 0,
    nParents: 0,
    visited: run && [0], // we carefully placed the start visit record in the first position (above)
    properties: {
      title: 'The flow starts here',
      fontSize: '4.5px'
    }
  }
  const end: TektonNode = {
    id: 'Exit',
    label: 'end',
    type: 'Exit',
    width: 18,
    height: 18,
    nChildren: 0,
    nParents: 0,
    visited: run && [1], // we carefully placed the end visit record in the second position (above)
    properties: {
      title: 'The flow ends here',
      fontSize: '4.5px'
    }
  }

  const symbolTable: SymbolTable<TektonNode> = pipeline.spec.tasks.reduce(
    (symtab: SymbolTable<TektonNode>, taskRef: TaskRef) => {
      const task: Task = taskName2Task[taskRef.taskRef.name]
      debug('TaskRef', taskRef.name, task)

      // -f file argument for drilldowns, if we have one
      const filearg = filepath ? `-f ${encodeComponent(filepath)}` : ''

      let node: TektonNode
      if (task && task.spec.steps && task.spec.steps.length > 0) {
        //
        // in this case, we do have a full Task definition, which
        // includes Steps; we will make a subgraph for the steps
        //
        const resources = (task.spec.inputs && task.spec.inputs.resources) || []
        const resourceList = `${resources.map(_ => `<span class='color-base0A'>${_.type}</span>:${_.name}`).join(', ')}`

        const params = (task.spec.inputs && task.spec.inputs.params) || []
        const paramList = `(${params.map(_ => _.name).join(', ')})`

        const subgraph = makeSubGraph(taskRef.name, {
          type: 'Tekton Task',
          tooltip: `<table><tr><td><strong>Resources</strong></td><td>${resourceList}</td></tr><tr><td><strong>Params</strong></td><td>${paramList}</td></tr></table>`,
          tooltipColor: '0C',
          onclick: `tekton get task ${encodeComponent(pipeline.metadata.name)} ${encodeComponent(
            task.metadata.name
          )} ${filearg}`,
          visited: task.visitedIdx !== undefined ? [task.visitedIdx] : undefined,
          children: task.spec.steps.map(step => {
            const stepNode: TektonNode = {
              id: stepId(taskRef, step),
              label: step.name,
              width: step.name.length * defaultCharWidth,
              height: defaultHeight,
              nChildren: 0,
              nParents: 0,
              deployed: true,
              visited: step.visitedIdx !== undefined ? [step.visitedIdx] : undefined,
              type: 'Tekton Step',
              tooltip: `<strong>Image</strong>: ${step.image}`,
              tooltipColor: '0E',
              onclick: `tekton get step ${encodeComponent(pipeline.metadata.name)} ${encodeComponent(
                task.metadata.name
              )} ${encodeComponent(step.name)} ${filearg}`
            }

            symtab[stepNode.id] = stepNode
            return stepNode
          })
        })

        subgraph.children.slice(1).reduce((cur: TektonNode, next: TektonNode) => {
          addEdge(subgraph, cur, next, { hasRuns: runs !== undefined })
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
    },
    {}
  )

  const lastStepOf = (node: TektonNode): TektonNode => {
    const taskRef = taskRefName2TaskRef[node.id]
    const task = taskRefName2Task[node.id]

    return task && symbolTable[stepId(taskRef, task.spec.steps[task.spec.steps.length - 1])]
  }

  const firstStepOf = (node: TektonNode): TektonNode => {
    const taskRef = taskRefName2TaskRef[node.id]
    const task = taskRefName2Task[node.id]

    return task && symbolTable[stepId(taskRef, task.spec.steps[0])]
  }

  const _addEdge = (parent: TektonNode, child: TektonNode, opts: EdgeOptions = { hasRuns: runs !== undefined }) => {
    const lastStepOfParentTask = lastStepOf(parent)
    const firstStepOfChildTask = firstStepOf(child)

    if (lastStepOfParentTask && firstStepOfChildTask) {
      addEdge(graph, lastStepOfParentTask, firstStepOfChildTask, {
        singletonSource: true,
        singletonTarget: true,
        hasRuns: runs !== undefined
      })
      parent.nChildren++
      child.nParents++
    } else if (!lastStepOfParentTask && firstStepOfChildTask) {
      addEdge(graph, parent, firstStepOfChildTask, {
        singletonSource: opts.singletonSource || false,
        singletonTarget: true,
        hasRuns: runs !== undefined
      })
      child.nParents++
    } else if (lastStepOfParentTask && !firstStepOfChildTask) {
      addEdge(graph, lastStepOfParentTask, child, {
        singletonSource: true,
        singletonTarget: opts.singletonTarget || false,
        hasRuns: runs !== undefined
      })
      parent.nChildren++
    } else {
      addEdge(graph, parent, child, Object.assign({}, opts, { hasRuns: runs !== undefined }))
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
    .forEach(child =>
      _addEdge(start, child, {
        singletonSource: true,
        hasRuns: graph.runs !== undefined
      })
    )

  // link end node
  graph.children
    .filter(parent => parent.nChildren === 0)
    .forEach(parent =>
      _addEdge(parent, end, {
        singletonTarget: true,
        hasRuns: graph.runs !== undefined
      })
    )

  // add the start and end nodes after we've done the linking
  graph.children.push(start)
  graph.children.push(end)

  return graph
}

interface EdgeOptions {
  singletonSource?: boolean
  singletonTarget?: boolean
  hasRuns: boolean
}
