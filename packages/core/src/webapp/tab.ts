/*
 * Copyright 2017 The Kubernetes Authors
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
import { isHeadless } from '../core/capabilities'
import { getImpl as getReplImpl } from '../repl/exec'

export interface Tab extends HTMLDivElement {
  uuid: string
  REPL: REPL
  state: TabState
  queueListener: EventListener // for input queueing, see queueing.ts
  _kui_session: Promise<any>

  onActivate(handler: (isActive: boolean) => void): void
  offActivate(handler: (isActive: boolean) => void): void

  addClass(cls: string): void
  removeClass(cls: string): void

  scrollToTop(): void
  scrollToBottom(): void
  getSize(): { width: number; height: number }

  splitCount(): number
  hasSideBySideTerminals(): boolean
}

export function isTab(node: Element | Tab): node is Tab {
  return node.classList.contains('kui--tab-content')
}

/**
 * Return the unique identifier for the given tab
 *
 */
export function getTabId(tab: Pick<Tab, 'uuid'>) {
  return tab.uuid
}

export function getTabIds(tab: Pick<Tab, 'uuid'>) {
  const uuid = getTabId(tab)
  if (uuid) {
    const [u1] = uuid.split(/_/)
    return u1 === uuid ? [u1] : [u1, uuid]
  } else {
    return []
  }
}

export function getPrimaryTabId(tab: Pick<Tab, 'uuid'>) {
  return getTabIds(tab)[0]
}

export function isTopLevelTab(tab: Pick<Tab, 'uuid'>) {
  return getPrimaryTabId(tab) === getTabId(tab)
}

export const sameTab = (tab1: Tab, tab2: Tab): boolean => {
  return getTabId(tab1) === getTabId(tab2)
}

export const getCurrentTab = (): Tab => {
  const tab = document.querySelector('.kui--tab-content.visible') as Tab

  if (isHeadless() && !tab.REPL) {
    getReplImpl(tab)
  }

  return tab
}

export const getTab = (idx: Tab | number): Tab => {
  if (!idx) {
    return getCurrentTab()
  } else if (typeof idx === 'number') {
    return document.querySelector(`.kui--tab-content[data-tab-id="${idx}"]`) as Tab
  } else {
    return idx
  }
}

/**
 * Execute the given command in the current (or given) tab.
 *
 * @param isInternalCallPath This is one plugin calling another
 * @param incognito Execute the command quietly but do not display the result in the Terminal
 *
 */
export function pexecInCurrentTab(command: string, topLevelTab?: Tab, isInternalCallpath = false, incognito = false) {
  const scrollback = ((topLevelTab || document).querySelector(
    (topLevelTab ? '' : '.kui--tab-content.visible') + ' .kui--scrollback:not([data-is-minisplit])'
  ) as any) as {
    facade: Tab
  }
  if (scrollback) {
    const { facade: tab } = scrollback
    return isInternalCallpath
      ? tab.REPL.qexec(command, undefined, undefined, { tab })
      : tab.REPL.pexec(command, { tab, echo: !incognito, noHistory: true })
  } else {
    return Promise.reject(
      new Error(
        'Internal Error: unable to execute in current tab, as there is no initialized scrollback in the current tab. This is probably due a race condition elsewhere in the code: trying to do the exec in parallel with the tab initialization.'
      )
    )
  }
}

export default Tab
