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
const debug = Debug('webapp/cli')
debug('loading')

import eventBus from '../core/events'
import { oopsMessage } from '../core/oops'
import { theme as settings, inBottomInputMode } from '../core/settings'
import UsageError from '../core/usage-error'
import { inBrowser, inElectron, isHeadless } from '../core/capabilities'
import { keys } from './keys'
import { installContext } from './prompt'

import {
  Entity,
  SimpleEntity,
  isEntitySpec,
  isMessageBearingEntity,
  MixedResponsePart,
  isMixedResponse
} from '../models/entity'
import { CommandHandlerWithEvents } from '../models/command'
import { ExecOptions, DefaultExecOptions, ParsedOptions } from '../models/execOptions'
import * as historyModel from '../models/history'
import { CodedError, isCodedError } from '../models/errors'
import { Table, isTable, MultiTable, isMultiTable } from './models/table'

import { element, removeAllDomChildren } from './util/dom'
import { prettyPrintTime } from './util/time'
import { isHTML } from '../util/types'

import Presentation from './views/presentation'
import { formatTable } from './views/table'

import {
  Formattable,
  getSidecar,
  BadgeSpec,
  presentAs,
  showEntity,
  showCustom,
  isCustomSpec,
  CustomSpec
} from './views/sidecar'
import { SidecarMode } from './bottom-stripe'

debug('finished loading modules')

declare let hljs

/**
 * Make sure that the given repl block is visible.
 *
 * @param when wait this long; e.g. the 305ms is in step with the sidecar transition: all 300ms ease-in-out
 * @param which the repl block sub-element that needs to be visible
 * @param element the element to scroll into view (optional, defaults to use @which)
 * @param center this is passed directly to the underlying API https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoViewIfNeeded
 *
 */
interface ScrollOptions {
  when?: number
  which?: string
  element?: HTMLElement
  how?: string
  center?: boolean | ScrollIntoViewOptions
}
export const scrollIntoView = (opts?: ScrollOptions) => {
  const {
    when = 305,
    which = '.repl-active',
    element = document.querySelector(`tab.visible .repl ${which}`) as HTMLElement,
    center = undefined,
    how = 'scrollIntoViewIfNeeded'
  } = opts || {}

  const scroll = () => {
    try {
      // false here means "bottom of the element will be aligned to the bottom of the visible area of the scrollable ancestor"
      //    (see https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView)
      // document.querySelector('tab.visible .repl .repl-active').scrollIntoView(true)
      element[how](center || { block: 'end', inline: 'end' })
    } catch (e) {
      if (element) {
        element.scrollIntoView(center || { block: 'end', inline: 'end' })
      }
    }
  }

  if (when === 0) {
    scroll()
  } else {
    return setTimeout(scroll, when)
  }
}

/**
 * Initiate input queueing
 *
 */
const startInputQueueing = () => {
  if (!isHeadless()) {
    const invisibleHand = document.getElementById('invisible-global-input') as HTMLInputElement
    invisibleHand.focus()
  }
}

/**
 * This API call allows plugins to disable input queueing while a
 * command is being processed.
 *
 * @return any queued input so far
 *
 */
let _invisibleHand: HTMLInputElement
export const disableInputQueueing = (): string => {
  if (isHeadless()) {
    return
  }

  const invisibleHand =
    _invisibleHand || (_invisibleHand = document.getElementById('invisible-global-input') as HTMLInputElement)

  // here is what might have queued up
  const queuedInput = invisibleHand.value

  // reset the queueing state
  invisibleHand.value = ''

  // this can be expensive; callers MUST focus on their element if they want this behavior
  // invisibleHand.blur()

  return queuedInput
}

/**
 * Set the queued input model to the given value
 *
 */
export const pasteQueuedInput = (value: string) => {
  const invisibleHand = document.getElementById('invisible-global-input') as HTMLInputElement
  invisibleHand.value = value
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Tab extends HTMLElement {}
const tabTagPattern = /tab/i
export function isTab(node: Element): node is Tab {
  return tabTagPattern.test(node.tagName)
}
/**
 * Return the unique identifier for the given tab
 *
 */
export function getTabId(tab: Tab) {
  return tab.getAttribute('data-tab-id')
}
export const sameTab = (tab1: Tab, tab2: Tab): boolean => {
  return getTabId(tab1) === getTabId(tab2)
}
export const getTabFromTarget = (target: EventTarget): Tab => {
  if (target) {
    let iter = target as Element

    while (iter && !isTab(iter)) {
      iter = iter.parentElement
    }

    if (iter && isTab(iter)) {
      return iter
    }

    // debug('current tab fallthrough', target)
  }

  // fallthrough
  return document.querySelector('tab.visible')
}
export const getCurrentTab = (): Tab => {
  return getTabFromTarget(document.activeElement)
}

const getInitialBlock = (tab: Tab): HTMLElement => {
  return tab.querySelector('.repl .repl-block.repl-initial')
}
export const getCurrentBlock = (tab = getCurrentTab()): HTMLElement => {
  return tab.querySelector('.repl .repl-active')
}
export const getCurrentProcessingBlock = (tab = getCurrentTab()): HTMLElement => {
  return tab.querySelector('.repl .repl-block.processing')
}
export const getBlockOfPrompt = (prompt: HTMLInputElement): HTMLElement => {
  return prompt.parentElement.parentElement
}
export const getPrompt = (block: HTMLElement): HTMLInputElement => {
  return block && block.querySelector && block.querySelector('input')
}
const getBottomPrompt = (tab: Tab): HTMLInputElement => {
  return getPrompt(tab.querySelector('.kui--input-stripe .repl-block'))
}
const getInitialPrompt = (tab: Tab): HTMLInputElement => {
  return getPrompt(getInitialBlock(tab))
}
/** are we operating in popup mode? */
export const isPopup = () => document.body.classList.contains('subwindow')
export const getCurrentPrompt = (tab = getCurrentTab()): HTMLInputElement => {
  if (isPopup()) {
    return getSidecar(tab).querySelector('input')
  } else if (inBottomInputMode) {
    return getPrompt(element('.kui--input-stripe'))
  } else {
    return getPrompt(getCurrentBlock(tab))
  }
}
export const getPromptFromTarget = (target: EventTarget): HTMLInputElement => {
  return getCurrentPrompt(getTabFromTarget(target))
}
export const getPromptLeft = (block: Element) => {
  return block.querySelector('.repl-prompt-righty')
}
export const getCurrentPromptLeft = (tab: Tab) => {
  if (inBottomInputMode) {
    return getPromptLeft(element('.kui--input-stripe'))
  } else {
    return getPromptLeft(getCurrentBlock(tab))
  }
}

/**
 * Install a sub-block of output in the given block
 *
 */
export function subblock() {
  const block = document.createElement('div')
  const blockResult = document.createElement('div')

  blockResult.classList.add('repl-result')
  block.classList.add('kui--repl-subblock')
  block.appendChild(blockResult)

  return block
}

const doPaste = (text: string, tab = getCurrentTab()) => {
  // const prompt = event.currentTarget
  const lines = text.split(/[\n\r]/)

  const pasteLooper = async (idx: number) => {
    if (idx === lines.length) {
      // all done...
      return Promise.resolve()
      /* } else if (lines[idx] === '') {
      // then this is a blank line, so skip it
      return pasteLooper(idx + 1) */
    } else if (idx <= lines.length - 2) {
      // then this is a command line with a trailing newline
      const prompt = getCurrentPrompt(tab)
      const repl = await import('../core/repl')
      return repl.pexec(prompt.value + lines[idx]).then(() => pasteLooper(idx + 1))
    } else {
      // then this is the last line, but without a trailing newline.
      // here, we add this command line to the current prompt, without executing it

      // paste the line with respect to the current prompt's
      // selection range; if there is no selection range, then
      // prompt.selectionStart will be the current caret position
      // (which is precisely what we want, i.e. to paste the given
      // text at the current caret position); if there is a
      // selectionEnd, then we will *also* replace the selection
      // range

      // and, then, when we are done, will position the caret just
      // after the pasted text:
      const prompt = getCurrentPrompt(tab)
      const newCaretPosition = prompt.selectionStart + lines[idx].length

      // note how this will either place the new text at the caret
      // position, or replace the selected text (if selectionEnd !==
      // selectionStart)
      prompt.value =
        prompt.value.substring(0, prompt.selectionStart) + lines[idx] + prompt.value.substring(prompt.selectionEnd)

      // restore the caret position
      prompt.setSelectionRange(newCaretPosition, newCaretPosition)

      return Promise.resolve()
    }
  }

  return pasteLooper(0)
}

/**
 * User has requested that we paste something from the clipboard
 *
 */
export const paste = (event: ClipboardEvent) => {
  debug('got paste', event)

  const text = event.clipboardData.getData('text')
  if (text) {
    // we'll handle it from here!
    event.preventDefault()

    return doPaste(text)
  }
}

/**
 * Handle any input that queued up during command processing
 *
 */
const handleQueuedInput = async (nextBlock: HTMLElement) => {
  const queuedInput = disableInputQueueing()

  if (nextBlock && queuedInput && queuedInput.length > 0) {
    debug('adding queued input to nextBlock')

    let nextPrompt = getPrompt(nextBlock)
    if (nextPrompt) {
      const lines = queuedInput.split(/[\n\r]/)

      const firstNonBlank = lines.findIndex(_ => _.length > 0)
      const nPrefixNewlines = firstNonBlank >= 0 ? firstNonBlank : lines.length === 0 ? -1 : lines.length

      // handle prefix newlines
      for (let idx = 0; idx < nPrefixNewlines; idx++) {
        await doCancel() // eslint-disable-line @typescript-eslint/no-use-before-define

        nextBlock = getCurrentBlock()
        nextPrompt = getCurrentPrompt()
      }

      // now handle any actual input
      if (firstNonBlank >= 0) {
        // for the first one, add it to the existing (preallocated) nextPrompt
        nextPrompt.value = lines[firstNonBlank]

        // if the user also hit a trailing newline, make sure to trigger a doEval
        if (lines.length - firstNonBlank > 1) {
          const repl = await import('../core/repl')
          await repl.doEval({ block: nextBlock, prompt: nextPrompt })

          // lastly, if the user typed more than one newline, handle
          // the rest via a doPaste
          const remainingLines = lines.slice(firstNonBlank + 1).join('\n')
          if (remainingLines.length > 0) {
            doPaste(remainingLines)
          }
        }
      }
    }
  }
}

/**
 * Reset input count for the given block
 *
 */
export const resetCount = (block: HTMLElement) => {
  block.setAttribute('data-input-count', '0')
}

/**
 * Allow commands to take charge of the cursor/caret/block rendering
 *
 */
export const setCustomCaret = (block: HTMLElement) => {
  block.classList.add('custom-caret')
}

/**
 * Set the processing/active status for the given block
 *
 */
export const setStatus = (block: HTMLElement, status: 'processing' | 'repl-active' | 'valid-response' | 'error') => {
  if (block) {
    block.classList.remove('processing')
    block.classList.remove('repl-active')
    block.classList.add(status)

    if (status === 'processing') {
      startInputQueueing()
      if (!isHeadless()) {
        const spinner = element('.repl-result-spinner', block)
        scrollIntoView({ when: 0, element: spinner })
      }
    } else if (status === 'repl-active') {
      getPrompt(block).value = ''
    }

    if (status !== 'repl-active' && inBottomInputMode) {
      // for either processing or the final output, and if we are in
      // bottom input model, then copy repl input from the bottom
      // input
      const prompt = getPrompt(block)
      if (!prompt.value) {
        // this guards pexecs, i.e. input filled programmatically via
        // a click
        const tab = getTabFromTarget(block)
        prompt.value = getBottomPrompt(tab).value
      }
    }

    // add timestamp to prompt
    element('.repl-prompt-timestamp', block).innerText = new Date().toLocaleTimeString()

    // screenshot click handler
    element('.kui--repl-prompt-buttons--screenshot', block).onclick = async event => {
      // intercept repl's scroll to bottom behavior
      event.stopPropagation()

      // the indexing is from 0 versus from 1
      const N = parseInt(block.getAttribute('data-input-count'), 10) + 1

      const repl = await import('../core/repl')
      debug(`capturing screenshot for block ${N}`)

      repl.qexec(`screenshot --nth ${N}`, undefined, undefined, {
        rethrowErrors: true,
        reportErrors: true
      })
    }
  }
}

/**
 *
 *
 */
export const ok = (parentNode: Element, suffix?: string | Element, css?: string) => {
  const okLine = document.createElement('div')
  okLine.classList.add('ok-line')

  const replResultBlock = parentNode.parentNode.querySelector('.repl-result')
  const resultHasContent = replResultBlock.children.length > 0
  if (resultHasContent) {
    ;(replResultBlock.parentNode as Element).classList.add('repl-result-has-content')
  }

  const ok = document.createElement('span')
  okLine.appendChild(ok)
  ok.classList.add('ok')
  ok.appendChild(document.createTextNode(suffix ? 'ok:' : 'ok'))

  if (suffix) {
    ok.classList.add('inline-ok')
    okLine.appendChild(typeof suffix === 'string' ? document.createTextNode(` ${suffix}`) : suffix)
  }

  if (css) {
    okLine.classList.add(css)
  }

  parentNode.appendChild(okLine)
  return okLine
}

/** plugins can register view handlers for a given type: string */
export type ViewHandler = (
  tab: Tab,
  response: Entity,
  resultDom: Element,
  parsedOptions: ParsedOptions,
  execOptions: ExecOptions
) => Promise<any> | void // eslint-disable-line @typescript-eslint/no-explicit-any
interface ViewRegistrar {
  [key: string]: ViewHandler
}

/**
 * Register a renderer for a given kind[]
 *
 */
const registeredListViews: ViewRegistrar = {}
export const registerListView = (kind: string, handler: ViewHandler) => {
  registeredListViews[kind] = handler
}

/**
 * Register a renderer for a given <kind>
 *
 */
const registeredEntityViews: ViewRegistrar = {}
export const registerEntityView = (kind: string, handler: ViewHandler) => {
  registeredEntityViews[kind] = handler
}

/**
 * Standard handling of Table responses
 *
 */
const printTable = async (
  tab: Tab,
  response: Table,
  resultDom: HTMLElement,
  execOptions?: ExecOptions,
  parsedOptions?: ParsedOptions
) => {
  //
  // some sort of list response; format as a table
  //
  const registeredListView = registeredListViews[response.type]
  if (registeredListView) {
    await registeredListView(tab, response, resultDom, parsedOptions, execOptions)
    return resultDom.children.length === 0
  }

  ;(resultDom.parentNode as HTMLElement).classList.add('result-as-table', 'result-as-vertical')

  if (response.noEntityColors) {
    // client wants control over entity-cell coloring
    resultDom.classList.add('result-table-with-custom-entity-colors')
  }

  formatTable(tab, response, resultDom)
}

/**
 * Stream output to the given block
 *
 */
export type Streamable = SimpleEntity | Table | MultiTable | CustomSpec
export const streamTo = (tab: Tab, block: Element) => {
  const resultDom = block.querySelector('.repl-result') as HTMLElement
  // so we can scroll this into view as streaming output arrives

  let previousLine: HTMLElement
  return async (response: Streamable, killLine = false) => {
    //
    debug('stream', response)

    const pre = document.createElement('pre')
    pre.classList.add('streaming-output')
    resultDom.appendChild(pre)
    resultDom.setAttribute('data-stream', 'data-stream')
    ;(resultDom.parentNode as HTMLElement).classList.add('result-vertical')

    if (killLine && previousLine) {
      previousLine.parentNode.removeChild(previousLine)
      previousLine = undefined
    }

    if (UsageError.isUsageError(response)) {
      previousLine = await UsageError.getFormattedMessage(response)
      pre.appendChild(previousLine)
      pre.classList.add('oops')
      pre.setAttribute('data-status-code', response.code.toString())
    } else if (isHTML(response)) {
      previousLine = response
      pre.appendChild(previousLine)
    } else if (isMultiTable(response)) {
      response.tables.forEach(async _ => printTable(tab, _, resultDom))
      const br = document.createElement('br')
      resultDom.appendChild(br)
    } else if (isTable(response)) {
      await printTable(tab, response, resultDom)
    } else if (isCustomSpec(response)) {
      showCustom(tab, response, {})
    } else {
      previousLine = document.createElement('div')
      previousLine.innerText = isMessageBearingEntity(response) ? response.message : response.toString()
      pre.appendChild(previousLine)
    }

    // scrollIntoView({ when: 0, element: spinner })
  }
}

/** create a popup content container */
export const createPopupContentContainer = (css: string[] = [], presentation?: Presentation): HTMLElement => {
  const container = document.createElement('div')
  container.classList.add('padding-content')

  const scrollRegion = document.createElement('div')
  scrollRegion.classList.add('repl-block')
  css.forEach(_ => scrollRegion.classList.add(_))
  container.appendChild(scrollRegion)

  if (presentation || presentation === 0) {
    presentAs(getCurrentTab(), presentation)
  }

  const resultDom = document.createElement('div')
  resultDom.classList.add('repl-result')
  scrollRegion.appendChild(resultDom)

  return resultDom
}

interface PopupEntity {
  prettyType?: string
  modes?: SidecarMode[]
  badges?: BadgeSpec[]
  controlHeaders?: boolean | string[]
  presentation?: Presentation
  subtext?: Formattable
}

/**
 * Render popup content in the given container
 *
 */
const renderPopupContent = (
  command: string,
  container: Element,
  execOptions: ExecOptions,
  entity: PopupEntity = {}
) => {
  debug('renderPopupContent', command, entity)

  const {
    prettyType = '',
    modes = [],
    badges = [],
    controlHeaders = false,
    presentation = Presentation.SidecarFullscreenForPopups
  } = entity

  // Last updated... text
  const subtext = document.createElement('div')
  subtext.appendChild(document.createTextNode('Last updated '))
  const date = document.createElement('strong')
  const now = new Date()
  date.appendChild(prettyPrintTime(now))
  subtext.appendChild(date)

  const millisPerDay = 24 * 60 * 60 * 1000
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
  const millisSinceMidnight = now.getTime() - midnight.getTime()
  const millisTillMidnight = millisPerDay - millisSinceMidnight

  /** re-pretty-print the "now" timestamp with every changing day */
  const updateLastUpdateDate = () => {
    removeAllDomChildren(date)
    date.appendChild(prettyPrintTime(now))
  }

  /** re-pretty-print the "now" timestamp after the first change of day */
  const updateLastUpdateDateFirstTime = () => {
    updateLastUpdateDate()
    setInterval(updateLastUpdateDate, millisPerDay) // schedule daily updates
  }
  setTimeout(updateLastUpdateDateFirstTime, millisTillMidnight)

  if (container) {
    if ((container.parentNode as HTMLElement).classList.contains('result-as-multi-table')) {
      ;(container.parentNode.parentNode as HTMLElement).classList.add('overflow-auto')
    }

    const custom = {
      type: 'custom',
      isEntity: true,
      isREPL: true,
      name: command,
      presentation,
      prettyType,
      subtext,
      modes,
      badges,
      controlHeaders,
      content: container.parentNode.parentNode // dom -> scrollRegion -> paddingContent
    }

    showCustom(getCurrentTab(), Object.assign({}, custom, entity), execOptions)
  }
}

/**
 * Remove any .repl-temporary structures from the given dom
 *
 */
export const removeAnyTemps = (block: HTMLElement): HTMLElement => {
  const temps = block.querySelectorAll('.repl-temporary')

  for (let idx = 0; idx < temps.length; idx++) {
    const temp = temps[idx]
    if (temp.parentNode) {
      temp.parentNode.removeChild(temp)
    }
  }

  block.classList.remove('using-custom-prompt')

  return block
}

/**
 * Clear current text selection
 *
 */
export const clearTextSelection = () => {
  try {
    window.getSelection().removeAllRanges()
  } catch (err) {
    debug('unable to clear text selection', err)
  }
}

/**
 * Allow for plugins to self-manage text selection
 *
 */
let pendingTextSelection
export const clearPendingTextSelection = () => {
  pendingTextSelection = undefined
}
export const setPendingTextSelection = (str: string) => {
  pendingTextSelection = str
  if (!document.oncopy) {
    document.addEventListener('select', () => {
      pendingTextSelection = undefined
    })
    document.addEventListener('copy', (evt: ClipboardEvent) => {
      if (pendingTextSelection) {
        evt.clipboardData.setData('text', pendingTextSelection)
        evt.preventDefault()
      }
    })
  }
}

/**
 * Update the caret position in an html INPUT field
 *
 */
const setCaretPosition = (ctrl: HTMLInputElement, pos: number) => {
  if (ctrl.setSelectionRange) {
    ctrl.focus()
    ctrl.setSelectionRange(pos, pos)
  } else if (ctrl['createTextRange']) {
    const range = ctrl['createTextRange']()
    range.collapse(true)
    range.moveEnd('character', pos)
    range.moveStart('character', pos)
    range.select()
  }
}
const setCaretPositionToEnd = (input: HTMLInputElement) => setCaretPosition(input, input.value.length)
const updateInputAndMoveCaretToEOL = (input: HTMLInputElement, newValue: string) => {
  input.value = newValue
  setTimeout(() => setCaretPositionToEnd(input), 0)
}

export const unlisten = (prompt: HTMLElement) => {
  if (prompt && !prompt.classList.contains('sidecar-header-input')) {
    prompt.onkeypress = null
  }
}
export const listen = (prompt: HTMLInputElement) => {
  prompt.readOnly = false
  prompt.placeholder = settings.placeholder || ''

  const grandparent = prompt.parentNode.parentNode as Element
  grandparent.className = `${grandparent.getAttribute('data-base-class')} repl-active`

  if (inBottomInputMode) {
    const tab = getTabFromTarget(prompt)
    prompt = getBottomPrompt(tab)
    prompt.value = ''
  }

  if (!prompt.classList.contains('sidecar-header-input') && !document.activeElement.classList.contains('grab-focus')) {
    prompt.focus()
  }

  prompt.onkeypress = async (event: KeyboardEvent) => {
    const char = event.keyCode
    if (char === keys.ENTER) {
      // user typed Enter; we've finished Reading, now Evalute
      const repl = await import('../core/repl')
      repl.doEval({ prompt })
    }
  }

  prompt.onkeydown = async event => {
    const char = event.keyCode

    if (char === keys.UP || (char === keys.P && event.ctrlKey)) {
      // go to previous command in history
      const newValue = (historyModel.previous() || { raw: '' }).raw
      if (newValue) {
        updateInputAndMoveCaretToEOL(prompt, newValue)
      }
    } else if (char === keys.PAGEUP) {
      if (inBrowser()) {
        debug('pageup')
        const { height } = document.body.getBoundingClientRect()
        document.querySelector('tab.visible .repl-inner').scrollBy(0, -height)
      }
    } else if (char === keys.PAGEDOWN) {
      if (inBrowser()) {
        debug('pagedown')
        const { height } = document.body.getBoundingClientRect()
        document.querySelector('tab.visible .repl-inner').scrollBy(0, +height)
      }
    } else if (char === keys.C && event.ctrlKey) {
      // Ctrl+C, cancel
      doCancel() // eslint-disable-line @typescript-eslint/no-use-before-define
    } else if (char === keys.U && event.ctrlKey) {
      // clear line
      prompt.value = ''
    } else if (
      (char === keys.L && (event.ctrlKey || (inElectron() && event.metaKey))) ||
      (process.platform === 'darwin' && char === keys.K && event.metaKey)
    ) {
      // clear screen; capture and restore the current
      // prompt value, in keeping with unix terminal
      // behavior
      if (isPopup()) {
        // see init() below; in popup mode, cmd/ctrl+L does something different
      } else {
        const current = getCurrentPrompt().value
        const repl = await import('../core/repl')
        const currentCursorPosition = getCurrentPrompt().selectionStart // also restore the cursor position
        repl.pexec('clear').then(() => {
          if (current) {
            // restore the prompt value
            getCurrentPrompt().value = current

            // restore the prompt cursor position
            debug('restoring cursor position', currentCursorPosition)
            getCurrentPrompt().setSelectionRange(currentCursorPosition, currentCursorPosition)
          }
        })
      }
    } else if (char === keys.HOME) {
      // go to first command in history
      const newValue = historyModel.first().raw
      if (newValue) {
        updateInputAndMoveCaretToEOL(prompt, newValue)
      }
    } else if (char === keys.END) {
      // go to last command in history
      const newValue = (historyModel.last() || { raw: '' }).raw
      updateInputAndMoveCaretToEOL(prompt, newValue)
    } else if (char === keys.DOWN || (char === keys.N && event.ctrlKey)) {
      // going DOWN past the last history item will result in '', i.e. a blank line
      const newValue = (historyModel.next() || { raw: '' }).raw
      updateInputAndMoveCaretToEOL(prompt, newValue)
    }
  }

  prompt.onpaste = paste
}
export const popupListen = (
  text = getSidecar(getCurrentTab()).querySelector('.sidecar-header-text'),
  previousCommand?: string
) => {
  if (previousCommand) {
    // emit the previous command on the repl
    const nameContainer = getSidecar(getCurrentTab()).querySelector('.sidecar-header-input') as HTMLInputElement
    nameContainer.value = previousCommand
  }

  const input = text.querySelector('.sidecar-header-input') as HTMLInputElement
  listen(input)
}

export async function renderResult(
  response: Entity,
  tab: Tab,
  execOptions: ExecOptions,
  parsedOptions: ParsedOptions,
  resultDom,
  echo = true,
  attach = echo
) {
  if (isTable(response)) {
    await printTable(tab, response, resultDom, execOptions, parsedOptions)
    return true
  } else if (isHTML(response)) {
    // TODO is this the best way to detect response is a dom??
    // pre-formatted DOM element
    if (attach) {
      resultDom.appendChild(response)
    }
    if (echo) {
      ;(resultDom.parentNode as HTMLElement).classList.add('result-vertical')
      ok(resultDom.parentElement).classList.add('ok-for-list')
    }
    return true
  } else {
    return false
  }
}

/**
 * Render the results of a command evaluation in the "console"
 *
 */
export const printResults = (
  block: HTMLElement,
  nextBlock: HTMLElement,
  tab: Tab,
  resultDom: HTMLElement,
  echo = true,
  execOptions?: ExecOptions,
  parsedOptions?: ParsedOptions,
  command?: string,
  evaluator?: CommandHandlerWithEvents
) => (response: Entity) => {
  debug('printResults', response)

  // does the command handler want to be incognito in the UI?
  const incognitoHint = evaluator && evaluator.options && evaluator.options.incognito && evaluator.options.incognito
  const incognito = incognitoHint && isPopup() && incognitoHint.indexOf('popup') >= 0

  const presentation = isCustomSpec(response) && response.presentation

  let customContainer: HTMLElement
  if (isPopup() && !incognito) {
    resultDom = customContainer = createPopupContentContainer(
      ['valid-response'],
      presentation || (!Array.isArray(response) && Presentation.SidecarFullscreenForPopups)
    )
  }

  if (process.env.KUI_TEE_TO_FILE) {
    // we were asked to tee the output to the system console
    debug('teeing output to file', process.env.KUI_TEE_TO_FILE)
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { print } = require('../main/headless-pretty-print')
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { createWriteStream } = require('fs')
      const stream = createWriteStream(process.env.KUI_TEE_TO_FILE)
      const logger = (data: string | Buffer) => stream.write(data)
      try {
        print(response, logger, stream)
        if (process.env.KUI_TEE_TO_FILE_END_MARKER) {
          stream.write(process.env.KUI_TEE_TO_FILE_END_MARKER)
        }
      } finally {
        stream.end()

        if (process.env.KUI_TEE_TO_FILE_EXIT_ON_END_MARKER) {
          // we were asked to exit after writing an end marker
          try {
            const { app } = require('electron').remote
            debug('attempting to quit', app)
            app.quit()
          } catch (err) {
            console.error('Error exiting', err)
          }
        }
      }
    } catch (err) {
      debug('error teeing output to console')
      console.error(err)
    }
  }

  if (echo) {
    setStatus(block, response === false ? 'error' : 'valid-response')
  }

  const render = async (response: Entity, { echo, resultDom }: { echo: boolean; resultDom: HTMLElement }) => {
    if (response && response !== true) {
      if (await renderResult(response, tab, execOptions, parsedOptions, resultDom, echo)) {
      } else if (
        isEntitySpec(response) &&
        response.verb === 'list' &&
        response[response.type] &&
        typeof response[response.type] === 'number'
      ) {
        // maybe a list API returned a count?
        const span = document.createElement('span')
        span.innerText = response[response.type]
        resultDom.appendChild(span)
        ;(resultDom.parentNode as HTMLElement).classList.add('result-vertical')
        ok(resultDom.parentElement).classList.add('ok-for-list')
      } else if (typeof response === 'number' || typeof response === 'string' || isMessageBearingEntity(response)) {
        // if either the response is a string, or it's a non-entity (no response.type) and has a message field
        //     then treat the response as a simple string response
        if (echo) {
          // wrap in a span so that drag text selection works; see shell issue #249
          const span = document.createElement('pre')
          span.innerText = isMessageBearingEntity(response) ? response.message : response.toString()
          resultDom.appendChild(span)
          ;(resultDom.parentNode as HTMLElement).classList.add('result-vertical')
          ok(resultDom.parentElement).classList.add('ok-for-list')
        }
      } else if (isCustomSpec(response)) {
        if (echo || (execOptions && execOptions.replSilence)) {
          const presentation = await showCustom(tab, response, execOptions, customContainer)

          if (!isPopup()) {
            ok(resultDom.parentElement)
          }

          if (presentation !== undefined) {
            response.presentation = presentation
          }

          return !customContainer || customContainer.children.length === 0
        }
      } else if (isEntitySpec(response) && registeredEntityViews[response.type]) {
        // there is a registered entity view handler for this response
        if (await registeredEntityViews[response.type](tab, response, resultDom, parsedOptions, execOptions)) {
          if (echo) ok(resultDom.parentElement)
        }

        // we rendered the content?
        return resultDom.children.length === 0
      } else if (isEntitySpec(response) && response.verb === 'delete') {
        if (echo) {
          // we want the 'ok:' part to appear even in popup mode
          if (response.type) {
            ok(resultDom, `deleted ${response.type.replace(/s$/, '')} ${response.name}`, 'show-in-popup')
          } else {
            ok(resultDom)
          }
        }
      } else if (
        isEntitySpec(response) &&
        (response.verb === 'get' || response.verb === 'create' || response.verb === 'update')
      ) {
        // get response?
        const forRepl = showEntity(
          tab,
          response,
          Object.assign({}, execOptions || {}, {
            echo,
            show: response.show || 'default'
          })
        )
        // forRepl means: the sidecar wants to display something on the repl when it's done
        // it's either a promise or a DOM entry directly
        if (echo) {
          if (forRepl && forRepl.then) {
            forRepl.then(response => render(response, { echo, resultDom }))
          } else if (forRepl) {
            ok(resultDom.parentElement)
          }
        }

        // we rendered the content
        return true
      } else if (isMixedResponse(response)) {
        debug('mixed response')
        const paragraph = (part: MixedResponsePart) => {
          if (typeof part === 'string') {
            const para = document.createElement('p')
            para.classList.add('kui--mixed-response--text')
            para.innerText = part
            return para
          } else {
            return part
          }
        }

        response.forEach(part => {
          printResults(block, nextBlock, tab, resultDom, echo, execOptions, parsedOptions, command, evaluator)(
            paragraph(part)
          )
        })
      } else if (typeof response === 'object') {
        // render random json in the REPL directly
        const code = document.createElement('code')
        code.appendChild(document.createTextNode(JSON.stringify(response, undefined, 4)))
        resultDom.appendChild(code)
        setTimeout(() => hljs.highlightBlock(code), 0)
        ;(resultDom.parentNode as HTMLElement).classList.add('result-vertical')
        ok(resultDom.parentElement).classList.add('ok-for-list')
      }
    } else if (response) {
      if (echo) ok(resultDom.parentElement)
    }
  }

  let promise: Promise<boolean>

  // print ok if it's an empty table
  if (isTable(response) && response.body.length === 0) {
    response = true
  }

  if (isMultiTable(response)) {
    ;(resultDom.parentNode as HTMLElement).classList.add('result-as-table', 'result-as-multi-table', 'result-vertical')

    const tables = response.tables

    if (tables[0].flexWrap) {
      ;(resultDom.parentNode as HTMLElement).classList.add('result-as-multi-table-flex-wrap')
    }

    // multi-table output; false means that the renderer hasn't placed
    // anything in the DOM; it's up to us here
    promise = Promise.resolve(formatTable(tab, response, resultDom)).then(() => false)
  } else {
    promise = render(response, { echo, resultDom })
  }

  if (isTable(response) || isMultiTable(response)) {
    if (isPopup()) {
      presentAs(tab, Presentation.FixedSize)
    }
    // say "ok"
    if (echo) {
      promise.then(() => {
        ok(resultDom.parentNode as Element).classList.add('ok-for-list')
      })
    }
  }

  promise.then(async (alreadyRendered: boolean) => {
    if (
      isPopup() &&
      (Array.isArray(response) ||
        (customContainer && customContainer.children.length > 0) ||
        (isCustomSpec(response) && response.presentation === Presentation.FixedSize))
    ) {
      if (!incognito) {
        // view modes
        const modes =
          isEntitySpec(response) &&
          (response.modes ||
            (response[0] && response[0].modes) ||
            (response[0] && response[0][0] && response[0][0].modes))

        // entity type
        const prettyType =
          isEntitySpec(response) &&
          (response.kind ||
            response.prettyType ||
            response.prettyKind ||
            response.type ||
            (response[0] && response[0].title) ||
            (response[0] && response[0][0] && response[0][0].title))

        // presentation mode
        const presentation =
          (isCustomSpec(response) && response.presentation) ||
          (prettyType && Array.isArray(response) && Presentation.FixedSize) ||
          Presentation.SidecarFullscreenForPopups

        await renderPopupContent(
          command,
          alreadyRendered !== true && resultDom,
          execOptions,
          Object.assign({}, response, {
            modes: modes || undefined,
            prettyType,
            badges: isCustomSpec(response) && response.badges,
            controlHeaders: isEntitySpec(response) && response.controlHeaders,
            presentation
          })
        )
      }

      if (!incognito) {
        // add the command to the popup CLI, unless the command does
        // not wish itself to be known in the popup CLI
        popupListen(undefined, command)
      }
    }
  })

  return Promise.resolve()
}

export const installBlock = (parentNode: Node, currentBlock: HTMLElement, nextBlock: HTMLElement) => async () => {
  if (!nextBlock) return // error cases

  parentNode.appendChild(nextBlock)
  listen(getPrompt(nextBlock))

  if (!document.activeElement.classList.contains('grab-focus')) {
    nextBlock.querySelector('input').focus()
  }

  // the currentBlock might've been detached; if so, re-start from 0
  const currentIndex = currentBlock.parentNode ? parseInt(currentBlock.getAttribute('data-input-count'), 10) : -1
  nextBlock.setAttribute('data-input-count', (currentIndex + 1).toString())

  installContext(nextBlock)

  scrollIntoView({ when: 100 })

  eventBus.emit('/core/cli/install-block', getTabFromTarget(currentBlock))

  await handleQueuedInput(nextBlock)
}

/**
 * User has requested that we "cancel" whatever is currently happening.
 *
 * If there is nothing happening, then terminate the current prompt
 * and start a new one
 *
 * TODO cancel the actual command?
 *
 */
export const doCancel = () => {
  debug('doCancel')

  const block = removeAnyTemps(getCurrentProcessingBlock() || getCurrentBlock())

  if (block['restorePrompt']) {
    debug('cancelling in-progress "prompt"')
    block['restorePrompt']()
  }

  // Note: clone after restorePrompt
  const nextBlock = block.cloneNode(true) as HTMLElement
  const nextBlockPrompt = getPrompt(nextBlock)

  block.className = `${block.getAttribute('data-base-class')} cancelled`
  block['isCancelled'] = true
  nextBlockPrompt.value = ''
  nextBlockPrompt.readOnly = false // in case we cancelled a block in-progress - the cloneNode will pick up the readonly attribute, which we need to remove

  unlisten(getPrompt(block))
  installBlock(block.parentNode, block, nextBlock)()
}

/**
 * Paste a command, but do not eval it
 *
 */
export const partial = (cmd: string, execOptions: ExecOptions = new DefaultExecOptions()) => {
  const prompt = getCurrentPrompt()
  if (prompt) {
    debug('applying partial', cmd)
    prompt.value = cmd
    prompt['execOptions'] = execOptions
    prompt.classList.add('repl-partial')
    prompt.focus()
    setTimeout(() => prompt.classList.remove('repl-partial'), 1000)
  } else {
    debug('retrying partial', cmd)
    setTimeout(() => partial(cmd, execOptions), 100)
  }
}

/**
 * Handle command execution errors
 *
 */
export const oops = (command: string, block?: HTMLElement, nextBlock?: HTMLElement) => async (
  err: Error | CodedError | UsageError
) => {
  if (!block) return // we're not attached to a prompt right now

  if (!nextBlock) {
    nextBlock = block.cloneNode(true) as HTMLElement
    nextBlock.querySelector('input').value = ''
  }

  if (getPrompt(block).value === '') {
    // e.g. we want qexec with reportErrors:true show command in repl
    getPrompt(block).value = command
  }

  setStatus(block, 'error')

  const resultDom = isPopup() ? createPopupContentContainer(['error']) : block.querySelector('.repl-result')
  const oopsDom = document.createElement('div')
  oopsDom.className = 'oops'
  resultDom.appendChild(oopsDom)

  if (err['hide']) {
    // we were instructed not to show any message
  } else if (UsageError.isUsageError(err)) {
    oopsDom.appendChild(await UsageError.getFormattedMessage(err))
    /* } else if (isHTML(err.message)) {
    // err.message is a DOM
    oopsDom.appendChild(err.message) */
    /* } else if (err.html) {
    // pre-rendered HTML
    oopsDom.classList.add('oops-as-html')
    oopsDom.appendChild(err.html) */
    /* } else if (err.message && err.message.then) {
    err.message.then(message => {
      err.message = message
      oops(command, block, nextBlock)(err)
    })
    return */
  } else if (isHTML(err)) {
    // err is a DOM
    oopsDom.appendChild(err)
  } else {
    // we'll go with our formatted message
    // wrap in a span so that drag text selection works; see shell issue #249
    const message = oopsMessage(err)
    const span = document.createElement('pre')
    span.appendChild(document.createTextNode(message))
    oopsDom.appendChild(span)
  }

  // add the http status code, if we have it (helps with testing)
  if (isCodedError(err)) {
    oopsDom.setAttribute('data-status-code', (err.statusCode || err.code).toString())
  } else {
    oopsDom.setAttribute('data-status-code', '0')
  }

  if (resultDom.hasAttribute('data-stream')) {
    // then the command has been streaming its output; copy any such output
    // over to the oops dom
    const streamingOutput = resultDom.querySelector('.streaming-output')
    if (streamingOutput) {
      oopsDom.appendChild(streamingOutput)
    }
  }

  if (isPopup()) {
    renderPopupContent(command, err['content'] || resultDom, {}, err['modes'])
    popupListen(undefined, command)
  }

  installBlock(block.parentNode, block, nextBlock)()

  // indicate that we've already rendered the block
  return false
}

export const showHelp = (command: string, block: HTMLElement, nextBlock: HTMLElement, error: Error) => {
  // if the message says command not found, then add on the "enter help to see your options" as a suffix
  const baseMessage = 'Enter help to see your options.'
  if (error.message && error.message === 'Command not found') error.message += `\n${baseMessage}`

  return oops(command, block, nextBlock)(error) && false
}

type PromptCompleter = RepromptSpec | Promise<Entity>

interface RepromptSpec {
  completion?: PromptCompletionHandler // for reprompt
  onpaste?: string
  placeholder?: string
  reprompt?: boolean // recursively prompt?
}

function isRequestingReprompt(spec: PromptCompleter): spec is RepromptSpec {
  return (spec as RepromptSpec).reprompt
}

interface PromptCompletionData {
  field: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

export type PromptCompletionHandler = (data: PromptCompletionData) => PromptCompleter

interface PromptOptions {
  dangerous?: boolean
  placeholder?: string
  onpaste?: string
  paste?: (evt: ClipboardEvent) => void
  type?: string // an HTMLInputElement attribute e.g. 'password'
}

/**
 * Prompt the user for information
 *
 */
export const prompt = (
  msg: string,
  block: HTMLElement,
  nextBlock: HTMLElement,
  tab: Tab,
  options: PromptOptions,
  completion: PromptCompletionHandler
) => {
  debug('prompt', options)

  const selection = block.querySelector('.repl-selection') as HTMLElement
  const promptDom = getPrompt(block)
  const resultDom = block.querySelector('.repl-result') as HTMLElement

  const currentSelection = selection.innerText
  const currentType = promptDom.getAttribute('type')
  const currentInput = promptDom.value
  const currentPlaceholder = promptDom.getAttribute('placeholder')

  // reactivate the current prompt
  listen(promptDom)
  block.className = `${block.getAttribute('data-base-class')} repl-active`

  selection.innerText = '' // no selection for prompts (for now?)
  promptDom.readOnly = false
  promptDom.value = ''

  promptDom.setAttribute('placeholder', options.placeholder || `Enter your ${msg}`)

  // paste handlers
  if (options.onpaste === 'capture') {
    debug('setting up for paste capture')

    const textarea = document.createElement('textarea') as HTMLTextAreaElement
    textarea.style.opacity = '0%'
    textarea.style.position = 'absolute'
    textarea.style.left = '-1000px'
    textarea.style.top = '-1000px'
    document.body.appendChild(textarea)
    textarea.focus()
    promptDom.onpaste = () => true
    const currentGlobalHandler = document.body.onpaste
    document.body.onpaste = () => true

    textarea.onkeypress = event => {
      const char = event.keyCode
      if (char === keys.ENTER) {
        block['completion'](textarea.value)
      }
    }

    textarea.onpaste = event => {
      const text = event.clipboardData.getData('text')
      debug('capturing paste for repl.prompt', text)
      block['completion'](text)
      document.body.removeChild(textarea)
      document.body.onpaste = currentGlobalHandler

      event.stopPropagation()
      return false
    }
  } else if (typeof options.paste === 'function') {
    promptDom.onpaste = options.paste
  }

  if (options.type) {
    promptDom.setAttribute('type', options.type)
  }

  const restorePrompt = (err?: Error) => {
    setStatus(block, 'valid-response')
    selection.innerText = currentSelection
    promptDom.value = currentInput
    promptDom.setAttribute('type', currentType)

    if (currentPlaceholder) {
      promptDom.setAttribute('placeholder', currentPlaceholder)
    } else {
      promptDom.removeAttribute('placeholder')
    }

    if (err) {
      console.error(err)
    }
  }
  block['restorePrompt'] = restorePrompt

  block['completion'] = (value: string) => {
    block.className = `${block.getAttribute('data-base-class')} processing`
    unlisten(promptDom)
    promptDom.readOnly = true
    const completer = completion(Object.assign({}, options, { field: value }))

    if (isRequestingReprompt(completer)) {
      // then the command needs a second prompt
      restorePrompt()
      return prompt(msg, block, nextBlock, tab, completer, completer.completion)
    } else {
      completer
        .then(response => {
          return printResults(block, nextBlock, tab, resultDom)(response)
        })
        .then(() => undefined) // so that restorePrompt sees no input on success
        .then(restorePrompt)
        .then(installBlock(block.parentNode, block, nextBlock)) // <-- create a new input, for the next iter of the Loop
        .catch((err: Error) => {
          restorePrompt()
          oops('', block, nextBlock)(err)
        })
    }
  }

  return { mode: 'prompt' }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const init = async (prefs = {}) => {
  debug('init')

  const tab = getCurrentTab()
  installContext(getInitialBlock(tab))
  listen(getInitialPrompt(tab))

  // in popup mode, cmd/ctrl+L should focus the repl input
  if (isPopup()) {
    document.body.addEventListener('keydown', (event: KeyboardEvent) => {
      const char = event.keyCode
      if (char === keys.L && (event.ctrlKey || (inElectron() && event.metaKey))) {
        const input = getSidecar(getCurrentTab()).querySelector('.repl-input input') as HTMLInputElement
        input.focus()
        input.setSelectionRange(0, input.value.length)
      }
    })
  }

  if (inBottomInputMode) {
    getCurrentPrompt(tab).onpaste = paste
  }

  // if you want to have the current directory displayed with the initial prompt
  // getCurrentBlock().querySelector('.repl-context').innerText = process.cwd() === process.env.HOME ? '~' : basename(process.cwd());
}
