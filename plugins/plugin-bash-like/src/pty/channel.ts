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
const debug = Debug('plugins/bash-like/pty/channel')

// import * as WebSocket from 'ws'
import * as EventEmitter from 'events'

import { onConnection, disableBashSessions } from './server'

export interface Channel {
  send: (msg: string) => void
  on: (eventType: string, handler: any) => void
  removeEventListener: (eventType: string, handler: any) => void
  readyState: number
}

/**
 * Channel impl for direct, in-electron communication
 *
 */
export class InProcessChannel extends EventEmitter implements Channel {
  readyState = WebSocket.OPEN
  private otherSide: InProcessChannel

  constructor (otherSide?: InProcessChannel) {
    super()

    if (otherSide) {
      this.otherSide = otherSide
    } else {
      this.otherSide = new InProcessChannel(this)
    }
  }

  async init () {
    debug('IPC init')
    await onConnection(await disableBashSessions())(this.otherSide)

    // emit 'open' on our side
    this.emit('open')
    debug('IPC init done')
  }

  /** emit 'message' on the other side */
  send (msg: string) {
    if (this.otherSide.readyState === WebSocket.OPEN) {
      try {
        this.otherSide.emit('message', msg)
      } catch (err) {
        console.error(err)
      }
    }
  }

  removeEventListener (eventType: string, handler: any) {
    this.off(eventType, handler)
  }
}

/**
 * Thin wrapper on top of browser WebSocket impl
 *
 */
export class WebSocketChannel extends WebSocket implements Channel {
  constructor (url: string) {
    debug('WebSocketChannel init', url)
    super(url, undefined /*, { rejectUnauthorized: false } */)
  }

  on (eventType: string, handler: any) {
    switch (eventType) {
      case 'open':
        debug('WebSocketChannel: installing onopen handler')
        this.onopen = handler
        break

      case 'message':
        debug('WebSocketChannel: installing onmessage handler')
        this.onmessage = message => handler(message.data)
        break

      case 'error':
        debug('WebSocketChannel: installing onerror handler')
        this.onerror = handler
        break

      case 'close':
        debug('WebSocketChannel: installing onclose handler')
        this.onclose = handler
        break
    }
  }
}
