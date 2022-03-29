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

import {
  CodeBlockProps,
  Ordered,
  Unordered,
  Graph,
  choose,
  isSequence,
  isParallel,
  isSubTask,
  isTitledSteps,
  isChoice
} from '.'

import { ChoiceState } from '../../..'

/** @return A linearized set of code blocks in the given `graph` */
export default function blocks<T extends Unordered | Ordered = Unordered>(
  graph: Graph<T>,
  choices: 'all' | 'default-path' | ChoiceState = 'default-path'
): (CodeBlockProps & T)[] {
  const subblocks = (subgraph: Graph<T>) => blocks(subgraph, choices)

  if (!graph) {
    return []
  } else if (isSequence(graph)) {
    return graph.sequence.flatMap(subblocks)
  } else if (isParallel(graph)) {
    return graph.parallel.flatMap(subblocks)
  } else if (isSubTask(graph)) {
    return blocks(graph.graph)
  } else if (isTitledSteps(graph)) {
    return graph.steps.map(_ => _.graph).flatMap(subblocks)
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
