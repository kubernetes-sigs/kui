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
const debug = Debug('webapp/cli/prompt-for-input')
debug('loading')

import { Tab } from './tab'
import { keys } from './keys'
import { oops } from './oops'
import { listen, unlisten } from './listen'
import { getPrompt } from './prompt'
import { setStatus, Status } from './status'
import { installBlock } from './block'
import { printResults } from './print'

import { Block } from './models/block'

import { Entity } from '../models/entity'

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
  field: string
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
  block: Block,
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
        block.completion(textarea.value)
      }
    }

    textarea.onpaste = event => {
      const text = event.clipboardData.getData('text')
      debug('capturing paste for repl.prompt', text)
      block.completion(text)
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
    setStatus(block, Status.validResponse)
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
  block.restorePrompt = restorePrompt

  block.completion = (value: string) => {
    block.className = `${block.getAttribute('data-base-class')} processing`
    unlisten(promptDom)
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

  return { mode: 'prompt' as const } // `as const` prevents 'prompt' from being widened to string
}
