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

/* eslint-disable @typescript-eslint/explicit-member-accessibility */

import * as Debug from 'debug'

import {
  isVisible as isSidecarVisible,
  toggle,
  toggleMaximization,
  clearSelection
} from '@kui-shell/core/webapp/views/sidecar'
import sidecarSelector from '@kui-shell/core/webapp/views/sidecar-selector'
import { element, removeAllDomChildren } from '@kui-shell/core/webapp/util/dom'
import {
  isPopup,
  listen,
  getCurrentPrompt,
  getCurrentTab,
  getTabIndex,
  Tab,
  setStatus
} from '@kui-shell/core/webapp/cli'
import eventBus from '@kui-shell/core/core/events'
import { pexec, qexec } from '@kui-shell/core/core/repl'
import { CommandRegistrar, Event, ExecType, EvaluatorArgs } from '@kui-shell/core/models/command'
import { theme, config } from '@kui-shell/core/core/settings'
import { inBrowser } from '@kui-shell/core/core/capabilities'
import { WatchableJob } from '@kui-shell/core/core/job'

const debug = Debug('plugins/core-support/new-tab')

export const tabButtonSelector = '#new-tab-button > svg'

interface TabConfig {
  topTabs?: { names: 'fixed' | 'command' }
}
const { topTabs = { names: 'command' } } = config as TabConfig

const usage = {
  strict: 'switch',
  command: 'switch',
  required: [{ name: 'tabIndex', numeric: true, docs: 'Switch to the given tab index' }]
}

/**
 * Helper methods to crawl the DOM
 *
 */
const getTabButton = (tab: Tab) =>
  element(`.main .left-tab-stripe .left-tab-stripe-button[data-tab-button-index="${getTabIndex(tab)}"]`)
const getCurrentTabButton = () => element('.main .left-tab-stripe .left-tab-stripe-button-selected')
const getTabButtonLabel = (tab: Tab) => getTabButton(tab).querySelector('.left-tab-stripe-button-label') as HTMLElement
const getTabCloser = (tab: Tab) => getTabButton(tab).querySelector('.left-tab-stripe-button-closer') as HTMLElement

/**
 * Otherwise global state that we want to keep per tab
 *
 */
class TabState {
  /** environment variables */
  private _env: Record<string, string>

  /** current working directory */
  private _cwd: string

  get env() {
    return this._env
  }

  get cwd() {
    return this._cwd
  }

  capture() {
    this._env = Object.assign({}, process.env)
    this._cwd = process.cwd().slice(0) // just in case, copy the string

    debug('captured tab state', this.cwd)
  }

  /** current watchable jobs */
  private _jobs: WatchableJob[]

  get jobs() {
    return this._jobs
  }

  captureJob(job: WatchableJob) {
    this._jobs = !this._jobs ? [job] : this._jobs.concat([job])
  }

  removeJob(job: WatchableJob) {
    this._jobs = this._jobs.filter(existingJob => existingJob.id !== job.id)
  }

  restore() {
    process.env = this._env

    if (inBrowser()) {
      debug('changing cwd', process.env.PWD, this._cwd)
      process.env.PWD = this._cwd
    } else {
      debug('changing cwd', process.cwd(), this._cwd)
      process.chdir(this._cwd)
    }
  }
}

const switchTab = (tabIndex: number, activateOnly = false) => {
  debug('switchTab', tabIndex)

  const currentTab = getCurrentTab()
  const nextTab = document.querySelector(`.main > .tab-container > tab[data-tab-index="${tabIndex}"]`)
  const nextTabButton = document.querySelector(
    `.main .left-tab-stripe .left-tab-stripe-button[data-tab-button-index="${tabIndex}"]`
  )
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
      currentTabButton.classList.remove('kui-tab--active')
    }

    nextTab.classList.add('visible')
    nextTabButton.classList.add('left-tab-stripe-button-selected')
    nextTabButton.classList.add('kui-tab--active')

    if (currentTab) {
      ;(currentTab['state'] as TabState).capture()
    }
    if (nextTab['state']) {
      ;(nextTab['state'] as TabState).restore()
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
  eventBus.on('/command/complete', (event: Event) => {
    if (event.execType !== undefined && event.execType !== ExecType.Nested && event.route) {
      // ignore nested, which means one plugin calling another
      debug('got event', event)
      getTabButton(event.tab).classList.remove('processing')
    }
  })

  eventBus.on('/command/start', (event: Event) => {
    if (event.execType !== undefined && event.execType !== ExecType.Nested && event.route) {
      // ignore nested, which means one plugin calling another
      debug('got event', event)

      const tab = event.tab

      if (
        event.route !== undefined &&
        !event.route.match(/^\/(tab|getting\/started)/) // ignore our own events and help
      ) {
        if (/^\/clear/.test(event.route)) {
          // nbsp in the case of clear, except if the sidecar is open;
          // then attempt to continue displaying the command that
          // produced the sidecar; TODO this isn't quite right; we
          // need to find a way to capture that sidecar-producing
          // command
          if (!isSidecarVisible(tab)) {
            if (topTabs.names === 'command') {
              getTabButtonLabel(tab).innerText = theme['productName']
            }
          }
        } else {
          if (topTabs.names === 'command') {
            getTabButtonLabel(tab).innerText = event.command
          }
          getTabButton(tab).classList.add('processing')
        }
      }
    }
  })
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

  const tabButtons = document.querySelectorAll(
    '.main .left-tab-stripe .left-tab-stripe-buttons .left-tab-stripe-button'
  )
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
const closeTab = (tab = getCurrentTab()) => {
  const nTabs = document.querySelectorAll('.main > .tab-container > tab').length
  if (nTabs <= 1) {
    debug('closing window')
    qexec('window close')
    return true
  }

  const tabButton = getTabButton(tab)
  const tabId = parseInt(tabButton.getAttribute('data-tab-button-index'), 10)

  const tabState: TabState = tab['state']
  if (tabState.jobs) {
    tabState.jobs.forEach(job => job.abort())
  }

  tab.parentNode.removeChild(tab)
  tabButton.parentNode.removeChild(tabButton)

  // true means we only want to activate the given tab
  switchTab(tabId === 1 ? 2 : tabId - 1, true)

  getCurrentPrompt().focus()

  reindexTabs()

  return true
}

function isElement(target: EventTarget): target is Element {
  return (target as Element).classList !== undefined
}

/**
 * Initialize events for a new tab
 *
 */
const perTabInit = (tab: Tab, doListen = true) => {
  tab['state'] = new TabState()

  eventBus.emit('/tab/new', tab)

  if (doListen) {
    listen(getCurrentPrompt(tab))
  }

  // keep repl prompt focused, if possible
  tab.querySelector('.repl-inner').addEventListener('click', (evt: MouseEvent) => {
    if (isElement(evt.target)) {
      if (evt.target.classList.contains('repl-inner') || evt.target.classList.contains('repl-output')) {
        getCurrentPrompt(tab).focus()
      }
    }
  })

  // tab close button
  getTabCloser(tab).onclick = (event: MouseEvent) => {
    event.stopPropagation()
    return closeTab(tab)
  }

  // maximize button
  sidecarSelector(tab, '.toggle-sidecar-maximization-button').onclick = () => {
    debug('toggle sidecar maximization')
    // indicate that the user requested maximization
    toggleMaximization(tab, 'user')
  }

  // close button
  sidecarSelector(tab, '.toggle-sidecar-button').onclick = () => {
    debug('toggle sidecar visibility')
    toggle(tab)
  }

  // quit button
  sidecarSelector(tab, '.sidecar-bottom-stripe-quit').onclick = () => {
    try {
      if (isPopup()) {
        debug('quit button click')
        window.close()
      } else {
        debug('close sidecar button click')
        clearSelection(tab)
      }
    } catch (err) {
      console.error('error handling quit button click', err)
    }
  }

  // screenshot button
  sidecarSelector(tab, '.sidecar-screenshot-button').onclick = () => {
    debug('sidecar screenshot')
    pexec('screenshot sidecar')
  }
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
  ;(currentVisibleTab['state'] as TabState).capture()

  const nTabs = document.querySelectorAll('.main > .tab-container > tab').length

  const newTab = currentVisibleTab.cloneNode(true) as HTMLElement
  const newTabId = (nTabs + 1).toString()
  newTab.setAttribute('data-tab-index', newTabId)
  newTab.className = 'visible'

  const currentTabButton = getCurrentTabButton()
  currentTabButton.classList.remove('left-tab-stripe-button-selected')
  currentTabButton.classList.remove('kui-tab--active')

  const newTabButton = currentTabButton.cloneNode(true) as HTMLElement
  newTabButton.classList.add('left-tab-stripe-button-selected')
  newTabButton.classList.add('kui-tab--active')
  newTabButton.classList.remove('processing')
  newTabButton.setAttribute('data-tab-button-index', newTabId)
  currentTabButton.parentNode.appendChild(newTabButton)

  getTabButtonLabel(newTab).innerText = topTabs.names === 'fixed' ? `Tab ${getTabIndex(newTab)}` : 'New Tab'

  newTabButton.onclick = () => qexec(`tab switch ${newTabId}`)

  const currentlyProcessingBlock: true | HTMLElement = await qexec(
    'clear --keep-current-active',
    undefined,
    undefined,
    { tab: newTab }
  )
  if (currentlyProcessingBlock !== true) {
    debug(
      'new tab cloned from one that is currently processing a command',
      currentlyProcessingBlock,
      currentlyProcessingBlock.querySelector('.repl-result').children.length
    )
    setStatus(currentlyProcessingBlock, 'repl-active')
  }

  // this must occur after the qexec('clear'), otherwise we may select
  // the wrong repl-result
  removeAllDomChildren(newTab.querySelector('.repl-result'))

  clearSelection(newTab)
  perTabInit(newTab)

  newTabButton.scrollIntoView()

  // make the new tab visible at the very end of the above init work!
  currentVisibleTab.classList.remove('visible')
  currentVisibleTab.parentNode.appendChild(newTab)
  getCurrentPrompt(newTab).focus()

  return true
}

/**
 * This will be called once, when the application loads. For the
 * per-tab init logic, look at perTabInit()
 *
 */
const oneTimeInit = (): void => {
  const initialTabButton = getCurrentTabButton()
  const initialTabId = initialTabButton.getAttribute('data-tab-button-index')
  initialTabButton.onclick = () => qexec(`tab switch ${initialTabId}`)

  if (document.body.classList.contains('subwindow')) {
    element(tabButtonSelector).onclick = () => window.open(window.location.href, '_blank')
  } else {
    element(tabButtonSelector).onclick = () => newTab()
  }

  addKeyboardListeners()
  addCommandEvaluationListeners()

  // initialize the first tab
  perTabInit(getCurrentTab(), false)

  getTabButtonLabel(getCurrentTab()).innerText =
    topTabs.names === 'fixed' ? `Tab ${getTabIndex(getCurrentTab())}` : theme['productName']

  // focus the current prompt no matter where the user clicks in the left tab stripe
  ;(document.querySelector('.main > .left-tab-stripe') as HTMLElement).onclick = () => {
    getCurrentPrompt().focus()
  }
}

/**
 * Same as newTab, but done asynchronously
 *
 */
const newTabAsync = ({ execOptions }: EvaluatorArgs) => {
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

const registerCommandHandlers = (commandTree: CommandRegistrar) => {
  commandTree.listen(
    '/tab/switch',
    ({ argvNoOptions }) => switchTab(parseInt(argvNoOptions[argvNoOptions.length - 1], 10)),
    { usage, needsUI: true, noAuthOk: true }
  )
  commandTree.listen('/tab/new', newTabAsync, {
    needsUI: true,
    noAuthOk: true
  })
  commandTree.listen('/tab/close', () => closeTab(), {
    needsUI: true,
    noAuthOk: true
  })
}

export default async (commandTree: CommandRegistrar) => {
  if (typeof document !== 'undefined') {
    oneTimeInit()

    return registerCommandHandlers(commandTree)
  }
}
