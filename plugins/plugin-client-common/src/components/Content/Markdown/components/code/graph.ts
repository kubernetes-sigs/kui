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

interface Sequence {
  sequence: Graph[]
}

interface Choice {
  group: string

  choices: {
    member: string
    graph: Sequence
  }[]
}

interface Parallel {
  parallel: Graph[]
}

export type Graph = Choice | Sequence | Parallel | CodeBlockProps

function isChoice(graph: Graph): graph is Choice {
  return Array.isArray((graph as Choice).choices)
}

function isSequence(graph: Graph): graph is Sequence {
  return Array.isArray((graph as Sequence).sequence)
}

function isParallel(graph: Graph): graph is Parallel {
  return Array.isArray((graph as Parallel).parallel)
}

export function sequence(parts: Graph[]): Sequence {
  return {
    sequence: parts
  }
}

export function parallel(parts: Graph[]): Parallel {
  return {
    parallel: parts
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

/**
 * @return the current choice, which defaults to the first if we are
 * not provided a set of user choices via the `choices` parameter. The
 * decision to default to the first choice stems from a common origin
 * UI, of presenting choices in a set of tabs; in a tabular UI,
 * usually the first tab is open by default.
 */
function choose(graph: Choice, choices: 'default-path' | ChoicesMap = 'default-path'): Graph {
  const selectedMember = choices !== 'default-path' ? choices[graph.group] : undefined

  const choice = (selectedMember && graph.choices.find(_ => _.member === selectedMember)) || graph.choices[0]

  return choice.graph
}

/** @return A linearized set of code blocks in the given `graph` */
export function blocks(graph: Graph, choices: 'all' | 'default-path' | ChoicesMap = 'default-path'): CodeBlockProps[] {
  const subblocks = (subgraph: Graph) => blocks(subgraph, choices)

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
  graph: Graph,
  statusMap?: Record<string, Status> /* map key is code block id */,
  choices?: ChoicesMap
): { nDone: number; nError: number; nTotal: number } {
  const zero = { nDone: 0, nError: 0, nTotal: 0 }
  const subprogress = (subgraph: Graph) => progress(subgraph, statusMap, choices)

  if (!graph) {
    return zero
  } else if (isSequence(graph) || isParallel(graph)) {
    // Sequence | Parallel => sum across parts
    const parts = (isSequence(graph) ? graph.sequence : graph.parallel).map(subprogress)

    return {
      nDone: parts.reduce((N, part) => N + part.nDone, 0),
      nError: parts.reduce((N, part) => N + part.nError, 0),
      nTotal: parts.reduce((N, part) => N + part.nTotal, 0)
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

      return {
        nDone: status === 'success' ? 1 : 0,
        nError: status === 'error' ? 1 : 0,
        nTotal: 1
      }
    }
  }
}
