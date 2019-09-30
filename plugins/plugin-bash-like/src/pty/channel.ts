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

import * as EventEmitter from 'events'

import { onConnection, disableBashSessions } from './server'

const debug = Debug('plugins/bash-like/pty/channel')

export interface Channel {
  /** is the channel alive? */
  isAlive?: boolean

  /** Forcibly close the channel */
  close: () => void

  /** Send a message over the channel */
  send: (msg: string | Buffer) => void

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on: (eventType: string, handler: any) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  removeEventListener: (eventType: string, handler: any) => void
  readyState: number
}

export enum ReadyState {
  CONNECTING,
  OPEN,
  CLOSING,
  CLOSED
}

/**
 * Channel impl for direct, in-electron communication
 *
 */
export class InProcessChannel extends EventEmitter implements Channel {
  readyState = ReadyState.OPEN

  private otherSide: InProcessChannel

  constructor(otherSide?: InProcessChannel) {
    super()

    if (otherSide) {
      this.otherSide = otherSide
    } else {
      this.otherSide = new InProcessChannel(this)
    }
  }

  async init() {
    debug('IPC init')
    await onConnection(await disableBashSessions())(this.otherSide)

    // emit 'open' on our side
    this.emit('open')
    debug('IPC init done')
  }

  /** Forcibly close the channel */
  close() {
    // no-op
  }

  /** emit 'message' on the other side */
  send(msg: string) {
    if (this.otherSide.readyState === ReadyState.OPEN) {
      try {
        this.otherSide.emit('message', msg)
      } catch (err) {
        console.error(err)
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  removeEventListener(eventType: string, handler: any) {
    this.off(eventType, handler)
  }
}

/**
 * Thin wrapper on top of WebView postMessage
 *
 */
export class WebViewChannelRendererSide extends EventEmitter implements Channel {
  readyState = ReadyState.OPEN

  private channelId: number

  async init() {
    debug('IPC init')
    const { body } = await window['webview-proxy']({
      command: 'init',
      provider: 'pty',
      channel: this
    })
    this.channelId = body.channelId
    console.log(`CHANNELID ${this.channelId}`)

    // emit 'open' on our side
    this.emit('open')
    debug('IPC init done')
  }

  /** Forcibly close the channel */
  close() {
    this.emit('exit')
  }

  /** emit 'message' on the other side */
  send(body: string) {
    console.log(`SEND ${this.channelId}`)
    window['webview-proxy']({
      command: 'send',
      provider: 'pty',
      channelId: this.channelId,
      body
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  removeEventListener(eventType: string, handler: any) {
    this.off(eventType, handler)
  }
}
