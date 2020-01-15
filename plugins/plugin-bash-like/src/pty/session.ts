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

import {
  inBrowser,
  inElectron,
  Registrar,
  CodedError,
  i18n,
  Tab,
  getCurrentBlock,
  getCurrentPrompt,
  getPrompt,
  getCurrentProcessingBlock,
  setStatus,
  Status
} from '@kui-shell/core'
import { promptPlaceholder } from '@kui-shell/client/config.d/style.json'
import { proxyServer, millisBeforeProxyConnectionWarning } from '@kui-shell/client/config.d/proxy.json'

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
    tab['_kui_session'] = channel

    return tab['_kui_session']
  } else {
    return tab['_kui_session'] as Promise<Channel>
  }
}

/**
 * Keep trying until we can establish a session
 *
 */
export function pollUntilOnline(tab: Tab, block?: HTMLElement) {
  const sessionInitialization = new Promise(resolve => {
    let placeholderChanged = false
    let previousText: string

    const once = (iter = 0) => {
      debug('trying to establish session', tab)

      if (!block) {
        block = getCurrentBlock(tab) || getCurrentProcessingBlock(tab)
        const prompt = getPrompt(block)
        prompt.readOnly = true
        prompt.placeholder = strings('Please wait while we connect to your cloud')

        placeholderChanged = true
        previousText = prompt.value
        prompt.value = '' // to make the placeholder visible

        setStatus(block, Status.processing)
      }

      return tab.REPL.qexec('echo initializing session', block, undefined, {
        tab,
        quiet: true,
        noHistory: true,
        replSilence: true,
        rethrowErrors: true,
        echo: false
      })
        .then(() => {
          try {
            setOnline()

            if (placeholderChanged) {
              const prompt = getPrompt(block)
              prompt.readOnly = false
              prompt.placeholder = promptPlaceholder || ''
              setStatus(block, Status.replActive)

              if (previousText) {
                prompt.value = previousText
                previousText = undefined
              }
              prompt.focus()
            }
          } catch (err) {
            console.error('error updating UI to indicate that we are online', err)
          }
          resolve(getChannelForTab(tab))
        })
        .catch(error => {
          const err = error as CodedError
          if (err.code !== 503) {
            // don't bother complaining too much about connection refused
            console.error('error establishing session', err.code, err.statusCode, err)
          }
          setOffline()
          setTimeout(() => once(iter + 1), iter < 10 ? 2000 : iter < 100 ? 4000 : 10000)
          return strings('Could not establish a new session')
        })
    }

    once()
  })

  tab['_kui_session'] = sessionInitialization
  return sessionInitialization
}

/**
 * This function establishes a promise of a websocket channel for the
 * given tab
 *
 */
function newSessionForTab(tab: Tab) {
  // eslint-disable-next-line no-async-promise-executor
  tab['_kui_session'] = new Promise(async (resolve, reject) => {
    try {
      const block = getCurrentBlock(tab)
      const prompt = getCurrentPrompt(tab)
      prompt.readOnly = true
      let placeholderChanged = false

      const sessionInitialization = pollUntilOnline(tab, block)

      // change the placeholder if sessionInitialization is slow
      const placeholderAsync = setTimeout(() => {
        prompt.placeholder = strings('Please wait while we connect to your cloud')
        setStatus(block, Status.processing)
        placeholderChanged = true
      }, millisBeforeProxyConnectionWarning)

      await sessionInitialization

      clearTimeout(placeholderAsync)
      prompt.readOnly = false
      if (placeholderChanged) {
        setStatus(block, Status.replActive)
        prompt.placeholder = promptPlaceholder || ''
        await tab.REPL.pexec('ready', { tab })
      }

      tab.classList.add('kui--session-init-done')

      resolve(getChannelForTab(tab))
    } catch (err) {
      reject(err)
    }
  })
}

export function registerCommands(commandTree: Registrar) {
  // this is the default "session is ready" command handler
  commandTree.listen(
    '/ready',
    ({ REPL }) => {
      const message = document.createElement('pre')
      message.appendChild(
        document.createTextNode(strings('Successfully connected to your cloud. For next steps, try this command: '))
      )

      const clicky = document.createElement('span')
      clicky.className = 'clickable clickable-blatant'
      clicky.innerText = 'getting started'
      clicky.onclick = () => REPL.pexec('getting started')
      message.appendChild(clicky)

      return message
    },
    { inBrowserOk: true, noAuthOk: true, hidden: true }
  )
}

/**
 * Initialize per-tab websocket session management
 *
 */
export async function init() {
  if (inBrowser() && (proxyServer as { enabled?: boolean }).enabled !== false) {
    debug('initializing pty sessions')

    const { eventBus } = await import('@kui-shell/core')

    // listen for new tabs
    eventBus.on('/tab/new', (tab: Tab) => {
      newSessionForTab(tab)
    })

    // listen for closed tabs
    eventBus.on('/tab/close', async (tab: Tab) => {
      try {
        debug('closing session for tab')
        getChannelForTab(tab).close()
      } catch (err) {
        console.error('error terminating session for closed tab', err)
      }
    })
  }
}
