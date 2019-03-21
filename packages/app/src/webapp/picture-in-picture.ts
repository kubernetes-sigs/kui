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

const debug = require('debug')('webapp/pip')
debug('loading')

import repl = require('../core/repl')
import bottomStripe = require('./bottom-stripe')
import { removeAllDomChildren } from './util/dom'
import { getSidecar, showEntity } from './views/sidecar'
import sidecarSelector from './views/sidecar-selector'
import Presentation from './views/presentation'
import { popupListen } from './cli'

const _highlight = op => highlightThis => {
  if (highlightThis) {
    if (Array.isArray(highlightThis)) {
      highlightThis.forEach(_ => _.classList[op]('picture-in-picture-highlight'))
    } else {
      highlightThis.classList[op]('picture-in-picture-highlight')
    }
  }
}
const dehighlight = _highlight('remove')
const highlight = _highlight('add')

/**
 * Make an DOM event handler that will restore the given pippedContainer
 *
 */
const restore = (pippedContainer, previousPresentation: Presentation, sidecarClass: string, capturedHeaders, highlightThis, escapeHandler, options?) => () => {
  debug('restore')

  const sidecar = getSidecar()
  const parent = (options && options.parent) || sidecar.querySelector('.custom-content')

  if (pippedContainer !== true) {
    removeAllDomChildren(parent)
  }

  if (previousPresentation) {
    debug('restoring presentation mode', previousPresentation, Presentation[previousPresentation].toString())
    document.body.setAttribute('data-presentation', Presentation[previousPresentation].toString())
  }

  // restore escape handler
  if (escapeHandler) {
    document.onkeyup = escapeHandler
  }

  // restore sidecar header state
  sidecar.className = sidecarClass
  capturedHeaders.forEach(({ selector, node, redraw, nextSibling }) => {
    const curHeader = document.querySelector(selector)
    const curHeaderParent = curHeader.parentNode

    curHeaderParent.removeChild(curHeader)
    // curHeaderParent.appendChild(node)
    curHeaderParent.insertBefore(node, nextSibling)

    if (redraw) {
      redraw(node)
    }
  })

  // pippedContainer.classList.remove('picture-in-picture')
  // pippedContainer.classList.add('picture-in-picture-stage1')
  // setTimeout(() => {
  // sidecar.classList.add('custom-content')
  // pippedContainer.classList.remove('picture-in-picture-stage1')
  if (pippedContainer !== true) {
    if (pippedContainer.parentNode) pippedContainer.parentNode.removeChild(pippedContainer)
    parent.appendChild(pippedContainer)
  }
  // pippedContainer.onclick = null
  // }, 300)

  dehighlight(highlightThis)
}

/**
 *
 *
 */
const pip = (container, previousPresentation: Presentation, capturedHeaders, highlightThis, returnTo = 'previous view', options?) => {
  try {
    if (container !== true) {
      container.parentNode.removeChild(container)
    }
  } catch (e) {
    // ok
  }

  const sidecar = getSidecar()
  const sidecarClass = sidecar.className
  const escapeHandler = undefined // we don't want to override the escape key behavior
  const backContainer = document.querySelector(bottomStripe.css.backContainer)
  const backButton = document.querySelector(bottomStripe.css.backButton)
  const restoreFn = restore(container, previousPresentation, sidecarClass, capturedHeaders, highlightThis, escapeHandler, options)

  debug('returnTo', returnTo)
  backButton.setAttribute('data-balloon', `Return to ${returnTo}`)
  backContainer.classList.add('has-back-button')

  backButton.addEventListener('click', () => {
    restoreFn()
    backContainer.classList.remove('has-back-button')
  }, { once: true })

  return restoreFn
}

/**
 *
 *
 */
/* const pipViaShrink = (container, capturedHeaders, highlightThis) => {
    const sidecar = getSidecar(),
          sidecarClass = sidecar.className

    container.classList.add('picture-in-picture-stage1')
    setTimeout(() => {
        container.classList.remove('picture-in-picture-stage1')
        container.classList.add('picture-in-picture')
    }, 0)

    try {
        container.parentNode.removeChild(container)
    } catch (e) {}
    document.body.appendChild(container)

    escapeHandler = document.onkeyup
    const restoreFn = restore(container, sidecarClass, capturedHeaders, highlightThis, escapeHandler)

    document.onkeyup = evt => {
        if (evt.keyCode === 27) { // escape key maps to keycode `27`
            restoreFn()
        }
    }

    container.onclick = restoreFn
} */

/**
 * Capture and clone the given selector
 *
 */
const capture = (selector: string, redraw?) => {
  const node = document.querySelector(selector)
  return {
    selector, // remember how to find the replacement
    node: node.cloneNode(true), // capture the current dom via deep clone
    redraw, // any redraw helper that might've been registered
    nextSibling: node.nextSibling // remember this, so we can reattach in the right place (using insertBefore)
  }
}

/**
 * Drill down to a more detailed view, using the given command to
 * populate the new view.
 *
 */
export default (command, highlightThis, container: string | Element, returnTo?: string, options?) => (event?: Event) => {
  debug('drilldown', command, container, returnTo)

  if (event) event.stopPropagation()

  if (typeof container === 'string') {
    // then container is a query selector
    container = document.querySelector(container)
  }

  // capture the current header and other DOM state, before the `command` overwrites it
  const alreadyPipped = document.querySelector('body > .picture-in-picture')
  const presentation: Presentation = document.body.getAttribute('data-presentation') && Presentation[document.body.getAttribute('data-presentation')]
  const capturedHeader = capture(sidecarSelector('.sidecar-header-text'), popupListen)
  const capturedHeader2 = capture(sidecarSelector('.header-right-bits .custom-header-content'))
  const capturedHeader3 = capture(sidecarSelector('.header-right-bits .action-content'))
  const capturedHeader4 = capture(sidecarSelector('.sidecar-header-icon'))
  const capturedHeader5 = capture(sidecarSelector('.sidecar-header-secondary-content'))

  // for the footer, we need to capture the modeButton renderer, so we can reattach the click events
  const modeButtons = document.querySelector(bottomStripe.css.modeContainer)['capture']
  const capturedFooter = capture(bottomStripe.css.buttons, modeButtons && modeButtons())

  debug('container', container)
  debug('alreadyPipped', alreadyPipped)
  debug('presentation', presentation)

  const capturedHeaders = [ capturedHeader, capturedHeader2, capturedHeader3, capturedHeader4, capturedHeader5, capturedFooter ]

  // make the transition
  const restoreFn = container && !alreadyPipped
    ? pip(container, presentation, capturedHeaders, highlightThis, returnTo, options)
    : () => true

  highlight(highlightThis)

  // now we can safely begin executing the command
  debug('executing command', command)

  if (typeof command === 'string') {
    debug('drilling down with string command')

    return repl[(options && options.exec) || 'pexec'](command, Object.assign({}, {
      isDrilldown: true,
      preserveBackButton: true,
      rethrowErrors: true,
      reportErrors: true
    }, (options && options.execOptions) || {})).catch(restoreFn)
  } else if (typeof command === 'function') {
    return command().catch(restoreFn)
  } else {
    return showEntity(command, { preserveBackButton: true })
  }
}
