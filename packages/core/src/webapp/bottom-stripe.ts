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

import Debug from 'debug'

import { Tab } from './cli'
import { removeAllDomChildren } from './util/dom'
import { isTable, isMultiTable, Table, MultiTable } from './models/table'
import { Capturable } from './models/capturable'
import { CustomSpec, getSidecar } from './views/sidecar-core'
import { isCustomSpec } from './views/custom-content'
import sidecarSelector from './views/sidecar-selector'
import { ExecOptions } from '../models/execOptions'
import { apply as addRelevantModes } from './views/registrar/modes'
import { pexec, qexec, rexec } from '../repl/exec'
import { isHTML } from '../util/types'
import { Entity, MetadataBearing, isMetadataBearing, isMetadataBearingByReference } from '../models/entity'
import { Label, ModeTraits, Button, isButton } from '../models/mmr/types'
import { Content as HighLevelContent, hasContent, isStringWithOptionalContentType } from '../models/mmr/content-types'

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
export type DirectViewControllerFunction<E = object, R = object> = (tab: Tab, entity: E) => PromiseLike<R> | R | void

type DirectViewEntity = CustomSpec

function isDirectViewEntity(direct: DirectViewController): direct is DirectViewEntity {
  return isCustomSpec(direct as DirectViewEntity)
}

// Notes: for reasons I don't understand fully, we need to export
// this, even though nobody uses it outside of this file (by name). I
// understand that this is necessary for generation of declrations
// files, however I am not sure why we didn't have to do this before
// some seemingly minor changes in other places in this file.
// Reference material:
// https://github.com/Microsoft/TypeScript/issues/5711
export interface DirectViewControllerSpec {
  plugin: string
  operation: string
  parameters: object
}

/** clicking on a button can toggle other buttons */
interface Toggle {
  toggle: { mode: string; disabled: boolean }[]
}
function isToggle(result: DirectResult): result is Toggle {
  return result && Array.isArray((result as Toggle).toggle)
}

export type DirectResult = Toggle | Entity

/**
 * Call a "direct" impl
 *
 */
const callDirect = async (
  tab: Tab,
  makeView: DirectViewController,
  entity: MetadataBearing | CustomSpec,
  execOptions: ExecOptions
): Promise<DirectResult> => {
  if (typeof makeView === 'string') {
    debug('makeView as string')
    if (execOptions && execOptions.exec === 'pexec') {
      return pexec(makeView, execOptions)
    } else if (execOptions && execOptions.exec === 'rexec') {
      return rexec(makeView, execOptions)
    } else {
      return qexec(makeView, undefined, undefined, Object.assign({}, execOptions, { rethrowErrors: true }))
    }
  } else if (typeof makeView === 'function') {
    debug('makeView as function')
    return Promise.resolve(makeView(tab, entity) as DirectResult)
  } else if (isDirectViewEntity(makeView)) {
    const combined = Object.assign({}, entity, makeView)
    return combined
  } else {
    //
    // what we want: a dynamic import of the plugin's "main"
    //
    // what we can't have: webpack does not support this; this seems
    // reasonable, as support this use case would require webpack to
    // scan for matches while it is building
    //
    // what we do instead: rely users of this API to provide the full
    // path to their main
    //
    // what we could also do in the future: enforce a policy on
    // plugins as to path to their main, e.g. /dist/index.js
    //
    const provider: Record<
      string,
      (tab: Tab, parameters: object, entity: MetadataBearing | CustomSpec) => DirectResult
    > = await import('@kui-shell/plugin-' + makeView.plugin)
    try {
      return provider[makeView.operation](tab, makeView.parameters, entity)
    } catch (err) {
      console.error('could not render mode', makeView.operation, err)
    }
  }
}

export interface LowLevelContent<Direct = DirectViewController> {
  // weak: if we have exclusively flush:right buttons, then snap them all left
  // right: always place this button flush:right
  // default: use the order? field if defined; otherwise: order mode tabs/buttons as given
  flush?: 'right' | 'weak'

  selected?: boolean
  selectionController?: { on: (evt: 'change', cb: (selected: boolean) => void) => void }
  visibleWhen?: string
  leaveBottomStripeAlone?: boolean

  // icon label?
  fontawesome?: string

  // show label below the fontawesome?
  labelBelow?: boolean

  // tooltip text
  balloon?: string
  balloonLength?: string

  data?: Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any

  command?: (entity: MetadataBearing | CustomSpec) => string
  direct?: Direct
  url?: string

  execOptions?: ExecOptions

  actAsButton?: boolean

  radioButton?: boolean

  echo?: boolean

  noHistory?: boolean

  replSilence?: boolean
}

type Content<Direct = DirectViewController, T = MetadataBearing> =
  | Button<T>
  | HighLevelContent<T>
  | LowLevelContent<Direct>

function isHighLevelMode<T extends MetadataBearing>(
  mode: Button<T> | HighLevelContent<T> | SidecarMode
): mode is Button<T> | HighLevelContent<T> {
  return isButton(mode) || hasContent(mode)
}

/**
 * Bottom stripe button specification
 *
 */
export type SidecarMode<Direct = DirectViewController> = Label & ModeTraits & Content<Direct>
export function isSidecarMode(entity: string | HTMLElement | Table | MultiTable | SidecarMode): entity is SidecarMode {
  const mode = entity as SidecarMode
  return mode.mode !== undefined && (isHighLevelMode(mode) || mode.direct !== undefined || mode.command !== undefined)
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
  /* const { flush,
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
    actAsButton,
    radioButton = false,
    echo = false,
    noHistory = true,
    replSilence = true
  } = opts */

  // create the button dom, and attach it
  const isTab =
    (hasContent(opts) && !isButton(opts)) ||
    (!isHighLevelMode(opts) && !(opts.flush === 'right' || opts.flush === 'weak'))
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

  if (!isHighLevelMode(opts)) {
    if (opts.visibleWhen && opts.visibleWhen !== show) {
      // only visible when a specific mode is active!
      return
    } else if (opts.visibleWhen) {
      button.setAttribute('data-visible-when', opts.visibleWhen)
    }

    if (opts.actAsButton) {
      // some plugins want to add buttons, not mode-switchers to the bottom bar
      // let's make them behave a bit more like buttons
      button.classList.add(css.buttonActingAsButton)

      if (opts.radioButton) {
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
      }
    }

    if (opts.data) {
      // we were asked to add some data attributes
      for (const attr in opts.data) {
        button.setAttribute(attr, opts.data[attr])
      }
    }
  }

  if (
    (((!show || show === 'default') && defaultMode) || show === mode) &&
    (isHighLevelMode(opts) || !opts.actAsButton)
  ) {
    button.classList.add(css.active)
  }
  button.setAttribute('data-mode', mode)

  // add the button label
  const fontawesome = !isHighLevelMode(opts) && opts.fontawesome
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

    if (!isHighLevelMode(opts) && opts.labelBelow) {
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

  if (!isHighLevelMode(opts) && opts.balloon) {
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

  const url = !isHighLevelMode(opts) && opts.url
  if (url) {
    //
    // onclick, open a new page
    //
    button.onclick = () => window.open(url)
  } else if (isHighLevelMode(opts) || opts.command || opts.direct) {
    //
    // insert the command handler
    //
    button.onclick = async () => {
      // change the active button
      const leaveBottomStripeAlone = isHighLevelMode(opts) || opts.leaveBottomStripeAlone
      const actAsButton = !isHighLevelMode(opts) && opts.actAsButton

      const changeActiveButton = () => {
        const radioButton = !isHighLevelMode(opts) && opts.radioButton
        const selected = !isHighLevelMode(opts) && opts.selected

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
        } else if (isTable(view) || isMultiTable(view)) {
          const dom1 = document.createElement('div')
          const dom2 = document.createElement('div')
          dom1.classList.add('scrollable', 'scrollable-auto')
          dom2.classList.add('result-as-table', 'repl-result')
          dom1.appendChild(dom2)
          const { formatTable } = await import('./views/table')
          formatTable(tab, view, dom2, { usePip: true })
          const { insertCustomContent } = await import('./views/sidecar')
          insertCustomContent(tab, dom1)
        }
      }

      // execute the command
      if (!isHighLevelMode(opts) && opts.direct) {
        try {
          if (isDirectViewEntity(opts.direct) || leaveBottomStripeAlone) {
            // change the active button before we fetch the model
            changeActiveButton()
          }

          const view = await callDirect(tab, opts.direct, entity, opts.execOptions)
          if (actAsButton && isToggle(view)) {
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
          } else if (view && !actAsButton && !isToggle(view)) {
            if (isTable(view) || isStringWithOptionalContentType(view)) {
              changeActiveButton()
            }

            await present(view)
          } else if (!isToggle(view) && isCustomSpec(view)) {
            const { showCustom } = await import('./views/sidecar')
            showCustom(tab, view, { leaveBottomStripeAlone: leaveBottomStripeAlone })
          } else if (!leaveBottomStripeAlone) {
            changeActiveButton()
          }
        } catch (err) {
          // do not change active bottom if the command failed!
          console.error(err)
        }
      } else if (!isHighLevelMode(opts) && opts.command) {
        try {
          const { echo, noHistory, replSilence } = opts
          await pexec(opts.command(entity), { echo, noHistory, replSilence })
          if (leaveBottomStripeAlone) {
            changeActiveButton()
          }
        } catch (err) {
          console.error(err)
        }
      } else if (hasContent(opts)) {
        const { format } = await import('../models/mmr/show')
        const view = await format(tab, entity as MetadataBearing, opts)
        changeActiveButton()
        await present(view)
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

export const addModeButtons = <Direct = DirectViewController>(
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

  // Place flush:right items at the end. Notes on flush:weak; this
  // means place to the right, unless there are no flush:right|weak
  // buttons.
  const modes = modesUnsorted.sort((a, b) => {
    const aFlush = isHighLevelMode(a) ? undefined : a.flush
    const bFlush = isHighLevelMode(b) ? undefined : b.flush

    if (aFlush === bFlush || (aFlush === 'weak' && bFlush === 'right') || (aFlush === 'right' && bFlush === 'weak')) {
      // then use the natural order of a versus b: a mode model can
      // optionally specify a numeric sort order; if not specified,
      // then use the order as given
      return (a.order || 0) - (b.order || 0)
    } else {
      if (aFlush === 'right' || aFlush === 'weak') {
        return 1
      } else {
        return -1
      }
    }
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

  const defaultMode =
    modes && (modes.find(({ defaultMode }) => defaultMode) || modes.find(_ => isHighLevelMode(_) || !_.flush))
  const show = (options && options.show) || (defaultMode && (defaultMode.mode || defaultMode.label))

  addModeButtons(tab, modes, entity, show)

  if (!options || !options.preserveBackButton) {
    const backContainer = css.backContainer(tab)
    backContainer.classList.remove('has-back-button')
  }

  return modesUnsorted
}
