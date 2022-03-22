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
 * blocks. @see ../README.md for more detail.
 *
 * Given a set of code blocks. call `compile` to get a `Graph`. Given
 * a Graph, you may ask for its `progress` towards completion, or, via
 * `blocks`, ask for a linear dump back to the original set of code
 * blocks.
 *
 */

import CodeBlockProps, { Choice as CodeBlockChoice, Title, Description } from '../../Wizard/CodeBlockProps'

export { CodeBlockProps }

/* map from choice group to selected choice member */
export type ChoicesMap = Record<CodeBlockChoice['group'], CodeBlockChoice['member']>

/** Iteration order */
export interface Ordered {
  order: number
  postorder: number
  controlDependenceRegion?: {
    depth: number
    group: CodeBlockChoice['group']
  }
}

export type Unordered = Partial<Ordered>

export type Sequence<T extends Unordered | Ordered = Unordered> = T & {
  sequence: Graph<T>[]
}

export type OrderedSequence = Sequence<Ordered>

export type TitledStep<T extends Unordered | Ordered = Unordered> = Title &
  Partial<Description> & { graph: Sequence<T> }

export type TitledSteps<T extends Unordered | Ordered = Unordered> = T &
  Title &
  Partial<Description> & {
    steps: TitledStep<T>[]
  }

export type OrderedTitledSteps = TitledSteps<Ordered>

export function isSequence<T extends Unordered | Ordered = Unordered>(graph: Graph<T>): graph is Sequence<T> {
  return graph && Array.isArray((graph as Sequence).sequence)
}

export function sequence(graphs: Graph[]): Sequence {
  return {
    // here, we flatten nested sequences
    sequence: graphs.flatMap(_ => (isSequence(_) ? _.sequence : _))
  }
}

export function parallel(parallel: Graph[]): Parallel {
  return {
    parallel
  }
}

export function emptySequence(): Sequence {
  return sequence([])
}

export function seq(block: CodeBlockProps): Sequence {
  return sequence([block])
}

function sameSequence(A: Sequence = emptySequence(), B: Sequence = emptySequence()) {
  return (
    A.sequence.length === B.sequence.length &&
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    A.sequence.every((a, idx) => sameGraph(a, B.sequence[idx]))
  )
}

type ChoiceGroup = string
type ChoiceMember = number

export type ChoicePart<T extends Unordered | Ordered = Unordered> = {
  member: ChoiceMember
  title: string
  graph: Sequence<T>
}

export type Choice<T extends Unordered | Ordered = Unordered> = T &
  Title & {
    group: ChoiceGroup
    choices: ChoicePart<T>[]
  }

export type OrderedChoice = Choice<Ordered>

function sameChoice(A: Choice, B: Choice) {
  return (
    A.group === B.group &&
    A.choices.length === B.choices.length &&
    A.choices.every((a, idx) => a.member === B.choices[idx].member && sameSequence(a.graph, B.choices[idx].graph))
  )
}

export type Parallel<T extends Unordered | Ordered = Unordered> = T & {
  parallel: Graph<T>[]
}

export type OrderedParallel = Parallel<Ordered>

function sameParallel(A: Parallel, B: Parallel) {
  return (
    A.parallel.length === B.parallel.length &&
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    A.parallel.every((a, idx) => sameGraph(a, B.parallel[idx]))
  )
}

function sameStep(A: TitledSteps['steps'][0], B: TitledSteps['steps'][0]) {
  return (
    A.title === B.title &&
    A.description === B.description &&
    A.graph.sequence.length === B.graph.sequence.length &&
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    A.graph.sequence.every((a, idx) => sameGraph(a, B.graph.sequence[idx]))
  )
}

function sameTitledSteps(A: TitledSteps, B: TitledSteps) {
  return (
    A.title === B.title &&
    A.description === B.description &&
    A.steps.length === B.steps.length &&
    A.steps.every((a, idx) => sameStep(a, B.steps[idx]))
  )
}

export type SubTask<T extends Unordered | Ordered = Unordered> = T & {
  key: string
  title: string
  filepath: string
  graph: Sequence<T>
}

export type OrderedSubTask = SubTask<Ordered>

export function subtask(key: string, title: string, filepath: string, graph: Sequence<Unordered>): SubTask<Unordered> {
  return {
    key,
    title,
    filepath,
    graph
  }
}

function sameSubTask(A: SubTask, B: SubTask) {
  return (
    A.key === B.key && A.title === B.title && A.filepath === B.filepath && sameGraph(A.graph, B.graph) // eslint-disable-line @typescript-eslint/no-use-before-define
  )
}

export type Graph<T extends Unordered | Ordered = Unordered> =
  | Choice<T>
  | Sequence<T>
  | Parallel<T>
  | SubTask<T>
  | TitledSteps<T>
  | (CodeBlockProps & T)

export type OrderedGraph = Graph<Ordered>

export type OrderedCodeBlock = CodeBlockProps & Ordered

export function isChoice<T extends Unordered | Ordered = Unordered>(graph: Graph<T>): graph is Choice<T> {
  return graph && Array.isArray((graph as Choice).choices)
}

export function isParallel<T extends Unordered | Ordered = Unordered>(graph: Graph<T>): graph is Parallel<T> {
  return graph && Array.isArray((graph as Parallel).parallel)
}

export function isTitledSteps<T extends Unordered | Ordered = Unordered>(graph: Graph<T>): graph is TitledSteps<T> {
  const ts = graph as TitledSteps<T>
  return ts && typeof ts.title === 'string' && Array.isArray(ts.steps)
}

export function isSubTask<T extends Unordered | Ordered = Unordered>(graph: Graph<T>): graph is SubTask<T> {
  const subtask = graph as SubTask
  return subtask && typeof subtask.key === 'string' && typeof subtask.filepath === 'string'
}

function sameCodeBlock(a: CodeBlockProps, b: CodeBlockProps) {
  return (
    a.id === b.id &&
    a.validate === b.validate &&
    a.body === b.body &&
    a.language === b.language &&
    a.optional === b.optional
  )
}

export function isEmpty(A: Graph): boolean {
  return (
    (isSequence(A) && A.sequence.length === 0) ||
    (isParallel(A) && A.parallel.length === 0) ||
    (isTitledSteps(A) && A.steps.length === 0) ||
    (isChoice(A) && A.choices.length === 0)
  )
}

export function sameGraph(A: Graph, B: Graph) {
  if (isChoice(A)) {
    return isChoice(B) && sameChoice(A, B)
  } else if (isSequence(A)) {
    return isSequence(B) && sameSequence(A, B)
  } else if (isParallel(A)) {
    return isParallel(B) && sameParallel(A, B)
  } else if (isTitledSteps(A)) {
    return isTitledSteps(B) && sameTitledSteps(A, B)
  } else if (isSubTask(A)) {
    return isSubTask(B) && sameSubTask(A, B)
  } else {
    return !isChoice(B) && !isSequence(B) && !isParallel(B) && !isTitledSteps(B) && !isSubTask(B) && sameCodeBlock(A, B)
  }
}

/**
 * @return the current choice, which defaults to the first if we are
 * not provided a set of user choices via the `choices` parameter. The
 * decision to default to the first choice stems from a common origin
 * UI, of presenting choices in a set of tabs; in a tabular UI,
 * usually the first tab is open by default.
 */
export function choose<T extends Unordered | Ordered = Unordered>(
  graph: Choice<T>,
  choices: 'default-path' | ChoicesMap = 'default-path'
): Graph<T> {
  const selectedMember = choices !== 'default-path' ? choices[graph.group] : undefined

  const choice = (selectedMember && graph.choices.find(_ => _.member === selectedMember)) || graph.choices[0]

  return choice.graph
}
