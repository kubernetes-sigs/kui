/*
 * Copyright 2021 The Kubernetes Authors
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

/**
 * This file defines a channel between the Electron renderer process
 * and Electron main process.
 *
 */

import Debug from 'debug'
import { EventEmitter } from 'events'
import { IpcMain, IpcRenderer, WebContents } from 'electron'

import { Channel, ReadyState } from './channel'
import { onConnection, disableBashSessions } from './server'

interface Args {
  execUUID: string
}

const debugMain = Debug('plugin-bash-like/pty/electron/main')
const debugRenderer = Debug('plugin-bash-like/pty/electron/renderer')

function messageChannel(execUUID) {
  return `/plugin-bash-like/pty/message/${execUUID}`
}

class ElectronMainSideChannel extends EventEmitter implements Channel {
  /** is the channel alive? */
  public readonly isAlive = true

  public readonly readyState = ReadyState.OPEN

  private ipcMain: IpcMain
  private otherSide: WebContents

  private messageChannel: string

  private handleMessage = (_, msg: string) => {
    // debugMain('got message', msg)
    this.emit('message', msg)
  }

  public async init(args: Args, otherSide: WebContents) {
    debugMain('main side init', args.execUUID)

    const { ipcMain } = await import('electron')
    this.ipcMain = ipcMain
    this.otherSide = otherSide

    this.messageChannel = messageChannel(args.execUUID)
    ipcMain.on(this.messageChannel, this.handleMessage)

    await disableBashSessions()
    await onConnection(() => {
      this.ipcMain.off(this.messageChannel, this.handleMessage)
    })(this)
  }

  /** Forcibly close the channel */
  public close() {
    this.emit('exit')
  }

  /** Send a message over the channel */
  public send(msg: string | Buffer) {
    this.otherSide.send(this.messageChannel, msg)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public removeEventListener(eventType: string, handler: any) {
    this.off(eventType, handler)
  }
}

export default class ElectronRendererSideChannel extends EventEmitter implements Channel {
  /** is the channel alive? */
  public readonly isAlive = true

  public readonly readyState = ReadyState.OPEN

  private ipcRenderer: IpcRenderer
  private messageChannel: string

  private handleMessage = (_, msg: string) => {
    this.emit('message', msg)
  }

  public async init(execUUID: string) {
    const { ipcRenderer } = await import('electron')
    this.ipcRenderer = ipcRenderer
    debugRenderer('renderer side init')

    this.messageChannel = messageChannel(execUUID)

    ipcRenderer.once(`/exec/response/${execUUID}`, (_, _msg: string) => {
      const msg = JSON.parse(_msg)
      debugRenderer('renderer side init exec response', msg)
      if (msg.returnValue === true) {
        this.ipcRenderer.on(this.messageChannel, this.handleMessage)
        this.emit('open')
      }
    })

    ipcRenderer.send(
      '/exec/invoke',
      JSON.stringify({
        module: 'plugin-bash-like',
        main: 'initMainPty',
        hash: execUUID,
        args: {
          execUUID
        }
      })
    )
  }

  /** Forcibly close the channel */
  public close() {
    this.send('exit')
    this.ipcRenderer.off(this.messageChannel, this.handleMessage)
  }

  /** Send a message over the channel */
  public send(msg: string | Buffer) {
    this.ipcRenderer.send(this.messageChannel, msg.toString())
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public removeEventListener(eventType: string, handler: any) {
    this.off(eventType, handler)
  }
}

export async function initMainPty(args: Args, otherSide: WebContents) {
  debugMain('initMainPty', args)
  try {
    await new ElectronMainSideChannel().init(args, otherSide)
    return true
  } catch (err) {
    console.error('Error starting up pty', err)
    return false
  }
}
