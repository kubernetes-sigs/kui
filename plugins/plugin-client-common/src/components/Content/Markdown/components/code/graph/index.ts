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

import { v4 } from 'uuid'
import { basename } from 'path'

import { ChoiceState } from '../../..'
import CodeBlockProps, { Source, Choice as CodeBlockChoice, Title, Description } from '../../Wizard/CodeBlockProps'

export { CodeBlockProps, Title, Description }

/* map from choice group to selected choice member */
export type ChoicesMap = Record<CodeBlockChoice['group'], CodeBlockChoice['title']>

type Key = {
  key: string
}

type Filepath = {
  filepath: string
}

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

export type Sequence<T extends Unordered | Ordered = Unordered> = T &
  Key & {
    sequence: Graph<T>[]
  }

export type OrderedSequence = Sequence<Ordered>

export type TitledStep<T extends Unordered | Ordered = Unordered> = Source &
  Title &
  Partial<Description> & { graph: Sequence<T> }

export type TitledSteps<T extends Unordered | Ordered = Unordered> = T &
  Source &
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
    key: v4(),
    sequence: graphs.flatMap(_ => (isSequence(_) ? _.sequence : _))
  }
}

export function parallel(parallel: Graph[]): Parallel {
  return {
    key: v4(),
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

export type Choice<T extends Unordered | Ordered = Unordered> = Source &
  T &
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

export type Parallel<T extends Unordered | Ordered = Unordered> = T &
  Key & {
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

export type SubTask<T extends Unordered | Ordered = Unordered> = Key &
  Source &
  Filepath &
  Title &
  Partial<Description> &
  T & {
    graph: Sequence<T>
  }

export type OrderedSubTask = SubTask<Ordered>

export function subtask(
  key: string,
  title: string,
  description: string,
  filepath: string,
  graph: Sequence<Unordered>,
  source: Source['source'] = ''
): SubTask<Unordered> {
  return {
    key,
    title,
    description,
    filepath,
    graph,
    source
  }
}

function sameSubTask(A: SubTask, B: SubTask) {
  return (
    A.key === B.key && A.title === B.title && A.filepath === B.filepath && sameGraph(A.graph, B.graph) // eslint-disable-line @typescript-eslint/no-use-before-define
  )
}

type InteriorNode<T extends Unordered | Ordered = Unordered> =
  | Choice<T>
  | Sequence<T>
  | Parallel<T>
  | SubTask<T>
  | TitledSteps<T>

type LeafNode<T extends Unordered | Ordered = Unordered> = CodeBlockProps & T

export type Graph<T extends Unordered | Ordered = Unordered> = InteriorNode<T> | LeafNode<T>

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
 * @return the current choice index, which defaults to the first if we
 * are not provided a set of user choices via the `choices`
 * parameter. The decision to default to the first choice stems from a
 * common origin UI, of presenting choices in a set of tabs; in a
 * tabular UI, usually the first tab is open by default.
 */
export function chooseIndex(graph: Choice, choices: 'default-path' | ChoiceState = 'default-path') {
  const selectedTitle = choices !== 'default-path' ? choices.get(graph.group) : undefined

  const index = !selectedTitle ? 0 : graph.choices.findIndex(_ => _.title === selectedTitle)
  return index < 0 ? 0 : index
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
  choices: 'default-path' | ChoiceState = 'default-path'
): Graph<T> {
  return graph.choices[chooseIndex(graph, choices)].graph
}

export function hasSource(graph: Graph): graph is Graph & Source {
  return typeof (graph as any).source === 'string'
}

export function hasKey(graph: Graph): graph is Graph & Key {
  return typeof (graph as Key).key === 'string'
}

export function hasFilepath(graph: Graph): graph is Graph & Filepath {
  return isSubTask(graph) && !!graph.filepath
}

export function hasTitleProperty(graph: Graph): graph is Graph & Title & Partial<Description> {
  return isTitledSteps(graph) || isSubTask(graph)
}

export function hasTitle(graph: Graph): graph is Graph & Title & Partial<Description> {
  return hasTitleProperty(graph) && !!graph.title
}

export function extractTitle(graph: Graph) {
  if (hasTitle(graph)) {
    return graph.title
  } else if (isSubTask(graph) && graph.graph.sequence.length === 1 && hasTitleProperty(graph.graph.sequence[0])) {
    // Heuristic: in the case that this `graph` is a thin wrapper over
    // some other SubTask, and this graph does not have an explicit
    // `title` property, favor whatever title we can extract from the
    // inner subtask. This will make the models shown in `guide
    // foo.md` compatible with those shown in `replay foo.md`.
    return extractTitle(graph.graph.sequence[0])
  } else if (hasFilepath(graph)) {
    return basename(graph.filepath)
  }
}

function hasDescriptionProperty(graph: Graph): graph is Graph & Description {
  return isTitledSteps(graph) || isSubTask(graph)
}

export function extractDescription(graph: Graph) {
  if (hasDescriptionProperty(graph)) {
    return graph.description
  }
}
