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

import * as Debug from 'debug'

import * as fs from 'fs'
import * as path from 'path'
import expandHomeDir from '@kui-shell/core/util/home'
import * as fqn from 'openwhisk-composer/fqn'
import * as Composer from 'openwhisk-composer'

import { Tab } from '@kui-shell/core/webapp/cli'
import UsageError from '@kui-shell/core/core/usage-error'
import { inBrowser } from '@kui-shell/core/core/capabilities'
import { findFile } from '@kui-shell/core/core/find-file'

import { currentSelection } from '@kui-shell/plugin-openwhisk'

import { isValidAst } from './ast'
import { create } from './usage'
import * as messages from './messages'
const debug = Debug('plugins/apache-composer/utility/compile')

const loadSourceCode = (inputFile: string, localCodePath: string): Promise<string> =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise(async (resolve, reject) => {
    if (!inBrowser()) {
      debug('readFile in headless mode or for electron')
      fs.readFile(localCodePath, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data.toString())
        }
      })
    } else {
      debug('readFile for webpack', localCodePath)
      try {
        const data = await import(
          '@kui-shell/plugin-apache-composer/samples' +
            localCodePath.replace(/^.*plugin-apache-composer\/samples(.*)$/, '$1')
        )
        debug('readFile for webpack done', data)
        resolve(data)
      } catch (err) {
        console.error(err)
        const error = new Error('The specified file does not exist')
        error['code'] = 404
        reject(error)
      }
    }
  })

/*
 * parse source file to composition using Composer library
 *
 */
export const compileComposition = (composition, name) => {
  debug('compileComposition', composition)

  let result
  try {
    result = Composer.parse(composition)
    result = result.compile()
    result.name = fqn(name)
  } catch (error) {
    error.statusCode = 422 // composition error
    throw error
  }
  debug('compiled source to composition', result)
  return result
}

// give style freedom for users to write composition source
const allowSourceVariation = (composition, logMessage: string, errorMessage: string) => {
  if ((composition.main && isValidAst(composition.main)) || typeof composition.main === 'function') {
    debug('pulling composition from exports.main')
    composition = composition.main
  } else if (
    (composition.composition && isValidAst(composition.composition)) ||
    typeof composition.composition === 'function'
  ) {
    debug('pulling composition from exports.composition')
    composition = composition.composition
  }

  if (typeof composition === 'function') {
    debug('composition is function; evaluating it')
    composition = composition()
  }

  if (isValidAst(composition)) {
    return composition
  } else {
    // maybe the code did a console.log?
    let err = ''
    try {
      const maybeStr = logMessage.substring(logMessage.indexOf('{'), logMessage.lastIndexOf('}') + 1)
      debug('maybe composition is in log message?', maybeStr)
      const maybe = Composer.util.deserialize(JSON.parse(maybeStr))
      if (isValidAst(maybe)) {
        debug('yes, found composition in log mesasge', maybe)
        return maybe
      }
    } catch (e) {
      // console.error('could not parse composition from stdout', e)
      err = e
    }

    throw new Error(`Unable to compile your composition ${err} ${errorMessage}`)
  }
}

/*
 * inform users errros in the composition source provided
 *
 */
const sourceErrHandler = (error, originalCode: string, filename: string) => {
  const junkMatch =
    error.stack.match(/\s+at Object\.exports\.runInNewContext/) ||
    error.stack.match(/\s+at Object\.runInNewContext/) ||
    error.stack.match(/\s+at fs\.readFile/)
  const _message =
    error.message.indexOf('Invalid argument to compile') >= 0
      ? 'Your source code did not produce a valid app.'
      : !junkMatch
      ? error.stack
      : error.stack
          .substring(0, junkMatch.index)
          .replace(/\s+.*compile([^\n])*/g, '\n')
          .replace(/(evalmachine.<anonymous>)/g, filename)
          .replace(/\s+at createScript([^\n])*/g, '\n')
          .trim()
  const message = _message
    .replace(/\s+\(.*plugins\/modules\/apache-composer\/node_modules\/openwhisk-composer\/composer\.js:[^\s]*/, '')
    .replace(/\s+at ContextifyScript[^\n]*/g, '')

  // for parse error, error message is shown in the ast (JSON) tab, and user code in the source (code) tab
  // reject now returns {ast:errMsg, code:originalCode}
  return {
    statusCode: 'ENOPARSE', // would like to use code here, but we've already used it for code:originalCode
    message,
    ast: message,
    cause: error,
    code: originalCode
  }
}

export const implicitInputFile = (tab: Tab, inputFile?: string, name?: string) => {
  if (!inputFile) {
    // the user didn't provide an input file, maybe we can infer one from the current selection
    const selection = currentSelection(tab)
    debug('selection', selection)
    if (selection && selection['ast'] && selection.prettyType === 'preview') {
      debug('input from app preview selection') // then the sidecar is currently showing an app preview
      const inputAnnotation = selection.annotations.find(({ key }) => key === 'file')

      if (inputAnnotation) {
        inputFile = inputAnnotation.value.toString()
        debug('using preview for inputFile', inputFile)

        if (!name) {
          // then the user typed "app create"; let's use the file name as the app name
          name = selection.name.replace(/[^]*/, '') // strip off the ".js" suffix
          debug('using preview for name', name)
        }
      }
    }
  }
  return { inputFile, name }
}

export const loadComposition = (inputFile: string, originalCode?: string, localCodePath?: string) => {
  if (inBrowser() && originalCode) {
    debug('loadComposition for webpack', originalCode)
    return originalCode
  }

  const localSourcePath = localCodePath || findFile(expandHomeDir(inputFile))

  debug('load source code from', localSourcePath)

  try {
    let errorMessage = ''
    let logMessage = ''
    debug('using require to process composition', localSourcePath)
    // we'll override these temporarily
    const log = console.log
    const err = console.error
    const exit = process.exit

    let composition

    try {
      // temporarily override (restored in the finally block)
      console.log = msg => {
        logMessage += msg + '\n'
      }
      console.error = function() {
        // eslint-disable-next-line prefer-rest-params
        err(...arguments)
        for (let idx = 0; idx < arguments.length; idx++) {
          // eslint-disable-next-line prefer-rest-params
          errorMessage += arguments[idx].toString() + ' '
        }
        errorMessage += '\n'
      }
      process.exit = () => {
        const error = new Error(errorMessage)
        error['statusCode'] = 'ENOPARSE'
        error['ast'] = errorMessage
        // error[code] = originalCode
        throw error
      }

      composition = require(localSourcePath)
      // Note the use of requireUncached: this allows
      // users to edit and see updates of their
      // compositions, without having to reload or
      // restart the shell
      delete require.cache[require.resolve(localSourcePath)]
    } finally {
      // restore our temporary overrides
      console.log = log
      console.error = err
      process.exit = exit

      if (logMessage) {
        console.log(logMessage)
      }
      if (errorMessage) {
        console.error(errorMessage)
      }
    }

    debug('got composition', typeof composition, composition)

    composition = allowSourceVariation(composition, logMessage, errorMessage)

    return composition
  } catch (error) {
    // error handler
    const filename = localSourcePath && path.basename(localSourcePath)
    throw sourceErrHandler(error, originalCode, filename)
  }
}

export const sourceToComposition = ({ inputFile, name = '' }: { inputFile: string; name?: string }) =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise(async (resolve, reject) => {
    debug('validating source file', inputFile)
    const extension = inputFile.substring(inputFile.lastIndexOf('.') + 1)
    if (extension === 'json' || extension === 'ast') {
      // we were given the AST directly
      debug('input is composer AST')
    } else if (extension === 'js' || extension === 'py') {
      debug('input is composer library client', extension)
    } else {
      return reject(
        new UsageError({
          message: messages.unknownInput,
          usage: create('create'),
          code: 497
        })
      )
    }

    const localCodePath = findFile(expandHomeDir(inputFile))

    return loadSourceCode(inputFile, localCodePath) // check inputfile extension and existence and then return the source code
      .then(sourceCode => loadComposition(inputFile, sourceCode)) // check before parse by composer and give users more freedom on source input
      .then(composition => resolve(compileComposition(composition, name))) // parse and compile composition and get {composition, ast, version} object
      .catch(reject)
  })
