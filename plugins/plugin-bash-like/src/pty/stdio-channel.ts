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

const debug = Debug('plugins/bash-like/pty/stdio-channel')

/**
 * stdin/stdout channel
 *
 */
export class StdioChannelWebsocketSide extends EventEmitter implements Channel {
  public readyState = ReadyState.CONNECTING

  private readonly wss: EventEmitter

  public constructor(wss: EventEmitter) {
    super()
    this.wss = wss
  }

  public async init(child: ChildProcess) {
    debug('StdioChannelWebsocketSide.init')

    child.stderr.on('data', (data: Buffer) => {
      debug(data.toString())
    })

    // underlying pty has emitted data from the subprocess
    child.stdout.on('data', (data: Buffer) => {
      this.send(data.toString())
    })

    // upstream client has sent data downstream; forward it to the subprocess
    this.wss.on('message', (data: string) => {
      child.stdin.write(data)
    })
  }

  /** emit 'message' on the other side */
  public send(msg: string) {
    if (msg === 'open') {
      this.readyState = ReadyState.OPEN
      this.emit('open')
    } else if (this.readyState === ReadyState.OPEN) {
      this.wss.emit('message', msg)
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
    debug('StdioChannelKuiSide.init')

    // await onConnection(await disableBashSessions())(this)
    await onConnection(onExit)(this)

    process.stdin.on('data', (data: Buffer) => {
      this.emit('message', data.toString())
    })

    this.send('open')
  }

  /** emit 'message' on the other side */
  public send(msg: string) {
    if (this.readyState === ReadyState.OPEN) {
      debug('send', msg)
      process.stdout.write(msg)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public removeEventListener(eventType: string, handler: any) {
    this.off(eventType, handler)
  }
}
