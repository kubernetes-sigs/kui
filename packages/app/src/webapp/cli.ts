/*
 * Copyright 2017-18 IBM Corporation
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

const debug = require('debug')('webapp/cli')
debug('loading')

declare var hljs

import eventBus from '../core/events'
import { oopsMessage } from '../core/oops'
import { inElectron } from '../core/capabilities'
import { keys } from './keys'

import { IExecOptions, DefaultExecOptions } from '../models/execOptions'
import * as historyModel from '../models/history'

import { element, removeAllDomChildren } from './util/dom'
import { prettyPrintTime } from './util/time'

import Presentation from './views/presentation'
import { formatListResult, formatMultiListResult } from './views/table'
import { currentSelection, showEntity, showCustom } from './views/sidecar'

/**
 * Make sure that the given repl block is visible.
 *
 * @param when wait this long; e.g. the 305ms is in step with the sidecar transition: all 300ms ease-in-out
 * @param which the repl block sub-element that needs to be visible
 * @param element the element to scroll into view (optional, defaults to use @which)
 * @param center this is passed directly to the underlying API https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoViewIfNeeded
 *
 */
export const scrollIntoView = ({ when = 305, which = '.repl-active', element = document.querySelector(`tab.visible .repl ${which}`) as HTMLElement, center = true } = {}) => {
  const scroll = () => {
    try {
      // false here means "bottom of the element will be aligned to the bottom of the visible area of the scrollable ancestor"
      //    (see https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView)
      // document.querySelector('tab.visible .repl .repl-active').scrollIntoView(true)
      element['scrollIntoViewIfNeeded'](center)
    } catch (e) {
      if (element) {
        element.scrollIntoView(center)
      }
    }
  }

  if (when === 0) {
    scroll()
  } else {
    setTimeout(scroll, when)
  }
}

/**
 *
 *
 */
export const setStatus = (block: Element, status: string) => {
  if (block) {
    block.classList.remove('processing')
    block.classList.remove('repl-active')
    block.classList.add(status)

    // add timestamp to prompt
    element('.repl-prompt-timestamp', block).innerText = new Date().toLocaleTimeString()

    // screenshot click handler
    element('.repl-prompt-right-element-icon', block).onclick = async event => {
      // intercept repl's scroll to bottom behavior
      event.stopPropagation()

      // the indexing is from 0 versus from 1
      const N = parseInt(block.getAttribute('data-input-count'), 10) + 1

      const repl = await import('../core/repl')
      debug(`capturing screenshot for block ${N}`)
      repl.qexec(`screenshot --nth ${N}`)
    }
  }
}

/**
 *
 *
 */
export const ok = (parentNode: Element, suffix?: string | Element) => {
  const okLine = document.createElement('div')

  const replResultBlock = parentNode.parentNode.querySelector('.repl-result')
  const resultHasContent = replResultBlock.children.length > 0
  if (resultHasContent) {
    (replResultBlock.parentNode as Element).classList.add('repl-result-has-content')
  }

  const ok = document.createElement('span')
  okLine.appendChild(ok)
  ok.setAttribute('class', 'ok')
  ok.appendChild(document.createTextNode('ok'))

  if (suffix) {
    okLine.appendChild(typeof suffix === 'string' ? document.createTextNode(suffix) : suffix)
  }

  parentNode.appendChild(okLine)
  return okLine
}

/**
 * Register a renderer for a given Array<kind>
 *
 */
export type ViewHandler = (response: Object, resultDom: Element, parsedOptions: Object, execOptions: Object) => void
const registeredListViews = {}
export const registerListView = (kind: string, handler: ViewHandler) => {
  registeredListViews[kind] = handler
}

/**
 * Register a renderer for a given <kind>
 *
 */
const registeredEntityViews = {}
export const registerEntityView = (kind: string, handler) => {
  registeredEntityViews[kind] = handler
}

/**
 * Stream output to the given block
 *
 */
export const streamTo = (block: Element) => {
  const resultDom = block.querySelector('.repl-result')
  const pre = document.createElement('pre')
  pre.classList.add('streaming-output')
  resultDom.appendChild(pre)
  resultDom.setAttribute('data-stream', 'data-stream');
  (resultDom.parentNode as HTMLElement).classList.add('result-vertical')

  // so we can scroll this into view as streaming output arrives
  const spinner = element('.repl-result-spinner', block)

  let previousLine
  return async (response, killLine = false) => {
    //
    debug('stream', response)

    if (killLine && previousLine) {
      previousLine.parentNode.removeChild(previousLine)
      previousLine = undefined
    }

    if (response.isUsageError) {
      previousLine = await response.message
      pre.appendChild(previousLine)
      pre.classList.add('oops')
      pre.setAttribute('data-status-code', response.statusCode || response.code || 500)
    } else if (response.nodeName) {
      previousLine = response
      pre.appendChild(previousLine)
    } else {
      previousLine = document.createElement('div')
      previousLine.innerText = response.message || response
      pre.appendChild(previousLine)
    }

    scrollIntoView({ when: 0, element: spinner })
  }
}

/** create a popup content container */
const createPopupContentContainer = (css = []): HTMLElement => {
  const container = document.createElement('div')
  container.classList.add('padding-content')

  const scrollRegion = document.createElement('div')
  scrollRegion.classList.add('repl-block')
  css.forEach(_ => scrollRegion.classList.add(_))
  container.appendChild(scrollRegion)

  const resultDom = document.createElement('div')
  resultDom.classList.add('repl-result')
  scrollRegion.appendChild(resultDom)

  return resultDom
}

/** render popup content in the given container */
const renderPopupContent = (command: string, container: Element, execOptions?: IExecOptions) => {
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

  if ((container.parentNode as HTMLElement).classList.contains('result-as-multi-table')) {
    (container.parentNode.parentNode as HTMLElement).classList.add('overflow-auto')
  }

  const custom = {
    type: 'custom',
    isEntity: true,
    isREPL: true,
    name: command,
    presentation: Presentation.SidecarFullscreenForPopups,
    subtext,
    content: container.parentNode.parentNode // dom -> scrollRegion -> paddingContent
  }

  showCustom(custom, execOptions)
}

/** are we operating in popup mode? */
const isPopup = () => document.body.classList.contains('subwindow')

/**
 * Render the results of a command evaluation in the "console"
 *
 */
export const printResults = (block: Element, nextBlock: Element, resultDom: Element, echo = true, execOptions?: IExecOptions, parsedOptions?, command?) => response => {
  debug('printResults')

  if (isPopup()) {
    resultDom = createPopupContentContainer()
  }

  if (process.env.KUI_TEE_TO_FILE) {
    // we were asked to tee the output to the system console
    debug('teeing output to file', process.env.KUI_TEE_TO_FILE)
    try {
      const { print } = require('../main/headless-pretty-print')
      const { createWriteStream } = require('fs')
      const stream = createWriteStream(process.env.KUI_TEE_TO_FILE)
      const logger = data => stream.write(data)
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

  if (echo) setStatus(block, 'valid-response')

  const render = async (response, { echo, resultDom }) => {
    if (response && response !== true) {
      if (Array.isArray(response)) {
        //
        // some sort of list response; format as a table
        //
        if (response.length > 0) {
          const registeredListView = registeredListViews[response[0].type]
          if (registeredListView) {
            registeredListView(response, resultDom, parsedOptions)
          } else {
            const rows = await formatListResult(response)
            rows.map(row => resultDom.appendChild(row))
          }
        }
      } else if (response.nodeName) { // TODO is this the best way to detect response is a dom??
        // pre-formatted DOM element
        if (echo) {
          resultDom.appendChild(response);
          (resultDom.parentNode as HTMLElement).classList.add('result-vertical')
          ok(resultDom.parentNode).className = 'ok-for-list'
        }
      } else if (response.verb === 'list' && response[response.type] && typeof response[response.type] === 'number') {
        // maybe a list API returned a count?
        const span = document.createElement('span')
        span.innerText = response[response.type]
        resultDom.appendChild(span);
        (resultDom.parentNode as HTMLElement).classList.add('result-vertical')
        ok(resultDom.parentNode).className = 'ok-for-list'
      } else if (typeof response === 'number' || typeof response === 'string' ||
                 (!response.type && response.message && typeof response.message === 'string')) {
        // if either the response is a string, or it's a non-entity (no response.type) and has a message field
        //     then treat the response as a simple string response
        if (echo) {
          // wrap in a span so that drag text selection works; see shell issue #249
          const span = document.createElement('pre')
          span.innerText = response.message || response
          resultDom.appendChild(span);
          (resultDom.parentNode as HTMLElement).classList.add('result-vertical')
          ok(resultDom.parentNode).className = 'ok-for-list'
        }
      } else if (response.type === 'custom' || response.renderAs === 'custom') {
        if (echo) {
          showCustom(response, execOptions)
          if (!isPopup()) {
            ok(resultDom.parentNode)
          }
        } else if (execOptions && execOptions.replSilence) {
          showCustom(response, execOptions)
        }
      } else if (registeredEntityViews[response.type]) {
        // there is a registered entity view handler for this response
        await registeredEntityViews[response.type](response, resultDom, parsedOptions, execOptions)
      } else if (response.verb === 'delete') {
        if (echo) ok(resultDom.parentNode)
      } else if (response.verb === 'get' || response.verb === 'create' || response.verb === 'update') {
        // get response?
        const forRepl = showEntity(response, Object.assign({}, execOptions || {}, { echo, show: response.show || 'default' }))
        // forRepl means: the sidecar wants to display something on the repl when it's done
        // it's either a promise or a DOM entry directly
        if (echo) {
          if (forRepl && forRepl.then) {
            forRepl.then(response => render(response, { echo, resultDom }))
          } else if (forRepl) {
            ok(resultDom.parentNode)
          }
        }
      } else if (typeof response === 'object') {
        // render random json in the REPL directly
        const code = document.createElement('code')
        code.appendChild(document.createTextNode(JSON.stringify(response, undefined, 4)))
        resultDom.appendChild(code)
        setTimeout(() => hljs.highlightBlock(code), 0);
        (resultDom.parentNode as HTMLElement).classList.add('result-vertical')
        ok(resultDom.parentNode).className = 'ok-for-list'
      }
    } else if (response) {
      if (echo) ok(resultDom.parentNode)
    }
  }

  let promise
  if (Array.isArray(response) && Array.isArray(response[0])) {
    // multi-table output
    promise = formatMultiListResult(response, resultDom)
  } else {
    promise = render(response, { echo, resultDom })
  }

  if (Array.isArray(response)) {
    // decorate it as a table
    (resultDom.parentNode as HTMLElement).classList.add('result-as-table')

    if (response.length > 0 && response[0].noEntityColors) {
      // client wants control over entity-cell coloring
      resultDom.classList.add('result-table-with-custom-entity-colors')
    }

    if (!Array.isArray(response[0]) && response.length > 0) {
      resultDom.classList.add('result-table')
    } else {
      (resultDom.parentNode as HTMLElement).classList.add('result-as-multi-table')
      if (response[0] && response[0][0] && response[0][0].flexWrap) {
        (resultDom.parentNode as HTMLElement).classList.add('result-as-multi-table-flex-wrap')
      }
    }

    // say "ok"
    (resultDom.parentNode as HTMLElement).classList.add('result-vertical')
    if (echo) {
      promise.then(() => {
        ok(resultDom.parentNode as Element).className = 'ok-for-list'
      })
    }

    if (isPopup()) {
      renderPopupContent(command, resultDom, execOptions)
    }
  }

  return Promise.resolve()
}

export const getInitialBlock = () => {
  return document.querySelector('tab.visible .repl .repl-block.repl-initial')
}
export const getCurrentBlock = () => {
  return document.querySelector('tab.visible .repl .repl-block.repl-active')
}
export const getCurrentProcessingBlock = () => {
  return document.querySelector('tab.visible .repl .repl-block.processing')
}
export const getPrompt = (block, noFakes = false) => {
  return (block && block.querySelector && block.querySelector('input')) || (!noFakes && { focus: () => true })
}
export const getInitialPrompt = (): HTMLInputElement => {
  return getPrompt(getInitialBlock())
}
export const getCurrentPrompt = (noFakes = false): HTMLInputElement => {
  return getPrompt(getCurrentBlock(), noFakes)
}
export const getPromptLeft = (block: Element) => {
  return block.querySelector('.repl-prompt-righty')
}
export const getCurrentPromptLeft = () => {
  return getPromptLeft(getCurrentBlock())
}

/**
 * Remove any .repl-temporary structures from the given dom
 *
 */
export const removeAnyTemps = (block: Element) => {
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
 * Update the caret position in an html INPUT field
 *
 */
const setCaretPosition = (ctrl, pos: number) => {
  if (ctrl.setSelectionRange) {
    ctrl.focus()
    ctrl.setSelectionRange(pos, pos)
  } else if (ctrl.createTextRange) {
    let range = ctrl.createTextRange()
    range.collapse(true)
    range.moveEnd('character', pos)
    range.moveStart('character', pos)
    range.select()
  }
}
const setCaretPositionToEnd = input => setCaretPosition(input, input.value.length)
const updateInputAndMoveCaretToEOL = (input, newValue) => {
  input.value = newValue
  setTimeout(() => setCaretPositionToEnd(input), 0)
}

export const unlisten = prompt => {
  if (prompt && !prompt.classList.contains('sidecar-header-input')) {
    prompt.onkeypress = null
  }
}
export const popupListen = (text: Element) => {
  if (text.classList.contains('is-repl-like')) {
    const input = text.querySelector('.sidecar-header-input')
    listen(input)
  }
}
export const listen = prompt => {
  debug('listen', prompt)

  if (!prompt.classList.contains('sidecar-header-input')) {
    prompt.focus()
  }

  prompt.parentNode.parentNode.className = `${prompt.parentNode.parentNode.getAttribute('data-base-class')} repl-active`

  prompt.onkeypress = async event => {
    const char = event.keyCode
    if (char === keys.ENTER) {
      // user typed Enter; we've finished Reading, now Evalute
      const repl = await import('../core/repl')
      repl.doEval({ prompt })
    }
  }

  prompt.onkeydown = async (event) => {
    const char = event.keyCode

    if (char === keys.UP || (char === keys.P && event.ctrlKey)) {
      // go to previous command in history
      const newValue = (historyModel.previous() || { raw: '' }).raw
      if (newValue) {
        updateInputAndMoveCaretToEOL(prompt, newValue)
      }
    } else if (char === keys.PAGEUP) {
      debug('pageup')
      const { height } = document.body.getBoundingClientRect()
      document.querySelector('tab.visible .repl-inner').scrollBy(0, -height)
    } else if (char === keys.PAGEDOWN) {
      debug('pagedown')
      const { height } = document.body.getBoundingClientRect()
      document.querySelector('tab.visible .repl-inner').scrollBy(0, +height)
    } else if (char === keys.C && event.ctrlKey) {
      // Ctrl+C, cancel
      doCancel()
    } else if (char === keys.U && event.ctrlKey) {
      // clear line
      prompt.value = ''
    } else if (char === keys.L && (event.ctrlKey || (inElectron() && event.metaKey))) {
      // clear screen; capture and restore the current
      // prompt value, in keeping with unix terminal
      // behavior
      const current = getCurrentPrompt().value
      const repl = await import('../core/repl')
      const currentCursorPosition = getCurrentPrompt().selectionStart // also restore the cursor position
      repl.pexec('clear')
        .then(() => {
          if (current) {
            // restore the prompt value
            getCurrentPrompt().value = current

            // restore the prompt cursor position
            debug('restoring cursor position', currentCursorPosition)
            getCurrentPrompt().setSelectionRange(currentCursorPosition, currentCursorPosition)
          }
        })
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

export const installBlock = (parentNode, currentBlock, nextBlock) => () => {
  if (!nextBlock) return // error cases

  parentNode.appendChild(nextBlock)
  listen(getPrompt(nextBlock))
  nextBlock.querySelector('input').focus()
  nextBlock.setAttribute('data-input-count', parseInt(currentBlock.getAttribute('data-input-count'), 10) + 1)

  // if you want to have the current directory displayed with the prompt
  // nextBlock.querySelector('.repl-context').innerText = process.cwd() === process.env.HOME ? '~' : basename(process.cwd());

  scrollIntoView({ when: 0 })

  eventBus.emit('/core/cli/install-block')
}

/**
 * User has requested that we paste something from the clipboard
 *
 */
export const paste = event => {
  debug('got paste', event)

  const text = event.clipboardData.getData('text')
  if (text) {
    // we'll handle it from here!
    event.preventDefault()

    // const prompt = event.currentTarget
    const lines = text.split(/\n|\r/)

    const pasteLooper = async (idx: number) => {
      if (idx === lines.length) {
        // all done...
        return Promise.resolve()
      } else if (lines[idx] === '') {
        // then this is a blank line, so skip it
        return pasteLooper(idx + 1)
      } else if (idx <= lines.length - 2) {
        // then this is a command line with a trailing newline
        const repl = await import('../core/repl')
        return repl.pexec(getCurrentPrompt().value + lines[idx])
          .then(() => pasteLooper(idx + 1))
      } else {
        // then this is the last line, but without a trailing newline.
        // here, we add this command line to the current prompt, without executing it
        const prompt = getCurrentPrompt()

        // paste the line with respect to the current prompt's
        // selection range; if there is no selection range, then
        // prompt.selectionStart will be the current caret position
        // (which is precisely what we want, i.e. to paste the given
        // text at the current caret position); if there is a
        // selectionEnd, then we will *also* replace the selection
        // range

        // and, then, when we are done, will position the caret just
        // after the pasted text:
        const newCaretPosition = prompt.selectionStart + lines[idx].length

        // note how this will either place the new text at the caret
        // position, or replace the selected text (if selectionEnd !==
        // selectionStart)
        prompt.value = prompt.value.substring(0, prompt.selectionStart)
          + lines[idx]
          + prompt.value.substring(prompt.selectionEnd)

        // restore the caret position
        prompt.setSelectionRange(newCaretPosition, newCaretPosition)

        return Promise.resolve()
      }
    }

    return pasteLooper(0)
  }
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
  const nextBlock = block.cloneNode(true)
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
export const partial = (cmd: string, execOptions: IExecOptions = new DefaultExecOptions()) => {
  const prompt = getCurrentPrompt(true)
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
export const oops = (command: string, block?: Element, nextBlock?: Element) => err => {
  const message = oopsMessage(err)
  // const errString = err && err.toString()

  if (!block) return // we're not attached to a prompt right now

  setStatus(block, 'error')

  const resultDom = isPopup() ? createPopupContentContainer(['error']) : block.querySelector('.repl-result')
  const oopsDom = document.createElement('div')
  oopsDom.className = 'oops'

  if (err.message && err.message.nodeName) {
    // err.message is a DOM
    oopsDom.appendChild(err.message)
  } else if (err.html) {
    // pre-rendered HTML
    oopsDom.classList.add('oops-as-html')
    oopsDom.appendChild(err.html)
  } else if (err.message && err.message.then) {
    err.message.then(message => {
      err.message = message
      oops(command, block, nextBlock)(err)
    })
    return
  } else if (err.nodeName) {
    // err is a DOM
    oopsDom.appendChild(err)
  } else {
    // we'll go with our formatted message
    // wrap in a span so that drag text selection works; see shell issue #249
    const span = document.createElement('span')
    span.appendChild(document.createTextNode(message))
    oopsDom.appendChild(span)
  }
  resultDom.appendChild(oopsDom)

  // add the http status code, if we have it (helps with testing)
  oopsDom.setAttribute('data-status-code', err.statusCode || err.code || 0)

  if (resultDom.hasAttribute('data-stream')) {
    // then the command has been streaming its output; copy any such output
    // over to the oops dom
    const streamingOutput = resultDom.querySelector('.streaming-output')
    if (streamingOutput) {
      oopsDom.appendChild(streamingOutput)
    }
  }

  if (isPopup()) {
    renderPopupContent(command, resultDom)
  }

  installBlock(block.parentNode, block, nextBlock)()

  // indicate that we've already rendered the block
  return false
}

export const showHelp = (command: string, block: Element, nextBlock: Element, error) => {
  // if the message says command not found, then add on the "enter help to see your options" as a suffix
  const baseMessage = 'Enter help to see your options.'
  if (error.message && error.message === 'Command not found') error.message += `\n${baseMessage}`

  return oops(command, block, nextBlock)(error) && false
}

/**
 * Prompt the user for information
 *
 */
export const prompt = (msg: string, block: Element, nextBlock: Element, options, completion) => {
  debug('prompt', options)

  const selection = block.querySelector('.repl-selection') as HTMLElement
  const promptDom = getPrompt(block)
  const resultDom = block.querySelector('.repl-result')

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
    promptDom.onpaste = options.onpaste
  }

  if (options.type) {
    promptDom.setAttribute('type', options.type)
  }

  const restorePrompt = (err?) => {
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

  block['completion'] = value => {
    block.className = `${block.getAttribute('data-base-class')} processing`
    unlisten(promptDom)
    promptDom.readOnly = true
    const completer = completion(Object.assign({}, options, { field: value }))

    if (completer.reprompt) {
      // then the command needs a second prompt
      restorePrompt()
      return prompt(msg, block, nextBlock, completer, completer.completion)
    } else {
      completer.then(response => {
        if (response && response.context && nextBlock) {
          // setContextUI(response, nextBlock)
        }
        return printResults(block, nextBlock, resultDom)(response)
      })
        .then(() => undefined) // so that restorePrompt sees no input on success
        .then(restorePrompt)
        .then(installBlock(block.parentNode, block, nextBlock)) // <-- create a new input, for the next iter of the Loop
        .catch(err => { restorePrompt(); oops('', block, nextBlock)(err) })
    }
  }

  return { mode: 'prompt' }
}

export const init = async (prefs = {}) => {
  debug('init')

  listen(getInitialPrompt())

  // if you want to have the current directory displayed with the initial prompt
  // getCurrentBlock().querySelector('.repl-context').innerText = process.cwd() === process.env.HOME ? '~' : basename(process.cwd());
}
