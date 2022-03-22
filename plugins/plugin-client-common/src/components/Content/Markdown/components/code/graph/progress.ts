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

import { ProgressStepState } from '../../../../ProgressStepper'

import {
  CodeBlockProps,
  Graph,
  ChoicesMap,
  Ordered,
  isSubTask,
  choose,
  isChoice,
  isSequence,
  isParallel,
  isTitledSteps
} from '.'

type Status = ProgressStepState['status']
type Progress = { nDone: number; nError: number; nTotal: number; nextOrdinals: number[] }

/** @return progress towards success of the given `graph` */
export default function progress(
  graph: Graph<Ordered>,
  statusMap?: Record<string, Status> /* map key is code block id */,
  choices?: ChoicesMap,
  filterOut?: (props: CodeBlockProps) => boolean
): Progress {
  const zero = { nDone: 0, nError: 0, nTotal: 0, nextOrdinals: [] }
  const subprogress = (subgraph: Graph<Ordered>) => progress(subgraph, statusMap, choices, filterOut)

  if (!graph) {
    return zero
  } else if (isSubTask(graph)) {
    return subprogress(graph.graph)
  } else if (isSequence(graph) || isParallel(graph) || isTitledSteps(graph)) {
    // Sequence | Parallel => sum across parts
    const parts = (isSequence(graph)
      ? graph.sequence
      : isTitledSteps(graph)
      ? graph.steps.map(_ => _.graph)
      : graph.parallel
    ).map(subprogress)
    const nexts = parts.flatMap(_ => _.nextOrdinals)
    const progress = {
      nDone: parts.reduce((N, part) => N + part.nDone, 0),
      nError: parts.reduce((N, part) => N + part.nError, 0),
      nTotal: parts.reduce((N, part) => N + part.nTotal, 0),
      nextOrdinals: isSequence(graph) || isTitledSteps(graph) ? [Math.min(...nexts)] : nexts
    }
    return progress
  } else if (isChoice(graph)) {
    // choice => consult choices? model, otherwise assume first choice (first tab is selected)
    return subprogress(choose(graph, choices))
  } else {
    // individual code block

    if (graph.optional || (filterOut && filterOut(graph))) {
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
