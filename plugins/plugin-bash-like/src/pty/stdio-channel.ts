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
import * as EventEmitter from 'events'
import { ChildProcess } from 'child_process'

import { ExitHandler, onConnection } from './server'
import { Channel, ReadyState } from './channel'

const debugE = Debug('plugins/bash-like/pty/stdio-channel-kui-stderr')
const debugW = Debug('plugins/bash-like/pty/stdio-channel-proxy')
const debugK = Debug('plugins/bash-like/pty/stdio-channel-kui')

const MARKER = '\n'

/**
 * stdin/stdout channel
 *
 */
export class StdioChannelWebsocketSide extends EventEmitter implements Channel {
  public readyState = ReadyState.CONNECTING

  private ws: Channel

  private readonly wss: EventEmitter

  public constructor(wss: EventEmitter) {
    super()
    this.wss = wss
  }

  public async init(child: ChildProcess) {
    debugW('StdioChannelWebsocketSide.init')

    this.wss.on('connection', (ws: Channel) => {
      debugW('got connection')
      this.ws = ws

      // upstream client has sent data downstream; forward it to the subprocess
      ws.on('message', (data: string) => {
        debugW('forwarding message downstream', data)
        child.stdin.write(data)
      })
    })

    child.on('exit', (code: number) => {
      debugW('child exit', code)
    })

    child.stderr.on('data', (data: Buffer) => {
      debugE(data.toString())
    })

    // underlying pty has emitted data from the subprocess
    child.stdout.on('data', (data: Buffer) => {
      debugW('forwarding child output upstream', data.toString())
      this.send(data.toString())
    })
  }

  /** emit 'message' on the other side */
  public send(msg: string) {
    debugW('send', this.readyState === ReadyState.OPEN)

    if (msg === `open${MARKER}`) {
      this.readyState = ReadyState.OPEN
      this.emit('open')
    } else if (this.readyState === ReadyState.OPEN) {
      msg
        .split(MARKER)
        .filter(_ => _)
        .forEach(_ => this.ws.send(_))
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public removeEventListener(eventType: string, handler: any) {
    this.off(eventType, handler)
  }
}

/**
 * stdin/stdout channel
 *
 */
export class StdioChannelKuiSide extends EventEmitter implements Channel {
  public readyState = ReadyState.OPEN

  public async init(onExit: ExitHandler) {
    debugK('StdioChannelKuiSide.init')

    // await onConnection(await disableBashSessions())(this)
    await onConnection(onExit)(this)

    process.stdin.on('data', (data: Buffer) => {
      debugK('input', data.toString())
      this.emit('message', data)
    })

    this.send('open')
  }

  /** emit 'message' on the other side */
  public send(msg: string) {
    if (this.readyState === ReadyState.OPEN) {
      debugK('send', msg)
      process.stdout.write(`${msg}${MARKER}`)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public removeEventListener(eventType: string, handler: any) {
    this.off(eventType, handler)
  }
}
