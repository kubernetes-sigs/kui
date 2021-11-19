/*
 * Copyright 2019 The Kubernetes Authors
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

/* eslint-disable no-async-promise-executor */

import Debug from 'debug'

import { Capabilities, Events, CodedError, i18n, Tab, PreloadRegistrar } from '@kui-shell/core'

import { Channel } from './channel'
import { setOnline, setOffline } from './ui'

import { getSessionForTab, invalidateCache, isExiting } from './sessionCache'

const strings = i18n('plugin-bash-like')
const debug = Debug('plugins/bash-like/pty/session')

/**
 * Return the cached websocket for the given tab
 *
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getChannelForTab(tab: Tab): Promise<Channel> {
  if (isExiting()) {
    // prevent any stagglers re-establishing a channel
    throw new Error('Exiting')
  } else if (Capabilities.inBrowser()) {
    return getSessionForTab(tab)
  }
}

/**
 * Keep trying until we can establish a session
 *
 */
export function pollUntilOnline(tab: Tab) {
  return new Promise<void>(resolve => {
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
            invalidateCache(tab)
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
  const thisSession =
    getSessionForTab(tab) ||
    new Promise(async (resolve, reject) => {
      try {
        await pollUntilOnline(tab)
        tab.classList.add('kui--session-init-done')

        resolve(await getChannelForTab(tab))
      } catch (err) {
        reject(err)
      }
    })

  await thisSession
  tab.classList.add('kui--session-init-done')
}

/** Connection to Kui proxy has been severed */
export function invalidateSession(tab: Tab) {
  invalidateCache(tab)
  Events.eventBus.emit('/tab/offline', tab)
  Events.eventBus.emitWithTabId(`/tab/offline`, tab.state.uuid)
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

  if (Capabilities.inBrowser() && (proxyServer as { enabled?: boolean }).enabled !== false) {
    debug('initializing pty sessions')
    registrar.registerSessionInitializer(newSessionForTab)
  }
}
