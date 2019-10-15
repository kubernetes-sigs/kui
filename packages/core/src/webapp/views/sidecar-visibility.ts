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

import { getSidecar, Sidecar, CustomSpec } from './sidecar-core'

import { Tab, getTabFromTarget } from '../tab'
import Presentation from './presentation'
import { scrollIntoView } from '../scroll'

import { EntitySpec } from '../../models/entity'

import eventBus from '../../core/events'

export const enableTabIndex = (sidecar: Sidecar, tabbable = true) => {
  const notabElements = document.querySelectorAll('.kui--notab-when-sidecar-hidden')

  notabElements.forEach(element => {
    if (tabbable) {
      element.removeAttribute('tabindex')
    } else {
      element.setAttribute('tabindex', '-1')
    }
  })
}

export const isVisible = (tab: Tab): boolean => {
  const sidecar = getSidecar(tab)
  return !!(sidecar.classList.contains('visible') && sidecar)
}

export const setVisibleClass = (sidecar: Sidecar) => {
  sidecar.classList.add('visible')
}

const setVisible = (sidecar: Sidecar) => {
  const tab = getTabFromTarget(sidecar)

  setVisibleClass(sidecar)
  enableTabIndex(sidecar)
  tab.classList.remove('sidecar-is-minimized')
  sidecar.classList.remove('minimized')
  document.body.classList.add('sidecar-visible')

  const replView = tab.querySelector('.repl')
  replView.classList.add('sidecar-visible')

  scrollIntoView()

  setTimeout(() => eventBus.emit('/sidecar/toggle', { sidecar, tab }), 0)
}

export const currentSelection = (tab: Tab): EntitySpec | CustomSpec => {
  const sidecar = getSidecar(tab)
  return sidecar && sidecar.entity
}

export const show = async (tab: Tab, block?: HTMLElement, nextBlock?: HTMLElement) => {
  const sidecar = getSidecar(tab)
  if (currentSelection(tab) || sidecar.className.indexOf('custom-content') >= 0) {
    setVisible(sidecar)
    enableTabIndex(sidecar)
    return true
  } else if (block && nextBlock) {
    const { oops } = await import('../oops')
    oops(undefined, block, nextBlock)(new Error('You have no entity to show'))
  }
}

export const hide = (tab: Tab, clearSelectionToo = false) => {
  const sidecar = getSidecar(tab)
  sidecar.classList.remove('visible')
  enableTabIndex(sidecar, false)

  if (!clearSelectionToo) {
    // only minimize if we weren't asked to clear the selection
    sidecar.classList.add('minimized')
    tab.classList.add('sidecar-is-minimized')
  } else {
    document.body.classList.remove('sidecar-visible')
  }

  const replView = tab.querySelector('.repl')
  replView.classList.remove('sidecar-visible')

  // we just hid the sidecar. make sure the current prompt is active for text input
  // cli.getCurrentPrompt().focus()

  // were we asked also to clear the selection?
  if (clearSelectionToo && sidecar.entity) {
    delete sidecar.entity
  }

  setTimeout(() => eventBus.emit('/sidecar/toggle', { sidecar, tab }), 0)
  return true
}

export const clearSelection = (tab: Tab) => {
  // true means also clear selection model
  return hide(tab, true)
}

/**
 * Toggle sidecar visibility
 *
 */
export const toggle = (tab: Tab) => {
  if (!isVisible(tab)) {
    return show(tab)
  } else {
    const presentationString = document.body.getAttribute('data-presentation') as keyof typeof Presentation
    const presentation: Presentation = presentationString && Presentation[presentationString]
    // Key.Escape for Presentation.SidecarThin is interpreted as Close
    return presentation === Presentation.SidecarThin ? clearSelection(tab) : hide(tab)
  }
}

type Op = (elt: Element, cls: string) => void
export const remove: Op = (elt: Element, cls: string) => elt.classList.remove(cls)
const add: Op = (elt: Element, cls: string) => elt.classList.add(cls)
const toggleClass: Op = (elt: Element, cls: string) => elt.classList.toggle(cls)
/**
 * Ensure that we are in sidecar maximization mode
 *
 */
export const setMaximization = (tab: Tab, op: Op = add, cause: MaximizationCause = 'default') => {
  if (document.body.classList.contains('subwindow')) {
    op(document.body, 'sidecar-full-screen')
    op(document.body, 'sidecar-visible')
  }

  const before = tab.classList.contains('sidecar-full-screen')
  op(tab, 'sidecar-full-screen')
  const after = tab.classList.contains('sidecar-full-screen')

  if (before !== after) {
    setTimeout(() => eventBus.emit('/sidecar/maximize'), 0)
  }

  if (after) {
    // if we entered full screen mode, remember if the user caused it,
    // so that we don't undo it during our normal flow
    tab.setAttribute('maximization-cause', cause)
  } else {
    tab.removeAttribute('maximization-cause')
  }
}

/** was maximization changed by user request, or by normal default processes? */
type MaximizationCause = 'default' | 'user'

/**
 * Toggle sidecar maximization
 *
 */
export const toggleMaximization = (tab: Tab, cause?: MaximizationCause) => {
  setMaximization(tab, toggleClass, cause)
}
