/*
 * Copyright 2020 IBM Corporation
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

import { keys } from '../keys'
import { Tab, getTabId } from '../tab'
import { isPopup } from '../popup-core'
import eventBus from '../../core/events'
import { scrollIntoView } from '../scroll'
import { getCurrentPrompt } from '../prompt'
import Presentation from '../views/presentation'
import { KuiFramedComponent, isSingleton } from './component'

/** toggling classes */
type Op = (elt: Element, cls: string) => void
const remove: Op = (elt: Element, cls: string) => elt.classList.remove(cls)
// const add: Op = (elt: Element, cls: string) => elt.classList.add(cls)
const toggle: Op = (elt: Element, cls: string) => elt.classList.toggle(cls)

// temporary until we make this React
const tabFrames: Record<string, KuiFrame> = {}

export default class KuiFrame {
  /**
   * Cleaners for any global handlers we might have registered
   *
   */
  private cleaners: (() => void)[] = []

  /**
   * The internal DOM representation
   *
   */
  private dom: HTMLElement

  public attach(component: KuiFramedComponent, tab: Tab) {
    this.dom = document.createElement('sidecar')

    // the container for the frame
    const container =
      component.frame.position === 'TabColumn' ? tab.querySelector('tabcolumn') : tab.querySelector('tabrow')

    if (isSingleton(component)) {
      const { viewId } = component.frame

      const existing = tabFrames[getTabId(tab)]
      if (existing) {
        existing.destroy()
      }

      tabFrames[getTabId(tab)] = this
      this.dom.setAttribute('data-view-id', viewId)
    }

    try {
      this.initEvents(tab)
      this.presentAs(tab, component.frame.presentation || Presentation.Default)
    } catch (err) {
      console.error(err)
    }

    // FIXME; the custom-content part we can fix, once we unlock sidecar.css
    this.setVisible(tab)
    this.dom.classList.add('visible')

    this.dom.appendChild(component.spec.content)
    container.appendChild(this.dom)
  }

  /**
   * Escape key toggles sidecar visibility
   *
   */
  private initEscapeKeyHandler(tab: Tab) {
    const handler = (evt: KeyboardEvent) => {
      if (
        document.activeElement &&
        !(
          document.activeElement === document.body ||
          document.activeElement.classList.contains('inputarea') || // monaco-editor
          document.activeElement.classList.contains('repl-input-element')
        )
      ) {
        // not focused on repl
        return
      }

      if (evt.keyCode === keys.ESCAPE) {
        if (!isPopup()) {
          const closeButton = tab.querySelector('sidecar .sidecar-bottom-stripe-close')
          if (this.isVisible()) {
            closeButton.classList.add('hover')
            setTimeout(() => closeButton.classList.remove('hover'), 500)
          }
          this.toggle(tab)
          scrollIntoView()
        }
      }
    }

    document.addEventListener('keyup', handler)
    this.cleaners.push(() => {
      document.removeEventListener('keyup', handler)
    })
  }

  /**
   * Listen for cleanup notifications
   *
   */
  private initCloseAllHandler(tab: Tab) {
    const handler = () => {
      this.close(tab)
    }

    eventBus.on(`/close/views/${getTabId(tab)}`, handler)
    this.cleaners.push(() => {
      eventBus.off(`/close/views/${getTabId(tab)}`, handler)
    })
  }

  /**
   * Ensure that we are in sidecar maximization mode
   *
   */
  private toggleMaximization(tab: Tab, op = toggle) {
    if (isPopup()) {
      op(document.body, 'sidecar-full-screen')
      op(document.body, 'sidecar-visible')
    }

    const before = tab.classList.contains('sidecar-full-screen')
    op(tab, 'sidecar-full-screen')
    const after = tab.classList.contains('sidecar-full-screen')

    if (before !== after) {
      setTimeout(() => eventBus.emit('/sidecar/maximize', this), 0)
    }
  }

  /**
   * Is the sidecar currently visible in the given tab
   *
   */
  public isVisible(): boolean {
    return this.dom.classList.contains('visible')
  }

  private enableTabIndex(tabbable = true) {
    const notabElements = this.dom.querySelectorAll('.kui--notab-when-sidecar-hidden')

    notabElements.forEach(element => {
      if (tabbable) {
        element.removeAttribute('tabindex')
      } else {
        element.setAttribute('tabindex', '-1')
      }
    })
  }

  private setVisibleClass() {
    this.dom.classList.remove('minimized')
    this.dom.classList.add('visible')
    this.enableTabIndex()
  }

  private setVisible(tab: Tab) {
    this.setVisibleClass()

    tab.classList.remove('sidecar-is-minimized')
    this.dom.classList.remove('minimized')
    document.body.classList.add('sidecar-visible')

    const replView = tab.querySelector('.repl')
    replView.classList.add('sidecar-visible')

    // scrollIntoView()

    setTimeout(() => eventBus.emit('/sidecar/toggle', { sidecar: this.dom, tab }), 0)
  }

  private show(tab: Tab) {
    this.setVisible(tab)
    this.enableTabIndex()
    return true
  }

  private hide(tab: Tab, clearSelectionToo = false) {
    this.dom.classList.remove('visible')
    this.enableTabIndex(false)

    if (!clearSelectionToo) {
      // only minimize if we weren't asked to clear the selection
      this.dom.classList.add('minimized')
      tab.classList.add('sidecar-is-minimized')
    } else {
      document.body.classList.remove('sidecar-visible')
    }

    const replView = tab.querySelector('.repl')
    replView.classList.remove('sidecar-visible')

    // we just hid the sidecar. make sure the current prompt is active for text input
    /// ////// cli.getCurrentPrompt().focus()

    setTimeout(() => eventBus.emit('/sidecar/toggle', { sidecar: this.dom, tab }), 0)
    return true
  }

  private clearSelection(tab: Tab) {
    // true means also clear selection model
    return this.hide(tab, true)
  }

  /**
   * Presentation hint
   *
   */
  private presentAs(tab: Tab, presentation: Presentation) {
    document.body.setAttribute('data-presentation', Presentation[presentation].toString())
    if (!isPopup() && presentation === Presentation.Default && tab.getAttribute('maximization-cause') !== 'user') {
      this.toggleMaximization(tab, remove)
    }
  }

  /**
   * Toggle sidecar visibility
   *
   */
  private toggle(tab: Tab) {
    if (!this.isVisible()) {
      return this.show(tab)
    } else {
      const presentationString = document.body.getAttribute('data-presentation') as keyof typeof Presentation
      const presentation: Presentation = presentationString && Presentation[presentationString]
      // Key.Escape for Presentation.SidecarThin is interpreted as Close
      return presentation === Presentation.SidecarThin ? this.clearSelection(tab) : this.hide(tab)
    }
  }

  private destroy() {
    this.dom.remove()
    this.cleaners.forEach(cleaner => {
      cleaner()
    })
  }

  /**
   * Close the DOM and destroy any associated resources
   *
   */
  private close(tab: Tab) {
    try {
      if (isPopup()) {
        window.close()
      } else {
        this.destroy()
      }
    } catch (err) {
      console.error('error handling quit button click', err)
    }

    const replView = tab.querySelector('.repl')
    replView.classList.remove('sidecar-visible')

    getCurrentPrompt().focus()
  }

  /**
   * Add onclick handlers to Frame Buttons
   *
   */
  private initEvents(tab: Tab) {
    this.initEscapeKeyHandler(tab)
    this.initCloseAllHandler(tab)

    const onMaximize = this.toggleMaximization.bind(this)
    const onRestore = this.toggleMaximization.bind(this)
    const onMinimize = this.toggle.bind(this)
    const onClose = this.close.bind(this)
    const tabId = getTabId(tab)
    const e1 = `/sidecar/maximize/${tabId}`
    const e2 = `/sidecar/restore/${tabId}`
    const e3 = `/sidecar/minimize/${tabId}`
    const e4 = `/sidecar/close/${tabId}`
    eventBus.on(e1, onMaximize)
    eventBus.on(e2, onRestore)
    eventBus.on(e3, onMinimize)
    eventBus.on(e4, onClose)
    this.cleaners.push(() => eventBus.off(e1, onMaximize))
    this.cleaners.push(() => eventBus.off(e2, onRestore))
    this.cleaners.push(() => eventBus.off(e3, onMinimize))
    this.cleaners.push(() => eventBus.off(e4, onClose))
  }
}
