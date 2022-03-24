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

import { Graph, isSubTask, isChoice, isSequence, isParallel, isTitledSteps } from '.'

/**
 * Attempt to propagate "meaning" to less areas without prior meaning,
 * but whose meaning can be properly associated with other
 * meanings. For example, we may not have a `title` attribute for a
 * `Choice`, but a `SubTask` immediate parent may have a title.
 *
 */
export default function propagateTitles(graph: Graph, title?: string) {
  if (isSequence(graph)) {
    graph.sequence.forEach(_ => propagateTitles(_, title))
  } else if (isParallel(graph)) {
    graph.parallel.forEach(_ => propagateTitles(_, title))
  } else if (isSubTask(graph)) {
    if (graph.graph) {
      propagateTitles(graph.graph, graph.title)
    }
  } else if (isTitledSteps(graph)) {
    graph.steps.forEach(_ => {
      if (_.graph) {
        propagateTitles(_.graph, _.title)
      }
    })
  } else if (isChoice(graph)) {
    if (!graph.title && title) {
      graph.title = title
    }

    graph.choices.forEach(_ => propagateTitles(_.graph, _.title))
  }

  return graph
}
