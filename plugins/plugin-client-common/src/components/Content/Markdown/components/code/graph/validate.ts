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

import { pexecInCurrentTab } from '@kui-shell/core'
import { Graph, isSequence, isParallel, isChoice, isTitledSteps, isSubTask } from '.'

import { Status } from '../../../../ProgressStepper'

/** Succeed only if all paths succeed, fail if any path fails */
function failFast(a: Status = 'success', b: Status = 'success') {
  if (a === 'success' && b === 'success') {
    return 'success'
  } else if (a === 'error' || b === 'error') {
    return 'error'
  } else if (a === 'in-progress' || b === 'in-progress') {
    return 'in-progress'
  } else if (a === 'pending' || b === 'pending') {
    return 'pending'
  } else if (a === 'warning' || b === 'warning') {
    return 'warning'
  } else {
    return 'blank'
  }
}

/** For choices, a success on any path is good */
function succeedFast(a: Status = 'success', b: Status = 'success') {
  if (a === 'success' || b === 'success') {
    return 'success'
  } else {
    return failFast(a, b)
  }
}

function intersection(A: Promise<Status[]>) {
  return A.then(A => A.slice(1).reduce(failFast, A[0]))
}

function union(A: Promise<Status[]>) {
  return A.then(A => A.slice(1).reduce(succeedFast, A[0]))
}

/**
 * Note: this code assumes that collapseMadeChoices has already been
 * applied to the `graph`.
 */
async function validate(graph: Graph): Promise<Status> {
  if (isSequence(graph)) {
    return intersection(Promise.all(graph.sequence.map(validate)))
  } else if (isParallel(graph)) {
    return intersection(Promise.all(graph.parallel.map(validate)))
  } else if (isChoice(graph)) {
    return union(Promise.all(graph.choices.map(_ => validate(_.graph))))
  } else if (isTitledSteps(graph)) {
    return intersection(Promise.all(graph.steps.map(_ => validate(_.graph))))
  } else if (isSubTask(graph)) {
    return validate(graph.graph)
  } else if (graph.optional) {
    // here we treat optional blocks as ... non-blockers
    // w.r.t. overall success
    return 'success'
  } else if (graph.validate) {
    try {
      await pexecInCurrentTab(graph.validate, undefined, true, true)
      return 'success'
    } catch (err) {
      return 'blank'
    }
  } else {
    return 'blank'
  }
}

export default async function validateGraph(graph: Graph): Promise<Status> {
  return (await validate(graph)) || 'blank'
}
