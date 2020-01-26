/*
 * Copyright 2017-19 IBM Corporation
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

import REPL from '../models/repl'
import TabState from '../models/tab-state'

export interface Tab extends HTMLElement {
  REPL: REPL
  state: TabState
  _kui_session: Promise<any>
}

const tabTagPattern = /^tab$/i

export function isTab(node: Element): node is Tab {
  return tabTagPattern.test(node.tagName)
}

/**
 * Return the unique identifier for the given tab
 *
 */
export function getTabId(tab: Tab) {
  return tab.getAttribute('data-tab-id')
}

export const sameTab = (tab1: Tab, tab2: Tab): boolean => {
  return getTabId(tab1) === getTabId(tab2)
}

export const getTabFromTarget = (target: EventTarget): Tab => {
  if (target) {
    let iter = target as Element

    while (iter && !isTab(iter)) {
      iter = iter.parentElement
    }

    if (iter && isTab(iter)) {
      return iter
    }

    // debug('current tab fallthrough', target)
  }

  // fallthrough
  return document.querySelector('tab.visible')
}

export const getCurrentTab = (): Tab => {
  return getTabFromTarget(document.activeElement)
}
