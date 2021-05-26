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

import { Tab } from '@kui-shell/core'
import { Channel } from './channel'

let _exiting = false
let _singleChannel: Promise<Channel> // share session across tabs see https://github.com/IBM/kui/issues/6453

/** Has the electron app already begun to terminate? */
export function isExiting() {
  return _exiting
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function invalidateCache(tab: Tab) {
  _singleChannel = undefined
}

/**
 * Return the session for the given tab
 *
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getSessionForTab(tab: Tab): Promise<Channel> {
  // debug('pty channel: get', tab.uuid)
  return _singleChannel
}

/**
 * Set it
 *
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function setChannelForTab(tab: Tab, channel: Promise<Channel>) {
  // debug('initializing pty channel: set')
  _singleChannel = channel

  // listen for the end of the world
  channel.then(chan => {
    // debug('initializing pty channel: success')
    window.addEventListener('beforeunload', () => {
      _exiting = true // prevent any stagglers re-establishing a channel
      chan.close()
    })
  })

  return _singleChannel
}
