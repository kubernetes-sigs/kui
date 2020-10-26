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

import { type as osType } from 'os'
import { Agent as HttpAgent } from 'http'
import { Agent as HttpsAgent } from 'https'

import { inBrowser } from '@kui-shell/core'

import agent from './agent'

const isLinux = osType() === 'Linux'
const { userAgent } = require('@kui-shell/client/config.d/client.json')

interface ClientOptions {
  timeout?: number
  agent?: HttpAgent | HttpsAgent
  'User-Agent'?: string
  noUserAgent?: boolean
}

const options: ClientOptions = {}

if (isLinux) {
  // options.forever = true
  options.timeout = 5000
  options.agent = agent()
}

if (userAgent && !process.env.TEST_SPACE && !process.env.TRAVIS) {
  // install a User-Agent header, except when running tests
  options['User-Agent'] = userAgent
}

if (inBrowser()) {
  options.noUserAgent = true
}

export default options
