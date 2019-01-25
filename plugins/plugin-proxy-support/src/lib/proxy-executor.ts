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

import * as Debug from 'debug'
const debug = Debug('plugins/proxy-support/executor')

import { IEvaluator, DirectEvaluator } from '@kui-shell/core/core/repl'
import { getValidCredentials } from '@kui-shell/core/core/capabilities'
import { IExecOptions, DefaultExecOptions } from '@kui-shell/core/models/execOptions'

import * as needle from 'needle'

/**
 * The proxy server configuration.
 *
 * TODO: allow for non-default configs
 *
 */
import defaultProxyServerConfig = require('@kui-shell/proxy/lib/defaultProxyServerConfig.json')
const proxyServerConfig = defaultProxyServerConfig

/** we may want to directly evaluate certain commands in the browser */
const directEvaluator = new DirectEvaluator()

/**
 * A repl.exec implementation that proxies to the packages/proxy container
 *
 */
class ProxyEvaluator implements IEvaluator {
  name = 'ProxyEvaluator'

  async apply (command: string, execOptions: IExecOptions, evaluator, args) {
    debug('apply', evaluator)

    if (evaluator.options && (evaluator.options.inBrowserOK || evaluator.options.needsUI)) {
      debug('delgating to direct evaluator')
      return directEvaluator.apply(command, execOptions, evaluator, args)
    } else {
      debug('delegating to proxy evaluator', getValidCredentials())
      const body = {
        command,
        execOptions: Object.assign({}, execOptions, {
          isProxied: true,
          credentials: getValidCredentials(),
          rawResponse: true // we will post-process the response
        })
      }
      debug('sending body', body)

      try {
        const response = await needle('post',
                                      proxyServerConfig.url,
                                      body,
                                      Object.assign({ json: true }, proxyServerConfig.needleOptions))
        debug('response', response)
        return response.body
      } catch (err) {
        debug('proxy execution resulted in an error, recasting to local exception', err.code, err.message, err.body, err)

        const error = new Error((err.body && err.body.message) || err.message)
        err['code'] = (err.body && err.body.code) || err.code
        throw error
      }
    }
  }
}

export default ProxyEvaluator
