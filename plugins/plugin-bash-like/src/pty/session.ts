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

import { inBrowser, inElectron, CodedError, i18n, Tab, PreloadRegistrar } from '@kui-shell/core'

import { Channel, InProcessChannel } from './channel'
import { setOnline, setOffline } from './ui'

const strings = i18n('plugin-bash-like')
const debug = Debug('plugins/bash-like/pty/session')

/**
 * Return the cached websocket for the given tab
 *
 */
export function getChannelForTab(tab: Tab): Channel {
  return tab['ws'] as Channel
}

/**
 * Return the session for the given tab
 *
 */
export async function getSessionForTab(tab: Tab): Promise<Channel> {
  if (tab['_kui_session'] === undefined && inElectron()) {
    const channel = new InProcessChannel()
    await channel.init()
    tab['_kui_session'] = Promise.resolve(channel)

    return tab['_kui_session']
  } else {
    return tab['_kui_session'] as Promise<Channel>
  }
}

/**
 * Keep trying until we can establish a session
 *
 */
export function pollUntilOnline(tab: Tab) {
  return new Promise(resolve => {
    let isOnline = false
    const initialSetOffline = setTimeout(() => {
      if (!isOnline) {
        setOffline()
      }
    }, 5000)

    const once = (iter = 0) => {
      debug('trying to establish session', tab)

      return tab.REPL.qexec('echo initializing session', undefined, undefined, {
        tab
      })
        .then(() => {
          isOnline = true
          clearTimeout(initialSetOffline)
          setOnline()
          resolve()
        })
        .catch(error => {
          const err = error as CodedError
          if (err.code !== 503) {
            // don't bother complaining too much about connection refused
            console.error('error establishing session', err.code, err.statusCode, err)
          }
          setTimeout(() => once(iter + 1), iter < 10 ? 2000 : iter < 100 ? 4000 : 10000)
          return strings('Could not establish a new session')
        })
    }

    once()
  })
}

/**
 * This function establishes a promise of a websocket channel for the
 * given tab
 *
 */
async function newSessionForTab(tab: Tab) {
  // eslint-disable-next-line no-async-promise-executor
  tab['_kui_session'] = new Promise(async (resolve, reject) => {
    try {
      await pollUntilOnline(tab)
      tab.classList.add('kui--session-init-done')

      resolve(getChannelForTab(tab))
    } catch (err) {
      reject(err)
    }
  })

  await tab['_kui_session']
}

/**
 * Initialize per-tab websocket session management
 *
 */
export async function init(registrar: PreloadRegistrar) {
  const { proxyServer } = await import('@kui-shell/client/config.d/proxy.json').catch(() => {
    console.log('using default proxy configuration')
    return { proxyServer: { enabled: false } }
  })

  if (inBrowser() && (proxyServer as { enabled?: boolean }).enabled !== false) {
    debug('initializing pty sessions')

    const { eventBus } = await import('@kui-shell/core')

    registrar.registerSessionInitializer(newSessionForTab)

    // listen for closed tabs
    eventBus.on('/tab/close', async (tab: Tab) => {
      try {
        debug('closing session for tab')
        const channel = getChannelForTab(tab)
        if (channel) {
          // the user may have asked to close the tab before we have
          // finished initializing the channel
          channel.close()
        }
      } catch (err) {
        console.error('error terminating session for closed tab', err)
      }
    })
  }
}
