/*
 * Copyright 2019 IBM Corporation
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
import { v4 as uuidgen } from 'uuid'

import UsageError from '@kui-shell/core/core/usage-error'
import { ReplEval, DirectReplEval } from '@kui-shell/core/core/repl'
import { getValidCredentials } from '@kui-shell/core/core/capabilities'
import { ExecOptions, withLanguage } from '@kui-shell/core/models/execOptions'
import { config } from '@kui-shell/core/core/settings'
import { isCommandHandlerWithEvents, Evaluator, EvaluatorArgs } from '@kui-shell/core/models/command'
import { ElementMimic } from '@kui-shell/core/util/mimic-dom'
import { CodedError } from '@kui-shell/core/models/errors'

// import { getChannelForTab } from '@kui-shell/plugin-bash-like/pty/session'
// copied for now, until we can figure out typescript compiler issues
import { Tab } from '@kui-shell/core/webapp/cli'
interface Channel {
  send: (msg: string) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on: (eventType: string, handler: any) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  removeEventListener: (eventType: string, handler: any) => void
}
function getSessionForTab(tab: Tab): Promise<Channel> {
  return tab['_kui_session'] as Promise<Channel>
}

const debug = Debug('plugins/proxy-support/executor')

interface ActualProxyServerConfig {
  url: string
  // needleOptions?: needle.NeedleOptions
}

interface DisabledProxyServerConfig {
  enabled: boolean
}

export function isDisabled(_config: ProxyServerConfig): _config is DisabledProxyServerConfig {
  const config = _config as DisabledProxyServerConfig
  return config && config.enabled === false
}

type ProxyServerConfig = DisabledProxyServerConfig | ActualProxyServerConfig

/**
 * The proxy server configuration.
 *
 * TODO: allow for non-default configs
 *
 */
import defaultProxyServerConfig = require('@kui-shell/proxy/lib/defaultProxyServerConfig.json')
const proxyServerConfig: ProxyServerConfig = config['proxyServer'] || defaultProxyServerConfig
debug('proxyServerConfig', proxyServerConfig)

/** we may want to directly evaluate certain commands in the browser */
const directEvaluator = new DirectReplEval()

function renderDom(content: ElementMimic): HTMLElement {
  const dom = document.createElement(content.nodeType)

  if (content.className.length > 0) {
    dom.className = content.className
  } else if (content.classList.classList.length > 0) {
    content.classList.classList.forEach(_ => {
      dom.classList.add(_)
    })
  }

  // TODO attrs

  if (content.innerText) {
    dom.innerText = content.innerText
  } else if (content.children && content.children.length > 0) {
    content.children.forEach(child => {
      dom.appendChild(renderDom(child))
    })
  }

  return dom
}

/**
 * A repl.exec implementation that proxies to the packages/proxy container
 *
 */
class ProxyEvaluator implements ReplEval {
  name = 'ProxyEvaluator'

  async apply(command: string, execOptions: ExecOptions, evaluator: Evaluator, args: EvaluatorArgs) {
    debug('apply', evaluator)
    debug('execOptions', execOptions)

    if (
      isDisabled(proxyServerConfig) ||
      (isCommandHandlerWithEvents(evaluator) &&
        evaluator.options &&
        (evaluator.options.inBrowserOk || evaluator.options.needsUI))
    ) {
      debug('delegating to direct evaluator')
      return directEvaluator.apply(command, execOptions, evaluator, args)
    } else {
      const execOptionsForInvoke = withLanguage(
        Object.assign({}, execOptions, {
          isProxied: true,
          cwd: process.env.PWD,
          env: process.env,
          credentials: getValidCredentials(),
          tab: undefined, // override execOptions.tab here since the DOM doesn't serialize, see issue: https://github.com/IBM/kui/issues/1649
          rawResponse: true // we will post-process the response
        })
      )

      if (command !== 'bash websocket open') {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
          const uuid = uuidgen()
          debug('delegating to proxy websocket', command, uuid)

          const channel = await getSessionForTab(args.tab)

          const msg = {
            type: 'request',
            cmdline: command,
            uuid,
            cwd: process.env.PWD,
            execOptions: execOptionsForInvoke
          }
          channel.send(JSON.stringify(msg))

          const MARKER = '\n'
          let raw = ''
          const onMessage = (data: string) => {
            // debug('raw', uuid, data)
            raw += data

            if (data.endsWith(MARKER)) {
              raw += data

              try {
                raw
                  .split(MARKER)
                  .filter(_ => _)
                  .forEach(_ => {
                    const response: {
                      uuid: string
                      response: {
                        code?: number
                        statusCode?: number
                        message?: string
                        stack?: string
                        content: string | HTMLElement | ElementMimic
                      }
                    } = JSON.parse(_)
                    if (response.uuid === uuid) {
                      channel.removeEventListener('message', onMessage)
                      const code = response.response.code || response.response.statusCode
                      if (code !== undefined && code !== 200) {
                        debug('rejecting', response)
                        if (UsageError.isUsageError(response.response)) {
                          // e.g. k get -h
                          reject(response.response)
                        } else {
                          // e.g. k get pod nonExistantName
                          const err: CodedError = new Error(response.response.message)
                          err.stack = response.response.stack
                          err.code = err.statusCode = code
                          err.body = response.response
                          reject(err)
                        }
                      } else if (ElementMimic.isFakeDom(response.response)) {
                        debug('rendering fakedom', response.response)
                        resolve(renderDom(response.response))
                      } else if (ElementMimic.isFakeDom(response.response.content)) {
                        debug('rendering fakedom content', response.response.content)
                        response.response.content = renderDom(response.response.content)
                        resolve(response.response)
                      } else {
                        debug('response', response)
                        resolve(response.response)
                      }
                    }
                  })
              } catch (err) {
                console.error('error handling response', raw)
                console.error(err)
                reject(new Error('Internal Error'))
              }
            }
          }
          channel.on('message', onMessage)
        })
      }

      debug('delegating to proxy exec', command)
      const body = {
        command,
        execOptions: execOptionsForInvoke
      }
      debug('sending body', body)

      try {
        const invokeRemote = () =>
          new Promise(resolve => {
            const proxyURL = new URL(proxyServerConfig.url, window.location.origin)
            const xhr = new XMLHttpRequest()
            xhr.open('POST', proxyURL.href)
            xhr.responseType = 'json'
            xhr.withCredentials = true
            xhr.setRequestHeader('Content-Type', 'application/json')
            xhr.setRequestHeader('Accept', 'application/json')
            xhr.addEventListener('error', () => {
              console.error('error in xhr', xhr)
              resolve(xhr.response || 'Internal Error')
            })
            xhr.addEventListener('load', () => {
              resolve({
                statusCode: xhr.status,
                body: xhr.response.response
              })
            })
            // proxyServerConfig.needleOptions
            xhr.send(JSON.stringify(body))
          })

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response: { statusCode: number; body: Record<string, any> | string | ElementMimic } = await (window[
          'webview-proxy'
        ]
          ? window['webview-proxy'](body)
          : invokeRemote())

        debug('response', response)

        if (response.statusCode !== 200) {
          debug('rethrowing non-200 response', response)
          // to trigger the catch just below
          const err: CodedError = new Error(response.body as string)
          err.code = err.statusCode = response.statusCode
          err.body = response.body
          throw err
        } else {
          /*
           * try to unwind the fakedom for now
           * TODO: we need a type guard to prevent fakedom object being passed to the proxy executor
           * see related issue: https://github.com/IBM/kui/issues/1687
           *
           */
          if (ElementMimic.isFakeDom(response.body)) {
            debug('catch a fakedom, try to unwind')
            if (response.body.innerText) {
              return response.body.innerText
            } else {
              const err = new Error('Internal Error: Fakedom objects are not accepted by proxy executor')
              err['code'] = 500
              throw err
            }
          }

          return response.body
        }
      } catch (err) {
        debug(
          'proxy execution resulted in an error, recasting to local exception',
          err.code,
          err.message,
          err.body,
          err
        )

        if (err.body && UsageError.isUsageError(err.body)) {
          debug('the error is a usage error, rethrowing as such')
          throw new UsageError({
            message: err.body.raw.message,
            usage: err.body.raw.usage,
            code: err.body.code,
            extra: err.body.extra
          })
        } else {
          const error = new Error(
            (err.body && err.body.message) ||
              (typeof err.body === 'string' ? err.body : err.message || 'Internal error')
          )
          error['code'] = error['statusCode'] = (err.body && err.body.code) || err.code || err.statusCode
          debug('using this code', error['code'])
          throw error
        }
      }
    }
  }
}

export default ProxyEvaluator
