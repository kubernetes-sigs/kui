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

import { Tab } from './cli'
import { removeAllDomChildren } from './util/dom'
import { isTable, Table } from './models/table'
import { Capturable } from './models/capturable'
import { CustomSpec, getSidecar } from './views/sidecar-core'
import { isCustomSpec } from './views/custom-content'
import sidecarSelector from './views/sidecar-selector'
import { apply as addRelevantModes } from './views/registrar/modes'
import { isHTML } from '../util/types'
import { Entity, MetadataBearing, isMetadataBearing, isMetadataBearingByReference } from '../models/entity'
import { Mode, Button, isButton } from '../models/mmr/types'
import { onclick as buttonOnclick } from '../models/mmr/button'
import { hasContent, isStringWithOptionalContentType } from '../models/mmr/content-types'

/** clicking on a button can toggle other buttons */
/* interface Toggle {
  toggle: { mode: string; disabled: boolean }[]
} */

export type SelectionController = { on: (evt: 'change', cb: (selected: boolean) => void) => void }

/**
 * Bottom stripe button specification
 *
 */
export type SidecarMode<T extends MetadataBearing = MetadataBearing> = Mode<T> | Button<T>
export function isSidecarMode(entity: string | HTMLElement | Table | SidecarMode): entity is SidecarMode {
  const mode = entity as SidecarMode
  return mode.mode !== undefined && (isButton(mode) || hasContent(mode))
}

interface BottomStripOptions {
  show?: string
  preserveBackButton?: boolean
}

export const rawCSS = {
  buttons: '.sidecar-top-stripe .sidecar-bottom-stripe-left-bits'
}
export const css = {
  buttons: (tab: Tab) => sidecarSelector(tab, rawCSS.buttons),
  backContainer: (tab: Tab) =>
    sidecarSelector(tab, '.sidecar-bottom-stripe .sidecar-bottom-stripe-left-bits .sidecar-bottom-stripe-back-bits'), // houses the back button text and <<
  backButton: (tab: Tab) =>
    sidecarSelector(tab, '.sidecar-bottom-stripe .sidecar-bottom-stripe-left-bits .sidecar-bottom-stripe-back-button'), // houses the back button text
  button: 'sidecar-bottom-stripe-button',
  tab: ['bx--tabs__nav-item', 'sidecar-bottom-stripe-button'],
  buttonAction: 'bx--tabs__nav-link',
  buttonActingAsButton: 'sidecar-bottom-stripe-button-as-button',
  buttonActingAsRadioButton: 'sidecar-bottom-stripe-button-as-radio-button',
  modeContainer: (tab: Tab) =>
    sidecarSelector(
      tab,
      '.sidecar-top-stripe .sidecar-bottom-stripe-left-bits .sidecar-bottom-stripe-mode-bits .bx--tabs__nav'
    ),
  bottomContainer: (tab: Tab) =>
    sidecarSelector(tab, '.sidecar-bottom-stripe-toolbar .sidecar-bottom-stripe-mode-bits'),
  active: 'bx--tabs__nav-item--selected',
  selected: 'selected',
  hidden: 'hidden'
}

const _addModeButton = (
  tab: Tab,
  modeStripe: Element,
  bottomStripe: Element,
  opts: SidecarMode,
  entity: MetadataBearing | CustomSpec,
  show: string
) => {
  const { mode, label, defaultMode } = opts

  // create the button dom, and attach it
  const isTab = !isButton(opts)
  const button = document.createElement(isTab ? 'li' : 'a')
  const buttonAction = document.createElement(isTab ? 'a' : 'span')
  button.appendChild(buttonAction)
  button.setAttribute('role', 'presentation')
  buttonAction.setAttribute('role', 'tab')
  if (isTab) {
    buttonAction.setAttribute('href', '#')
    buttonAction.classList.add('kui--tab-navigatable', 'kui--notab-when-sidecar-hidden')
  } else {
    button.setAttribute('href', '#')
    button.classList.add('kui--tab-navigatable', 'kui--notab-when-sidecar-hidden')
  }

  if (opts.visibleWhen && opts.visibleWhen !== show) {
    // only visible when a specific mode is active!
    return
  } else if (opts.visibleWhen) {
    button.setAttribute('data-visible-when', opts.visibleWhen)
  }

  if (isButton(opts)) {
    // some plugins want to add buttons, not mode-switchers to the bottom bar
    // let's make them behave a bit more like buttons
    button.classList.add(css.buttonActingAsButton)

    /* if (opts.radioButton) {
      button.classList.add(css.buttonActingAsRadioButton)
    }
    if (opts.selected) {
      button.classList.add(css.selected)
    }

    if (opts.selectionController) {
      opts.selectionController.on('change', (selected: boolean) => {
        const op = selected ? 'add' : 'remove'
        button.classList[op](css.selected)
      })
    } */
  }

  /* if (opts.data) {
    // we were asked to add some data attributes
    for (const attr in opts.data) {
      button.setAttribute(attr, opts.data[attr])
    }
  } */

  if ((((!show || show === 'default') && defaultMode) || show === mode) && !isButton(opts)) {
    button.classList.add(css.active)
  }
  button.setAttribute('data-mode', mode)

  // add the button label
  const fontawesome = opts.fontawesome
  if (fontawesome) {
    const iconContainer = document.createElement('span')
    const icon = document.createElement('i')

    if (/trash/.test(fontawesome)) {
      // delete
      icon.innerHTML =
        '<svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 6h1v6H6zm3 0h1v6H9z"></path><path d="M2 3v1h1v10c0 .6.4 1 1 1h8c.6 0 1-.4 1-1V4h1V3H2zm2 11V4h8v10H4zM6 1h4v1H6z"></path></svg>'
    } else if (/fa-unlock/.test(fontawesome)) {
      icon.innerHTML =
        '<svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M12 7H6V4c0-1.1.9-2 2-2s2 .9 2 2h1c0-1.7-1.3-3-3-3S5 2.3 5 4v3H4c-.6 0-1 .4-1 1v6c0 .6.4 1 1 1h8c.6 0 1-.4 1-1V8c0-.6-.4-1-1-1zm0 7H4V8h8v6z"></path></svg>'
    } else if (/fa-exclamation/.test(fontawesome)) {
      icon.innerHTML =
        '<svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1c-5 0-9 4-9 9s4 9 9 9 9-4 9-9-4-9-9-9zm-.8 4h1.5v7H9.2V5zm.8 11c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z"></path><path d="M9.2 5h1.5v7H9.2V5zm.8 11c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z" data-icon-path="inner-path" opacity="0"></path></svg>'
    } else if (/search-plus/.test(fontawesome)) {
      // zoom in
      icon.innerHTML =
        '<svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" aria-hidden="true"><path d="M19 13h-4V9h-2v4H9v2h4v4h2v-4h4v-2z"></path><path d="M22.45 21A10.87 10.87 0 0 0 25 14a11 11 0 1 0-11 11 10.87 10.87 0 0 0 7-2.55L28.59 30 30 28.59zM14 23a9 9 0 1 1 9-9 9 9 0 0 1-9 9z"></path></svg>'
    } else if (/search-minus/.test(fontawesome)) {
      // zoom out
      icon.innerHTML =
        '<svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" aria-hidden="true"><path d="M9 13h10v2H9z"></path><path d="M22.45 21A10.87 10.87 0 0 0 25 14a11 11 0 1 0-11 11 10.87 10.87 0 0 0 7-2.55L28.59 30 30 28.59zM14 23a9 9 0 1 1 9-9 9 9 0 0 1-9 9z"></path></svg>'
    } else if (/chart-bar/.test(fontawesome)) {
      // bar chart
      icon.innerHTML =
        '<svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" aria-hidden="true"><path d="M27 28V6h-8v22h-4V14H7v14H4V2H2v26a2 2 0 0 0 2 2h26v-2zm-14 0H9V16h4zm12 0h-4V8h4z"></path></svg>'
    } else if (/^fas fa-th$/.test(fontawesome)) {
      // grid
      icon.innerHTML =
        '<svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" aria-hidden="true"><path d="M12 4H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 8H6V6h6zm14-8h-6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 8h-6V6h6zm-14 6H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2zm0 8H6v-6h6zm14-8h-6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2zm0 8h-6v-6h6z"></path></svg>'
    } else {
      icon.className = fontawesome
    }

    button.classList.add('graphical-icon')
    button.appendChild(iconContainer)
    iconContainer.appendChild(icon)
    iconContainer.classList.add('icon-container')

    if (opts.labelBelow) {
      const labelContainer = document.createElement('div')
      labelContainer.classList.add('deemphasize')
      labelContainer.innerText = label
      iconContainer.appendChild(labelContainer)
    }
  } else {
    buttonAction.innerText = label || mode
  }

  let container = modeStripe
  if (!isTab) {
    let fillContainer = bottomStripe.querySelector('.fill-container.flush-right[role="tablist"]')
    if (!fillContainer) {
      fillContainer = document.createElement('div')
      fillContainer.className = 'fill-container flush-right'
      fillContainer.setAttribute('role', 'tablist')
    }
    button.classList.add(css.button)
    bottomStripe.appendChild(fillContainer)
    container = fillContainer
  } else {
    if (Array.isArray(css.tab)) {
      css.tab.forEach(_ => button.classList.add(_))
    } else {
      button.classList.add(css.tab)
    }
    buttonAction.classList.add(css.buttonAction)
  }
  container.appendChild(button)

  if (opts.balloon) {
    button.setAttribute('data-balloon', opts.balloon)
    button.setAttribute('data-balloon-pos', !isTab ? 'down-right' : 'down')
    if (opts.balloonLength) {
      button.setAttribute('data-balloon-length', opts.balloonLength)
    } else {
      button.setAttribute('data-balloon-length', 'medium')
    }
  }

  // back button does not modify sidecar entity, causing the mode buttons to have the wrong behavior (using the previous entity)
  // set sidecar entity to the current entity every time when mode buttons are regenerated
  if (isCustomSpec(entity) && entity.type !== 'custom') {
    getSidecar(tab).entity = entity
  }

  //
  // insert the command handler
  //
  button.onclick = async () => {
    // change the active button
    const leaveBottomStripeAlone = true
    const actAsButton = isButton(opts)

    const changeActiveButton = () => {
      const radioButton = false
      const selected = false // && opts.selected

      if (!isButton(opts)) {
        const currentActive = modeStripe.querySelector(`.${css.active}`)
        if (currentActive) {
          currentActive.classList.remove(css.active)
        }
        button.classList.add(css.active)

        const visibleWhens = bottomStripe.querySelectorAll('.sidecar-bottom-stripe-button[data-visible-when]')
        for (let idx = 0; idx < visibleWhens.length; idx++) {
          const otherButton = visibleWhens[idx] as HTMLElement
          const when = otherButton.getAttribute('data-visible-when')
          if (when === mode) {
            otherButton.classList.remove('not-displayed')
          } else {
            otherButton.classList.add('not-displayed')
          }
        }
      } else if (actAsButton && selected !== undefined) {
        if (radioButton) {
          button.classList.toggle(css.selected)
        } else {
          const currentSelected = bottomStripe.querySelector(`.${css.selected}`)
          if (currentSelected) {
            currentSelected.classList.remove(css.selected)
          }
          button.classList.add(css.selected)
        }
      }
    }

    const present = async (view: Entity) => {
      if (typeof view === 'string') {
        const dom = document.createElement('div')
        dom.classList.add('padding-content', 'scrollable', 'scrollable-auto')
        dom.innerText = view
        const { insertCustomContent } = await import('./views/sidecar')
        insertCustomContent(tab, dom)
      } else if (isStringWithOptionalContentType(view) && isMetadataBearing(entity)) {
        const { showCustom } = await import('./views/sidecar')
        showCustom(
          tab,
          {
            type: 'custom',
            resource: entity,
            content: view.content,
            contentType: view.contentType
          },
          { leaveBottomStripeAlone: true }
        )
      } else if (isHTML(view)) {
        const dom = document.createElement('div')
        dom.classList.add('padding-content', 'scrollable', 'scrollable-auto')
        dom.appendChild(view)
        const { insertCustomContent } = await import('./views/sidecar')
        insertCustomContent(tab, dom)
      } else if (isCustomSpec(view)) {
        const { showCustom } = await import('./views/sidecar')
        showCustom(tab, view, { leaveBottomStripeAlone: leaveBottomStripeAlone })
      } else if (isTable(view)) {
        const dom1 = document.createElement('div')
        const dom2 = document.createElement('div')
        dom1.classList.add('scrollable', 'scrollable-auto')
        dom2.classList.add('result-as-table', 'repl-result')
        dom1.appendChild(dom2)
        const { formatTable } = await import('./views/table')
        formatTable(tab, view, dom2)
        const { insertCustomContent } = await import('./views/sidecar')
        insertCustomContent(tab, dom1)
      }
    }

    // execute the actual onclick handler
    if (isButton(opts)) {
      buttonOnclick(tab, entity as MetadataBearing, opts)
    } else if (hasContent(opts)) {
      const { formatForTab } = await import('../models/mmr/show')
      const view = await formatForTab(tab, entity as MetadataBearing, opts)
      changeActiveButton()
      await present(view)
    }
  }

  return button
}

export const addModeButton = (
  tab: Tab,
  mode: SidecarMode,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  entity: Record<string, any>
) => {
  const modeStripe = css.modeContainer(tab)
  const bottomStripe = css.bottomContainer(tab)
  return _addModeButton(tab, modeStripe, bottomStripe, mode, entity, undefined)
}

export const addModeButtons = (
  tab: Tab,
  modesUnsorted: SidecarMode[] = [],
  entity: MetadataBearing | CustomSpec,
  options?: BottomStripOptions
): SidecarMode[] => {
  // consult the view registrar for registered view modes
  // relevant to this resource
  const command = ''
  if (isMetadataBearing(entity)) {
    addRelevantModes(tab, modesUnsorted, command, { resource: entity })
  } else if (isMetadataBearingByReference(entity)) {
    addRelevantModes(tab, modesUnsorted, command, entity)
  }

  if (options.show && modesUnsorted.find(_ => _.mode === options.show)) {
    modesUnsorted = modesUnsorted.map(_ => Object.assign({}, _))

    modesUnsorted.filter(_ => _.defaultMode && _.mode !== options.show).forEach(_ => (_.defaultMode = false))

    modesUnsorted.find(_ => _.mode === options.show).defaultMode = true
  }

  // obey the `order` constraints of the modes
  const modes = modesUnsorted.sort((a, b) => {
    return (a.order || 0) - (b.order || 0)
  })

  // for going back
  const addModeButtons = (tab: Tab, modes: SidecarMode[], entity: MetadataBearing | CustomSpec, show: string) => {
    const modeStripe = css.modeContainer(tab)
    const bottomStripe = css.bottomContainer(tab) as Capturable
    removeAllDomChildren(modeStripe)
    removeAllDomChildren(bottomStripe)

    if (modes) {
      modes.forEach(mode => {
        _addModeButton(tab, modeStripe, bottomStripe, mode, entity, show)
      })
    }

    bottomStripe.capture = () => {
      // capture the current selection
      const currentSelection = modeStripe.querySelector(`.${css.active}`)
      const currentShow = currentSelection && currentSelection.getAttribute('data-mode')
      const show = currentShow || (options && options.show)

      // to avoid stale buttons from showing up while the new view renders
      removeAllDomChildren(bottomStripe)

      return () => addModeButtons(tab, modes, entity, show)
    }
  }

  const defaultMode = modes && (modes.find(_ => _.defaultMode && !isButton(_)) || modes.find(_ => !isButton(_)))
  const show = (options && options.show) || (defaultMode && (defaultMode.mode || defaultMode.label))

  addModeButtons(tab, modes, entity, show)

  if (!options || !options.preserveBackButton) {
    const backContainer = css.backContainer(tab)
    backContainer.classList.remove('has-back-button')
  }

  return modesUnsorted
}
