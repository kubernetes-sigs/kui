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
    return [graph, ...extractDominatedSubTasksUpToChoice(graph.graph)]
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

function pruneSubTasks(
  graph: SubTask,
  inheritedSubTasks: SubTask[],
  includingMe = true
): { changed: boolean; graph: SubTask } {
  if (includingMe && inheritedSubTasks.find(_ => _.key === graph.key)) {
    // then we can zero out this particular instance of the subtask,
    // since it is inherited from above
    return { changed: true, graph: undefined }
  } else if (!graph.graph) {
    return { changed: false, graph }
  } else {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const { changed, graph: subgraph } = pruneShadowedSubTasks(graph.graph, inheritedSubTasks)
    if (!subgraph) {
      return { changed: !!graph, graph: undefined }
    } else {
      return { changed, graph: Object.assign({}, graph, { graph: subgraph }) }
    }
  }
}

function pruneShadowedSubTasks(graph: Graph, inheritedSubTasks: SubTask[]): { changed: boolean; graph: Graph | void } {
  if (isSubTask(graph)) {
    return pruneSubTasks(graph, inheritedSubTasks)
  } else if (isSequence(graph)) {
    const elements = graph.sequence.map(_ => pruneShadowedSubTasks(_, inheritedSubTasks))
    const changed = !!elements.find(_ => _.changed)
    const residual = elements.map(_ => _.graph).filter(Boolean)

    return {
      changed,
      graph: !changed
        ? graph
        : residual.length === 0
        ? undefined
        : Object.assign({}, graph, {
            sequence: residual
          })
    }
  } else if (isParallel(graph)) {
    const elements = graph.parallel.map(_ => pruneShadowedSubTasks(_, inheritedSubTasks))
    const changed = !!elements.find(_ => _.changed)
    const residual = elements.map(_ => _.graph).filter(Boolean)

    return {
      changed,
      graph: !changed
        ? graph
        : residual.length === 0
        ? undefined
        : Object.assign({}, graph, {
            parallel: residual
          })
    }
  } else if (isChoice(graph)) {
    const prunedSubGraphs = graph.choices.map(_ => pruneShadowedSubTasks(_.graph, inheritedSubTasks))
    const changed = !!prunedSubGraphs.find(_ => _.changed)
    const prunedGraph = !changed
      ? graph
      : Object.assign({}, graph, {
          choices: graph.choices
            .map((_, idx) => {
              const prunedSubGraph = prunedSubGraphs[idx].graph
              if (prunedSubGraph) {
                return Object.assign({}, _, {
                  graph: prunedSubGraph
                })
              }
            })
            .filter(Boolean)
        })

    return {
      changed,
      graph: prunedGraph.choices.length === 0 ? undefined : prunedGraph
    }
  } else if (isTitledSteps(graph)) {
    const prunedSubGraphs = graph.steps.map(_ => pruneShadowedSubTasks(_.graph, inheritedSubTasks))
    const changed = !!prunedSubGraphs.find(_ => _.changed)
    return {
      changed,
      graph: !changed
        ? graph
        : Object.assign({}, graph, {
            steps: graph.steps
              .map((_, idx) => {
                const prunedSubGraph = prunedSubGraphs[idx].graph
                if (prunedSubGraph) {
                  return Object.assign({}, _, {
                    graph: prunedSubGraph
                  })
                }
              })
              .filter(Boolean)
          })
    }
  } else {
    return { changed: false, graph }
  }
}

function findChoiceFrontier(graph: Graph): Choice[] {
  if (isChoice(graph)) {
    return [graph]
  } else if (isSubTask(graph)) {
    return findChoiceFrontier(graph.graph)
  } else if (isSequence(graph)) {
    return graph.sequence.flatMap(findChoiceFrontier)
  } else if (isParallel(graph)) {
    return graph.parallel.flatMap(findChoiceFrontier)
  } else if (isTitledSteps(graph)) {
    return graph.steps.flatMap(_ => findChoiceFrontier(_.graph))
  } else {
    return []
  }
}

function findAndHoistChoiceFrontier(
  graph: void | Graph,
  inheritedSubTasks: SubTask[]
): { changed: boolean; graph: Graph | void } {
  if (!graph) {
    return { changed: false, graph }
  } else if (isChoice(graph)) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const recurse = graph.choices.map(_ => hoist(_.graph, inheritedSubTasks))
    const changed = !!recurse.find(_ => _.changed)
    return {
      changed,
      graph: !changed
        ? graph
        : Object.assign({}, graph, {
            choices: graph.choices.map((_, idx) =>
              Object.assign({}, _, {
                graph: recurse[idx].graph
              })
            )
          })
    }
  } else if (isSubTask(graph)) {
    const recurse = findAndHoistChoiceFrontier(graph.graph, inheritedSubTasks)
    return { changed: recurse.changed, graph: Object.assign({}, graph, { graph: recurse.graph }) }
  } else if (isSequence(graph)) {
    const recurse = graph.sequence.map(_ => findAndHoistChoiceFrontier(_, inheritedSubTasks))
    const changed = !!recurse.find(_ => _.changed)
    return { changed, graph: !changed ? graph : Object.assign({}, graph, { sequence: recurse.map(_ => _.graph) }) }
  } else if (isParallel(graph)) {
    const recurse = graph.parallel.map(_ => findAndHoistChoiceFrontier(_, inheritedSubTasks))
    const changed = !!recurse.find(_ => _.changed)
    return { changed, graph: !changed ? graph : Object.assign({}, graph, { parallel: recurse.map(_ => _.graph) }) }
  } else if (isTitledSteps(graph)) {
    const recurse = graph.steps.map(_ => findAndHoistChoiceFrontier(_.graph, inheritedSubTasks))
    const changed = !!recurse.find(_ => _.changed)
    return {
      changed,
      graph: !changed
        ? graph
        : Object.assign({}, graph, {
            steps: graph.steps.map((_, idx) =>
              Object.assign({}, _, {
                graph: recurse[idx].graph
              })
            )
          })
    }
  } else {
    return { changed: false, graph }
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

function union(...As: SubTask[][]): SubTask[] {
  return As.reduce((set, subtasks) => set.concat(subtasks.filter(b => !set.find(a => a.key === b.key))), [])
}

/** Smash in any subTasks we hoisted */
function recombine(graph: Graph | void, subTasks1: SubTask[]) {
  const subTasks = subTasks1.map(_ => pruneSubTasks(_, subTasks1, false).graph).filter(Boolean)

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

/* function names(A: SubTask[]): string[] {
  return A.map(_ => _.key)
} */

/** Hoist shared SubTasks as high as possible in the graph */
function hoist(inputGraph: Graph, inheritedSubTasks: SubTask[]): { changed: boolean; graph: Graph | void } {
  const myDominatedSubTasks = extractDominatedSubTasksUpToChoice(inputGraph)

  const choiceFrontier = findChoiceFrontier(inputGraph)
  const frontierAllChoicesSubTasks = choiceFrontier.flatMap(extractSubTasksCommonToAllChoices)

  const subTasks = union(myDominatedSubTasks, frontierAllChoicesSubTasks, inheritedSubTasks)
  // console.error('!!!!!!SUB1', names(myDominatedSubTasks))
  // console.error('!!!!!!SUB2', names(frontierAllChoicesSubTasks))
  // console.error('!!!!!!SUB3', names(inheritedSubTasks))

  if (subTasks.length === 0) {
    return { changed: false, graph: inputGraph }
  }

  const { changed: changed1, graph: prunedGraph } = pruneShadowedSubTasks(inputGraph, subTasks)

  // recurse, for each control subregion
  const { changed: changed2, graph: prunedGraph2 } = findAndHoistChoiceFrontier(prunedGraph, subTasks)

  // any changes from me or a control subregion?
  const changed = changed1 || changed2

  // smash in any subTasks we hoisted
  const graph = recombine(prunedGraph2, subTasks)

  return {
    changed,
    graph
  }
}

/** Hoist shared SubTasks as high as possible in the graph */
export default function hoistSubTasks(inputGraph: Graph): Graph {
  const { graph } = hoist(inputGraph, [])
  /* if (changed) {
    if (graph) {
      return hoistSubTasks(graph)
    } else {
      return emptySequence()
    }
  } else */
  return graph || emptySequence()
}
