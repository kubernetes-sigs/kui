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
import { isTable } from './models/table'
import { formatTable } from './views/table'
import {
  getSidecar,
  showCustom,
  isCustomSpec,
  CustomSpec,
  insertView
} from './views/sidecar'
import sidecarSelector from './views/sidecar-selector'
import { ExecOptions } from '../models/execOptions'
import { apply as addRelevantModes } from '@kui-shell/core/webapp/views/registrar/modes'
import repl = require('../core/repl')

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
type DirectViewController =
  | string
  | DirectViewControllerFunction
  | DirectViewControllerSpec
  | DirectViewEntity
type DirectViewControllerFunction = (
  tab: Tab,
  entity: object
) => PromiseLike<object> | object | void

interface DirectViewEntity extends CustomSpec {
  isEntity: boolean
}

function isDirectViewEntity(
  direct: DirectViewController
): direct is DirectViewEntity {
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
const callDirect = async (
  tab: Tab,
  makeView: DirectViewController,
  entity,
  execOptions: ExecOptions
) => {
  if (typeof makeView === 'string') {
    debug('makeView as string')
    if (execOptions && execOptions.exec === 'pexec') {
      return repl.pexec(makeView, execOptions)
    } else {
      return repl.qexec(
        makeView,
        undefined,
        undefined,
        Object.assign({}, execOptions, { rethrowErrors: true })
      )
    }
  } else if (typeof makeView === 'function') {
    debug('makeView as function')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Promise.resolve(makeView(tab, entity) as any)
  } else if (isDirectViewEntity(makeView)) {
    const combined = Object.assign({}, entity, makeView)
    return combined
  } else {
    const provider = await import(
      `@kui-shell/plugin-${makeView.plugin}/${makeView.module}`
    )
    return provider[makeView.operation](tab, makeView.parameters)
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
    sidecarSelector(
      tab,
      '.sidecar-bottom-stripe .sidecar-bottom-stripe-left-bits .sidecar-bottom-stripe-back-bits'
    ), // houses the back button text and <<
  backButton: (tab: Tab) =>
    sidecarSelector(
      tab,
      '.sidecar-bottom-stripe .sidecar-bottom-stripe-left-bits .sidecar-bottom-stripe-back-button'
    ), // houses the back button text
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
    sidecarSelector(
      tab,
      '.sidecar-bottom-stripe .sidecar-bottom-stripe-left-bits .sidecar-bottom-stripe-mode-bits'
    ),
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
  const button = document.createElement(isTab ? 'li' : 'div')
  const buttonAction = document.createElement(isTab ? 'a' : 'span')
  button.appendChild(buttonAction)
  button.setAttribute('role', 'presentation')
  buttonAction.setAttribute('role', 'tab')

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

  if (
    (((!show || show === 'default') && defaultMode) || show === mode) &&
    !actAsButton
  ) {
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

    icon.className = fontawesome
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
    let fillContainer = bottomStripe.querySelector(
      '.fill-container.flush-right'
    )
    if (!fillContainer) {
      fillContainer = document.createElement('div')
      fillContainer.className = 'fill-container flush-right'
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
    button.setAttribute('data-balloon-pos', 'up')
    if (balloonLength) {
      button.setAttribute('data-balloon-length', balloonLength)
    }
  }

  // back button does not modify sidecar entity, causing the mode buttons to have the wrong behavior (using the previous entity)
  // set sidecar entity to the current entity every time when mode buttons are regenerated
  if (entity.type !== 'custom') {
    getSidecar(tab).entity = entity
  }

  // insert the command handler
  if (command || direct) {
    button.onclick = async () => {
      // change the active button
      const changeActiveButton = () => {
        if (!actAsButton) {
          const currentActive = modeStripe.querySelector(`.${css.active}`)
          if (currentActive) {
            currentActive.classList.remove(css.active)
          }
          button.classList.add(css.active)

          const visibleWhens = bottomStripe.querySelectorAll(
            '.sidecar-bottom-stripe-button[data-visible-when]'
          )
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
            const currentSelected = bottomStripe.querySelector(
              `.${css.selected}`
            )
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
          const view = await callDirect(tab, direct, entity, execOptions)
          if (view && !actAsButton) {
            if (
              isTable(view) ||
              isDirectViewEntity(direct) ||
              leaveBottomStripeAlone
            ) {
              changeActiveButton()
            }

            if (typeof view === 'string') {
              const dom = document.createElement('div')
              dom.classList.add(
                'padding-content',
                'scrollable',
                'scrollable-auto'
              )
              dom.innerText = view
              insertView(tab)(dom)
            } else if (view.nodeName) {
              const dom = document.createElement('div')
              dom.classList.add(
                'padding-content',
                'scrollable',
                'scrollable-auto'
              )
              dom.appendChild(view)
              insertView(tab)(dom)
            } else if (isCustomSpec(view)) {
              // Promise.resolve(view as Promise<ICustomSpec>).then(custom => showCustom(tab, custom, { leaveBottomStripeAlone }))
              showCustom(tab, view, { leaveBottomStripeAlone })
            } else if (isTable(view)) {
              const dom1 = document.createElement('div')
              const dom2 = document.createElement('div')
              dom1.classList.add(
                'padding-content',
                'scrollable',
                'scrollable-auto'
              )
              dom2.classList.add('result-as-table', 'repl-result')
              dom1.appendChild(dom2)
              formatTable(tab, view, dom2, { usePip: true })
              insertView(tab)(dom1)
            }
          } else if (actAsButton && view && view.toggle) {
            view.toggle.forEach(({ mode, disabled }) => {
              const button = modeStripe.querySelector(
                `.sidecar-bottom-stripe-button[data-mode="${mode}"]`
              )
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
          await repl.pexec(command(entity), { echo, noHistory, replSilence })
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

export const addModeButtons = (
  tab: Tab,
  modesUnsorted: SidecarMode[] = [],
  entity,
  options?: BottomStripOptions
) => {
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
  const addModeButtons = (
    tab: Tab,
    modes: SidecarMode[],
    entity,
    show: string
  ) => {
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
      const currentShow =
        currentSelection && currentSelection.getAttribute('data-mode')
      const show = currentShow || (options && options.show)

      // to avoid stale buttons from showing up while the new view renders
      removeAllDomChildren(bottomStripe)

      return () => addModeButtons(tab, modes, entity, show)
    }
  }

  const defaultMode = modes && modes.find(({ defaultMode }) => defaultMode)
  const show =
    (options && options.show) ||
    (defaultMode && (defaultMode.mode || defaultMode.label))

  addModeButtons(tab, modes, entity, show)

  if (!options || !options.preserveBackButton) {
    const backContainer = css.backContainer(tab)
    backContainer.classList.remove('has-back-button')
  }
}
