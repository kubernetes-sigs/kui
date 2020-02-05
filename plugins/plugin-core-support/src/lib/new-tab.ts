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

import {
  closeAllViews as clearSelection,
  TabState,
  eventBus,
  i18n,
  inElectron,
  Arguments,
  Registrar,
  Event,
  ExecType,
  Tab,
  KeyCodes,
  getCurrentPrompt,
  empty,
  getReplImpl,
  setStatus,
  Status,
  getCurrentTab,
  getTabId,
  internalBeCarefulListen as listen

  // deprecated
  // isSidecarVisible,
  // sidecarSelector
} from '@kui-shell/core'
import { productName } from '@kui-shell/client/config.d/name.json'
import { topTabs } from '@kui-shell/client/config.d/style.json'

const strings = i18n('plugin-core-support')
const debug = Debug('plugins/core-support/new-tab')

export const tabButtonSelector = '#new-tab-button'

/** cheapo uuid; we only need single-threaded uniqueness */
let _uuidCounter = 1
function uuid() {
  return (_uuidCounter++).toString()
}

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

/**
 * @return current number of tabs
 *
 */
function numTabs() {
  return document.querySelectorAll('.main .left-tab-stripe .left-tab-stripe-button[data-tab-id]').length
}

function isUsingCommandName() {
  return topTabs.names === 'command' && !document.body.classList.contains('kui--alternate')
}

/**
 * Given a tab index, return the tab id
 *
 */
function getTabFromIndex(idx: number): Tab {
  return element(`.main tab:nth-child(${idx})`) as Tab
}

/**
 * Helper methods to crawl the DOM
 *
 */
const getTabButton = (tab: Tab) =>
  element(`.main .left-tab-stripe .left-tab-stripe-button[data-tab-id="${getTabId(tab)}"]`)
const getCurrentTabButton = () => element('.main .left-tab-stripe .left-tab-stripe-button-selected')
const getTabButtonLabel = (tab: Tab) =>
  getTabButton(tab).querySelector('.left-tab-stripe-button-label .kui-tab--label-text') as HTMLElement
const getTabCloser = (tab: Tab) => getTabButton(tab).querySelector('.left-tab-stripe-button-closer') as HTMLElement

const switchTab = (tabId: string, activateOnly = false) => {
  debug('switchTab', tabId)

  const currentTab = getCurrentTab()
  const nextTab = document.querySelector(`.main > .tab-container > tab[data-tab-id="${tabId}"]`) as Tab
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
    currentTab.state.capture()
  }
  if (nextTab.state) {
    nextTab.state.restore()
  }

  const promptToFocus = getCurrentPrompt(nextTab)
  if (promptToFocus) {
    promptToFocus.focus()
  }

  eventBus.emit('/tab/switch', nextTab)

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

  // switch tabs based on keyboard events
  if (inElectron) {
    document.addEventListener('keydown', event => {
      if (event.metaKey && event.shiftKey) {
        // shift-command+[]: switch to previous or next
        const whichDir = event.key
        if (whichDir === '[' || whichDir === ']') {
          const curTab = getCurrentTab()
          const switchToThisTab = whichDir === '[' ? curTab.previousElementSibling : curTab.nextElementSibling
          if (switchToThisTab) {
            switchTab(getTabId(switchToThisTab as Tab))
          }
        }
        event.stopPropagation()
        return
      }

      if (event.ctrlKey) {
        // ctrl+PgUp/PgDown: switch to previous or next
        const whichDir = event.keyCode
        if (whichDir === KeyCodes.PAGEUP || whichDir === KeyCodes.PAGEDOWN) {
          const curTab = getCurrentTab()
          const switchToThisTab =
            whichDir === KeyCodes.PAGEUP ? curTab.previousElementSibling : curTab.nextElementSibling
          if (switchToThisTab) {
            switchTab(getTabId(switchToThisTab as Tab))
          }
        }
        event.stopPropagation()
        return
      }

      if (event.metaKey) {
        // meta+number: switch to tab by index
        const whichTabStr = event.key
        if (/\d/.test(whichTabStr)) {
          event.stopPropagation()
          const nTabs = numTabs()
          const whichTab = parseInt(whichTabStr, 10)
          if (whichTab <= nTabs) {
            switchTab(getTabId(getTabFromIndex(whichTab)))
          }
        }
      }
    })
  }
}

/**
 * Register any command evaluation listeners, i.e. when the REPL finishes evaluating a command.
 *
 */
const addCommandEvaluationListeners = (): void => {
  eventBus.on('/command/complete', (event: Event) => {
    if (event.execType !== undefined && event.execType !== ExecType.Nested && event.route) {
      // ignore nested, which means one plugin calling another
      // debug('got event', event)
      const button = getTabButton(event.tab)
      if (button) {
        // the tab might no longer be visible
        button.classList.remove('processing')
      }
    }
  })

  eventBus.on('/command/start', (event: Event) => {
    if (event.execType !== undefined && event.execType !== ExecType.Nested && event.route) {
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
          /* if (!isSidecarVisible(tab)) {
            if (isUsingCommandName()) {
              getTabButtonLabel(tab).innerText = productName
            }
          } */
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
    if (inElectron()) {
      debug('closing window on close of last tab')
      tab.REPL.qexec('window close')
    }
    return true
  }

  if (tab === getCurrentTab()) {
    // note: true means we only want to activate the given tab.
    const makeThisTabActive = (tab.nextElementSibling as Tab) || (tab.previousElementSibling as Tab)
    debug('makeThisTabActive', makeThisTabActive, tab.nextSibling)
    switchTab(getTabId(makeThisTabActive), true)
  }

  // remove the tab state for the current tab
  const tabState = tab.state
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
const perTabInit = (tab: Tab, tabButton: HTMLElement, doListen = true) => {
  tab.state = new TabState()

  const newTabId = uuid()
  tab.setAttribute('data-tab-id', newTabId)
  tabButton.setAttribute('data-tab-id', newTabId)
  tabButton.onclick = () => switchTab(newTabId)

  setTimeout(async () => {
    getReplImpl(tab)
    eventBus.emit('/tab/new', tab)
  })

  if (doListen) {
    listen(getCurrentPrompt(tab))
  }

  // keep repl prompt focused, if possible
  const grabFocus = (checkPath: boolean) => (evt: MouseEvent) => {
    const target = evt.target
    if (isElement(target)) {
      setTimeout(() => {
        const prompt = getCurrentPrompt(tab)
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
  // tab.querySelector('sidecar').addEventListener('click', grabFocus(false))
  tab.querySelector('.repl-inner').addEventListener('click', grabFocus(true))

  // tab close button
  getTabCloser(tab).onclick = (event: MouseEvent) => {
    event.stopPropagation()
    return closeTab(tab)
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
  currentVisibleTab.state.capture()

  const newTab = currentVisibleTab.cloneNode(true) as Tab
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

  const currentlyProcessingBlock: true | HTMLElement = await currentVisibleTab.REPL.qexec(
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
    setStatus(currentlyProcessingBlock, Status.replActive)
  }

  // this must occur after the REPL.qexec('clear'), otherwise we may select
  // the wrong repl-result
  empty(newTab.querySelector('.repl-result'))

  clearSelection(newTab)
  perTabInit(newTab, newTabButton)

  newTabButton.scrollIntoView()

  // make the new tab visible at the very end of the above init work!
  currentVisibleTab.classList.remove('visible')
  currentVisibleTab.parentNode.appendChild(newTab)
  getCurrentPrompt(newTab).focus()

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

  getTabButtonLabel(getCurrentTab()).innerText = !isUsingCommandName() ? strings('Tab') : productName

  // focus the current prompt no matter where the user clicks in the left tab stripe
  ;(document.querySelector('.main > .left-tab-stripe') as HTMLElement).onclick = () => {
    const prompt = getCurrentPrompt()
    if (prompt) {
      prompt.focus()
    }
  }
}

/**
 * Same as newTab, but done asynchronously
 *
 */
const newTabAsync = ({ execOptions }: Arguments) => {
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

const registerCommandHandlers = (commandTree: Registrar) => {
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

export default async (commandTree: Registrar) => {
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
