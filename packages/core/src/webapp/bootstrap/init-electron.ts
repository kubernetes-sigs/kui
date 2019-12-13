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

import { BrowserWindow } from 'electron'
import eventBus from '../../core/events'

interface KuiWindow extends BrowserWindow {
  subwindow?: {
    fullscreen?: boolean
    viewName?: string
    title?: string
    partialExec?: string
    noEcho?: boolean
    theme?: string
  }
  executeThisArgvPlease?: string[]
}

export async function preinit() {
  // ugh, on macos, dock- and finder-launched apps have a cwd of /
  if (process.cwd() === '/') {
    try {
      process.chdir((await import('../../util/home')).default('~'))
      process.env.PWD = process.cwd()
    } catch (err) {
      console.error(err)
    }
  }

  let prefs = {}
  if (process.env.___IBM_FSH_FUZZ) {
    // for testing, we sometimes want to monkey patch out certain features
    try {
      prefs = await (await import('../../core/fuzz-testing')).default(process.env.___IBM_FSH_FUZZ)
    } catch (err) {
      // debug('fuzz testing raw', process.env.___IBM_FSH_FUZZ)
      console.error('Error parsing fuzz testing prefs', err)
    }
    // debug('parsed fuzz testing config', prefs)
  }

  try {
    const { remote } = await import('electron')
    const window = remote && (remote.getCurrentWindow() as KuiWindow)
    const subwindow = window.subwindow
    if (subwindow && subwindow.fullscreen !== false) {
      const titleOverride = typeof subwindow === 'string' ? subwindow : subwindow.title
      if (titleOverride && typeof titleOverride === 'string') {
        document.title = titleOverride
      }

      // set the current mode, if we have one, so that back
      // button can inform the user of what they're going back
      // to
      if (subwindow.viewName) {
        document.body.setAttribute('data-view-name', subwindow.viewName)
      }

      // body styling
      document.body.classList.add('subwindow')
      if (subwindow.theme) document.body.classList.add(`theme-${subwindow.theme}`)

      return subwindow
    }
  } catch (err) {
    // debug('no electron', err)
    // NOTE: so far, we only know that we aren't running in electron;
    // subsequently, we will decide whether we are headless or browser
    // in ../electron-events, which is called by boot on domReady
  }

  return prefs
}

export function init() {
  // debug('setting up /init/done handler')
  eventBus.once('/init/done', async () => {
    // debug('got /init/done')

    const { remote } = await import('electron')
    const electronWindow = remote.getCurrentWindow() as KuiWindow
    const prefs = electronWindow.subwindow
    const argv = electronWindow['executeThisArgvPlease']
    const maybeExecuteThis = argv && argv.length > 0 ? argv : undefined
    const fullShell = maybeExecuteThis && maybeExecuteThis.length === 1 && maybeExecuteThis[0] === 'shell'

    if (maybeExecuteThis && !fullShell) {
      const command = typeof maybeExecuteThis === 'string' ? maybeExecuteThis : maybeExecuteThis.join(' ')
      // debug('maybeExecuteThis', maybeExecuteThis, command)

      if (prefs && prefs.partialExec) {
        // document.body.classList.add('repl-lite')
        const { partial } = await import('../prompt')
        partial(command)
      } else {
        const { pexec } = await import('../../repl/exec')
        const noEcho = prefs && prefs.noEcho // don't echo the command, just do it
        pexec(
          command,
          Object.assign(prefs || {}, {
            causedByHeadless: true,
            echo: !noEcho
          })
        ).then(() => {
          /* if (!noEcho && prefs && prefs.clearREPLOnLoad) {
             setTimeout(() => repl.pexec('clear'), 1000)
             } */
        })
      }
    }
  })
}
