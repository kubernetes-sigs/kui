/*
 * Copyright 2019 The Kubernetes Authors
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
import { v4 as uuidgen } from 'uuid'

import {
  getValidCredentials,
  Arguments,
  Evaluator,
  ExecOptions,
  KResponse,
  isCommandHandlerWithEvents,
  ParsedOptions,
  withLanguage,
  UsageError,
  isUsageError,
  CodedError,
  ReplEval,
  DirectReplEval,
  ElementMimic
} from '@kui-shell/core'

import { isDisabled, config } from './config'

import { getSessionForTab } from '@kui-shell/plugin-bash-like'

const debug = Debug('plugins/proxy-support/executor')

/** we may want to directly evaluate certain commands in the browser */
const directEvaluator = new DirectReplEval()

function renderDom(content: ElementMimic): HTMLElement {
  const dom = document.createElement(content.nodeType || 'span')

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

  /**
   * The proxy server configuration.
   *
   */
  private readonly proxyServerConfig = config().then(_ => _.proxyServer)

  async apply<T extends KResponse, O extends ParsedOptions>(
    command: string,
    execOptions: ExecOptions,
    evaluator: Evaluator<T, O>,
    args: Arguments<O>
  ): Promise<T> {
    debug('apply', evaluator)
    debug('execOptions', execOptions)

    const proxyServerConfig = await this.proxyServerConfig
    if (
      isDisabled(proxyServerConfig) ||
      (isCommandHandlerWithEvents(evaluator) && evaluator.options && !evaluator.options.requiresLocal)
    ) {
      debug('delegating to direct evaluator')
      return directEvaluator.apply(command, execOptions, evaluator, args)
    } else {
      const execOptionsForInvoke = withLanguage(
        Object.assign({}, execOptions, {
          block: undefined,
          nextBlock: undefined,
          isProxied: true,
          cwd: process.env.PWD,
          env:
            process.env && execOptions.env
              ? { ...process.env, ...execOptions.env }
              : execOptions.env
              ? execOptions.env
              : process.env,
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
          const isStreamingConsumer = execOptions.onInit !== undefined

          const msg = {
            type: 'request',
            cmdline: command,
            uuid,
            stream: isStreamingConsumer,
            cwd: process.env.PWD,
            execOptions: execOptionsForInvoke
          }

          const stdout = execOptions.onInit
            ? await execOptions.onInit({
                write: (data: string) => channel.send(JSON.stringify({ type: 'data', data, uuid })),
                xon: () => {
                  debug('xon requested on streaming proxy exec')
                  channel.send(JSON.stringify({ type: 'xon', uuid }))
                },
                xoff: () => {
                  debug('xoff requested on streaming proxy exec')
                  channel.send(JSON.stringify({ type: 'xoff', uuid }))
                },
                abort: () => {
                  debug('abort requested on streaming proxy exec')
                  channel.send(JSON.stringify({ type: 'kill', uuid }))
                }
              })
            : undefined

          channel.send(JSON.stringify(msg))

          const MARKER = '\n'
          let raw = ''
          const onMessage = (msg: { data: string }) => {
            const { data } = msg
            // debug('raw', uuid, data)
            raw += data

            if (data.endsWith(MARKER)) {
              try {
                const toBeProcessed = raw
                raw = ''

                toBeProcessed
                  .split(MARKER)
                  .filter(_ => _)
                  .forEach(_ => {
                    const response:
                      | { type: 'chunk'; uuid: string; chunk: string }
                      | {
                          type: 'object'
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
                      if (response.type === 'chunk') {
                        // we got a streaming chunk back
                        stdout(response.chunk)
                        return
                      }

                      channel.removeEventListener('message', onMessage)
                      const code = response.response.code || response.response.statusCode

                      if (execOptions.onExit) {
                        execOptions.onExit(code)
                      }

                      if (code !== undefined && code !== 200) {
                        if (isUsageError(response.response)) {
                          // e.g. k get -h
                          debug('rejecting as usage error', response)
                          reject(response.response)
                        } else {
                          // e.g. k get pod nonExistantName
                          debug('rejecting as other error', response)
                          const err: CodedError = new Error(response.response.message)
                          err.stack = response.response.stack
                          err.code = code

                          // see https://github.com/IBM/kui/issues/3318
                          err.statusCode =
                            response.response.statusCode !== undefined ? response.response.statusCode : code

                          err.body = response.response
                          reject(err)
                        }
                      } else if (ElementMimic.isFakeDom(response.response)) {
                        debug('rendering fakedom', response.response)
                        resolve(renderDom(response.response) as T)
                      } else if (ElementMimic.isFakeDom(response.response.content)) {
                        debug('rendering fakedom content', response.response.content)
                        response.response.content = renderDom(response.response.content)
                        resolve(response.response as T)
                      } else if (response.response.message && response.response.stack) {
                        const err = new Error(response.response.message)
                        err.stack = response.response.stack
                        reject(err)
                      } else {
                        debug('response', response)
                        resolve(response.response as T)
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
        const proxyHref = /KUI_PROXY_COHOSTED=true/.test(document.cookie)
          ? `${window.location.pathname.replace(/index\.html/, '')}exec`
          : new URL(proxyServerConfig.url, window.location.origin).href
        debug('proxy server url', proxyHref)

        const invokeRemote = () =>
          new Promise(resolve => {
            const xhr = new XMLHttpRequest()
            xhr.open('POST', proxyHref)
            xhr.responseType = 'json'
            xhr.withCredentials = true
            xhr.setRequestHeader('Content-Type', 'application/json')
            xhr.setRequestHeader('Accept', 'application/json')
            xhr.addEventListener('error', () => {
              if (xhr.readyState === 4 && xhr.status === 0) {
                // this means connection refused or other inability to connect to the proxy server
                resolve({
                  statusCode: 503,
                  code: 503,
                  body: 'Connection refused'
                })
              } else {
                console.error('error in xhr', xhr.status, xhr)
                resolve(xhr.response || 'Internal Error')
              }
            })
            xhr.addEventListener('load', () => {
              if (xhr.status === 401 || xhr.status === 403) {
                alert('You do not have access to this resource')
                const { homepage } = require('@kui-shell/client/package.json')
                if (homepage) {
                  window.location.href = homepage
                } else {
                  // some default...
                  window.location.href = 'https://google.com'
                }
              }
              resolve({
                statusCode: xhr.status,
                body: xhr.response ? xhr.response.response : xhr.statusText
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

        // debug('response', response)

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
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              return (response.body.innerText as any) as T
            } else {
              const err = new Error('Internal Error: Fakedom objects are not accepted by proxy executor')
              err['code'] = 500
              throw err
            }
          }

          return response.body as T
        }
      } catch (err) {
        debug(
          'proxy execution resulted in an error, recasting to local exception',
          err.code,
          err.message,
          err.body,
          err
        )

        if (err.body && isUsageError(err.body)) {
          debug('the error is a usage error, rethrowing as such')
          throw new UsageError({
            message: err.body.raw.message,
            usage: err.body.raw.usage,
            code: err.body.code,
            extra: err.body.extra
          })
        } else {
          const error: CodedError = new Error(
            (err.body && err.body.message) ||
              (typeof err.body === 'string' ? err.body : err.message || 'Internal error')
          )
          error.code = error.statusCode = (err.body && err.body.code) || err.code || err.statusCode
          debug('using this code', error.code)
          throw error
        }
      }
    }
  }
}

export default ProxyEvaluator
