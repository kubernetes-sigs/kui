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

class Platform {
  /** internal, the value should be namespaced and unique, but the particulars don't matter */
  private readonly choiceGroup = 'org.kubernetes-sigs.kui/choice/platform'

  private readonly platforms: Record<string, typeof process['platform']> = {
    mac: 'darwin',
    macos: 'darwin',
    darwin: 'darwin',

    linux: 'linux',

    win: 'win32',
    win32: 'win32',
    windows: 'win32'
  }

  private readonly findPlatform = (str: string) => this.platforms[str.toLowerCase()]

  /**
   * This code assumes the given `node` satisfies `import('..').isTabGroup`.
   *
   * @return whether or not this tab group represents a "what platform are you on" choice group.
   */
  private isMatchingTabGroup(node: Element) {
    return node.children
      .filter(isTabWithProperties)
      .map(getTabTitle)
      .every(this.findPlatform)
  }

  private capitalize(str: string) {
    return str[0].toUpperCase() + str.slice(1)
  }

  private rewriteTabsToUseCanonicalNames(node: Element) {
    node.children.forEach(tab => {
      if (isTabWithProperties(tab)) {
        setTabTitle(tab, this.capitalize(this.findPlatform(getTabTitle(tab))))
      }
    })
  }

  /** Set the platform choice group to use the current host platform */
  public populateChoice(choices: ChoiceState) {
    choices.set(this.choiceGroup, process.platform, false)
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

export default new Platform()
