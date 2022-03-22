/*
 * Copyright 2022 The Kubernetes Authors
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
  Choice,
  Graph,
  SubTask,
  emptySequence,
  isSubTask,
  isChoice,
  isSequence,
  isParallel,
  isTitledSteps,
  parallel,
  sequence,
  subtask
} from '../graph'

import findChoiceFrontier from './choice-frontier'

type LookupTable = Record<SubTask['key'], SubTask>

function toLookupTable(list: SubTask[]): LookupTable {
  return list.reduce((M, subtask) => {
    M[subtask.key] = subtask
    return M
  }, {})
}

function removeDuplicates(list: SubTask[]): SubTask[] {
  const uniqueKeys = Array.from(new Set(list.map(_ => _.key)))
  const lookupTable = toLookupTable(list)
  return uniqueKeys.map(key => lookupTable[key])
}

function extractDominatedSubTasksUpToChoice(graph: Graph): SubTask[] {
  if (isSubTask(graph)) {
    const subgraphTasks = extractDominatedSubTasksUpToChoice(graph.graph)
    if (!graph.filepath) {
      // then this is a subtask that was made up internally, e.g. we
      // even do so here, with a "Prerequisites" subtask
      return subgraphTasks
    } else {
      return [graph, ...subgraphTasks]
    }
  } else if (isChoice(graph)) {
    return []
  } else if (isSequence(graph)) {
    return removeDuplicates(graph.sequence.flatMap(extractDominatedSubTasksUpToChoice))
  } else if (isParallel(graph)) {
    return removeDuplicates(graph.parallel.flatMap(extractDominatedSubTasksUpToChoice))
  } else if (isTitledSteps(graph)) {
    return removeDuplicates(graph.steps.flatMap(_ => extractDominatedSubTasksUpToChoice(_.graph)))
  } else {
    return []
  }
}

function extractSubTasksCommonToAllChoices(choice: Choice): SubTask[] {
  const subTasksPerChoice = choice.choices.map(_ => extractDominatedSubTasksUpToChoice(_.graph))

  if (subTasksPerChoice.find(_ => _.length === 0)) {
    // there exists at least one empty set, across choices
    return []
  } else if (subTasksPerChoice.length === 1) {
    return subTasksPerChoice[0]
  } else {
    // otherwise, every choice has at least one SubTask
    return subTasksPerChoice
      .slice(1)
      .reduce(
        (sofar, subtasks) => sofar.filter(subtask => subtasks.find(_ => _.key === subtask.key)),
        subTasksPerChoice[0]
      )
  }
}

function pruneSubTasks(graph: SubTask, inheritedSubTasks: SubTask[], includingMe = true): SubTask {
  if (includingMe && inheritedSubTasks.find(_ => _.key === graph.key)) {
    // then we can zero out this particular instance of the subtask,
    // since it is inherited from above
    return undefined
  } else if (!graph.graph) {
    return graph
  } else {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const subgraph = pruneShadowedSubTasks(graph.graph, inheritedSubTasks)
    if (!subgraph) {
      return undefined
    } else {
      return Object.assign({}, graph, { graph: subgraph })
    }
  }
}

/**
 * Given a set of `inheritedSubTasks`, scan the given `graph` and
 * remove any references to those inherited tasks. The idea is one of
 * graph dominance: if we already know that a certain subtask is
 * certainly required for completion of the main task, then we don't
 * need to repeat this fact in subtrees.
 */
function pruneShadowedSubTasks(graph: Graph, inheritedSubTasks: SubTask[]): Graph | void {
  if (isSubTask(graph)) {
    return pruneSubTasks(graph, inheritedSubTasks)
  } else if (isSequence(graph)) {
    const elements = graph.sequence.map(_ => pruneShadowedSubTasks(_, inheritedSubTasks))
    const residual = elements.filter(Boolean)

    return residual.length === 0
      ? undefined
      : Object.assign({}, graph, {
          sequence: residual
        })
  } else if (isParallel(graph)) {
    const elements = graph.parallel.map(_ => pruneShadowedSubTasks(_, inheritedSubTasks))
    const residual = elements.filter(Boolean)

    return residual.length === 0
      ? undefined
      : Object.assign({}, graph, {
          parallel: residual
        })
  } else if (isChoice(graph)) {
    const prunedChoices = graph.choices.map(choice => {
      const prunedSubGraph = pruneShadowedSubTasks(choice.graph, inheritedSubTasks) || emptySequence()
      return Object.assign({}, choice, {
        graph: prunedSubGraph
      })
    })

    if (prunedChoices.length > 0) {
      return Object.assign({}, graph, {
        choices: prunedChoices
      })
    }
  } else if (isTitledSteps(graph)) {
    const prunedSteps = graph.steps
      .map(step => {
        const prunedStep = pruneShadowedSubTasks(step.graph, inheritedSubTasks)
        if (prunedStep) {
          return Object.assign({}, step, {
            graph: prunedStep
          })
        }
      })
      .filter(Boolean)

    if (prunedSteps.length > 0) {
      return Object.assign({}, graph, {
        steps: prunedSteps
      })
    }
  } else {
    return graph
  }
}

function findAndHoistChoiceFrontier(graph: void | Graph, inheritedSubTasks: SubTask[]): Graph | void {
  if (!graph) {
    return graph
  } else if (isChoice(graph)) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const recurse = graph.choices.map(_ => hoist(_.graph, inheritedSubTasks))
    return Object.assign({}, graph, {
      choices: graph.choices.map((_, idx) =>
        Object.assign({}, _, {
          graph: recurse[idx]
        })
      )
    })
  } else if (isSubTask(graph)) {
    const recurse = findAndHoistChoiceFrontier(graph.graph, inheritedSubTasks)
    return Object.assign({}, graph, { graph: recurse })
  } else if (isSequence(graph)) {
    const recurse = graph.sequence.map(_ => findAndHoistChoiceFrontier(_, inheritedSubTasks))
    return Object.assign({}, graph, { sequence: recurse })
  } else if (isParallel(graph)) {
    const recurse = graph.parallel.map(_ => findAndHoistChoiceFrontier(_, inheritedSubTasks))
    return Object.assign({}, graph, { parallel: recurse })
  } else if (isTitledSteps(graph)) {
    const recurse = graph.steps.map(_ => findAndHoistChoiceFrontier(_.graph, inheritedSubTasks))
    return Object.assign({}, graph, {
      steps: graph.steps.map((_, idx) =>
        Object.assign({}, _, {
          graph: recurse[idx]
        })
      )
    })
  } else {
    return graph
  }
}

function extractTopLevelSubTasks(graph: Graph): { toplevelSubTasks: SubTask[]; residual: Graph } {
  if (isSequence(graph)) {
    const toplevelSubTasks = graph.sequence.filter(isSubTask)
    const residual = sequence(graph.sequence.filter(_ => !isSubTask(_)))
    return { toplevelSubTasks, residual }
  } else if (isParallel(graph)) {
    const toplevelSubTasks = graph.parallel.filter(isSubTask)
    const residual = parallel(graph.parallel.filter(_ => !isSubTask(_)))
    return { toplevelSubTasks, residual }
  } else if (isSubTask(graph)) {
    return { toplevelSubTasks: [graph], residual: emptySequence() }
  } else {
    return { toplevelSubTasks: [], residual: graph }
  }
}

function union(...Ts: SubTask[][]): SubTask[] {
  return Ts.reduce((set, subtasks) => set.concat(subtasks.filter(b => !set.find(a => a.key === b.key))), [])
}

/** Smash in any subTasks we hoisted */
function recombine(graph: Graph | void, subTasks1: SubTask[]) {
  const subTasks = subTasks1.map(_ => pruneSubTasks(_, subTasks1, false)).filter(Boolean)

  if (subTasks.length === 0) {
    return graph
  } else if (!graph) {
    return sequence(subTasks)
  } else {
    const { toplevelSubTasks, residual } = extractTopLevelSubTasks(graph)
    const allSubTasks = union(toplevelSubTasks, subTasks)
    return sequence([subtask('Prerequisites', 'Prerequisites', '', sequence(allSubTasks)), residual])
  }
}

/** Hoist shared SubTasks as high as possible in the graph */
function hoist(inputGraph: Graph, inheritedSubTasks: SubTask[]): Graph | void {
  const myDominatedSubTasks = extractDominatedSubTasksUpToChoice(inputGraph)

  const choiceFrontier = findChoiceFrontier(inputGraph)
  const frontierAllChoicesSubTasks = choiceFrontier.flatMap(extractSubTasksCommonToAllChoices)

  const mySubTasks = union(myDominatedSubTasks, frontierAllChoicesSubTasks)
  const allSubTasks = union(mySubTasks, inheritedSubTasks)

  if (allSubTasks.length === 0) {
    return inputGraph
  }

  const prunedGraph = pruneShadowedSubTasks(inputGraph, allSubTasks)

  // recurse, for each control subregion
  const prunedGraph2 = findAndHoistChoiceFrontier(prunedGraph, allSubTasks)

  // smash in any subTasks we hoisted.
  return recombine(prunedGraph2, mySubTasks)
  // NOTE: do not recombine with ^^^^^^^^^^ inherited sub tasks! otherwise we will repeat them for every
  // subtree call to hoist()!
}

/**
 * Hoist shared SubTasks as high as possible in the graph.
 *
 * @param inputGraph the graph to optimize
 * @param maxIter to protect against infinite loop bugs
 */
export default function hoistSubTasks(inputGraph: Graph, iter = 0, maxIter = 20): Graph {
  const graph = hoist(inputGraph, []) || emptySequence()
  const changed = JSON.stringify(inputGraph) !== JSON.stringify(graph)

  if (changed && iter < maxIter) {
    return hoistSubTasks(graph, iter + 1, maxIter)
  } else {
    return graph
  }
}
