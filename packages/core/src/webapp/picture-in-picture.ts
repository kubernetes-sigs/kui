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

import Debug from 'debug'
const debug = Debug('webapp/pip')
debug('loading')

import { removeAllDomChildren } from './util/dom'
import { getSidecar, showEntity, getActiveView } from './views/sidecar'

import { Tab } from './tab'
import { popupListen } from './listen'
import Presentation from './views/presentation'
import { ExecOptions } from '../models/execOptions'
import { EntitySpec } from '../models/entity'
import { pexec, qexec } from '../repl/exec'
import { css, rawCSS } from './bottom-stripe'
import { isCapturable } from './models/capturable'

type Op = (elt: Element, cls: string) => void
const remove: Op = (elt: Element, cls: string) => elt.classList.remove(cls)
const add: Op = (elt: Element, cls: string) => elt.classList.add(cls)
const _highlight = (op: Op) => (highlightThis?: Element | Element[]) => {
  if (highlightThis) {
    if (Array.isArray(highlightThis)) {
      highlightThis.forEach(_ => op(_, 'picture-in-picture-highlight'))
    } else {
      op(highlightThis, 'picture-in-picture-highlight')
    }
  }
}
const dehighlight = _highlight(remove)
const highlight = _highlight(add)

interface PipOptions {
  parent?: Element
  exec?: 'qexec' | 'pexec'
  execOptions?: ExecOptions
}

/**
 * Make an DOM event handler that will restore the given pippedContainer
 *
 */
const restore = (
  tab: Tab,
  pippedContainer: boolean | Element,
  previousPresentation: Presentation,
  sidecarClass: string,
  capturedHeaders: CapturedHeader[],
  highlightThis: Element | Element[],
  escapeHandler: (evt: KeyboardEvent) => boolean,
  options?: PipOptions
) => () => {
  debug('restore')

  const sidecar = getSidecar(tab)
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
  if (pippedContainer !== true && pippedContainer !== false) {
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
const pip = (
  tab: Tab,
  container: boolean | Element,
  previousPresentation: Presentation,
  capturedHeaders: CapturedHeader[],
  highlightThis: Element | Element[],
  returnTo = 'previous view',
  options?: PipOptions
) => {
  try {
    if (container !== true && container !== false) {
      container.parentNode.removeChild(container)
    }
  } catch (e) {
    // ok
  }

  const sidecar = getSidecar(tab)
  const sidecarClass = sidecar.className
  const escapeHandler: (evt: KeyboardEvent) => boolean = undefined // we don't want to override the escape key behavior
  const backContainer = css.backContainer(tab)
  const backButton = css.backButton(tab)
  const restoreFn = restore(
    tab,
    container,
    previousPresentation,
    sidecarClass,
    capturedHeaders,
    highlightThis,
    escapeHandler,
    options
  )

  debug('returnTo', returnTo)
  backButton.setAttribute('data-balloon', `Return to ${returnTo}`)
  backContainer.classList.add('has-back-button')

  backButton.addEventListener(
    'click',
    () => {
      restoreFn()
      backContainer.classList.remove('has-back-button')
    },
    { once: true }
  )

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
    const restoreFn = restore(tab, container, sidecarClass, capturedHeaders, highlightThis, escapeHandler)

    document.onkeyup = evt => {
        if (evt.keyCode === 27) { // escape key maps to keycode `27`
            restoreFn()
        }
    }

    container.onclick = restoreFn
} */

interface CapturedHeader {
  selector: string
  node: Element
  redraw: Function
  nextSibling: Element
}

/**
 * Capture and clone the given selector
 *
 */
const capture = (tab: Tab, selector: string, redraw?: Function): CapturedHeader => {
  // capture the current dom via deep clone
  const node = tab.querySelector(selector)
  const clone = node.cloneNode(true) as Element

  // remember this, so we can reattach in the right place (using insertBefore)
  const parent = node.parentNode
  const nextSibling = node.nextSibling as Element

  node.remove()
  parent.insertBefore(clone, nextSibling)

  return {
    selector, // remember how to find the replacement
    node,
    redraw, // any redraw helper that might've been registered
    nextSibling
  }
}

type StringProducing = () => Promise<string>

/**
 * Drill down to a more detailed view, using the given command to
 * populate the new view.
 *
 */
export const drilldown = (
  tab: Tab,
  command?: string | EntitySpec | StringProducing,
  highlightThis?: Element | Element[],
  ccontainer?: string | Element,
  returnTo?: string,
  options?: PipOptions
) => (event?: Event) => {
  if (event) event.stopPropagation()

  // maybe ccontainer is a query selector
  const container =
    typeof ccontainer === 'string' ? document.querySelector(ccontainer) : ccontainer || getActiveView(tab)

  debug('drilldown', command, container, returnTo)

  // capture the current header and other DOM state, before the `command` overwrites it
  const alreadyPipped = document.querySelector('body > .picture-in-picture')

  const presentationString = document.body.getAttribute('data-presentation') as keyof typeof Presentation
  const presentation: Presentation = presentationString && Presentation[presentationString]

  const capturedHeader = capture(tab, '.sidecar-header-text', popupListen)
  const capturedHeader2 = capture(tab, '.header-right-bits .custom-header-content')
  const capturedHeader3 = capture(tab, '.header-right-bits .action-content')
  const capturedHeader4 = capture(tab, '.sidecar-header-icon')
  const capturedHeader5 = capture(tab, '.sidecar-header-secondary-content')

  // for the footer, we need to capture the modeButton renderer, so we can reattach the click events
  const modeContainer = css.modeContainer(tab)
  const modeButtons = isCapturable(modeContainer) && modeContainer.capture
  const capturedFooter = capture(tab, rawCSS.buttons, modeButtons && modeButtons())

  const capturedHeaders = [
    capturedHeader,
    capturedHeader2,
    capturedHeader3,
    capturedHeader4,
    capturedHeader5,
    capturedFooter
  ]

  // make the transition
  const restoreFn =
    container && !alreadyPipped
      ? pip(tab, container, presentation, capturedHeaders, highlightThis, returnTo, options)
      : () => true

  highlight(highlightThis)

  // now we can safely begin executing the command
  debug('executing command', command)

  if (typeof command === 'string') {
    debug('drilling down with string command')

    const execOptions: ExecOptions = Object.assign(
      {},
      {
        isDrilldown: true,
        preserveBackButton: true,
        rethrowErrors: true,
        reportErrors: true
      },
      (options && options.execOptions) || {}
    )

    if (!options || options.exec === 'pexec') {
      return pexec(command, execOptions).catch(restoreFn)
    } else {
      return qexec(command, undefined, undefined, execOptions).catch(restoreFn)
    }
  } else if (typeof command === 'function') {
    return command().catch(restoreFn)
  } else {
    return showEntity(tab, command, { preserveBackButton: true })
  }
}

export default drilldown
