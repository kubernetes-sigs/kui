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

import { Channel } from './channel'
const debug = Debug('plugins/bash-like/pty/channel')

/**
 * Thin wrapper on top of browser WebSocket impl
 *
 */
class WebSocketChannel extends WebSocket implements Channel {
  private readonly uid: number

  private readonly gid: number

  constructor(url: string, uid: number, gid: number) {
    debug('WebSocketChannel init', url)
    super(url, undefined /*, { rejectUnauthorized: false } */)
    this.uid = uid
    this.gid = gid
  }

  send(msg: string) {
    // inject uid and gid into the payload
    const withUser = Object.assign(JSON.parse(msg), {
      uid: this.uid,
      gid: this.gid
    })
    return super.send(JSON.stringify(withUser))
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on(eventType: string, handler: any) {
    switch (eventType) {
      case 'open':
        debug('WebSocketChannel: installing onopen handler')
        this.addEventListener(eventType, handler)
        break

      case 'message':
        debug('WebSocketChannel: installing onmessage handler')
        // this.onmessage = message => handler(message.data)
        this.addEventListener(eventType, message => handler(message.data))
        break

      case 'error':
        debug('WebSocketChannel: installing onerror handler')
        this.addEventListener(eventType, handler)
        break

      case 'close':
        debug('WebSocketChannel: installing onclose handler')
        this.addEventListener(eventType, handler)
        break
    }
  }
}

export default WebSocketChannel
