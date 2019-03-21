/*
 * Copyright 2018 IBM Corporation
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

// we don't want to treat this file as a script;
// adding this bit tells tsc to treat this source as a module, rather than a script
// otherwise, we'd get fonclits with electron.ts, which *is* a script, rather than a module
// https://stackoverflow.com/questions/40900791/cannot-redeclare-block-scoped-variable-in-unrelated-files

// process.env.DEBUG = '*'
const debug = require('debug')('webapp/bootstrap/boot')
debug('loading')

import * as initializer from './init'
import eventBus from '../../core/events'
import * as plugins from '../../core/plugins'
import * as repl from '../../core/repl'
import * as query from '../query'
import * as sidecar from '../views/sidecar'
import * as electronEvents from '../electron-events'

/**
 * Look up an HTML element
 *
 */
const element = (id: string): HTMLElement => {
  return document.querySelector(id) as HTMLElement
}

function catastrophe (err) {
  console.error('restart needed')
  console.error(err)
  document.body.classList.add('oops-total-catastrophe')
}

// note: the q npm doesn't like functions called "bootstrap"!
const domReady = (prefs) => async () => {
  debug('domReady')

  try {
    await plugins.init()
    debug('plugins init done')

    await electronEvents.init()

    await repl.init(prefs)
    debug('repl init done')

    // const namespace = require('../../../plugins/modules/openwhisk/plugin/lib/models/namespace')
    // const nsInit = namespace.init(plugins.prequire, prefs && prefs.noAuthOk, prefs)

    sidecar.init()

    await initializer.init(prefs)
    debug('initializer init done')

    debug('preloading plugins')
    await plugins.preload()
    debug('preloading plugins done')

    await query.init()
    debug('query init done')

    // await nsInit
    // debug('ns init done')

    document.body.classList.remove('still-loading')
    eventBus.emit('/init/done')
  } catch (err) {
    catastrophe(err)
  }
}

export default async () => {
  const prefs = initializer.preinit()

  window.addEventListener('load', domReady(prefs), { once: true })
}
