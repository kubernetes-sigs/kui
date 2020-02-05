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
const debug = Debug('webapp/cli/print')
debug('loading')

import { Tab } from './tab'
import { Block } from './models/block'
import { setStatus, Status } from './status'
import { scrollIntoView } from './scroll'

import { isHTML } from '../util/types'
import { promiseEach } from '../util/async'

import KuiFrame from './component/KuiFrame'
import { isKuiFramedComponent } from './component/component'
import { findComponentProviders } from './component/registrar'

import { Streamable, Stream } from '../models/streamable'
import { CommandHandlerWithEvents, KResponse, ParsedOptions } from '../models/command'
import { ExecOptions } from '../models/execOptions'
import { isMultiModalResponse } from '../models/mmr/is'
import {
  Entity,
  isResourceModification,
  isMessageBearingEntity,
  MixedResponsePart,
  isMixedResponse
} from '../models/entity'

import UsageError from '../core/usage-error'

/**
 * Emit a green "ok"
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

/**
 * See if we have any registered component providers for the given
 * response. If we got here, then the response type is one of those
 * that Kui currently supports via component provider plugins. It
 * remains to be seen whether any of the registered providers actually
 * want to render this particular response.
 *
 * @return whether or not we *actually* found a willing provider
 *
 */
async function printViaProvider(
  tab: Tab,
  response: Entity,
  resultDom: Element,
  command?: string,
  echoOk?: boolean
): Promise<boolean> {
  const providers = findComponentProviders(response)
  if (providers.length === 0) {
    debug('no registered component providers for response, using built-in printers', response)
    return false
  } else {
    if (providers.length > 1) {
      providers.sort((a, b) => (b.priority || 0) - a.priority || 0)
      debug(
        'warning: multiple view providers for this response, picking the highest priority provider',
        response,
        providers[0]
      )
    }
    ;[providers[0]].forEach(async _ => {
      const component = await _.render(response, tab, tab.REPL, command)

      if (component.spec.content.children.length > 0) {
        resultDom.parentElement.classList.add('repl-result-has-content')
      }

      // does the view provider need us to wrap the content in a frame?
      if (isKuiFramedComponent(component)) {
        new KuiFrame().attach(component, tab)
        if (echoOk) {
          ok(resultDom.parentElement)
        }
      } else {
        // if not, then append its content to the REPL output

        // TODO these two should go away once we consolidate the table styling in plugin-kui-tables
        resultDom.parentElement.classList.add('result-as-table', 'result-as-vertical')
        resultDom.classList.add('repl-result')

        resultDom.appendChild(component.spec.content)
        if (echoOk) {
          ok(resultDom.parentElement).classList.add('ok-for-list')
        }
      }
    })
    return true
  }
}

/**
 * Stream output to the given block
 *
 */
export const streamTo = (tab: Tab, block: Block): Stream => {
  const container = block.querySelector('.repl-output') as HTMLElement
  const resultDom = container ? document.createElement('div') : (block.querySelector('.repl-result') as HTMLElement)
  if (container) {
    container.classList.add('repl-result-has-content')
    container.insertBefore(resultDom, container.childNodes[0])
  }

  let previousLine: HTMLElement
  return (response: Streamable, killLine = false): Promise<void> => {
    // debug('stream', response, killLine)
    resultDom.setAttribute('data-stream', 'data-stream')
    ;(resultDom.parentNode as HTMLElement).classList.add('result-vertical')

    if (killLine && previousLine) {
      previousLine.parentNode.removeChild(previousLine)
      previousLine = undefined
    }

    const formatPart = async (response: Streamable, resultDom: HTMLElement) => {
      if (await printViaProvider(tab, response, resultDom)) {
        // then a provider handled the rendering for us. we're done here
        return
      }

      if (UsageError.isUsageError(response)) {
        previousLine = await UsageError.getFormattedMessage(response)
        resultDom.appendChild(previousLine)
        resultDom.classList.add('oops')
        resultDom.setAttribute('data-status-code', response.code.toString())
      } else if (isMixedResponse(response)) {
        promiseEach(response, _ => {
          const para = document.createElement('p')
          para.classList.add('kui--mixed-response--text')
          resultDom.appendChild(para)
          return formatPart(_, para)
        })
      } else if (isHTML(response)) {
        response.classList.add('repl-result-like')
        previousLine = response
        resultDom.appendChild(previousLine)
      } else {
        previousLine = document.createElement('pre')
        previousLine.classList.add('streaming-output', 'repl-result-like')
        previousLine.innerText = isMessageBearingEntity(response) ? response.message : response.toString()
        resultDom.appendChild(previousLine)
      }
    }

    return formatPart(response, resultDom).then(() => {
      scrollIntoView({ element: resultDom, when: 0 })
    })
  }
}

async function renderResult(
  response: Entity,
  tab: Tab,
  resultDom: HTMLElement,
  block: Block,
  echo = true,
  attach = echo
) {
  if (isHTML(response)) {
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

export function replResult() {
  const resultContainer = document.createElement('div')
  const resultDom = document.createElement('div')
  resultDom.classList.add('repl-result')
  resultContainer.appendChild(resultDom)
  return resultDom
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
  command?: string,
  evaluator?: CommandHandlerWithEvents<KResponse, ParsedOptions>
) => async (response: Entity): Promise<boolean> => {
  debug('printResults', response)

  if (process.env.KUI_TEE_TO_FILE) {
    // we were asked to tee the output to the system console
    debug('teeing output to file', process.env.KUI_TEE_TO_FILE)
    import('../util/tee').then(_ => _.default(response))
  }

  if (echo) {
    setStatus(block, response === false ? Status.error : Status.validResponse)
  }

  const render = async (response: Entity, { echo, resultDom }: { echo: boolean; resultDom: HTMLElement }) => {
    if (response && response !== true) {
      const echoOk = echo || (execOptions && execOptions.replSilence)
      if (await printViaProvider(tab, response, resultDom, command, echoOk)) {
        // then we found at least one provider willing to do the
        // rendering for us!
      } else if (await renderResult(response, tab, resultDom, block, echo)) {
        // then renderResult took care of things
      } else if (
        typeof response === 'number' ||
        typeof response === 'string' ||
        (isMessageBearingEntity(response) && !isMultiModalResponse(response))
      ) {
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
      } else if (isResourceModification(response) && response.verb === 'delete') {
        if (echo) {
          // we want the 'ok:' part to appear even in popup mode
          if (response.kind) {
            ok(resultDom, `deleted ${response.kind.replace(/s$/, '')} ${response.metadata.name}`, 'show-in-popup')
          } else {
            ok(resultDom)
          }
        }
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
          printResults(block, nextBlock, tab, resultDom, echo, execOptions, command, evaluator)(paragraph(part))
        })
      } else if (typeof response === 'object') {
        // render random json in the REPL directly
        const code = document.createElement('code')
        code.appendChild(document.createTextNode(JSON.stringify(response, undefined, 4)))
        resultDom.appendChild(code)
        code.classList.add('hljs', 'json') // we have some CSS rules that trigger off these
        ;(resultDom.parentNode as HTMLElement).classList.add('result-vertical')
        ok(resultDom.parentElement).classList.add('ok-for-list')
      }
    } else if (response) {
      if (echo) ok(resultDom.parentElement)
    } else {
      return false
    }
  }

  await render(response, { echo, resultDom })

  // did we print something to the repl?
  // return !isCustomSpec(response)
  return true
}
