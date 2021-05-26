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

import { EventEmitter } from 'events'
import { IpcMain, IpcRenderer, WebContents } from 'electron'

import { Channel, ReadyState } from './channel'
import { onConnection, disableBashSessions } from './server'

interface Args {
  execUUID: string
}

function messageChannelFor(execUUID: string) {
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
    this.emit('message', msg)
  }

  public async init(args: Args, otherSide: WebContents) {
    const { ipcMain } = await import('electron')
    this.ipcMain = ipcMain
    this.otherSide = otherSide

    this.messageChannel = messageChannelFor(args.execUUID)
    ipcMain.on(this.messageChannel, this.handleMessage)

    await disableBashSessions()
    await onConnection(() => {
      try {
        this.ipcMain.off(this.messageChannel, this.handleMessage)
      } catch (err) {
        console.error('Error turning off PTY events', err)
      }
    })(this)
  }

  /** Forcibly close the channel */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public close() {}

  /** Send a message over the channel */
  public send(msg: string | Buffer) {
    try {
      if (!this.otherSide.isDestroyed()) {
        this.otherSide.send(this.messageChannel, msg)
      }
    } catch (err) {
      console.error('Error sending PTY output to renderer', err)
    }
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
    console.error('renderer side init', execUUID)

    this.messageChannel = messageChannelFor(execUUID)

    window.addEventListener('beforeunload', () => {
      this.send(JSON.stringify({ type: 'kill', uuid: execUUID }))
      this.ipcRenderer.off(this.messageChannel, this.handleMessage)
    })

    ipcRenderer.once(`/exec/response/${execUUID}`, (_, _msg: string) => {
      const msg = JSON.parse(_msg)
      console.error('renderer side init exec response', msg)
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
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public close() {}

  /** Send a message over the channel */
  public send(msg: string | Buffer) {
    try {
      this.ipcRenderer.send(this.messageChannel, msg.toString())
    } catch (err) {
      console.error('Error sending PTY message to main process', err)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public removeEventListener(eventType: string, handler: any) {
    this.off(eventType, handler)
  }
}

export async function initMainPty(args: Args, otherSide: WebContents) {
  try {
    await new ElectronMainSideChannel().init(args, otherSide)
    return true
  } catch (err) {
    console.error('Error starting up pty', err)
    return false
  }
}
