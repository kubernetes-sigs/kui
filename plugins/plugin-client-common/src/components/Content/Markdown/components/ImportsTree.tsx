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

import { TreeViewProps } from '@patternfly/react-core'

import { isChoice, isSubTask, isTitledSteps } from './code/graph'

export default abstract class Tree {
  /**
   * Transform A -> Import1,Import2,Wizard -> Step1,Step2,Step3
   *      ===> A -> Wizard -> Import1,Import2,Step1,Step2,Step3
   *
   * i.e. if A has exactly one Wizard child, and more than one Import
   * child, and no other children, then we can fold the Imports and
   * treat them as prefix steps in the Wizard
   */
  private static xformFoldImportsIntoWizards(children: TreeViewProps['data'], depth = 0): TreeViewProps['data'] {
    const { subtasks, titledSteps, rest } = children.reduce(
      (P, child) => {
        const origin = child['data-origin']
        if (origin && isTitledSteps(origin)) {
          P.titledSteps.push(child)
        } else if (origin && isSubTask(origin)) {
          P.subtasks.push(child)
        } else {
          P.rest.push(child)
        }
        return P
      },
      {
        subtasks: [] as TreeViewProps['data'],
        titledSteps: [] as TreeViewProps['data'],
        rest: [] as TreeViewProps['data']
      }
    )

    if (subtasks.length > 0 && titledSteps.length === 1 && rest.length === 0) {
      const wizard = titledSteps[0]
      const prereqs = {
        name: 'Prerequisites',
        hasBadge: true,
        children: subtasks,
        defaultExpanded: depth < 2
      }
      wizard.children.splice(0, 0, prereqs)
      return [wizard]
    } else {
      return children
    }
  }

  /**
   * Transform A -> Choice -> 1,2,3,4
   *      ===> A -> 1,2,3,4
   *
   * i.e. if A has only one child, and it is a Choice, then we can
   * skip this intermediate Choice node
   */
  public static xformFoldChoices(children: TreeViewProps['data']) {
    const isNestedChoice = children.length === 1 && children[0]['data-origin'] && isChoice(children[0]['data-origin'])

    if (isNestedChoice) {
      return children[0].children
    } else {
      return children
    }
  }

  public static optimize(children: TreeViewProps['data'], depth = 0): TreeViewProps['data'] {
    return Tree.xformFoldImportsIntoWizards(Tree.xformFoldChoices(children), depth)
  }
}
