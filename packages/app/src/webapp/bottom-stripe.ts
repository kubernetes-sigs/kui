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

import repl = require('../core/repl')
import { removeAllDomChildren } from './util/dom'
import { getSidecar, showCustom } from './views/sidecar'
import sidecarSelector from './views/sidecar-selector'

export const css = {
  buttons: sidecarSelector('.sidecar-bottom-stripe .sidecar-bottom-stripe-left-bits'),
  backContainer: sidecarSelector('.sidecar-bottom-stripe .sidecar-bottom-stripe-left-bits .sidecar-bottom-stripe-back-bits'), // houses the back button text and <<
  backLabel: sidecarSelector('.sidecar-bottom-stripe .sidecar-bottom-stripe-left-bits .sidecar-bottom-stripe-back-inner-bits'), // houses the back button text
  modeContainer: sidecarSelector('.sidecar-bottom-stripe .sidecar-bottom-stripe-left-bits .sidecar-bottom-stripe-mode-bits'),
  button: 'sidecar-bottom-stripe-button',
  buttonActingAsButton: 'sidecar-bottom-stripe-button-as-button',
  buttonActingAsRadioButton: 'sidecar-bottom-stripe-button-as-radio-button',
  active: 'sidecar-bottom-stripe-button-active',
  selected: 'selected',
  hidden: 'hidden'
}

const _addModeButton = (bottomStripe, opts, entity, show) => {
  const { mode, label, flush, selected, selectionController, visibleWhen,
    leaveBottomStripeAlone = false,
    fontawesome, labelBelow, // show label below the fontawesome?
    balloon, balloonLength, data, command = () => mode, direct,
    defaultMode, actAsButton, radioButton = false, echo = false, noHistory = true, replSilence = true } = opts

  if (visibleWhen && visibleWhen !== show) {
    // only visible when a specific mode is active!
    return
  }

  // create the button dom, and attach it
  const button = document.createElement('div')

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
      selectionController.on('change', selected => {
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
    getSidecar().entity = entity
  }

  // insert the command handler
  if (command || direct) {
    button.onclick = () => {
      // change the active button
      if (!actAsButton) {
        const currentActive = bottomStripe.querySelector(`.${css.active}`)
        if (currentActive) {
          currentActive.classList.remove(css.active)
        }
        button.classList.add(css.active)

        // visible when
        /* buttons.forEach(button => {
                    const visibleWhen = button.getAttribute('visible-when')
                    if (visibleWhen) {
                        if (visibleWhen !== (mode||label)) {
                            button.classList.add(css.hidden)
                        } else {
                            button.classList.remove(css.hidden)
                        }
                    }
                }) */
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

      // execute the command
      if (direct) {
        const view = direct(entity)
        if (view && view.then && !actAsButton) {
          view.then(custom => showCustom(custom, { leaveBottomStripeAlone }))
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
        }
      } else {
        repl.pexec(command(entity), { /* leaveBottomStripeAlonex true,*/ echo, noHistory, replSilence })
      }
    }
  }

  return button
}

export const addModeButton = (mode, entity) => {
  const bottomStripe = document.querySelector(css.modeContainer)
  return _addModeButton(bottomStripe, mode, entity, undefined)
}

export const addModeButtons = (modes, entity, options) => {
  // for going back
  const addModeButtons = (modes, entity, show) => {
    const bottomStripe = document.querySelector(css.modeContainer)
    removeAllDomChildren(bottomStripe)

    if (modes) {
      modes.forEach(mode => {
        _addModeButton(bottomStripe, mode, entity, show)
      })
    }

    bottomStripe['capture'] = () => {
      // capture the current selection
      const currentSelection = bottomStripe.querySelector(`.${css.active}`)
      const currentShow = currentSelection && currentSelection.getAttribute('data-mode')
      const show = currentShow || (options && options.show)

      // to avoid stale buttons from showing up while the new view renders
      removeAllDomChildren(bottomStripe)

      return () => addModeButtons(modes, entity, show)
    }
  }

  const defaultMode = modes && modes.find(({ defaultMode }) => defaultMode)
  const show = (options && options.show) || (defaultMode && (defaultMode.mode || defaultMode.label))

  addModeButtons(modes, entity, show)

  if (!options || !options.preserveBackButton) {
    const backContainer = document.querySelector(css.backContainer)
    backContainer.classList.remove('has-back-button')
  }
}
