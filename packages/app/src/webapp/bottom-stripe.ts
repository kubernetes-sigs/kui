/*
 * Copyright 2017 IBM Corporation
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
const debug = Debug('webapp/picture-in-picture')

import repl = require('../core/repl')
import { ITab } from './cli'
import { removeAllDomChildren } from './util/dom'
import { getSidecar, showCustom, ICustomSpec } from './views/sidecar'
import sidecarSelector from './views/sidecar-selector'
import { IExecOptions } from '../models/execOptions'

/**
 * Bottom stripe button specification
 *
 */
export interface ISidecarMode {
  mode: string
  label?: string

  // weak: if we have exclusively flush:right buttons, then snap them all left
  // right: always place this button flush:right
  // default: normal flex LTR flow rules
  flush?: 'right' | 'weak'

  selected?: boolean
  selectionController?: any
  visibleWhen?: any,
  leaveBottomStripeAlone?: boolean

  // icon label?
  fontawesome?: string

  // show label below the fontawesome?
  labelBelow?: boolean

  // tooltip text
  balloon?: string
  balloonLength?: string

  data?: any

  command?: any
  direct?: DirectViewController

  execOptions?: IExecOptions,

  defaultMode?: boolean

  actAsButton?: boolean

  radioButton?: boolean

  echo?: boolean

  noHistory?: boolean

  replSilence?: boolean
}

interface IBottomStripOptions {
  show?: string
  preserveBackButton?: boolean
}

export const rawCSS = {
  buttons: '.sidecar-bottom-stripe .sidecar-bottom-stripe-left-bits'
}
export const css = {
  buttons: (tab: ITab) => sidecarSelector(tab, rawCSS.buttons),
  backContainer: (tab: ITab) => sidecarSelector(tab, '.sidecar-bottom-stripe .sidecar-bottom-stripe-left-bits .sidecar-bottom-stripe-back-bits'), // houses the back button text and <<
  backButton: (tab: ITab) => sidecarSelector(tab, '.sidecar-bottom-stripe .sidecar-bottom-stripe-left-bits .sidecar-bottom-stripe-back-button'), // houses the back button text
  button: 'sidecar-bottom-stripe-button',
  buttonActingAsButton: 'sidecar-bottom-stripe-button-as-button',
  buttonActingAsRadioButton: 'sidecar-bottom-stripe-button-as-radio-button',
  modeContainer: (tab: ITab) => sidecarSelector(tab, '.sidecar-bottom-stripe .sidecar-bottom-stripe-left-bits .sidecar-bottom-stripe-mode-bits'),
  active: 'sidecar-bottom-stripe-button-active',
  selected: 'selected',
  hidden: 'hidden'
}

const _addModeButton = (tab: ITab, bottomStripe: Element, opts: ISidecarMode, entity, show: string) => {
  const { mode, label, flush, selected, selectionController, visibleWhen,
    leaveBottomStripeAlone = false,
    fontawesome, labelBelow, // show label below the fontawesome?
    balloon, balloonLength, data, command = () => mode, direct, execOptions,
    defaultMode, actAsButton, radioButton = false, echo = false, noHistory = true, replSilence = true } = opts

  // create the button dom, and attach it
  const button = document.createElement('div')

  if (visibleWhen && visibleWhen !== show) {
    // only visible when a specific mode is active!
    return
  } else if (visibleWhen) {
    button.setAttribute('data-visible-when', visibleWhen)
  }

  button.classList.add(css.button)
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
    for (let attr in data) {
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
    button.innerText = label || mode
  }

  let container = bottomStripe
  if (flush === 'right') {
    let fillContainer = bottomStripe.querySelector('.fill-container.flush-right')
    if (!fillContainer) {
      fillContainer = document.createElement('div')
      fillContainer.className = 'fill-container flush-right'
    }
    container.appendChild(fillContainer)
    container = fillContainer
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
          const currentActive = bottomStripe.querySelector(`.${css.active}`)
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
          const view = await callDirect(tab, direct, entity, execOptions)
          if (view && !actAsButton) {
            if (isDirectViewEntity(direct) || leaveBottomStripeAlone) {
              changeActiveButton()
            }
            Promise.resolve(view as Promise<ICustomSpec>).then(custom => showCustom(tab, custom, { leaveBottomStripeAlone }))
          } else if (actAsButton && view && view.toggle) {
            view.toggle.forEach(({ mode, disabled }) => {
              const button = bottomStripe.querySelector(`.sidecar-bottom-stripe-button[data-mode="${mode}"]`)
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
type DirectViewController = string | DirectViewControllerFunction | IDirectViewControllerSpec | IDirectViewEntity
type DirectViewControllerFunction = (tab: ITab, entity: object) => PromiseLike<object> | object | void

interface IDirectViewEntity extends ICustomSpec {
  isEntity: boolean
}

function isDirectViewEntity (direct: DirectViewController): direct is IDirectViewEntity {
  const entity = direct as IDirectViewEntity
  return entity.isEntity !== undefined
}

interface IDirectViewControllerSpec {
  plugin: string
  module: string
  operation: string
  parameters: object
}

function isDirectViewControllerSpec (direct: DirectViewController): direct is IDirectViewControllerSpec {
  const spec = direct as IDirectViewControllerSpec
  return spec.plugin !== undefined && spec.module !== undefined
}

/**
 * Call a "direct" impl
 *
 */
const callDirect = async (tab: ITab, makeView: DirectViewController, entity, execOptions: IExecOptions) => {
  if (typeof makeView === 'string') {
    debug('makeView as string')
    if (execOptions && execOptions.exec === 'pexec') {
      return repl.pexec(makeView, execOptions)
    } else {
      return repl.qexec(makeView, undefined, undefined, Object.assign({}, execOptions, { rethrowErrors: true }))
    }
  } else if (typeof makeView === 'function') {
    debug('makeView as function')
    return Promise.resolve(makeView(tab, entity) as any)
  } else if (isDirectViewEntity(makeView)) {
    const combined = Object.assign({}, entity, makeView)
    return combined
  } else {
    const provider = await import(`@kui-shell/plugin-${makeView.plugin}/${makeView.module}`)
    return provider[makeView.operation](tab, makeView.parameters)
  }
}

export const addModeButton = (tab: ITab, mode: ISidecarMode, entity: Record<string, any>) => {
  const bottomStripe = css.modeContainer(tab)
  return _addModeButton(tab, bottomStripe, mode, entity, undefined)
}

export const addModeButtons = (tab: ITab, modesUnsorted: ISidecarMode[] = [], entity, options?: IBottomStripOptions) => {
  // place flush:right items at the end
  const modes = modesUnsorted.sort((a, b) => {
    if (a.flush === b.flush ||
        a.flush === 'weak' && b.flush === 'right' ||
        a.flush === 'right' && b.flush === 'weak') {
      return 0
    } else {
      if (a.flush === 'right' || a.flush === 'weak') {
        return 1
      } else {
        return -1
      }
    }
  })

  // if we have *only* flush-right buttons, then do not flush-right any of them
  const nFlushRight = modes.reduce((count, { flush }) => count += flush === 'right' ? 1 : 0, 0)
  const nFlushLeft = modes.reduce((count, { flush }) => count += flush !== 'weak' && flush !== 'right' ? 1 : 0, 0)
  if (nFlushRight > 0 && nFlushLeft === 0) {
    modes.forEach(_ => delete _.flush)
  }

  // for going back
  const addModeButtons = (tab: ITab, modes: ISidecarMode[], entity, show: string) => {
    const bottomStripe = css.modeContainer(tab)
    removeAllDomChildren(bottomStripe)

    if (modes) {
      modes.forEach(mode => {
        _addModeButton(tab, bottomStripe, mode, entity, show)
      })
    }

    bottomStripe['capture'] = () => {
      // capture the current selection
      const currentSelection = bottomStripe.querySelector(`.${css.active}`)
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
