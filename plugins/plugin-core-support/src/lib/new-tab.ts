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

import Debug from 'debug'
import { v4 as uuid } from 'uuid'

import { Capabilities, Commands, eventBus, i18n, Models, REPL, Settings, UI } from '@kui-shell/core'
import { isVisible as isSidecarVisible, toggle, toggleMaximization } from '@kui-shell/core/webapp/views/sidecar'
import sidecarSelector from '@kui-shell/core/webapp/views/sidecar-selector'
import { listen, getCurrentTab, getTabId, setStatus } from '@kui-shell/core/webapp/cli'
import { WatchableJob } from '@kui-shell/core/core/job'

const strings = i18n('plugin-core-support')
const debug = Debug('plugins/core-support/new-tab')

export const tabButtonSelector = '#new-tab-button'

interface TabConfig {
  topTabs?: { names: 'fixed' | 'command' }
}
const { topTabs = { names: 'command' } } = Settings.config as TabConfig

const usage = {
  strict: 'switch',
  command: 'switch',
  required: [{ name: 'tabIndex', numeric: true, docs: 'Switch to the given tab index' }]
}

/**
 * Look up an HTML element
 *   note: ParentNode is a common parent of Element and Document
 */
function element(id: string, parent: ParentNode = document): HTMLElement {
  return parent.querySelector(id) as HTMLElement
}

function isUsingCommandName() {
  return topTabs.names !== 'fixed' && !document.body.classList.contains('kui--alternate')
}

/**
 * Given a tab index, return the tab id
 *
 */
function getTabFromIndex(idx: number): UI.Tab {
  return element(`.main tab:nth-child(${idx})`) as UI.Tab
}

/**
 * Helper methods to crawl the DOM
 *
 */
const getTabButton = (tab: UI.Tab) =>
  element(`.main .left-tab-stripe .left-tab-stripe-button[data-tab-id="${getTabId(tab)}"]`)
const getCurrentTabButton = () => element('.main .left-tab-stripe .left-tab-stripe-button-selected')
const getTabButtonLabel = (tab: UI.Tab) =>
  getTabButton(tab).querySelector('.left-tab-stripe-button-label .kui-tab--label-text') as HTMLElement
const getTabCloser = (tab: UI.Tab) => getTabButton(tab).querySelector('.left-tab-stripe-button-closer') as HTMLElement

/**
 * Otherwise global state that we want to keep per tab
 *
 */
export class TabState {
  /** is the tab closed? */
  closed: boolean

  /** environment variables */
  private _env: Record<string, string>

  /** current working directory */
  private _cwd: string

  /** jobs attached to this tab */
  private _jobs: WatchableJob[]

  private _age: number[]

  private _ageCounter = 0

  private _currentBottomInputValue = ''

  get env() {
    return this._env
  }

  get cwd() {
    return this._cwd
  }

  get currentBottomInputValue() {
    return this._currentBottomInputValue
  }

  capture() {
    this._env = Object.assign({}, process.env)
    this._cwd = Capabilities.inBrowser() ? process.env.PWD : process.cwd().slice(0) // just in case, copy the string

    if (Settings.inBottomInputMode) {
      this._currentBottomInputValue = UI.getCurrentPrompt().value
    }

    debug('captured tab state', this.cwd)
  }

  /**
   * @return the number of attached jobs
   */
  get jobs(): number {
    return !this._jobs ? 0 : this._jobs.filter(_ => _ !== undefined).length
  }

  /** INTERNAL: abort the oldest job, and return the index of its slot */
  private abortOldestJob(): number {
    const oldestSlot = this._age.reduce((minAgeIdx, age, idx, ages) => {
      if (minAgeIdx === -1) {
        return idx
      } else if (ages[minAgeIdx] > age) {
        return idx
      } else {
        return minAgeIdx
      }
    }, -1)

    this._jobs[oldestSlot].abort()
    return oldestSlot
  }

  /** INTERNAL: find a free job slot, aborting the oldest job if necessary to free up a slot */
  private findFreeJobSlot(): number {
    const idx = this._jobs.findIndex(_ => _ === undefined)
    if (idx === -1) {
      return this.abortOldestJob()
    } else {
      return idx
    }
  }

  /** attach a job to this tab */
  captureJob(job: WatchableJob) {
    if (!this._jobs) {
      const maxJobs = Settings.theme.maxWatchersPerTab || 6
      this._jobs = new Array<WatchableJob>(maxJobs)
      this._age = new Array<number>(maxJobs)
    }
    const slot = this.findFreeJobSlot()
    this._jobs[slot] = job
    this._age[slot] = this._ageCounter++
  }

  /**
   * Abort all jobs attached to this tab
   *
   */
  public abortAllJobs() {
    if (this._jobs) {
      this._jobs.forEach((job, idx) => {
        this.abortAt(idx)
      })
    }
  }

  /** INTERNAL: abort the job at the given index */
  private abortAt(idx: number) {
    this._jobs[idx].abort()
    this.clearAt(idx)
  }

  /** INTERNAL: clear the references to the job at the given index */
  private clearAt(idx: number) {
    this._jobs[idx] = undefined
    this._age[idx] = undefined
  }

  /**
   * Clear any references to the given job. It is assumed that the
   * caller is responsible for aborting the job.
   *
   */
  removeJob(job: WatchableJob) {
    if (this._jobs) {
      const idx = this._jobs.findIndex(existingJob => existingJob && existingJob.id === job.id)
      this.clearAt(idx)
    }
  }

  restore() {
    process.env = this._env

    if (Capabilities.inBrowser()) {
      debug('changing cwd', process.env.PWD, this._cwd)
      process.env.PWD = this._cwd
    } else {
      debug('changing cwd', process.cwd(), this._cwd)
      process.chdir(this._cwd)
    }

    if (Settings.inBottomInputMode) {
      UI.getCurrentPrompt().value = this.currentBottomInputValue
    }
  }
}

const switchTab = (tabId: string, activateOnly = false) => {
  debug('switchTab', tabId)

  const currentTab = getCurrentTab()
  const nextTab = document.querySelector(`.main > .tab-container > tab[data-tab-id="${tabId}"]`) as UI.Tab
  const nextTabButton = document.querySelector(`.main .left-tab-stripe .left-tab-stripe-button[data-tab-id="${tabId}"]`)
  // debug('nextTab', nextTab)
  // debug('nextTabButton', nextTabButton)

  if (!nextTab || !nextTabButton) {
    debug('Cannot find the desired tab to switch to')
  }

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

  const promptToFocus = UI.getCurrentPrompt(nextTab)
  if (promptToFocus) {
    promptToFocus.focus()
  }

  return true
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
  eventBus.on('/command/complete', (event: Commands.Event) => {
    if (event.execType !== undefined && event.execType !== Commands.ExecType.Nested && event.route) {
      // ignore nested, which means one plugin calling another
      // debug('got event', event)
      const button = getTabButton(event.tab)
      if (button) {
        // the tab might no longer be visible
        button.classList.remove('processing')
      }
    }
  })

  eventBus.on('/command/start', (event: Commands.Event) => {
    if (event.execType !== undefined && event.execType !== Commands.ExecType.Nested && event.route) {
      // ignore nested, which means one plugin calling another
      // debug('got event', event)

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
            if (isUsingCommandName()) {
              getTabButtonLabel(tab).innerText = Settings.theme.productName
            }
          }
        } else {
          if (isUsingCommandName()) {
            getTabButtonLabel(tab).innerText = event.command
          }
          getTabButton(tab).classList.add('processing')
        }
      }
    }
  })
}

/**
 * Close the current tab
 *
 */
const closeTab = (tab = getCurrentTab()) => {
  debug('closeTab', tab)

  const nTabs = document.querySelectorAll('.main > .tab-container > tab').length
  if (nTabs <= 1) {
    if (Capabilities.inElectron()) {
      debug('closing window on close of last tab')
      REPL.qexec('window close')
    }
    return true
  }

  if (tab === getCurrentTab()) {
    // note: true means we only want to activate the given tab.
    const makeThisTabActive = (tab.nextElementSibling as UI.Tab) || (tab.previousElementSibling as UI.Tab)
    debug('makeThisTabActive', makeThisTabActive, tab.nextSibling)
    switchTab(getTabId(makeThisTabActive), true)
  }

  // remove the tab state for the current tab
  const tabState: TabState = tab['state']
  tabState.abortAllJobs()
  tabState.closed = true

  // remove the UI for the current tab
  const tabButton = getTabButton(tab)
  tab.parentNode.removeChild(tab)
  tabButton.parentNode.removeChild(tabButton)

  eventBus.emit('/tab/close', tab)

  return true
}

function isElement(target: EventTarget): target is Element {
  return (target as Element).classList !== undefined
}

function getSelectionText() {
  if (window.getSelection) {
    return window.getSelection().toString()
  }
}

function isInViewport(el: Element) {
  const scroll = window.scrollY || window.pageYOffset
  const boundsTop = el.getBoundingClientRect().top + scroll

  const viewportTop = scroll
  const viewportBottom = scroll + window.innerHeight

  const boundsBottom = boundsTop + el.clientHeight

  return (
    (boundsBottom >= viewportTop && boundsBottom <= viewportBottom) ||
    (boundsTop <= viewportBottom && boundsTop >= viewportTop)
  )
}

/**
 * Initialize events for a new tab
 *
 */
const perTabInit = (tab: UI.Tab, tabButton: HTMLElement, doListen = true) => {
  tab['state'] = new TabState()

  const newTabId = uuid()
  tab.setAttribute('data-tab-id', newTabId)
  tabButton.setAttribute('data-tab-id', newTabId)
  tabButton.onclick = () => switchTab(newTabId)

  eventBus.emit('/tab/new', tab)

  if (doListen) {
    listen(UI.getCurrentPrompt(tab))
  }

  // keep repl prompt focused, if possible
  const grabFocus = (checkPath: boolean) => (evt: MouseEvent) => {
    const target = evt.target
    if (isElement(target)) {
      setTimeout(() => {
        const prompt = UI.getCurrentPrompt(tab)
        if (
          prompt &&
          getSelectionText().length === 0 &&
          (target.classList.contains('repl-inner') ||
            target.classList.contains('repl-output') ||
            target.classList.contains('kui--tab-navigatable') ||
            (checkPath && evt['path'] && evt['path'].find(_ => isElement(_) && /header/i.test(_.tagName))))
        ) {
          if (target.classList.contains('repl-inner') || isInViewport(prompt)) {
            prompt.focus()
          }
        }
      }, 0)
    }
  }
  tab.querySelector('sidecar').addEventListener('click', grabFocus(false))
  tab.querySelector('.repl-inner').addEventListener('click', grabFocus(true))

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
      if (UI.isPopup()) {
        debug('quit button click')
        window.close()
      } else {
        debug('close sidecar button click')
        Models.Selection.clear(tab)
      }
    } catch (err) {
      console.error('error handling quit button click', err)
    }
  }

  // screenshot button
  sidecarSelector(tab, '.sidecar-screenshot-button').onclick = () => {
    debug('sidecar screenshot')
    REPL.pexec('screenshot sidecar')
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

  const newTab = currentVisibleTab.cloneNode(true) as HTMLElement
  newTab.className = 'visible'

  const currentTabButton = getCurrentTabButton()
  currentTabButton.classList.remove('left-tab-stripe-button-selected')
  currentTabButton.classList.remove('kui-tab--active')

  const newTabButton = currentTabButton.cloneNode(true) as HTMLElement
  newTabButton.classList.add('left-tab-stripe-button-selected')
  newTabButton.classList.add('kui-tab--active')
  newTabButton.classList.remove('processing')
  currentTabButton.parentNode.appendChild(newTabButton)

  const temps = newTab.querySelectorAll('.repl-temporary')
  for (let idx = 0; idx < temps.length; idx++) {
    temps[idx].remove()
  }

  const currentlyProcessingBlock: true | HTMLElement = await REPL.qexec(
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

  // this must occur after the REPL.qexec('clear'), otherwise we may select
  // the wrong repl-result
  UI.empty(newTab.querySelector('.repl-result'))

  Models.Selection.clear(newTab)
  perTabInit(newTab, newTabButton)

  newTabButton.scrollIntoView()

  // make the new tab visible at the very end of the above init work!
  currentVisibleTab.classList.remove('visible')
  currentVisibleTab.parentNode.appendChild(newTab)
  UI.getCurrentPrompt(newTab).focus()

  getTabButtonLabel(newTab).innerText = !isUsingCommandName() ? strings('Tab') : strings('New Tab')

  return true
}

/**
 * This will be called once, when the application loads. For the
 * per-tab init logic, look at perTabInit()
 *
 */
const oneTimeInit = (): void => {
  const initialTab = getTabFromIndex(1)
  const initialTabButton = getCurrentTabButton()

  if (document.body.classList.contains('subwindow')) {
    element(tabButtonSelector).onclick = () => window.open(window.location.href, '_blank')
  } else {
    element(tabButtonSelector).onclick = () => newTab()
  }

  addKeyboardListeners()
  addCommandEvaluationListeners()

  // initialize the first tab
  perTabInit(initialTab, initialTabButton, false)

  getTabButtonLabel(getCurrentTab()).innerText = !isUsingCommandName() ? strings('Tab') : Settings.theme.productName

  // focus the current prompt no matter where the user clicks in the left tab stripe
  ;(document.querySelector('.main > .left-tab-stripe') as HTMLElement).onclick = () => {
    UI.getCurrentPrompt().focus()
  }
}

/**
 * Same as newTab, but done asynchronously
 *
 */
const newTabAsync = ({ execOptions }: Commands.Arguments) => {
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

const registerCommandHandlers = (commandTree: Commands.Registrar) => {
  commandTree.listen(
    '/tab/switch',
    ({ argvNoOptions }) => switchTab(getTabId(getTabFromIndex(parseInt(argvNoOptions[argvNoOptions.length - 1], 10)))),
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

export default async (commandTree: Commands.Registrar) => {
  if (typeof document !== 'undefined') {
    oneTimeInit()

    eventBus.on('/theme/change', () => {
      const tabLabels = document.querySelectorAll('.main .kui-header .kui-tab--label-text') as NodeListOf<HTMLElement>
      const usingCommandName = isUsingCommandName()
      if (!usingCommandName) {
        for (let idx = 0; idx < tabLabels.length; idx++) {
          tabLabels[idx].innerText = strings('Tab')
        }
      }
    })

    return registerCommandHandlers(commandTree)
  }
}
