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
const debug = Debug('webapp/cli/status')
debug('loading')

import { getBottomPrompt, getPrompt } from './prompt'
import { scrollIntoView } from './scroll'
import { startInputQueueing } from './queueing'
import { getTabFromTarget } from './tab'

import { element } from './util/dom'

import { isHeadless } from '../core/capabilities'
import { inBottomInputMode } from '../core/settings'

export const enum Status {
  processing = 'processing',
  replActive = 'repl-active',
  validResponse = 'valid-response',
  error = 'error'
}

type Status2 = 'processing' | 'repl-active' | 'valid-response' | 'error'

/**
 * Set the processing/active status for the given block
 *
 */
export const setStatus = (block: HTMLElement, status: Status) => {
  if (block) {
    block.classList.remove(Status.processing)
    block.classList.remove(Status.replActive)
    block.classList.remove(Status.validResponse)
    block.classList.remove(Status.error)
    block.classList.add(status)

    if (status === Status.processing) {
      startInputQueueing(getTabFromTarget(block))
      if (!isHeadless()) {
        const spinner = element('.repl-result-spinner', block)
        scrollIntoView({ when: 0, element: spinner })
      }
    } else if (status === Status.replActive) {
      getPrompt(block).value = ''
    }

    if (status !== Status.replActive && inBottomInputMode) {
      // for either processing or the final output, and if we are in
      // bottom input model, then copy repl input from the bottom
      // input
      const prompt = getPrompt(block)
      if (!prompt.value) {
        // this guards pexecs, i.e. input filled programmatically via
        // a click
        prompt.value = getBottomPrompt().value
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

      const { qexec } = await import('../repl/exec')
      debug(`capturing screenshot for block ${N}`)

      qexec(`screenshot --nth ${N}`, undefined, undefined, {
        rethrowErrors: true,
        reportErrors: true
      })
    }
  }
}
