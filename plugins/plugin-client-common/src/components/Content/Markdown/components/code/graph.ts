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

import CodeBlockProps, {
  Import as CodeBlockImport,
  Choice as CodeBlockChoice,
  WizardStep as CodeBlockWizardStep,
  Title,
  Description,
  isChoice as isCodeBlockChoice,
  isImport as isCodeBlockImport,
  isWizardStep as isCodeBlockWizardStep
} from '../Wizard/CodeBlockProps'
import { ProgressStepState } from '../../../ProgressStepper'

import hoistSubTasks from './graph/hoistSubTasks'

type Status = ProgressStepState['status']

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

type TitledStep<T extends Unordered | Ordered = Unordered> = Title & Partial<Description> & { graph: Sequence<T> }

type TitledSteps<T extends Unordered | Ordered = Unordered> = T &
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

function seq(block: CodeBlockProps): Sequence {
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

type ChoicePart<T extends Unordered | Ordered = Unordered> = {
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

type Parallel<T extends Unordered | Ordered = Unordered> = T & {
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

type ChoiceNesting = { parent: CodeBlockChoice; graph: Choice }
type SubTaskNesting = { parent: CodeBlockImport; graph: SubTask }
type WizardStepNesting = { parent: CodeBlockWizardStep; graph: TitledSteps }
type Nesting = ChoiceNesting | SubTaskNesting | WizardStepNesting

/* function isGroupMemberNesting(nesting: Nesting): nesting is ChoiceNesting | WizardStepNesting {
  return isGroupMember(nesting.parent)
} */

function isChoiceNesting(nesting: Nesting): nesting is ChoiceNesting {
  return isCodeBlockChoice(nesting.parent)
}

function isImportNesting(nesting: Nesting): nesting is SubTaskNesting {
  return isCodeBlockImport(nesting.parent)
}

function isWizardStepNesting(nesting: Nesting): nesting is WizardStepNesting {
  return isCodeBlockWizardStep(nesting.parent)
}

function optimize(graph: Graph) {
  return hoistSubTasks(graph)
  // return graph
}

/** Take a list of code blocks and arrange them into a control flow dag */
export function compile(blocks: CodeBlockProps[], ordering: 'sequence' | 'parallel' = 'parallel'): Graph {
  if (!blocks) {
    return undefined
  }

  const parts: Graph[] = []
  let currentNesting: Nesting[] = []

  const newChoice = (block: CodeBlockProps, parent: CodeBlockChoice, isDeepest: boolean) => ({
    graph: isDeepest ? seq(block) : emptySequence(),
    title: parent.title,
    member: parent.member
  })

  const newChoices = (block: CodeBlockProps, parent: CodeBlockChoice, isDeepest: boolean): Choice => ({
    title: parent.groupTitle,
    group: parent.group,
    choices: [newChoice(block, parent, isDeepest)]
  })

  const newWizardStep = (
    block: CodeBlockProps,
    parent: CodeBlockWizardStep,
    isDeepest: boolean
  ): TitledSteps['steps'][0] => {
    return {
      title: parent.title,
      description: parent.description,
      graph: isDeepest ? seq(block) : emptySequence()
    }
  }

  const addToCurrentWizardStep = (
    wiz: TitledSteps,
    block: CodeBlockProps,
    parent: CodeBlockWizardStep,
    isDeepest: boolean
  ): TitledSteps => {
    if (isDeepest) {
      wiz.steps[wiz.steps.length - 1].graph.sequence.push(block)
    }
    return wiz
  }

  const addWizardStep = (
    wiz: TitledSteps,
    block: CodeBlockProps,
    parent: CodeBlockWizardStep,
    isDeepest: boolean
  ): TitledSteps => {
    wiz.steps.push(newWizardStep(block, parent, isDeepest))
    return wiz
  }

  const newWizard = (block: CodeBlockProps, parent: CodeBlockWizardStep, isDeepest: boolean): TitledSteps => {
    const wiz = {
      title: parent.wizard.title,
      description: parent.wizard.description,
      steps: []
    }
    return addWizardStep(wiz, block, parent, isDeepest)
  }

  const newSubTask = (block: CodeBlockProps, parent: CodeBlockImport, isDeepest: boolean): SubTask => ({
    key: parent.key,
    title: parent.title,
    filepath: parent.filepath,
    graph: isDeepest ? seq(block) : emptySequence()
  })

  const set = (idx: number, nesting: Nesting) => {
    currentNesting = currentNesting.slice(0, idx).concat([nesting])
    if (idx === 0) {
      parts.push(nesting.graph)
    } else {
      const parent = currentNesting[idx - 1]
      if (isChoiceNesting(parent)) {
        parent.graph.choices[parent.graph.choices.length - 1].graph.sequence.push(nesting.graph)
      } else if (isWizardStepNesting(parent)) {
        parent.graph.steps[parent.graph.steps.length - 1].graph.sequence.push(nesting.graph)
      } else {
        parent.graph.graph.sequence.push(nesting.graph)
      }
    }
  }

  blocks.forEach(block => {
    if (!block.nesting) {
      parts.push(block)
    } else {
      block.nesting.forEach((parent, idx) => {
        const isDeepest = idx === block.nesting.length - 1
        const curNesting = currentNesting[idx]

        // expect >=3^2 combinations
        // [1] parent is Choice, current nesting is Choice
        //   [1a] same group and member; add to the current choice graph
        //   [1b] same group different member; add a new choice member node
        //   [1c] different group; create new choice node
        // [2] [3] parent is Choice, current nesting is WizardStep or Import
        //    *: create new Choice node
        // [4] parent is WizardStep, current nesting is WizardStep
        //   [4a] same wizard, same step; add to its graph
        //   [4b] same wizard, different step; create new step node
        //   [4c] different wizard
        // [5] [6] parent is WizardStep, current nesting is Choice or Import
        //    *: create new WizardStep node
        // [7] parent is Import, current nesting is Import
        //   [7a] same import; add to current Import graph
        //   [7b] different import; create new import node
        // [8] [9] parent is Import, current nesting is Choice or WizardStep
        //    *: create new Import node
        if (curNesting) {
          if (isCodeBlockChoice(parent)) {
            if (isChoiceNesting(curNesting)) {
              // here we are at [1]
              if (curNesting.parent.group === parent.group) {
                if (curNesting.parent.member === parent.member) {
                  // here we are at [1a]
                  if (isDeepest) {
                    curNesting.graph.choices[curNesting.graph.choices.length - 1].graph.sequence.push(block)
                  }
                } else {
                  // here we are at [1b]
                  currentNesting = [...currentNesting.slice(0, idx), { parent, graph: curNesting.graph }]
                  curNesting.graph.choices.push(newChoice(block, parent, isDeepest))
                }
              } else {
                // here we are at [1c]
                set(idx, { parent, graph: newChoices(block, parent, isDeepest) })
              }
            } else {
              // here we are at [2] and [3]
              set(idx, { parent, graph: newChoices(block, parent, isDeepest) })
            }
          } else if (isCodeBlockWizardStep(parent)) {
            // here we are at [4]
            if (isWizardStepNesting(curNesting)) {
              if (curNesting.parent.group === parent.group) {
                if (curNesting.parent.member === parent.member) {
                  // here we are at [4a]
                  addToCurrentWizardStep(curNesting.graph, block, parent, isDeepest)
                } else {
                  // here we are at [4b]
                  currentNesting = [...currentNesting.slice(0, idx), { parent, graph: curNesting.graph }]
                  addWizardStep(curNesting.graph, block, parent, isDeepest)
                }
              } else {
                // here we are at [4c]
                set(idx, { parent, graph: newWizard(block, parent, isDeepest) })
              }
            } else {
              // here we are at [5] and [6]
              set(idx, { parent, graph: newWizard(block, parent, isDeepest) })
            }
          } else if (isImportNesting(curNesting)) {
            // here we are at [7]
            if (curNesting.parent.key === parent.key) {
              // here we are at [7a]
              if (isDeepest) {
                curNesting.graph.graph.sequence.push(block)
              }
            } else {
              // here we are at [7b]
              set(idx, { parent, graph: newSubTask(block, parent, isDeepest) })
            }
          } else {
            // here we are at [8] and [9]
            set(idx, { parent, graph: newSubTask(block, parent, isDeepest) })
          }
        } else {
          // no graph node yet for this nesting depth
          if (isCodeBlockChoice(parent)) {
            // new graph node for choice
            set(idx, { parent, graph: newChoices(block, parent, isDeepest) })
          } else if (isCodeBlockWizardStep(parent)) {
            // new graph node for wizard
            set(idx, { parent, graph: newWizard(block, parent, isDeepest) })
          } else if (isCodeBlockImport(parent)) {
            // new graph node for import
            set(idx, { parent, graph: newSubTask(block, parent, isDeepest) })
          } else {
            console.error('Missing handler in graph compilation', parent)
          }
        }
      })
    }
  })

  return optimize(
    parts.length === 0
      ? undefined
      : parts.length === 1
      ? parts[0]
      : ordering === 'parallel'
      ? parallel(parts)
      : sequence(parts)
  )
}

function orderSequence(graph: Sequence = emptySequence(), ordinal = 0): Sequence<Ordered> {
  const { postorder, sequence } = graph.sequence.reduce(
    (P: { postorder: number; sequence: Graph<Ordered>[] }, _) => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      const subgraph = order(_, P.postorder + 1)
      P.sequence.push(subgraph)
      return { postorder: subgraph.postorder, sequence: P.sequence }
    },
    { postorder: ordinal, sequence: [] }
  )

  return { order: ordinal, postorder, sequence }
}

function orderParallel(graph: Parallel, ordinal: number): Parallel<Ordered> {
  const { postorder, parallel } = graph.parallel.reduce(
    (P: { postorder: number; parallel: Graph<Ordered>[] }, _) => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      const subgraph = order(_, P.postorder + 1)
      P.parallel.push(subgraph)
      return { postorder: subgraph.postorder, parallel: P.parallel }
    },
    { postorder: ordinal, parallel: [] }
  )

  return { order: ordinal, postorder, parallel }
}

function orderTitledSteps(graph: TitledSteps<Unordered>, ordinal = 0): TitledSteps<Ordered> {
  const { postorder, steps } = graph.steps.reduce(
    (P: { postorder: number; steps: TitledStep<Ordered>[] }, _) => {
      const step = Object.assign({}, _, { graph: orderSequence(_.graph, P.postorder + 1) })
      P.steps.push(step)
      return { postorder: step.graph.postorder, steps: P.steps }
    },
    { postorder: ordinal, steps: [] }
  )

  return Object.assign({}, graph, { order: ordinal, postorder, steps })
}

export function orderSubTask(graph: SubTask<Unordered>, ordinal = 0): SubTask<Ordered> {
  const ordered = orderSequence(graph.graph, ordinal + 1)

  return Object.assign({}, graph, {
    order: ordinal,
    postorder: ordered.postorder,
    graph: ordered
  })
}

function orderChoice(graph: Choice, ordinal = 0): Choice<Ordered> {
  const { postorder, choices } = graph.choices.reduce(
    (P: { postorder: number; choices: ChoicePart<Ordered>[] }, _) => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      const choice = Object.assign({}, _, { graph: orderSequence(_.graph, P.postorder + 1) })
      P.choices.push(choice)
      return { postorder: choice.graph.postorder, choices: P.choices }
    },
    { postorder: ordinal, choices: [] }
  )

  return Object.assign({}, graph, { order: ordinal, postorder, choices })
}

function orderCodeBlock(graph: CodeBlockProps, ordinal: number): CodeBlockProps & Ordered {
  return Object.assign({}, graph, { order: ordinal, postorder: ordinal })
}

// T extends Sequence ? Sequence<Ordered> : T extends Parallel ? Parallel<Ordered> : T extends Choice ? Choice<Ordered> : (CodeBlockProps & Ordered)
export function order<T extends Graph<Unordered>>(graph: T, ordinal = 0): Graph<Ordered> {
  if (isSequence(graph)) {
    return orderSequence(graph, ordinal)
  } else if (isParallel(graph)) {
    return orderParallel(graph, ordinal)
  } else if (isSubTask(graph)) {
    return orderSubTask(graph, ordinal)
  } else if (isTitledSteps(graph)) {
    return orderTitledSteps(graph, ordinal)
  } else if (isChoice(graph)) {
    return orderChoice(graph, ordinal)
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

/** @return progress towards success of the given `graph` */
export function progress(
  graph: Graph<Ordered>,
  statusMap?: Record<string, Status> /* map key is code block id */,
  choices?: ChoicesMap,
  filterOut?: (props: CodeBlockProps) => boolean
): { nDone: number; nError: number; nTotal: number; nextOrdinals: number[] } {
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
