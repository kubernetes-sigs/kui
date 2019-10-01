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
const debug = Debug('webapp/bootstrap/init')
debug('loading')

import { BrowserWindow } from 'electron'

import { inElectron } from '../../core/capabilities'
import eventBus from '../../core/events'
import { extractSearchKey } from '../util/search'
import { setDefaultCommandContext as setDefault } from '../../core/command-tree'

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

/**
 * We don't (at least not for now) want to support drag and drop at the global scope
 *
 */
const nope = (event: Event) => {
  event.preventDefault()
  return false
}
const disableDragAndDrop = () => {
  debug('disableDragAndDrop')
  document.addEventListener('dragover', nope, false)
  document.addEventListener('drop', nope, false)
}

/**
 * When commands are executed, the command resolver will use a
 * fallback prefix. This routine tries to discover, from the
 * environment, what the default fallback prefix should be.
 *
 */
const setDefaultCommandContext = () => {
  const contextString =
    process.env.KAON_CONTEXT ||
    (typeof window !== 'undefined' && window.location && window.location.search && extractSearchKey('command-context'))

  if (contextString) {
    try {
      const context = JSON.parse(contextString)
      setDefault(context)
      return
    } catch (err) {
      debug('Error parsing KAON_CONTEXT', err)
    }
  }
}

export const init = async () => {
  debug('init')

  debug('window init')
  eventBus.emit('/window/init')

  disableDragAndDrop()

  setDefaultCommandContext()

  window.addEventListener('beforeunload', () => {
    eventBus.emit('/window/reload')
  })

  //
  // see if we were passed an argv to execute on load
  //
  if (inElectron()) {
    debug('setting up /init/done handler')
    eventBus.once('/init/done', async () => {
      debug('got /init/done')

      const { remote } = await import('electron')
      const electronWindow = remote.getCurrentWindow() as KuiWindow
      const prefs = electronWindow.subwindow
      const argv = electronWindow['executeThisArgvPlease']
      const maybeExecuteThis = argv && argv.length > 0 ? argv : undefined
      const fullShell = maybeExecuteThis && maybeExecuteThis.length === 1 && maybeExecuteThis[0] === 'shell'

      if (maybeExecuteThis && !fullShell) {
        const command = typeof maybeExecuteThis === 'string' ? maybeExecuteThis : maybeExecuteThis.join(' ')
        debug('maybeExecuteThis', maybeExecuteThis, command)

        if (prefs && prefs.partialExec) {
          // document.body.classList.add('repl-lite')
          const cli = await import('../cli')
          cli.partial(command)
        } else {
          const repl = await import('../../core/repl')
          const noEcho = prefs && prefs.noEcho // don't echo the command, just do it
          repl
            .pexec(
              command,
              Object.assign(prefs || {}, {
                causedByHeadless: true,
                echo: !noEcho
              })
            )
            .then(() => {
              /* if (!noEcho && prefs && prefs.clearREPLOnLoad) {
                 setTimeout(() => repl.pexec('clear'), 1000)
                 } */
            })
        }
      }
    })
  }

  debug('init done')
}

export const preinit = async () => {
  debug('preinit')

  let prefs = {}
  if (process.env.___IBM_FSH_FUZZ) {
    // for testing, we sometimes want to monkey patch out certain features
    try {
      prefs = await (await import('../../core/fuzz-testing')).default(process.env.___IBM_FSH_FUZZ)
    } catch (err) {
      debug('fuzz testing raw', process.env.___IBM_FSH_FUZZ)
      console.error('Error parsing fuzz testing prefs', err)
    }
    debug('parsed fuzz testing config', prefs)
  }

  /** add os-xxxx to the body's classname, to allow for os-specific styling, if needed */
  document.body.classList.add(`os-${process.platform}`)

  try {
    const { remote } = await import('electron')
    const window = remote && (remote.getCurrentWindow() as KuiWindow)
    const subwindow = window.subwindow
    if (subwindow && subwindow.fullscreen !== false) {
      // sidecarOnly = subwindow.sidecarOnly === undefined ? true : subwindow.sidecarOnly
      document.title = typeof subwindow === 'string' ? subwindow : subwindow.title

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
    debug('no electron')

    // NOTE: so far, we only know that we aren't running in electron;
    // subsequently, we will decide whether we are headless or browser
    // in ../electron-events, which is called by boot on domReady
  }

  return prefs
}
