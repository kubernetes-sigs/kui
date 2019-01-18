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

const debug = require('debug')('main/protocol-handlers')

import { app, protocol, RegisterStringProtocolRequest, InterceptHttpProtocolRequest, RedirectRequest } from 'electron'

import { URL } from 'url'

// TODO externalize
const scheme = 'kui'

/**
 * Initialize protocol handlers
 *
 */
export default (createWindow: ((argv: Array<string>) => void)) => {
  debug('init')

  protocol.registerStandardSchemes([scheme])

  if (!app.setAsDefaultProtocolClient(scheme)) {
    debug('error registering as default protocol client', scheme)
  } else {
    debug('successfully registered as default protocol client', scheme)
  }

  app.once('ready',() => {
    debug('registering protocol handlers')
    // protocol.registerHttpProtocol(scheme, handleRequestWithHttp)
    protocol.registerStringProtocol(scheme, handleRequestWithString)
  })

  app.on('open-url', function (event, urlString: string) {
    debug('open-url', urlString)
    event.preventDefault()

    const url = new URL(urlString)
    debug('url', url)
    const command = url.hostname
    if (command === 'exec') {
      const argv = url.pathname.split(/\//).slice(1)
      debug('executing command in new window', argv)
      createWindow(argv)
    }
  })
}

/**
 * Handle receipt of a scheme:// request
 *
 */
const handleRequestWithHttp = (request: InterceptHttpProtocolRequest, callback: (redirectRequest: RedirectRequest) => void) => {
  debug('handleRequestWithHttp')
}

/**
 * Handle receipt of a scheme:// request
 *
 */
const handleRequestWithString = (request: RegisterStringProtocolRequest, callback: (data?: string) => void) => {
  debug('handleRequestWithString', request)

  callback('hi')
}
