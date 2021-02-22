/*
 * Copyright 2017-18 The Kubernetes Authors
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
const debug = Debug('webapp/electron-events')
debug('loading')

import { IpcRenderer } from 'electron'

import { pexecInCurrentTab } from './tab'
import { inElectron, Media, setMedia } from '../core/capabilities'

/**
 * Listen for the main process telling us to execute a command
 *
 */
const listenForRemoteEvents = (ipcRenderer: IpcRenderer) => {
  debug('listenForRemoteEvents')

  if (inElectron() && ipcRenderer) {
    ipcRenderer.on('/repl/pexec', async (event, { command }) => {
      debug('remote pexec', command)
      const { pexec } = await import('../repl/exec')
      return pexec(command)
    })

    ipcRenderer.on('/repl/qexec', async (event, { command }) => {
      debug('remote qexec', command)
      return pexecInCurrentTab(command, undefined, false, true)
    })
  }
}

/**
 * Set up the IPC channel to the main process
 *
 */
const initializeIPC = async () => {
  debug('initializeIPC')

  const electron = await import('electron')
  const ipcRenderer = electron.ipcRenderer
  setMedia(Media.Electron)
  return { ipcRenderer }
}

/**
 * Send a synchronous message to the main process
 *
 */
export const tellMain = (
  message: string | Record<string, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
  channel?: 'asynchronous-message' | 'synchronous-message'
) =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise(async (resolve, reject) => {
    const electron = await import('electron')
    const ipcRenderer = electron.ipcRenderer

    ipcRenderer[channel === 'asynchronous-message' ? 'send' : 'sendSync'](
      channel || 'synchronous-message',
      typeof message === 'string' ? JSON.stringify({ operation: message }) : JSON.stringify(message)
    )

    if (channel === 'asynchronous-message') {
      console.log('listening')
      ipcRenderer.on('asynchronous-reply', (event, response) => {
        console.log('got response', response)
        if (response === 'true') {
          resolve(true)
        } else {
          reject(response)
        }
      })
    } else {
      resolve(true)
    }
  })

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const init = (prefs = {}) => {
  return initializeIPC().then(({ ipcRenderer }) => {
    listenForRemoteEvents(ipcRenderer)
  })
}
