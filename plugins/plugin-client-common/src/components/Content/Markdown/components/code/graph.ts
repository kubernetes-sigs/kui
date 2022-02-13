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

/**
 * This file defines a dependence structure over a set of code
 * blocks. @see ./README.md for more detail.
 *
 * Given a set of code blocks. call `compile` to get a `Graph`. Given
 * a Graph, you may ask for its `progress` towards completion, or, via
 * `blocks`, ask for a linear dump back to the original set of code
 * blocks.
 *
 */

import CodeBlockProps from '../Wizard/CodeBlockProps'
import { ProgressStepState } from '../../../ProgressStepper'

type Status = ProgressStepState['status']

/* map from choice group to selected choice member */
type ChoicesMap = Record<CodeBlockProps['choice']['group'], CodeBlockProps['choice']['member']>

/** Iteration order */
interface Ordered {
  order: number
}

type Unordered = Partial<Ordered>

type Sequence<T extends Unordered | Ordered = Unordered> = {
  sequence: Graph<T>[]
}

type Choice<T extends Unordered | Ordered = Unordered> = {
  group: string

  choices: {
    member: string
    graph: Sequence<T>
  }[]
}

type Parallel<T extends Unordered | Ordered = Unordered> = {
  parallel: Graph<T>[]
}

export type Graph<T extends Unordered | Ordered = Unordered> =
  | Choice<T>
  | Sequence<T>
  | Parallel<T>
  | (CodeBlockProps & T)

export type OrderedGraph = Graph<Ordered>

function isChoice<T extends Unordered | Ordered = Unordered>(graph: Graph<T>): graph is Choice<T> {
  return Array.isArray((graph as Choice).choices)
}

function isSequence<T extends Unordered | Ordered = Unordered>(graph: Graph<T>): graph is Sequence<T> {
  return Array.isArray((graph as Sequence).sequence)
}

function isParallel<T extends Unordered | Ordered = Unordered>(graph: Graph<T>): graph is Parallel<T> {
  return Array.isArray((graph as Parallel).parallel)
}

export function sequence<T extends Unordered | Ordered = Unordered>(sequence: Graph<T>[]): Sequence<T> {
  return {
    sequence
  }
}

export function parallel<T extends Unordered | Ordered = Unordered>(parallel: Graph<T>[]): Parallel<T> {
  return {
    parallel
  }
}

function seq(block: CodeBlockProps): Sequence {
  return sequence([block])
}

export function compile(blocks: CodeBlockProps[], ordering: 'sequence' | 'parallel' = 'parallel'): Graph {
  let currentChoices: Choice
  let currentChoice: CodeBlockProps['choice']

  const parts: Graph[] = []

  blocks.forEach(block => {
    if (block.choice) {
      if (!currentChoice || currentChoice.group !== block.choice.group) {
        currentChoice = block.choice

        currentChoices = {
          group: block.choice.group,
          choices: [
            {
              member: block.choice.member,
              graph: seq(block)
            }
          ]
        }

        parts.push(currentChoices)
      } else if (currentChoice.member === block.choice.member) {
        // continuation of the current choice member
        currentChoices.choices[currentChoices.choices.length - 1].graph.sequence.push(block)
      } else {
        // next member of the current choice group
        currentChoice = block.choice
        currentChoices.choices.push({
          member: block.choice.member,
          graph: seq(block)
        })
      }
    } else {
      parts.push(block)
    }
  })

  return parts.length === 0
    ? undefined
    : parts.length === 1
    ? parts[0]
    : ordering === 'parallel'
    ? parallel(parts)
    : sequence(parts)
}

function orderSequence(graph: Sequence, ordinal = 0): Sequence<Ordered> {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return sequence(graph.sequence.map((_, idx) => order(_, ordinal + idx)))
}

function orderParallel(graph: Parallel, ordinal: number): Parallel<Ordered> {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return parallel(graph.parallel.map(_ => order(_, ordinal)))
}

function orderedChoice(choice: Choice, subgraphs: Sequence<Ordered>[]): Choice<Ordered> {
  return {
    group: choice.group,

    choices: choice.choices.map((item, idx) => ({
      member: item.member,
      graph: subgraphs[idx]
    }))
  }
}

function orderCodeBlock(graph: CodeBlockProps, ordinal: number): CodeBlockProps & Ordered {
  return Object.assign({}, graph, { order: ordinal })
}

// T extends Sequence ? Sequence<Ordered> : T extends Parallel ? Parallel<Ordered> : T extends Choice ? Choice<Ordered> : (CodeBlockProps & Ordered)
export function order<T extends Graph<Unordered>>(graph: T, ordinal = 0): Graph<Ordered> {
  if (isSequence(graph)) {
    return orderSequence(graph, ordinal)
  } else if (isParallel(graph)) {
    return orderParallel(graph, ordinal)
  } else if (isChoice(graph)) {
    return orderedChoice(
      graph,
      graph.choices.map(_ => orderSequence(_.graph, ordinal))
    )
  } else {
    return orderCodeBlock(graph, ordinal)
  }
}

/**
 * @return the current choice, which defaults to the first if we are
 * not provided a set of user choices via the `choices` parameter. The
 * decision to default to the first choice stems from a common origin
 * UI, of presenting choices in a set of tabs; in a tabular UI,
 * usually the first tab is open by default.
 */
function choose<T extends Unordered | Ordered = Unordered>(
  graph: Choice<T>,
  choices: 'default-path' | ChoicesMap = 'default-path'
): Graph<T> {
  const selectedMember = choices !== 'default-path' ? choices[graph.group] : undefined

  const choice = (selectedMember && graph.choices.find(_ => _.member === selectedMember)) || graph.choices[0]

  return choice.graph
}

/** @return A linearized set of code blocks in the given `graph` */
export function blocks<T extends Unordered | Ordered = Unordered>(
  graph: Graph<T>,
  choices: 'all' | 'default-path' | ChoicesMap = 'default-path'
): (CodeBlockProps & T)[] {
  const subblocks = (subgraph: Graph<T>) => blocks(subgraph, choices)

  if (!graph) {
    return []
  } else if (isSequence(graph)) {
    return graph.sequence.flatMap(subblocks)
  } else if (isParallel(graph)) {
    return graph.parallel.flatMap(subblocks)
  } else if (isChoice(graph)) {
    if (choices === 'all') {
      // return the union across all choices
      return graph.choices.map(_ => _.graph).flatMap(subblocks)
    } else {
      // return the current/default selection
      return subblocks(choose(graph, choices))
    }
    // } else if (graph.optional) { <-- if you want to exclude optional blocks from the MiniProgressStep UI
    // return []
  } else {
    return [graph]
  }
}

/** @return progress towards success of the given `graph` */
export function progress(
  graph: Graph<Ordered>,
  statusMap?: Record<string, Status> /* map key is code block id */,
  choices?: ChoicesMap
): { nDone: number; nError: number; nTotal: number; nextOrdinals: number[] } {
  const zero = { nDone: 0, nError: 0, nTotal: 0, nextOrdinals: [] }
  const subprogress = (subgraph: Graph<Ordered>) => progress(subgraph, statusMap, choices)

  if (!graph) {
    return zero
  } else if (isSequence(graph) || isParallel(graph)) {
    // Sequence | Parallel => sum across parts
    const parts = (isSequence(graph) ? graph.sequence : graph.parallel).map(subprogress)
    const nexts = parts.flatMap(_ => _.nextOrdinals)

    return {
      nDone: parts.reduce((N, part) => N + part.nDone, 0),
      nError: parts.reduce((N, part) => N + part.nError, 0),
      nTotal: parts.reduce((N, part) => N + part.nTotal, 0),
      nextOrdinals: isSequence(graph) ? [Math.min(...nexts)] : nexts
    }
  } else if (isChoice(graph)) {
    // choice => consult choices? model, otherwise assume first choice (first tab is selected)
    return subprogress(choose(graph, choices))
  } else {
    // individual code block

    if (graph.optional) {
      return zero
    } else {
      const status: Status = (statusMap && statusMap[graph.id]) || 'blank'

      const isDone = status === 'success'
      return {
        nDone: isDone ? 1 : 0,
        nError: status === 'error' ? 1 : 0,
        nTotal: 1,
        nextOrdinals: isDone ? [] : [graph.order]
      }
    }
  }
}
