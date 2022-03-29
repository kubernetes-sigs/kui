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

import { v4 } from 'uuid'

import {
  Choice,
  CodeBlockProps,
  Graph,
  hasKey,
  hasTitle,
  isSubTask,
  isChoice,
  isSequence,
  isParallel,
  isTitledSteps,
  chooseIndex,
  subtask
} from '.'

import { ChoiceState } from '../../../'

function key(graph: Graph) {
  if (hasKey(graph)) {
    return graph.key
  } else if (hasTitle(graph)) {
    return graph.title
  } else if (isChoice(graph)) {
    return graph.group
  } else {
    return graph.id
  }
}

/**
 * Find the first set of `CodeBlock` nodes, when scanning the given
 * `graph`. Do not scan under Choice nodes for nested subtasks, unless
 *  the user has already indicated a selection for that choice.
 */

export function findCodeBlockFrontier(graph: Graph, choices: ChoiceState): CodeBlockProps[] {
  if (isSubTask(graph)) {
    return findCodeBlockFrontier(graph.graph, choices)
  } else if (isChoice(graph)) {
    if (graph.group in choices) {
      const whatTheUserChose = chooseIndex(graph, choices)
      return findCodeBlockFrontier(graph.choices[whatTheUserChose].graph, choices)
    } else {
      return []
    }
  } else if (isSequence(graph)) {
    return graph.sequence.flatMap(_ => findCodeBlockFrontier(_, choices))
  } else if (isParallel(graph)) {
    return graph.parallel.flatMap(_ => findCodeBlockFrontier(_, choices))
  } else if (isTitledSteps(graph)) {
    return graph.steps.flatMap(_ => findCodeBlockFrontier(_.graph, choices))
  } else {
    return [graph]
  }
}

/**
 * Enumerate the Prerequisites and Main Tasks in the given `graph.
 */
export function findPrereqsAndMainTasks(graph: Graph): Graph[] {
  if (isSubTask(graph) && isSequence(graph.graph) && graph.graph.sequence.length === 2) {
    const child1 = graph.graph.sequence[0]
    const child2 = graph.graph.sequence[1]

    if (isSubTask(child1) && child1.title === 'Prerequisites' && isSubTask(child2) && child2.title === 'Main Tasks') {
      // this needs a bit more refinement. we need to find a general
      // way to deal with an arbitrary mixture of titled and untitled
      // tasks
      if (child2.graph.sequence.every(_ => hasTitle(_))) {
        return child1.graph.sequence.concat(child2.graph.sequence)
      } else {
        return child1.graph.sequence.concat(child2)
      }
    }
  } else if (isTitledSteps(graph)) {
    return graph.steps.map(_ => subtask(v4(), _.title, _.description, '', _.graph, _.source))
  }

  return []
}

/**
 * Find the first set of `Choice` nodes, when scanning the given
 * `graph`. Do not scan under Choice nodes for nested
 * choices... unless the user has already made a choice (according to
 * the given `ChoiceState`) for that choice; in which case, we tunnel
 * through under that branch, looking for the next choice...
 *
 */
export function findChoiceFrontier(
  graph: Graph,
  choices: ChoiceState,
  prereqs: Graph[] = [],
  marks: Record<string, boolean> = {}
): { prereqs?: Graph[]; choice: Choice }[] {
  if (isChoice(graph)) {
    marks[key(graph)] = true

    if (!(graph.group in choices)) {
      // user has not yet made a choice. stop here and consume all
      // prereqs
      const frontier = [{ prereqs: prereqs.slice(), choice: graph }]
      prereqs.forEach(_ => (marks[key(_)] = true))
      prereqs.splice(0, prereqs.length) // consume...
      return frontier
    } else {
      // otherwise, we continue to tunnel down that chosen branch
      const whatTheUserChose = chooseIndex(graph, choices)
      return findChoiceFrontier(graph.choices[whatTheUserChose].graph, choices, prereqs, marks)
    }
  } else if (isSubTask(graph)) {
    const frontier = findChoiceFrontier(graph.graph, choices, prereqs, marks)

    if (graph.title === 'Prerequisites') {
      graph.graph.sequence.forEach(_ => {
        if (!marks[key(_)]) {
          prereqs.push(_)
          marks[key(_)] = true
        }
      })
      marks[key(graph)] = true
    }

    if (isSequence(graph.graph) && graph.graph.sequence.every(child => marks[key(child)])) {
      marks[key(graph)] = true

      if (frontier.length === 0 && graph.title === 'Prerequisites') {
        graph.graph.sequence.forEach(_ => {
          if (!marks[key(_)]) {
            prereqs.push(_)
            marks[key(_)] = true
          }
        })
      }
    }
    return frontier
  } else if (isSequence(graph)) {
    const frontier = graph.sequence.flatMap(_ => {
      const frontier = findChoiceFrontier(_, choices, prereqs, marks)

      if (!marks[key(_)]) {
        prereqs.push(_)
      }

      return frontier
    })
    graph.sequence.forEach(a => {
      const idx = prereqs.findIndex(b => a === b)
      if (idx >= 0) {
        prereqs.splice(idx, 1)
      }
    })
    if (graph.sequence.every(child => marks[key(child)])) {
      marks[key(graph)] = true
    }
    return frontier
  } else if (isParallel(graph)) {
    const frontier = graph.parallel.flatMap(_ => {
      const frontier = findChoiceFrontier(_, choices, prereqs, marks)

      if (!marks[key(_)]) {
        prereqs.push(_)
      }

      return frontier
    })
    graph.parallel.forEach(a => {
      const idx = prereqs.findIndex(b => a === b)
      if (idx >= 0) {
        prereqs.splice(idx, 1)
      }
    })
    if (graph.parallel.every(child => marks[key(child)])) {
      marks[key(graph)] = true
    }
    return frontier
  } else if (isTitledSteps(graph)) {
    const frontier = graph.steps.flatMap(_ => {
      const frontier = findChoiceFrontier(_.graph, choices, prereqs, marks)

      if (!marks[key(_.graph)]) {
        if (hasTitle(_.graph)) {
          prereqs.push(_.graph)
        } else {
          prereqs.push(subtask(_.title, _.title, _.description, '', _.graph, _.source))
        }
      }

      return frontier
    })
    graph.steps.forEach(({ graph: a }) => {
      const idx = prereqs.findIndex(b => a === b)
      if (idx >= 0) {
        prereqs.splice(idx, 1)
      }
    })
    if (graph.steps.every(step => marks[key(step.graph)])) {
      marks[key(graph)] = true
    }
    return frontier
  } else {
    // leaf-most code blocks. no choices here.
    return []
  }
}

export default function findChoicesOnFrontier(graph: Graph, choices: ChoiceState): Choice[] {
  return findChoiceFrontier(graph, choices).map(_ => _.choice)
}
