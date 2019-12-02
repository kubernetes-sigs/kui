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

import Debug from 'debug'
import * as EventEmitter from 'events'
import { ChildProcess } from 'child_process'

import { ExitHandler, onConnection } from './server'
import { Channel, ReadyState } from './channel'

const debugE = Debug('plugins/bash-like/pty/stdio-channel-proxy-stderr')
const debugW = Debug('plugins/bash-like/pty/stdio-channel-proxy')
const debugK = Debug('plugins/bash-like/pty/stdio-channel-kui')

const MARKER = '\n'

function heartbeat(this: Channel) {
  debugW('heartbeat')
  this.isAlive = true
}

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

  public async init(child: ChildProcess, pollInterval = 30000) {
    debugW('StdioChannelWebsocketSide.init')

    this.wss.on('error', (err: Error) => {
      debugW('websocket error', err)
    })

    this.wss.on('connection', (ws: Channel) => {
      debugW('got connection')
      this.ws = ws

      // upstream client has sent data downstream; forward it to the subprocess
      ws.on('message', (data: string) => {
        debugW('forwarding message downstream')
        child.stdin.write(`${data}${MARKER}`)
      })

      // on pong response, indicate we remain alive
      ws.on('pong', heartbeat)

      ws.on('close', () => {
        debugW('killing child process, because client connection is dead')
        child.kill()
      })
    })

    const self = this // eslint-disable-line @typescript-eslint/no-this-alias
    setInterval(function ping() {
      self.wss['clients'].forEach(function each(ws) {
        if (ws.isAlive === false) {
          debugW('killing child process, because client connection did not respond to ping')
          child.kill()
          return ws.terminate()
        }

        // assume it is dead until we get a pong
        ws.isAlive = false
        ws.ping(() => {
          // intentional no-op
        })
      })
    }, pollInterval)

    child.on('exit', (code: number) => {
      debugW('child exit', code)
      this.emit('exit', code)
    })

    child.stderr.on('data', (data: Buffer) => {
      if (data.length > 0) {
        debugE(data.toString())
      }
    })

    // underlying pty has emitted data from the subprocess
    let pending
    child.stdout.on('data', (data: Buffer) => {
      const msg = data.toString()
      if (!msg.endsWith(MARKER)) {
        if (!pending) {
          pending = msg
        } else {
          pending += msg
        }
      } else {
        this.send(pending ? `${pending}${msg}` : msg)
        pending = undefined
      }
    })
  }

  /** Forcibly close the channel */
  public close() {
    debugW('closing stdio channel')
    this.emit('exit')
  }

  /** emit 'message' on the other side */
  public send(msg: string) {
    debugW('send', this.readyState === ReadyState.OPEN)

    if (msg === `open${MARKER}`) {
      this.readyState = ReadyState.OPEN

      // this signals exec.js that the websocket is ready; see channel.once('open', ...)
      this.emit('open')
    } else if (this.readyState === ReadyState.OPEN) {
      msg
        .split(MARKER)
        .filter(_ => _)
        .forEach(_ => {
          debugW('forwarding child output upstream')
          this.ws.send(`${_}${MARKER}`)
        })
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
      data
        .toString()
        .split(MARKER)
        .filter(_ => _)
        .forEach(_ => {
          debugK('input', _)
          this.emit('message', _)
        })
    })

    this.send('open')
  }

  /** Forcibly close the channel */
  public close() {
    debugW('closing stdio channel')
    this.emit('close')
  }

  /** emit 'message' on the other side */
  public send(msg: string) {
    if (this.readyState === ReadyState.OPEN) {
      // debugK('send', msg)
      process.stdout.write(`${msg}${MARKER}`)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public removeEventListener(eventType: string, handler: any) {
    this.off(eventType, handler)
  }
}
