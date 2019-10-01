/*
 * Copyright 2017-18 IBM Corporation
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

import { IpcRenderer, Remote } from 'electron'

import { inElectron, Media, setMedia } from '../core/capabilities'
import { qexec, pexec } from '../core/repl'

/**
 * Listen for the main process telling us to execute a command
 *
 */
const listenForRemoteEvents = (ipcRenderer: IpcRenderer) => {
  debug('listenForRemoteEvents')

  if (inElectron() && ipcRenderer) {
    ipcRenderer.on('/repl/pexec', (event, { command }) => {
      debug('remote pexec', command)
      return pexec(command)
    })

    ipcRenderer.on('/repl/qexec', (event, { command }) => {
      debug('remote qexec', command)
      return qexec(command)
    })
  }
}

/**
 * Set up the IPC channel to the main process
 *
 */
const initializeIPC = async () => {
  debug('initializeIPC')

  try {
    const electron = await import('electron')
    const ipcRenderer = electron.ipcRenderer
    const remote = electron.remote
    if (!ipcRenderer || !remote) {
      debug('probably browser 1')
      setMedia(Media.Browser)
      document.body.classList.add('not-electron')
    } else {
      setMedia(Media.Electron)
      return { ipcRenderer, remote }
    }
  } catch (err) {
    debug('could not find electron')

    if (typeof document === 'undefined') {
      // then we're probably compiling the modules, without electron
      // installed; that's ok. the code below is protected for
      // the absence of ipcRenderer and remote
      debug('probably headless')
      setMedia(Media.Headless)
    } else {
      // otherwise, we're probably in webpack mode
      debug('probably browser 2')
      setMedia(Media.Browser)
      document.body.classList.add('not-electron')
    }
  }

  return {}
}

/**
 * Deal with full-screen changes; also note that we need to do a
 * one-time check on page load to see whether we're in full screen;
 * it'd be nice if there were a CSS :fullscreen selector for this :(
 *
 */
const listenForWindowEvents = (remote?: Remote) => {
  if (remote) {
    debug('listenForWindowEvents')

    if (remote.getCurrentWindow().isFullScreen()) {
      document.body.classList.add('fullscreen')
    }
    remote.getCurrentWindow().on('enter-full-screen', function() {
      document.body.classList.add('fullscreen')
    })
    remote.getCurrentWindow().on('leave-full-screen', function() {
      document.body.classList.remove('fullscreen')
    })
  }
}

/**
 * Request to write out coverage data
 *
 */
const listenForTestEvents = (ipcRenderer?: IpcRenderer) => {
  if (ipcRenderer) {
    debug('listenForTestEvents')

    /* ipcRenderer.on('/coverage/dump', config => {
      const nyc = new (require('nyc'))(config) // create the nyc instance
      nyc.writeCoverageFile() // write out the coverage data for the renderer code
    }) */
  }
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
  return initializeIPC().then(({ remote, ipcRenderer }) => {
    listenForRemoteEvents(ipcRenderer)

    listenForWindowEvents(remote)
    listenForTestEvents(ipcRenderer)
  })
}
