/*
 * Copyright 2021 The Kubernetes Authors
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

import { Transformer } from 'unified'
import { Element, ElementContent } from 'hast'

import isElementWithProperties from '../isElement'

import { ChoiceState } from '..'
import populateTabs from './populate'
import identifyRecognizableTabGroups from './groups'

export const START_OF_TAB = `<!-- ____KUI_START_OF_TAB____ -->`
export const PUSH_TABS = `<!-- ____KUI_NESTED_TABS____ -->`
export const END_OF_TAB = `<!-- ____KUI_END_OF_TAB____ -->`

export function isTab(elt: ElementContent): boolean {
  return isElementWithProperties(elt) && elt.properties['data-kui-tab-index'] !== undefined
}

export function isTabWithProperties(elt: ElementContent): elt is Element {
  return isTab(elt)
}

export function isTabGroup(elt: Element): boolean {
  return elt.properties['data-kui-choice-group'] !== undefined
}

export function setTabGroup(elt: Element, group: string) {
  elt.properties['data-kui-choice-group'] = group
}

export function getTabTitle(elt: Element): string {
  return elt.properties.title.toString()
}

export function setTabTitle(elt: Element, title: string): string {
  return (elt.properties.title = title)
}

export default function plugin(uuid: string, choices: ChoiceState) {
  return function rehypeTabbed(tree: Parameters<Transformer>[0]): ReturnType<Transformer> {
    // first, assemble the tabs into this tree structure, one of these per tab group:
    // - div with properties {data-kui-choice-group, data-kui-choice-nesting-depth}
    //   - span with properties {data-kui-tab-index=0}
    //       children: content of first tab
    //   - span with properties {data-kui-tab-index=1}
    //       children: content of second tab
    //   - span with properties {data-kui-tab-index=2}
    //       children: content of third tab
    //
    const { tree: treeWithTabs, tabgroupIdx } = populateTabs(uuid, tree)

    // second, analyze the tabs to see if we can identify recognizable
    // tab groups, e.g. "choose your platform"
    const treeWithTabsInRecognizableGroups =
      tabgroupIdx < 0 ? treeWithTabs : identifyRecognizableTabGroups(treeWithTabs, choices)

    return treeWithTabsInRecognizableGroups
  }
}
