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

import { Channel } from './channel'
import { inBrowser } from '@kui-shell/core/core/capabilities'
import { CommandRegistrar } from '@kui-shell/core/models/command'
import {
  getCurrentPrompt,
  getPrompt,
  getCurrentBlock,
  getCurrentProcessingBlock,
  setStatus,
  Tab
} from '@kui-shell/core/webapp/cli'
import { pexec, qexec } from '@kui-shell/core/core/repl'
import { theme as settings, config } from '@kui-shell/core/core/settings'
import { CodedError } from '@kui-shell/core/models/errors'

import { setOnline, setOffline } from './ui'

const debug = Debug('plugins/bash-like/pty/session')

/**
 * Return the cached websocket for the given tab
 *
 */
export function getChannelForTab(tab: Tab): Channel {
  return tab['ws'] as Channel
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
        prompt.placeholder = 'Please wait while we connect to your cloud'

        placeholderChanged = true
        previousText = prompt.value
        prompt.value = '' // to make the placeholder visible

        setStatus(block, 'processing')
      }

      return qexec('echo initializing session', block, undefined, {
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
              prompt.placeholder = settings.placeholder || ''
              setStatus(block, 'repl-active')

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
          return 'Could not establish a new session'
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
        prompt.placeholder = 'Please wait while we connect to your cloud'
        setStatus(block, 'processing')
        placeholderChanged = true
      }, settings.millisBeforeProxyConnectionWarning || 250)

      await sessionInitialization

      clearTimeout(placeholderAsync)
      prompt.readOnly = false
      if (placeholderChanged) {
        setStatus(block, 'repl-active')
        await pexec('ready', { tab })
      }

      tab.classList.add('kui--session-init-done')

      resolve(getChannelForTab(tab))
    } catch (err) {
      reject(err)
    }
  })
}

export function registerCommands(commandTree: CommandRegistrar) {
  // this is the default "session is ready" command handler
  commandTree.listen(
    '/ready',
    () => {
      const message = document.createElement('pre')
      message.appendChild(
        document.createTextNode('Successfully connected to your cloud. For next steps, try this command: ')
      )

      const clicky = document.createElement('span')
      clicky.className = 'clickable clickable-blatant'
      clicky.innerText = 'getting started'
      clicky.onclick = () => pexec('getting started')
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
  if (inBrowser() && config['proxyServer'] && config['proxyServer']['enabled'] !== false) {
    debug('initializing pty sessions')

    const eventBus = (await import('@kui-shell/core/core/events')).default

    // listen for new tabs
    eventBus.on('/tab/new', (tab: Tab) => {
      newSessionForTab(tab)
    })
  }
}
