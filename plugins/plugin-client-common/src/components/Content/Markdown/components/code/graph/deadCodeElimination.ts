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

import { Graph, Ordered, Unordered, emptySequence, isSequence, isParallel, isSubTask, isTitledSteps, isChoice } from '.'

/** Remove any subgraphs that contain no code blocks */
function dce<T extends Unordered | Ordered, G extends Graph<T>>(graph: G): G {
  if (isSequence(graph)) {
    const sequence = graph.sequence.map(dce).filter(Boolean)
    if (sequence.length > 0) {
      return Object.assign({}, graph, { sequence })
    }
  } else if (isParallel(graph)) {
    const parallel = graph.parallel.map(dce).filter(Boolean)
    if (parallel.length > 0) {
      return Object.assign({}, graph, { parallel })
    }
  } else if (isSubTask<T>(graph)) {
    const subgraph = dce(graph.graph)
    if (subgraph) {
      return Object.assign({}, graph, { graph: subgraph })
    }
  } else if (isTitledSteps<T>(graph)) {
    const steps = graph.steps
      .map(_ => {
        const subgraph = dce(_.graph)
        if (subgraph) {
          return Object.assign({}, _, { graph: subgraph })
        }
      })
      .filter(Boolean)
    if (steps.length > 0) {
      return Object.assign({}, graph, { steps })
    }
  } else if (isChoice(graph)) {
    const choices = graph.choices
      .map(_ => {
        const subgraph = dce(_.graph)
        if (subgraph) {
          return Object.assign({}, _, { graph: subgraph })
        }
      })
      .filter(Boolean)
    if (choices.length > 0) {
      return Object.assign({}, graph, { choices })
    }
  } else {
    return graph
  }
}

/** Remove any subgraphs that contain no code blocks */
export default function deadCodeElimination(graph: Graph): Graph {
  return dce(graph) || emptySequence()
}
