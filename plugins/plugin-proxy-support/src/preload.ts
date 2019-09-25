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

import * as Debug from 'debug'

import { Capabilities } from '@kui-shell/core'

import { isDisabled } from './lib/proxy-executor'

const debug = Debug('plugins/proxy-support/preload')

/**
 * This is the capabilities registraion
 *
 */
export const registerCapability: Capabilities.Registration = async () => {
  if (Capabilities.inBrowser()) {
    const {
      Settings: { config }
    } = await import('@kui-shell/core')
    debug('config', config)

    if (!isDisabled(config['proxyServer'])) {
      // notify the Capabilities manager that we have extended the
      // capabilities of Kui
      Capabilities.assertHasProxy()
      Capabilities.assertLocalAccess()
    }
  }
}

/**
 * This is the module
 *
 */
export default async () => {
  if (Capabilities.inBrowser()) {
    const {
      Settings: { config }
    } = await import('@kui-shell/core')
    debug('config', config)

    if (!isDisabled(config['proxyServer'])) {
      const ProxyEvaluator = (await import('./lib/proxy-executor')).default
      const { REPL } = await import('@kui-shell/core')

      debug('attempting to establish our proxy executor')
      REPL.setEvaluatorImpl(new ProxyEvaluator())
    }
  }
}
