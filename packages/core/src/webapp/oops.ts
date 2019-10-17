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
const debug = Debug('webapp/oops')
debug('loading')

import { getPrompt } from './prompt'
import { setStatus, Status } from './status'
import { popupListen } from './listen'
import { installBlock } from './block'
import { isPopup } from './popup-core'
import { PopupEntity, renderPopupContent, createPopupContentContainer } from './popup'

import { isHTML } from '../util/types'

import { oopsMessage } from '../core/oops'
import UsageError from '../core/usage-error'

import { HideError, isHideError, CodedError, isCodedError } from '../models/errors'

interface PopupError extends Error {
  content?: Element
  modes?: PopupEntity
}

function isPopupError(err: Error): err is PopupError {
  return (err as PopupError).content !== undefined
}

/**
 * Handle command execution errors
 *
 */
export const oops = (command: string, block?: HTMLElement, nextBlock?: HTMLElement) => async (
  err: Error | CodedError | UsageError | HideError | PopupError
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

  setStatus(block, Status.error)

  const resultDom = isPopup() ? createPopupContentContainer(['error']) : block.querySelector('.repl-result')
  const oopsDom = document.createElement('div')
  oopsDom.className = 'oops'
  resultDom.appendChild(oopsDom)

  if (isHideError(err)) {
    // we were instructed not to show any message
    debug('we were instructed to hide this error', err)
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
    await renderPopupContent(
      command,
      (isPopupError(err) && err.content) || resultDom,
      {},
      isPopupError(err) && err.modes
    )
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
