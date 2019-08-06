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
import { getCurrentPrompt, getCurrentBlock, setStatus, Tab } from '@kui-shell/core/webapp/cli'
import { pexec, qexec } from '@kui-shell/core/core/repl'
import { theme as settings, config } from '@kui-shell/core/core/settings'

const debug = Debug('plugins/bash-like/pty/session')

/**
 * Return the cached websocket for the given tab
 *
 */
export function getChannelForTab(tab: Tab): Channel {
  return tab['ws'] as Channel
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
      debug('newSessionForTab', tab)

      const sessionInitialization = qexec('/bin/sleep 5; echo initializing session', undefined, undefined, {
        tab,
        quiet: true,
        noHistory: true,
        replSilence: true,
        echo: false
      })

      const block = getCurrentBlock(tab)
      const prompt = getCurrentPrompt(tab)
      prompt.readOnly = true
      let placeholderChanged = false

      // change the placeholder if sessionInitialization is slow
      const placeholderAsync = setTimeout(() => {
        prompt.placeholder = 'Please wait while we connect to your cloud'
        setStatus(block, 'processing')
        placeholderChanged = true
      }, settings.millisBeforeProxyConnectionWarning || 750)

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
