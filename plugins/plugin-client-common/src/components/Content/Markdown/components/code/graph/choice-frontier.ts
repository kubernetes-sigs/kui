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

import { Choice, Graph, isSubTask, isChoice, isSequence, isParallel, isTitledSteps } from '.'

/**
 * Find the first set of `Choice` nodes, when scanning the given
 * `graph`. Do not scan under Choice nodes for nested choices.
 *
 */
export default function findChoiceFrontier(graph: Graph): Choice[] {
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
