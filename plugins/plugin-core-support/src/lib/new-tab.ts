/*
 * Copyright 2018 IBM Corporation
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
const debug = Debug('plugins/core-support/new-tab')

import installReplFocusHandlers from './repl-focus'

import { keys } from '@kui-shell/core/webapp/keys'
import { isVisible as isSidecarVisible,
         toggle,
         toggleMaximization,
         clearSelection } from '@kui-shell/core/webapp/views/sidecar'
import sidecarSelector from '@kui-shell/core/webapp/views/sidecar-selector'
import { element, removeAllDomChildren } from '@kui-shell/core/webapp/util/dom'
import { listen, getCurrentPrompt, getCurrentTab, getTabIndex, ITab, setStatus } from '@kui-shell/core/webapp/cli'
import eventBus from '@kui-shell/core/core/events'
import { pexec, qexec } from '@kui-shell/core/core/repl'
import { CommandRegistrar, IEvent, ExecType, IEvaluatorArgs } from '@kui-shell/core/models/command'

const usage = {
  strict: 'switch',
  command: 'switch',
  required: [
    { name: 'tabIndex', numeric: true, docs: 'Switch to the given tab index' }
  ]
}

/**
 * Helper methods to crawl the DOM
 *
 */
const getTabButton = (tab: ITab) => element(`.main .left-tab-stripe .left-tab-stripe-button[data-tab-button-index="${getTabIndex(tab)}"]`)
const getCurrentTabButton = () => element('.main .left-tab-stripe .left-tab-stripe-button-selected')
const getTabButtonLabel = (tab: ITab) => getTabButton(tab).querySelector('.left-tab-stripe-button-label') as HTMLElement

/**
 * Otherwise global state that we want to keep per tab
 *
 */
class TabState {
  /** environment variables */
  readonly env: Record<string, string>

  /** current working directory */
  readonly cwd: string

  constructor () {
    this.env = Object.assign({}, process.env)
    this.cwd = process.cwd().slice(0) // just in case, copy the string

    debug('captured tab state', this.cwd)
  }

  restore () {
    debug('changing cwd', process.cwd(), this.cwd)
    process.chdir(this.cwd)
    process.env = this.env
  }
}

const switchTab = (tabIndex: number, activateOnly = false) => {
  debug('switchTab', tabIndex)

  const currentTab = getCurrentTab()
  const nextTab = document.querySelector(`.main > .tab-container > tab[data-tab-index="${tabIndex}"]`)
  const nextTabButton = document.querySelector(`.main .left-tab-stripe .left-tab-stripe-button[data-tab-button-index="${tabIndex}"]`)
  debug('nextTab', nextTab)
  debug('nextTabButton', nextTabButton)

  if (!nextTab || !nextTabButton) {
    throw new Error('Cannot find the given tab')
  } else {
    if (!activateOnly) {
      // then deactivate the current tab
      const currentVisibleTab = getCurrentTab()
      const currentTabButton = getCurrentTabButton()
      currentVisibleTab.classList.remove('visible')
      currentTabButton.classList.remove('left-tab-stripe-button-selected')
    }

    nextTab.classList.add('visible')
    nextTabButton.classList.add('left-tab-stripe-button-selected')

    if (currentTab) {
      currentTab['state'] = new TabState()
    }
    if (nextTab['state']) {
      (nextTab['state'] as TabState).restore()
    }

    return true
  }
}

/**
 * Register any keyboard event listeners
 *
 */
const addKeyboardListeners = (): void => {
/* this is now done in the main process; see src/main/menu.js
  document.addEventListener('keydown', async event => {
    if (event.keyCode === keys.T &&
        ((event.ctrlKey && process.platform !== 'darwin') || (event.metaKey && process.platform === 'darwin'))) {
      // true means that this is based on an event, rather than a repl.exec
      newTab(true)
    }
  })
*/
}

/**
 * Register any command evaluation listeners, i.e. when the REPL finishes evaluating a command.
 *
 */
const addCommandEvaluationListeners = (): void => {
  eventBus.on('/command/resolved', (event: IEvent) => {
    if (event.execType !== undefined &&
        event.execType !== ExecType.Nested &&
        !event.isDrilldown &&
        event.route) {
      // ignore nested, which means one plugin calling another
      // ignore drilldown events; keep the top-level command in the display
      debug('got event', event)

      const tab = event.tab || getCurrentTab()

      if (event.route !== undefined
          && !event.route.match(/^\/(tab|getting\/started)/) // ignore our own events and help
         ) {
        if (event.route.match(/^\/clear/)) {
          // nbsp in the case of clear, except if the sidecar is open;
          // then attempt to continue displaying the command that
          // produced the sidecar; TODO this isn't quite right; we
          // need to find a way to capture that sidecar-producing
          // command
          if (!isSidecarVisible()) {
            getTabButtonLabel(tab).innerText = '\u00a0'
          }
        } else {
          getTabButtonLabel(tab).innerText = event.command
        }
      }
    }
  })
}

/**
 * This will be called once, when the application loads. For the
 * per-tab init logic, look at perTabInit()
 *
 */
const oneTimeInit = (): void => {
  // focus the current prompt no matter where the user clicks in the left tab stripe
  (document.querySelector('.main > .left-tab-stripe') as HTMLElement).onclick = (evt: MouseEvent) => {
    getCurrentPrompt().focus()
  }

  const initialTabButton = getCurrentTabButton()
  const initialTabId = initialTabButton.getAttribute('data-tab-button-index')
  initialTabButton.onclick = () => qexec(`tab switch ${initialTabId}`)

  if (document.body.classList.contains('subwindow')) {
    element('#new-tab-button').onclick = () => window.open(window.location.href, '_blank')
  } else {
    element('#new-tab-button').onclick = () => newTab()
  }

  addKeyboardListeners()
  addCommandEvaluationListeners()

  // initialize the first tab
  perTabInit(false)
}

/**
 * Create and initialize a new tab
 *
 */
const newTab = async (basedOnEvent = false): Promise<boolean> => {
  debug('new tab')

  if (basedOnEvent && process.env.RUNNING_SHELL_TEST) {
    debug('aborting: spectron issues')
    return
  }

  const currentVisibleTab = getCurrentTab()
  currentVisibleTab['state'] = new TabState()

  const nTabs = document.querySelectorAll('.main > .tab-container > tab').length

  const newTab = currentVisibleTab.cloneNode(true) as HTMLElement
  const newTabId = (nTabs + 1).toString()
  newTab.setAttribute('data-tab-index', newTabId)
  newTab.className = 'visible'

  currentVisibleTab.classList.remove('visible')
  currentVisibleTab.parentNode.appendChild(newTab)

  const currentTabButton = getCurrentTabButton()
  currentTabButton.classList.remove('left-tab-stripe-button-selected')

  const newTabButton = currentTabButton.cloneNode(true) as HTMLElement
  const newTabButtonIcon = newTabButton.querySelector('i')
  newTabButton.classList.add('left-tab-stripe-button-selected')
  newTabButton.setAttribute('data-tab-button-index', newTabId)
  currentTabButton.parentNode.appendChild(newTabButton)

  getTabButtonLabel(currentVisibleTab).innerText = '\u00a0' // nbsp

  const currentlyProcessingBlock: true | HTMLElement = await qexec('clear --keep-current-active')
  if (currentlyProcessingBlock !== true) {
    debug('new tab cloned from one that is currently processing a command', currentlyProcessingBlock, currentlyProcessingBlock.querySelector('.repl-result').children.length)
    setStatus(currentlyProcessingBlock, 'repl-active')
  }

  // this must occur after the qexec('clear'), otherwise we may select
  // the wrong repl-result
  removeAllDomChildren(newTab.querySelector('.repl-result'))

  newTabButton.onclick = () => qexec(`tab switch ${newTabId}`)
  clearSelection()

  perTabInit()

  newTabButton.scrollIntoView()

  return true
}

/**
 * Initialize events for a new tab
 *
 */
const perTabInit = (doListen = true) => {
  if (doListen) {
    listen(getCurrentPrompt())
  }

  // we want to focus the current repl input when the user clicks, but
  // the logic here is a bit complicated; so we'll push the logic out
  // to a separate source file
  installReplFocusHandlers()

  // maximize button
  element(sidecarSelector('.toggle-sidecar-maximization-button')).onclick = () => {
    debug('toggle sidecar maximization')
    toggleMaximization()
  }

  // close button
  element(sidecarSelector('.toggle-sidecar-button')).onclick = () => {
    debug('toggle sidecar visibility')
    toggle()
  }

  // quit button
  element(sidecarSelector('.sidecar-bottom-stripe-quit')).onclick = () => {
    debug('quit button')
    try {
      window.close()
    } catch (err) {
      console.error('error handling quit button click', err)
    }
  }

  // screenshot button
  element(sidecarSelector('.sidecar-screenshot-button')).onclick = () => {
    debug('sidecar screenshot')
    pexec('screenshot sidecar')
  }
}

/**
 * Same as newTab, but done asynchronously
 *
 */
const newTabAsync = ({ execOptions }: IEvaluatorArgs) => {
  if (execOptions.nested) {
    newTab()
    return true
  } else {
    // we can't proceed until the repl is done installing the next block
    eventBus.once('/core/cli/install-block', () => newTab())

    // tell the REPL we're done, so it can get busy installing the next block!
    return true
  }
}

/**
 * Ensure the tabs have ids in consecutive order.
 *
 */
const reindexTabs = () => {
  const tabs = document.querySelectorAll('.main > .tab-container > tab')
  for (let idx = 0; idx < tabs.length; idx++) {
    const id = idx + 1 // indexed from 1
    tabs[idx].setAttribute('data-tab-index', id.toString())
  }

  const tabButtons = document.querySelectorAll('.main .left-tab-stripe .left-tab-stripe-buttons .left-tab-stripe-button')
  for (let idx = 0; idx < tabButtons.length; idx++) {
    const id = idx + 1 // also indexed from 1
    const button = tabButtons[idx] as HTMLElement

    button.setAttribute('data-tab-button-index', id.toString())
    button.onclick = () => qexec(`tab switch ${id}`)
  }
}

/**
 * Close the current tab
 *
 */
const closeTab = () => {
  const nTabs = document.querySelectorAll('.main > .tab-container > tab').length
  if (nTabs <= 1) {
    debug('closing window')
    qexec('window close')
    return true
  }

  const currentVisibleTab = getCurrentTab()
  const currentTabButton = getCurrentTabButton()
  const currentTabId = parseInt(currentTabButton.getAttribute('data-tab-button-index'), 10)

  currentVisibleTab.parentNode.removeChild(currentVisibleTab)
  currentTabButton.parentNode.removeChild(currentTabButton)

  // true means we only want to activate the given tab
  switchTab(currentTabId === 1 ? 2 : currentTabId - 1, true)

  getCurrentPrompt().focus()

  reindexTabs()

  return true
}

const registerCommandHandlers = (commandTree: CommandRegistrar) => {
  commandTree.listen('/tab/switch', ({ argvNoOptions }) => switchTab(parseInt(argvNoOptions[argvNoOptions.length - 1], 10)),
                     { usage, needsUI: true, noAuthOk: true })
  commandTree.listen('/tab/new', newTabAsync, { needsUI: true, noAuthOk: true })
  commandTree.listen('/tab/close', closeTab, { needsUI: true, noAuthOk: true })
}

export default async (commandTree: CommandRegistrar) => {
  if (typeof document !== 'undefined') {
    oneTimeInit()

    return registerCommandHandlers(commandTree)
  }
}
