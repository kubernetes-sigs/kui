/*
 * Copyright 2019-2020 The Kubernetes Authors
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

import { Channel } from './channel'
const debug = Debug('plugins/bash-like/pty/channel')

/**
 * Thin wrapper on top of browser WebSocket impl
 *
 */
class WebSocketChannel implements Channel {
  private readonly ws: WebSocket

  private readonly uid: number

  private readonly gid: number

  constructor(url: string, uid: number, gid: number) {
    debug('WebSocketChannel init', url)
    this.ws = new WebSocket(url)
    this.uid = uid
    this.gid = gid
  }

  /** Forcibly close the channel */
  close() {
    try {
      debug('closing websocket channel')
      this.ws.close()
    } catch (err) {
      console.error('Error in WebSocketChannel.close', err)
    }
  }

  send(msg: string) {
    // inject uid and gid into the payload
    const withUser = Object.assign(JSON.parse(msg), {
      uid: this.uid,
      gid: this.gid
    })
    // message from Kui proxy process that we are retransmitting to the browser
    try {
      return this.ws.send(JSON.stringify(withUser))
    } catch (err) {
      console.error('Error in WebSocketChannel.send', err)
    }
  }

  get readyState(): number {
    return this.ws.readyState
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  removeEventListener(eventType: string, handler: any) {
    try {
      this.ws.removeEventListener(eventType, handler)
    } catch (err) {
      console.error('Error in WebSocketChannel.removeEventListener', err)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on(eventType: string, handler: any) {
    try {
      switch (eventType) {
        // new Kui browser client
        case 'open':
          debug('WebSocketChannel: installing onopen handler')
          this.ws.addEventListener(eventType, handler)
          break

        // message from Kui browser client
        case 'message':
          debug('WebSocketChannel: installing onmessage handler')
          // this.onmessage = message => handler(message.data)
          this.ws.addEventListener(eventType, handler)
          break

        case 'error':
          debug('WebSocketChannel: installing onerror handler')
          this.ws.addEventListener(eventType, handler)
          break

        case 'close':
          debug('WebSocketChannel: installing onclose handler')
          this.ws.addEventListener(eventType, handler)
          break
      }
    } catch (err) {
      console.error('Error in WebSocketChannel.on', err)
    }
  }
}

export default WebSocketChannel
