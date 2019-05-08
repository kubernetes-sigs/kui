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

import * as Debug from 'debug'
const debug = Debug('main/main')
debug('loading')

import { IExecOptions } from '../models/execOptions'
import { getCommand, initElectron, initHeadless } from './spawn-electron'
import ISubwindowPrefs from '../models/SubwindowPrefs'

/**
 * This is the main entry point to kui
 *
 */
export const main = (argv: string[], env = process.env, execOptions?: IExecOptions) => {
  const forceUI = !!argv.find(arg => arg === '--ui') || !!env.KUI_POPUP
  const isShell = !!argv.find(arg => arg === 'shell')
  const kuiShell = forceUI || isShell
  const isRunningHeadless = !!env.KUI_HEADLESS && !kuiShell

  if (!isRunningHeadless) {
    // then spawn the electron graphics
    debug('shortcut to graphics')
    const { argv: strippedArgv, subwindowPlease, subwindowPrefs } = getCommand(argv)
    initElectron(strippedArgv,
                 { isRunningHeadless, forceUI },
                 env.subwindowPlease || subwindowPlease ? true : false,
                 env.subwindowPrefs
                 ? typeof env.subwindowPrefs === 'string'
                 ? JSON.parse(env.subwindowPrefs) : env.subwindowPrefs
                 : subwindowPrefs)
  } else {
    // otherwise, don't spawn the graphics; stay in headless mode
    const result = initHeadless(argv, false, isRunningHeadless, execOptions)
    if (env.KUI_REPL_MODE) {
      debug('returning repl mode result')
      return result
    }
  }

  // try {
  //    if (isRunningHeadless && app.dock) app.dock.hide()
  // } catch (e) {
  // }
  debug('isRunningHeadless %s', isRunningHeadless)
  debug('all done here, the rest is async')
}

// initElectron respawns us with electron enabled; in this case,
// main.ts will be evaluated outside of a require context, so we need
// to bootstrap things, as follows:
if (require.main === module) {
  debug('it looks like this is the main entry point, rather than a require')
  main(process.argv, process.env)
}
