import * as Debug from 'debug'
const debug = Debug('plugins/apache-composer/utility/compile')
import { extractActionsFromAst, isValidAst } from './ast'
import { currentSelection } from '../../../../../../build/webapp/views/sidecar'
import UsageError from '../../../../../../build/core/usage-error'
import { create } from './usage'
import * as fqn from 'openwhisk-composer/fqn'
import * as Composer from 'openwhisk-composer'
import { inBrowser } from '../../../../../../build/core/capabilities'
import * as path from 'path'
import { parseName, deployAction } from './parse'
import { findFile } from '../../../../../../build/core/find-file'
import * as fs from 'fs'
import * as expandHomeDir from 'expand-home-dir'
import * as messages from './messages'

// help compositions find our openwhisk-composer module
if (!inBrowser()) {
  debug('path',path.join(__dirname, '../../../node_modules'))
  require('app-module-path').addPath(path.join(__dirname, '../../../node_modules'))
  require('app-module-path').addPath(path.join(__dirname, '../../../../node_modules'))
}

export const sourceToComposition = ({ inputFile, name = '', recursive = false }) => new Promise(async (resolve, reject) => {
  return validateSourceFile(inputFile) // check inputfile extension and existence
    .then(sourceCode => validateSourceCode(inputFile, sourceCode)) // check before parse by composer and give users more freedom on source input
    .then(compiledAST => {
      const composition = astToComposition(compiledAST, name)
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

// TODO: app create 1. check file extension
const validateSourceFile = (inputFile) => new Promise((resolve, reject) => {
  debug('validate', inputFile)
  const extension = inputFile.substring(inputFile.lastIndexOf('.') + 1)
  if (extension === 'json' || extension === 'ast') { // we were given the FSM directly
    debug('input is composer AST')
  } else if (extension === 'js' || extension === 'py') {
    debug('input is composer library client', extension)
  } else {
    return reject(new UsageError({ message: messages.unknownInput, usage: create('create') }, undefined, 497))
  }

  const localCodePath = findFile(expandHomeDir(inputFile))
  if (!inBrowser()) {
    debug('readFile in headless mode or for electron')
    fs.readFile(localCodePath, (err, data) => {
      if (err) { reject(err) } else { resolve(data.toString()) }
    })
  } else {
    debug('readFile for webpack')
    try {
      resolve(require('../../../../../app/plugins/modules' + localCodePath.replace(/^\/?app\/plugins\/modules/, ''))) // TODO: what path???
    } catch (err) {
      console.error(err)
      const error = new Error('The specified file does not exist')
      error['code'] = 404
      reject(error)
    }
  }
})

export const validateSourceCode = (inputFile, originalCode?) => {
  const localSourcePath = findFile(expandHomeDir(inputFile))
  debug('validate source code from', localSourcePath)
  const filename = localSourcePath && path.basename(localSourcePath) // TODO: do we really need this?

  try {
    let errorMessage = ''
    let logMessage = ''
    debug('using require to process composition', localSourcePath)
    // we'll override these temporarily
    const log = console.log
    const err = console.error
    const exit = process.exit

    let compiledAST

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
      compiledAST = require(localSourcePath)
      // if (extension !== 'py') {
      //   compiledResult = require(localSourcePath)
      // }

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

    debug('compiledAST', typeof compiledAST, compiledAST)

    compiledAST = allowSourceVariation(compiledAST, logMessage, errorMessage)

    return compiledAST

  } catch (error) {
    // error handler
    throw sourceErrHandler(error, originalCode, filename)
  }
}

// give style freedom for users to write composition source
const allowSourceVariation = (compiledAST, logMessage, errorMessage) => {
  if ((compiledAST.main && isValidAst(compiledAST.main)) || typeof compiledAST.main === 'function') {
    debug('pulling composition from exports.main')
    compiledAST = compiledAST.main
  } else if ((compiledAST.composition && isValidAst(compiledAST.composition)) || typeof compiledAST.composition === 'function') {
    debug('pulling composition from exports.composition')
    compiledAST = compiledAST.composition
  }

  if (typeof compiledAST === 'function') {
    debug('composition is function; evaluating it')
    compiledAST = compiledAST()
  }

  if (isValidAst(compiledAST)) {
    return compiledAST
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

// TODO: REMOVE THIS! edit is using it
export const compileSource = (localSourcePath, originalCode?) => {
  debug('compile source', localSourcePath)
  const filename = localSourcePath && path.basename(localSourcePath) // TODO: do we really need this?

  try {
    let errorMessage = ''
    let logMessage = ''
    debug('using require to process composition', localSourcePath)
    // we'll override these temporarily
    const log = console.log
    const err = console.error
    const exit = process.exit

    let compiledResult

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
      compiledResult = require(localSourcePath)
      // if (extension !== 'py') {
      //   compiledResult = require(localSourcePath)
      // }
      // TODO: else

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

    debug('compiledResult', typeof compiledResult, compiledResult)

    compiledResult = allowSourceVariation(compiledResult, logMessage, errorMessage)

    return compiledResult

  } catch (error) {
    // error handler
    return sourceErrHandler(error, originalCode, filename)
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
export const astToComposition = (compiledAST, name) => {
  let composition
  try {
    composition = Composer.parse(compiledAST)
    composition = composition.compile()
    composition.name = fqn(name)
  } catch (error) {
    error.statusCode = 422  // composition error
    throw error
  }
  debug('compiled source to composition', composition)
  return composition
}
