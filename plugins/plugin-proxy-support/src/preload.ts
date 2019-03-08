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
const debug = Debug('plugins/proxy-support/preload')

import { inBrowser, assertLocalAccess } from '@kui-shell/core/core/capabilities'
import { PluginRequire, PreloadRegistration } from '@kui-shell/core/models/plugin'
import { setEvaluatorImpl } from '@kui-shell/core/core/repl'
import { config } from '@kui-shell/core/core/settings'

import ProxyEvaluator from './lib/proxy-executor'

/**
 * This is the module
 *
 */
const registration: PreloadRegistration = async (commandTree, prequire: PluginRequire, options?) => {
  debug('config', config)

  if (inBrowser() && config['needsProxy']) {
    debug('attempting to establish our proxy executor')
    setEvaluatorImpl(new ProxyEvaluator())
    assertLocalAccess()
  }
}

export default registration
