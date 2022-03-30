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

import { Element } from 'hast'

import { ChoiceState } from '../..'
import { getTabTitle, isTabWithProperties, setTabGroup, setTabTitle } from '..'

class Arch {
  /** internal, the value should be namespaced and unique, but the particulars don't matter */
  private readonly choiceGroup = 'org.kubernetes-sigs.kui/choice/arch'

  private readonly archs: Record<string, typeof process['arch']> = {
    intel: 'x64',
    x86: 'x64',

    arm: 'arm64',
    arm64: 'arm64',
    'apple silicon': 'arm64',
    m1: 'arm64',
    m2: 'arm64'
  }

  private readonly findArch = (str: string) => this.archs[str.toLowerCase()]

  /**
   * This code assumes the given `node` satisfies `import('..').isTabGroup`.
   *
   * @return whether or not this tab group represents a "what architecture are you on" choice group.
   */
  private isMatchingTabGroup(node: Element) {
    return node.children
      .filter(isTabWithProperties)
      .map(getTabTitle)
      .every(this.findArch)
  }

  private capitalize(str: string) {
    return str[0].toUpperCase() + str.slice(1)
  }

  private rewriteTabsToUseCanonicalNames(node: Element) {
    node.children.forEach(tab => {
      if (isTabWithProperties(tab)) {
        setTabTitle(tab, this.capitalize(this.findArch(getTabTitle(tab))))
      }
    })
  }

  /** Set the architecture choice group to use the current host arch */
  public populateChoice(choices: ChoiceState) {
    choices.set(this.choiceGroup, process.arch)
  }

  /** Check if the given `node` is a tab group that we can inform */
  public checkAndSet(node: Element) {
    if (this.isMatchingTabGroup(node)) {
      setTabGroup(node, this.choiceGroup)
      this.rewriteTabsToUseCanonicalNames(node)
      return true
    }
  }
}

export default new Arch()
