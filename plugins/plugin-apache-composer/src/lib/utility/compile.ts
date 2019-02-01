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
const debug = Debug('plugins/apache-composer/utility/compile')

import * as fs from 'fs'
import * as path from 'path'
import * as expandHomeDir from 'expand-home-dir'
import * as fqn from 'openwhisk-composer/fqn'
import * as Composer from 'openwhisk-composer'

import { currentSelection } from '@kui-shell/core/webapp/views/sidecar'
import UsageError from '@kui-shell/core/core/usage-error'
import { inBrowser } from '@kui-shell/core/core/capabilities'
import { findFile } from '@kui-shell/core/core/find-file'

import { extractActionsFromAst, isValidAst } from './ast'
import { create } from './usage'
import { deployAction } from '../controller/client'
import * as messages from './messages'

export const sourceToComposition = ({ inputFile, name = '', recursive = false }) => new Promise(async (resolve, reject) => {
  debug('validating source file', inputFile)
  const extension = inputFile.substring(inputFile.lastIndexOf('.') + 1)
  if (extension === 'json' || extension === 'ast') { // we were given the FSM directly
    debug('input is composer AST')
  } else if (extension === 'js' || extension === 'py') {
    debug('input is composer library client', extension)
  } else {
    return reject(new UsageError({ message: messages.unknownInput, usage: create('create') }, undefined, 497))
  }

  const localCodePath = findFile(expandHomeDir(inputFile))

  return loadSourceCode(inputFile, localCodePath) // check inputfile extension and existence and then return the source code
    .then(sourceCode => loadComposition(inputFile, sourceCode)) // check before parse by composer and give users more freedom on source input
    .then(composition => {
      composition = compileComposition(composition, name) // parse and compile composition and get {composition, ast, version} object
      if (recursive) {
          // we were asked to (try to) deploy the actions referenced by the AST
        const localSourcePath = findFile(expandHomeDir(inputFile))
        const actions = extractActionsFromAst(composition.ast)  // extract the action name from ast
        debug('extracted actions from ast', actions)
        return Promise.all(actions.map(deployAction(path.join(localSourcePath, '..')))) // deploy the referenced actions
            .then(() => resolve(composition))
            .catch(error => reject(error))
      } else {
        return resolve(composition)
      }
    })
    .catch(err => reject(err))
})

const loadSourceCode = (inputFile, localCodePath) => new Promise(async (resolve, reject) => {
  if (!inBrowser()) {
    debug('readFile in headless mode or for electron')
    fs.readFile(localCodePath, (err, data) => {
      if (err) { reject(err) } else { resolve(data.toString()) }
    })
  } else {
    debug('readFile for webpack', localCodePath)
    try {
      const data = await import('@kui-shell/plugin-apache-composer/lib' + localCodePath.replace(/^\/?plugins\/plugin-apache-composer\/lib/, ''))
      resolve(data)
    } catch (err) {
      console.error(err)
      const error = new Error('The specified file does not exist')
      error['code'] = 404
      reject(error)
    }
  }
})

export const loadComposition = (inputFile, originalCode?, localCodePath?) => {
  if (inBrowser() && originalCode) return originalCode

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
      console.log = msg => { logMessage += msg + '\n' }
      console.error = function () {
        err(...arguments)
        for (let idx = 0; idx < arguments.length; idx++) {
          errorMessage += arguments[idx].toString() + ' '
        }
        errorMessage += '\n'
      }
      process.exit = () => {
        let error = new Error(errorMessage)
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

// give style freedom for users to write composition source
const allowSourceVariation = (composition, logMessage, errorMessage) => {
  if ((composition.main && isValidAst(composition.main)) || typeof composition.main === 'function') {
    debug('pulling composition from exports.main')
    composition = composition.main
  } else if ((composition.composition && isValidAst(composition.composition)) || typeof composition.composition === 'function') {
    debug('pulling composition from exports.composition')
    composition = composition.composition
  }

  if (typeof composition === 'function') {
    debug('composition is function; evaluating it')
    composition = composition()
  }

  if (isValidAst(composition)) {
    return composition
  } else { // maybe the code did a console.log?
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
const sourceErrHandler = (error, originalCode, filename) => {
  const junkMatch = error.stack.match(/\s+at Object\.exports\.runInNewContext/) ||
                error.stack.match(/\s+at Object\.runInNewContext/) ||
                error.stack.match(/\s+at fs\.readFile/)
  const _message = error.message.indexOf('Invalid argument to compile') >= 0
              ? 'Your source code did not produce a valid app.'
              : (!junkMatch ? error.stack
                  : error.stack.substring(0, junkMatch.index).replace(/\s+.*compile([^\n])*/g, '\n').replace(/(evalmachine.<anonymous>)/g, filename).replace(/\s+at createScript([^\n])*/g, '\n').trim())
  const message = _message
    .replace(/\s+\(.*plugins\/modules\/apache-composer\/node_modules\/openwhisk-composer\/composer\.js:[^\s]*/, '')
    .replace(/\s+at ContextifyScript[^\n]*/g, '')

  // for parse error, error message is shown in the ast (JSON) tab, and user code in the source (code) tab
  // reject now returns {fsm:errMsg, code:originalCode}
  return {
    statusCode: 'ENOPARSE', // would like to use code here, but we've already used it for code:originalCode
    message,
    ast: message,
    code: originalCode
  }
}

export const implicitInputFile = (inputFile, name) => {
  if (!inputFile) { // the user didn't provide an input file, maybe we can infer one from the current selection
    const selection = currentSelection()
    debug('selection', selection)
    if (selection && selection.ast && selection.prettyType === 'preview') {
      debug('input from app preview selection') // then the sidecar is currently showing an app preview
      const inputAnnotation = selection.annotations.find(({ key }) => key === 'file')

      if (inputAnnotation) {
        inputFile = inputAnnotation.value
        debug('using preview for inputFile', inputFile)

        if (!name) { // then the user typed "app create"; let's use the file name as the app name
          name = selection.name.replace(/[^]*/, '') // strip off the ".js" suffix
          debug('using preview for name', name)
        }
      }
    }
  }
  return { inputFile, name }
}

/*
 * parse source file to composition using Composer library
 *
 */
export const compileComposition = (composition, name) => {
  let result
  try {
    result = Composer.parse(composition)
    result = result.compile()
    result.name = fqn(name)
  } catch (error) {
    error.statusCode = 422  // composition error
    throw error
  }
  debug('compiled source to composition', result)
  return result
}
