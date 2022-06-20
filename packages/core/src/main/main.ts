/*
 * Copyright 2017 The Kubernetes Authors
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
const debug = Debug('main/main')
debug('loading')

import { ExecOptions } from '../models/execOptions'
import ISubwindowPrefs from '../models/SubwindowPrefs'

function getPrefsFromEnv(env: typeof process.env, defaultPrefs: ISubwindowPrefs) {
  if (env.subwindowPrefs) {
    const envPrefs = typeof env.subwindowPrefs === 'string' ? JSON.parse(env.subwindowPrefs) : env.subwindowPrefs
    return Object.assign(defaultPrefs, envPrefs)
  } else {
    return defaultPrefs
  }
}

/**
 * This is the main entry point to kui
 *
 */
export const main = async (argv: string[], env = process.env, execOptions?: ExecOptions) => {
  const N = argv.length
  const isRunningHeadless = !!process.env.KUI_HEADLESS || (argv[N - 3] === 'bash' && argv[N - 2] === 'websocket')

  if (!isRunningHeadless || !!process.env.KUI_FORCE_GRAPHICS) {
    // then spawn the electron graphics
    debug('shortcut to graphics', argv)
    const { getCommand, initElectron } = await import(/* webpackChunkName: "electron-main" */ './spawn-electron')
    const { argv: strippedArgv, subwindowPlease, subwindowPrefs } = getCommand(argv, process.cwd(), env, async () =>
      import('electron').catch(err => {
        debug('Error importing electron. We are probably running a headless client.', err)
        return { screen: undefined, BrowserWindow: undefined }
      })
    )
    initElectron(
      strippedArgv,
      { isRunningHeadless },
      !!(env.subwindowPlease || subwindowPlease),
      getPrefsFromEnv(env, subwindowPrefs)
    )
  } else {
    // otherwise, don't spawn the graphics; stay in headless mode
    const { initHeadless } = await import(/* webpackChunkName: "headless-main" */ './headless')
    const result = await initHeadless(argv, false, isRunningHeadless, execOptions).catch(err => {
      if (env.KUI_REPL_MODE) {
        const errResponse = Object.assign(
          {
            code: err.code,
            statusCode: err.statusCode,
            message: err.message
          },
          err
        )
        return errResponse
      } else {
        throw err
      }
    })
    if (env.KUI_REPL_MODE) {
      if (env.KUI_REPL_MODE === 'stdout') {
        debug('emitting repl mode result')
        console.log(
          JSON.stringify({
            type: typeof result,
            response: result
          })
        )
      } else {
        debug('returning repl mode result', env.KUI_REPL_MODE)
        return result
      }
    }
  }

  // try {
  //    if (isRunningHeadless && app.dock) app.dock.hide()
  // } catch (e) {
  // }
  debug('isRunningHeadless %s', isRunningHeadless)
  debug('all done here, the rest is async')
}

main(process.argv, process.env, process.env.KUI_EXEC_OPTIONS && JSON.parse(process.env.KUI_EXEC_OPTIONS))
