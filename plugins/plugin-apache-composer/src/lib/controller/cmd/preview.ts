/*
 * Copyright 2017-2019 IBM Corporation
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
import * as fs from 'fs'
import * as path from 'path'

import { Capabilities, Commands, REPL, UI, Util } from '@kui-shell/core'
import Presentation from '@kui-shell/core/webapp/views/presentation'
import { showCustom, showEntity } from '@kui-shell/core/webapp/views/sidecar'
import { optionsToString, handleError } from '@kui-shell/core/core/utility'

import * as usage from './preview-usage'
import { codeViewMode, vizAndfsmViewModes } from '../../utility/decorate'
import { ast as astBadge } from '../../utility/badges'
import { invalidFSM, unknownInput } from '../../utility/messages'
import { sourceToComposition } from '../../utility/compile'

const debug = Debug('plugins/wskflow/preview')

const viewName = 'preview' // for back button and sidecar header labels
const viewNameLong = 'App Visualization' //    ... long form
const defaultMode = 'visualization' // on open, which view mode should be selected?

interface ViewOptions {
  renderFunctionsInView?: boolean
  noHeader?: boolean
}
class DefaultViewOptions implements ViewOptions {}

interface CompositionWithCode {
  ast?: any // eslint-disable-line @typescript-eslint/no-explicit-any
  code?: string
}

/**
 * Here is the app kill entry point. Here we register command
 * handlers.
 *
 */
export default (commandTree: Commands.Registrar) => {
  const readFile = (input: string): Promise<string> =>
    // eslint-disable-next-line no-async-promise-executor
    new Promise(async (resolve, reject) => {
      const filepath = Util.findFile(Util.expandHomeDir(input))

      if (!Capabilities.inBrowser()) {
        debug('readFile in headless mode or for electron')
        fs.readFile(filepath, (err, data) => {
          if (err) {
            reject(err)
          } else {
            resolve(data.toString())
          }
        })
      } else {
        debug('readFile for webpack')

        if (filepath.indexOf('@') >= 0) {
          debug('readFile for webpack, built-in', filepath)
          try {
            const data = await import(
              'raw-loader!@kui-shell/plugin-apache-composer/samples' +
                filepath.replace(/^.*plugin-apache-composer\/samples(.*)$/, '$1')
            )

            resolve(data)
          } catch (err) {
            console.error(err)
            const error = new Error('The specified file does not exist')
            error['code'] = 404
            reject(error)
          }
        } else {
          const error = new Error('The specified file does not exist')
          error['code'] = 404
          reject(error)
        }
      }
    })

  const render = (
    tab: UI.Tab,
    input: string,
    options: Commands.ParsedOptions,
    execOptions: Commands.ExecOptions,
    mode: string
  ) =>
    new Promise((resolve, reject) => {
      debug('options', options)

      let fsmPromise
      let type
      const coreModes = []

      const extension = input.substring(input.lastIndexOf('.') + 1)

      if (extension === 'json' || extension === 'ast') {
        debug('input is composer AST', extension)
        try {
          fsmPromise = sourceToComposition({
            inputFile: input,
            name: path.basename(input)
          })
          type = astBadge
        } catch (err) {
          reject(invalidFSM)
        }
      } else if (extension === 'js' || extension === 'py') {
        debug('input is composer library client', extension)
        try {
          fsmPromise = sourceToComposition({
            inputFile: input,
            name: path.basename(input)
          })
          debug('composition parsed from input', fsmPromise)
        } catch (err) {
          reject(err)
        }
      } else {
        reject(unknownInput)
      }

      const name = path.basename(input)

      // create a fake action/entity record
      const formatForUser = (mode: string) => async (composition: CompositionWithCode) => {
        debug('formatForUser', composition)

        const { ast } = composition
        const code = await readFile(input)
        // pass through cli options for the wskflow renderer
        const viewOptions: ViewOptions = new DefaultViewOptions()

        coreModes.push(codeViewMode(code))

        if (options.functions) {
          // note we must be careful not to pass false; only undefined
          viewOptions.renderFunctionsInView = options.functions !== undefined // render all inline functions directly in the view?
        }

        if (execOptions.container) {
          // if we're rendering this inside of a given viewport, then don't modify the sidecar header
          viewOptions.noHeader = true
        }

        const { visualize, wskflow, zoomToFitButtons } = await import('@kui-shell/plugin-wskflow')
        const { view, controller } = await wskflow(tab, visualize, {
          ast,
          name,
          viewOptions,
          container: execOptions.container,
          namespace: undefined
        })

        const modes: UI.Mode[] = vizAndfsmViewModes(visualize, viewName, mode, input, ast, options)
        modes.splice(modes.length, 0, ...coreModes)
        const extraModes = zoomToFitButtons(controller)

        let entity = {
          isEntity: true,
          type: mode === 'visualization' ? 'custom' : 'actions',
          prettyType: viewName,
          name,
          ast,
          input,
          content: view,
          source: code,
          verb: 'get',
          show: mode,
          exec: {
            kind: 'source'
          },
          presentation: Presentation.FixedSize,
          modes: modes.concat(extraModes),
          annotations: [
            {
              key: 'wskng.combinators',
              value: [{ role: 'replacement', type: 'composition', badge: type }]
            },
            { key: 'ast', value: ast },
            { key: 'code', value: code },
            { key: 'file', value: input }
          ]
        }

        if (!viewOptions.noHeader) {
          entity = Object.assign(entity, {
            controlHeaders: ['sidecar-header-secondary-content'],
            subtext: 'This is a preview of your composition, it is not yet deployed'
          })
        }

        if (options.ast || mode === 'ast') {
          // then the user asked to see the fsm
          debug('showing JSON')
          entity.verb = 'get'
          entity.show = 'ast'
          entity.type = 'actions'
        }

        if (execOptions.alreadyWatching) {
          // in filewatch mode (alreadyWatching), command echo is set to false
          // calling showCustom as the main repl does not do anything for custom type entity when echo is false
          if (entity.show !== 'visualization') {
            showEntity(tab, entity, { show: entity.show })
          } else if (entity.type === 'custom') {
            showCustom(tab, entity, {})
          } else {
            showEntity(tab, entity, { show: 'ast' })
          }
        } else {
          resolve(entity)
        }
      } /* formatForUser */

      fsmPromise.then(formatForUser(mode)).catch(err => {
        debug('got error generating IR', err)

        if (err.type === 'EMPTY_FILE') {
          // start rendering an empty JSON
          formatForUser(mode)({})
        } else if (execOptions.alreadyWatching) {
          // we already have the sidecar open to this file,
          // so we can report the error in the sidecar

          // createFromSource returns error as either an object that's {fsm:errMsg, code:originalCode}, or just the errMsg string
          // here we check the error format and send the correct input to formatForUser/handleError
          // in sidecar, error message shows in the fsm (JSON) tab. code tab shows the user's js code (if existed).
          debug('already watching')
          if (err.ast) {
            formatForUser('ast')(err)
          } else {
            formatForUser('ast')({ ast: err })
          }
        } else {
          // otherwise, report the error in the REPL
          if (err.ast) {
            handleError(err.ast, reject)
          } else {
            handleError(err, reject)
          }
        }
      })
    })

  /** command handler */
  const doIt = (cmd: string, mode = defaultMode) => ({
    tab,
    execOptions,
    argvNoOptions,
    parsedOptions: options
  }: Commands.Arguments) =>
    new Promise((resolve, reject) => {
      const idx = argvNoOptions.indexOf(cmd)
      const inputFile = argvNoOptions[idx + 1]

      debug('cmd', cmd)
      debug('inputFile', inputFile)

      if (options.c) {
        // then the user wants to see the code and preview side-by-side
        debug('delegating to editor')
        return resolve(REPL.qexec(`compose ${path.basename(inputFile)} --simple --readOnly --template "${inputFile}"`))
      }

      const input = Util.findFile(Util.expandHomeDir(inputFile))

      /* if (currentSelection() && currentSelection().input === input) {
             debug('already showing', input)
             return resolve(true);
         } */

      const exists = () =>
        new Promise((resolve, reject) => {
          const ENOENT = () => {
            const error = new Error('The specified file does not exist')
            error['code'] = 404
            return error
          }

          if (!Capabilities.inBrowser()) {
            fs.stat(input, err => {
              if (err) {
                reject(ENOENT())
              } else {
                resolve()
              }
            })
          } else {
            if (input.indexOf('@') >= 0) {
              resolve()
            } else {
              reject(ENOENT())
            }
          }
        })

      exists()
        .then(async () => {
          // in case the user provides env vars
          const backupEnv = {}
          if (options.env) {
            debug('parsing environment variables from command line', options.env)

            for (let idx = 0; idx < options.env.length; idx += 2) {
              const key = options.env[idx]
              const value = options.env[idx + 1]

              // remember the value we're about to overwrite
              if (key in process.env) {
                debug('stashing env var', key)
                backupEnv[key] = process.env[key]
              }

              process.env[key] = value
            }

            delete options.e
          }

          try {
            render(tab, input, options, execOptions, mode).then(resolve, reject)
          } finally {
            // restore any env vars we smashed
            for (const key in backupEnv) {
              debug('restoring env var', key)
              process.env[key] = backupEnv[key]
            }
          }

          // and set up a file watcher to re-render upon change of the file
          if (!execOptions || !execOptions.alreadyWatching) {
            if (!Capabilities.inBrowser()) {
              const chokidar = await import('chokidar')
              chokidar.watch(input).on('change', path => {
                debug('change observed to file', path)

                REPL.pexec(`${cmd} ${path} ${optionsToString(options)}`, {
                  echo: false,
                  alreadyWatching: true,
                  noHistory: true
                })
              })
            }
          }
        })
        .catch(reject)
    })

  const vizCmd = commandTree.listen(`/wsk/app/preview`, doIt('preview'), {
    usage: usage.preview('preview'),
    needsUI: true,
    viewName: viewNameLong,
    fullscreen: true,
    width: 800,
    height: 600,
    clearREPLOnLoad: true,
    noAuthOk: true,
    placeholder: 'Loading visualization ...'
  })
  commandTree.synonym(`/wsk/app/viz`, doIt('viz'), vizCmd, {
    usage: usage.preview('viz'),
    noAuthOk: true
  })

  commandTree.listen('/wsk/app/src', doIt('src', 'src'), {
    usage: usage.source('src'),
    noAuthOk: true
  })

  return Promise.resolve()
}
