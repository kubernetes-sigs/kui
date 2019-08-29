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

import * as Debug from 'debug'

import { Tab } from './cli'
import { removeAllDomChildren } from './util/dom'
import { isTable, isMultiTable } from './models/table'
import { formatTable } from './views/table'
import { getSidecar, showCustom, isCustomSpec, CustomSpec, insertView } from './views/sidecar'
import sidecarSelector from './views/sidecar-selector'
import { ExecOptions } from '../models/execOptions'
import { apply as addRelevantModes } from '@kui-shell/core/webapp/views/registrar/modes'
import { pexec, qexec } from '../core/repl'

const debug = Debug('webapp/picture-in-picture')

/**
 * A mode button provider can, via direct, as to take charge of view
 * insertion (otherwise, the button stripe will use the normal REPL
 * view dispatching logic, e.g. opening entities in sidecar, tuples as
 * tables, etc.)
 *
 * A direct view controller is either a function from entity to view,
 * or a specification of such; the latter allows for serialization
 * across remote proxies, and thus is preferable to the former.
 *
 */
type DirectViewController = string | DirectViewControllerFunction | DirectViewControllerSpec | DirectViewEntity
type DirectViewControllerFunction = (tab: Tab, entity: object) => PromiseLike<object> | object | void

interface DirectViewEntity extends CustomSpec {
  isEntity: boolean
}

function isDirectViewEntity(direct: DirectViewController): direct is DirectViewEntity {
  const entity = direct as DirectViewEntity
  return entity.isEntity !== undefined
}

interface DirectViewControllerSpec {
  plugin: string
  module: string
  operation: string
  parameters: object
}

/**
 * Call a "direct" impl
 *
 */
const callDirect = async (tab: Tab, makeView: DirectViewController, entity, execOptions: ExecOptions) => {
  if (typeof makeView === 'string') {
    debug('makeView as string')
    if (execOptions && execOptions.exec === 'pexec') {
      return pexec(makeView, execOptions)
    } else {
      return qexec(makeView, undefined, undefined, Object.assign({}, execOptions, { rethrowErrors: true }))
    }
  } else if (typeof makeView === 'function') {
    debug('makeView as function')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Promise.resolve(makeView(tab, entity) as any)
  } else if (isDirectViewEntity(makeView)) {
    const combined = Object.assign({}, entity, makeView)
    return combined
  } else {
    const provider = await import(`@kui-shell/plugin-${makeView.plugin}/${makeView.module}`)
    return provider[makeView.operation](tab, makeView.parameters, entity)
  }
}

/**
 * Bottom stripe button specification
 *
 */
export interface SidecarMode {
  mode: string
  label?: string

  // sort order; default is as given
  order?: number

  // weak: if we have exclusively flush:right buttons, then snap them all left
  // right: always place this button flush:right
  // default: use the order? field if defined; otherwise: order mode tabs/buttons as given
  flush?: 'right' | 'weak'

  selected?: boolean
  selectionController?: any // eslint-disable-line @typescript-eslint/no-explicit-any
  visibleWhen?: any // eslint-disable-line @typescript-eslint/no-explicit-any
  leaveBottomStripeAlone?: boolean

  // icon label?
  fontawesome?: string

  // show label below the fontawesome?
  labelBelow?: boolean

  // tooltip text
  balloon?: string
  balloonLength?: string

  data?: any // eslint-disable-line @typescript-eslint/no-explicit-any

  command?: any // eslint-disable-line @typescript-eslint/no-explicit-any
  direct?: DirectViewController
  url?: string

  execOptions?: ExecOptions

  defaultMode?: boolean

  actAsButton?: boolean

  radioButton?: boolean

  echo?: boolean

  noHistory?: boolean

  replSilence?: boolean
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
  entity,
  show: string
) => {
  const {
    mode,
    label,
    flush,
    selected,
    selectionController,
    visibleWhen,
    leaveBottomStripeAlone = false,
    fontawesome,
    labelBelow, // show label below the fontawesome?
    balloon,
    balloonLength,
    data,
    command = () => mode,
    direct,
    url,
    execOptions,
    defaultMode,
    actAsButton,
    radioButton = false,
    echo = false,
    noHistory = true,
    replSilence = true
  } = opts

  // create the button dom, and attach it
  const isTab = !(flush === 'right' || flush === 'weak')
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

  if (visibleWhen && visibleWhen !== show) {
    // only visible when a specific mode is active!
    return
  } else if (visibleWhen) {
    button.setAttribute('data-visible-when', visibleWhen)
  }

  if (actAsButton) {
    // some plugins want to add buttons, not mode-switchers to the bottom bar
    // let's make them behave a bit more like buttons
    button.classList.add(css.buttonActingAsButton)

    if (radioButton) {
      button.classList.add(css.buttonActingAsRadioButton)
    }

    if (selected) {
      button.classList.add(css.selected)
    }

    if (selectionController) {
      selectionController.on('change', (selected: boolean) => {
        const op = selected ? 'add' : 'remove'
        button.classList[op](css.selected)
      })
    }
  }

  if ((((!show || show === 'default') && defaultMode) || show === mode) && !actAsButton) {
    button.classList.add(css.active)
  }
  button.setAttribute('data-mode', mode)

  if (data) {
    // we were asked to add some data attributes
    for (const attr in data) {
      button.setAttribute(attr, data[attr])
    }
  }

  // add the button label
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

    if (labelBelow) {
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

  if (balloon) {
    button.setAttribute('data-balloon', balloon)
    button.setAttribute('data-balloon-pos', !isTab ? 'down-right' : 'down')
    if (balloonLength) {
      button.setAttribute('data-balloon-length', balloonLength)
    } else {
      button.setAttribute('data-balloon-length', 'medium')
    }
  }

  // back button does not modify sidecar entity, causing the mode buttons to have the wrong behavior (using the previous entity)
  // set sidecar entity to the current entity every time when mode buttons are regenerated
  if (entity.type !== 'custom') {
    getSidecar(tab).entity = entity
  }

  if (url) {
    //
    // onclick, open a new page
    //
    button.onclick = () => window.open(url)
  } else if (command || direct) {
    //
    // insert the command handler
    //
    button.onclick = async () => {
      // change the active button
      const changeActiveButton = () => {
        if (!actAsButton) {
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

      // execute the command
      if (direct) {
        try {
          if (isDirectViewEntity(direct) || leaveBottomStripeAlone) {
            // change the active button before we fetch the model
            changeActiveButton()
          }

          const view = await callDirect(tab, direct, entity, execOptions)
          if (view && !actAsButton) {
            if (isTable(view)) {
              changeActiveButton()
            }

            if (typeof view === 'string') {
              const dom = document.createElement('div')
              dom.classList.add('padding-content', 'scrollable', 'scrollable-auto')
              dom.innerText = view
              insertView(tab)(dom)
            } else if (view.nodeName) {
              const dom = document.createElement('div')
              dom.classList.add('padding-content', 'scrollable', 'scrollable-auto')
              dom.appendChild(view)
              insertView(tab)(dom)
            } else if (isCustomSpec(view)) {
              // Promise.resolve(view as Promise<ICustomSpec>).then(custom => showCustom(tab, custom, { leaveBottomStripeAlone }))
              showCustom(tab, view, { leaveBottomStripeAlone })
            } else if (isTable(view) || isMultiTable(view)) {
              const dom1 = document.createElement('div')
              const dom2 = document.createElement('div')
              dom1.classList.add('padding-content', 'scrollable', 'scrollable-auto')
              dom2.classList.add('result-as-table', 'repl-result')
              dom1.appendChild(dom2)
              formatTable(tab, view, dom2, { usePip: true })
              insertView(tab)(dom1)
            }
          } else if (actAsButton && view && view.toggle) {
            view.toggle.forEach(({ mode, disabled }) => {
              const button = modeStripe.querySelector(`.sidecar-bottom-stripe-button[data-mode="${mode}"]`)
              if (button) {
                if (disabled) {
                  button.classList.add('disabled')
                } else {
                  button.classList.remove('disabled')
                }
              }
            })

            changeActiveButton()
          } else if (!leaveBottomStripeAlone) {
            changeActiveButton()
          }
        } catch (err) {
          // do not change active bottom if the command failed!
          console.error(err)
        }
      } else {
        try {
          await pexec(command(entity), { echo, noHistory, replSilence })
          if (leaveBottomStripeAlone) {
            changeActiveButton()
          }
        } catch (err) {
          console.error(err)
        }
      }
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

export const addModeButtons = (tab: Tab, modesUnsorted: SidecarMode[] = [], entity, options?: BottomStripOptions) => {
  // consult the view registrar for registered view modes
  // relevant to this resource
  const command = ''
  addRelevantModes(modesUnsorted, command, entity)

  // Place flush:right items at the end. Notes on flush:weak; this
  // means place to the right, unless there are no flush:right|weak
  // buttons.
  const modes = modesUnsorted.sort((a, b) => {
    if (
      a.flush === b.flush ||
      (a.flush === 'weak' && b.flush === 'right') ||
      (a.flush === 'right' && b.flush === 'weak')
    ) {
      // then use the natural order of a versus b: a mode model can
      // optionally specify a numeric sort order; if not specified,
      // then use the order as given
      return (a.order || 0) - (b.order || 0)
    } else {
      if (a.flush === 'right' || a.flush === 'weak') {
        return 1
      } else {
        return -1
      }
    }
  })

  // for going back
  const addModeButtons = (tab: Tab, modes: SidecarMode[], entity, show: string) => {
    const modeStripe = css.modeContainer(tab)
    const bottomStripe = css.bottomContainer(tab)
    removeAllDomChildren(modeStripe)
    removeAllDomChildren(bottomStripe)

    if (modes) {
      modes.forEach(mode => {
        _addModeButton(tab, modeStripe, bottomStripe, mode, entity, show)
      })
    }

    bottomStripe['capture'] = () => {
      // capture the current selection
      const currentSelection = modeStripe.querySelector(`.${css.active}`)
      const currentShow = currentSelection && currentSelection.getAttribute('data-mode')
      const show = currentShow || (options && options.show)

      // to avoid stale buttons from showing up while the new view renders
      removeAllDomChildren(bottomStripe)

      return () => addModeButtons(tab, modes, entity, show)
    }
  }

  const defaultMode = modes && modes.find(({ defaultMode }) => defaultMode)
  const show = (options && options.show) || (defaultMode && (defaultMode.mode || defaultMode.label))

  addModeButtons(tab, modes, entity, show)

  if (!options || !options.preserveBackButton) {
    const backContainer = css.backContainer(tab)
    backContainer.classList.remove('has-back-button')
  }
}
