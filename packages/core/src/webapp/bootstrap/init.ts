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

import { inBrowser } from './client'
import eventChannelUnsafe from '../../core/events'

/**
 * We don't (at least not for now) want to support drag and drop at the global scope
 *
 */
const nope = (event: Event) => {
  event.preventDefault()
  return false
}
const disableDragAndDrop = () => {
  // debug('disableDragAndDrop')
  document.addEventListener('dragover', nope, false)
  document.addEventListener('drop', nope, false)
}

/**
 * When commands are executed, the command resolver will use a
 * fallback prefix. This routine tries to discover, from the
 * environment, what the default fallback prefix should be.
 *
 */
async function setDefaultCommandContext() {
  const { extractSearchKey } = await import('../util/search')

  const contextString =
    process.env.KUI_CONTEXT ||
    (typeof window !== 'undefined' && window.location && window.location.search && extractSearchKey('command-context'))

  if (contextString) {
    try {
      const context = JSON.parse(contextString)
      const { setDefaultCommandContext: setDefault } = await import('../../commands/context')
      setDefault(context)
      return
    } catch (err) {
      console.error('Error parsing KUI_CONTEXT', err)
    }
  }
}

export const init = async () => {
  // debug('init')

  const waitForThese: Promise<void>[] = []

  // debug('window init')
  eventChannelUnsafe.emit('/window/init')

  disableDragAndDrop()

  waitForThese.push(setDefaultCommandContext())

  window.addEventListener('beforeunload', () => {
    eventChannelUnsafe.emit('/window/reload')
  })

  waitForThese.push(import('../themes/init').then(_ => _.default()))

  await Promise.all(waitForThese)

  // debug('init done')
}

export const preinit = async (inSandbox: boolean) => {
  // debug('preinit')

  let prefs = {}

  /** add os-xxxx to the body's classname, to allow for os-specific styling, if needed */
  document.body.classList.add(`os-${process.platform}`)

  if (!inSandbox && !inBrowser()) {
    // Notes: sequester the electron bits into their own chunk, to
    // prevent webpack from bunching code that has an
    // `import('electron')` into the main bundle
    prefs = await import(/* webpackChunkName: "electron" */ /* webpackMode: "lazy" */ './init-electron').then(_ =>
      _.preinit()
    )
  }

  return prefs
}
