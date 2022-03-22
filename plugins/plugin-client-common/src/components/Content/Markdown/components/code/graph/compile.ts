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

import { CodeBlockProps, Choice, Graph, SubTask, emptySequence, TitledSteps, parallel, seq, sequence } from '.'

import {
  Import as CodeBlockImport,
  Choice as CodeBlockChoice,
  WizardStep as CodeBlockWizardStep,
  isChoice as isCodeBlockChoice,
  isImport as isCodeBlockImport,
  isWizardStep as isCodeBlockWizardStep
} from '../../Wizard/CodeBlockProps'

import optimize from './optimize'

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

/** Take a list of code blocks and arrange them into a control flow dag */
export default function compile(blocks: CodeBlockProps[], ordering: 'sequence' | 'parallel' = 'parallel'): Graph {
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
