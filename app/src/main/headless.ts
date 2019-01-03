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

const debug = require('debug')('main/headless')
debug('loading')

import * as colors from 'colors/safe'
import * as events from 'events'

import * as repl from '../core/repl'
import { prequire, preload, init as pluginsInit } from '../core/plugins'
import Store from './store'
import { print, setGraphicalShellIsOpen } from './headless-pretty-print'

// set the headless capability
import { Media, setMedia } from '../core/capabilities'
setMedia(Media.Headless)

// by default, we'll exit with an exit code of 0 when success is
// called; this bit is necessary, as process.exit doesn't seem to
// really exit the first time
let exitCode = 0

// electron pops up a window by default, for uncaught exceptions
process.on('uncaughtException', err => {
  debug('uncaughtException')
  console.error(colors.red(err.toString()))
  process.exit(1)
})

let argStart = 1
if (process.env.DEVMODE) {
  // then we're running in dev mode, where the app is started with
  // an extra argument, e.g. "electron ."
  argStart = 2
}

const commandContextPattern = /--command-context/
const commandContext = process.argv.find(_ => !!_.match(commandContextPattern))
const argv = process.argv.slice(argStart).filter(arg => !arg.match(commandContextPattern) && arg !== '--kui-headless' && arg !== '-v' && arg !== '--raw-output' && arg !== '--no-color' && arg !== '--no-colors' && arg !== '--color=always' && arg !== '--ui')

const log = console.log
const error = console.error

debug('modules loaded')
debug('argv', argv)

/**
 * Certain commands may open the graphical shell; remember this, so
 * we know not to process.exit
 *
 */
let graphicalShellIsOpen = false

/**
 * Are we in the middle of a hasty retreat?
 *
 */
let noAuth = false

// TODO factor this out
let ns
let auth
const setNoAuth = () => {
  if (!graphicalShellIsOpen) {
    noAuth = true
    repl.setNoAuth()
  }
}
const namespace = {
  init: async () => {
    const wsk = await prequire('openwhisk')
    try {
      auth = wsk.auth.get()
      return wsk.namespace.get()
        .then(_ => { ns = _; return ns })
        .catch(() => {
          setNoAuth()
        })
    } catch (err) {
      setNoAuth()
      return Promise.resolve()
    }
  },
  setApiHost: () => {
    // no-op; this would update any UI elements for electron mode
  },
  setNoNamespace: () => {
    // no-op; this would update any UI elements for electron mode
  },
  get: ons => ons === ns ? Promise.resolve(auth) : Promise.resolve(undefined),
  list: () => Promise.resolve(ns ? [{ namespace: ns }] : []),
  store: (newNamespace, auth) => { ns = newNamespace; return ns },
  current: () => {
    if (!ns) {
      throw new Error('namespace uninitialized')
    } else {
      return ns
    }
  }
}

const ui = {
}

/**
 * Create structures to mimic having a head
 *
 */
function mimicDom (app) {
  debug('mimicDom')

  const { quit } = app

  try {
    global['localStorage'] = Store(app)
    debug('successfully initialized persistent localStorage')
  } catch (err) {
    debug('error initializing persistent localStorage', err)

    const localStorage = {}
    global['localStorage'] = {
      setItem: (k, v) => { localStorage[k] = v; return v },
      getItem: k => localStorage[k] || null
    }
  } finally {
    global['window'] = { localStorage: global['localStorage'] }
  }

  const dom0 = () => {
    const obj = {
      _isFakeDom: true,
      value: '',
      innerText: '',
      innerHTML: '',
      className: '',
      _classList: [],
      classList: {
        add: _ => obj._classList.push(_),
        remove: _ => {
          const idx = obj._classList.findIndex(x => x === _)
          if (idx >= 0) {
            obj._classList.splice(idx, 1)
          }
        }
      },
      nodeType: '',
      attrs: {},
      style: {},
      children: [],
      focus: () => { /* empty ok */ },
      appendChild: c => obj.children.push(c),
      getAttribute: (k: string) => obj.attrs[k] || '',
      setAttribute: (k: string, v) => { obj.attrs[k] = v; return v },
      removeAttribute: (k: string) => delete obj.attrs[k],
      cloneNode: () => Object.assign({}, obj),
      querySelectorAll: selector => [],
      querySelector: sel => {
        return obj[sel] || dom0()
      },
      hasStyle: (style, desiredValue) => {
        const actualValue = obj.style && obj.style[style]
        // intentional double equals, so that 500=='500'
        if (desiredValue) return desiredValue == actualValue // tslint:disable-line
        else return actualValue
      },
      recursiveInnerTextLength: () => {
        return obj.innerText.length + obj.children.reduce((sum, child) => sum + child.recursiveInnerTextLength(), 0)
      }
    }

    return obj
  }
  const dom = () => Object.assign(dom0(), {
    input: dom0()
  })
  const block = () => Object.assign(dom(), {
    '.repl-result': dom0()
  })

  const document = {
    body: dom0(),
    createElement: type => {
      const element = dom0()
      element.nodeType = type
      if (type === 'table') {
        element['rows'] = []
        element['insertRow'] = idx => {
          const row = document.createElement('tr')
          row['cells'] = []
          row['insertCell'] = idx => {
            const cell = document.createElement('td')
            if (idx === -1) row['cells'].push(cell)
            else row['cells'].splice(idx, 0, cell)
            return cell
          }
          if (idx === -1) element['rows'].push(row)
          else element['rows'].splice(idx, 0, row)
          return row
        }
      }
      return element
    },
    addEventListener: () => true,
    createTextNode: text => { const element = dom0(); element.innerText = text; return element },
    querySelector: selector => {
      if (selector === '#openwhisk-namespace') {
        return {
          getAttribute: () => {
            return namespace.current()
          }
        }
      } else {
        return dom0()
      }
    }
  }
  global['document'] = document
  // global.eventBus = new events.EventEmitter()

  /* const prompt = (msg: string, block, nextBlock, options, completion) => new Promise(async (resolve, reject) => {
    const rl = await import('readline')
    const prompt = rl.createInterface({ input: process.stdin, output: process.stdout })
    try {
      prompt.question(`${msg} ${options.placeholder} `, answer => {
        try {
          log('ok'.green)
          return completion(Object.assign({}, options, { field: answer }))
            .then(resolve)
            .catch(reject)
        } catch (err) {
          failure(quit)(err); reject(err)
        }
      })
    } catch (err) {
      failure(quit)(err); reject(err)
    }
  }) */
}

/** completion handlers for success and failure */
const success = quit => async out => {
  debug('success!')
  await print(out, log, process.stdout)

  if (!graphicalShellIsOpen) {
    quit()
    process.exit(exitCode)
  } else {
    // log('The graphical shell should now be open. This process will stay alive till you close the window.'.red)
    // log('You may background this process, but do not kill it, unless you also want to kill the graphical shell.'.red)
    debug('graphical shell is open')
  }
}
const failure = quit => async err => {
  const code = err.code || err.statusCode
  debug('failure', code, err)

  let completion = Promise.resolve()

  if (!noAuth) {
    // we're not in a corner case of having no openwhisk auth, so
    // print the error
    const { oopsMessage } = await import('../core/oops')
    const msg = oopsMessage(err)

    if (process.env.TEST_CODE_ONLY && err.statusCode) {
      // client asked us to emit only the error code
      error(err.statusCode)
    } else if (typeof msg === 'string') {
      if (process.env.TEST_INCLUDE_CODE && err.statusCode) {
        // client asked for the code and the message
        error(colors.blue(err.statusCode.toString()) + ' ' + colors.red(msg))
      } else {
        // client did not ask for the error code
        error(colors.red(msg))
      }
    } else {
      completion = print(msg, error, process.stderr, 'red', 'error') || Promise.resolve()
    }
  } else {
    error(`No wskprops file was found. Consider trying again with "kui help" command.`)
  }

  return completion.then(() => {
    if (!graphicalShellIsOpen) {
      // if the graphical shell isn't open, then we're done here
      exitCode = typeof code === 'number' ? code : 1

      if (exitCode === 401) {
        const fs = require('fs')
        const expandHomeDir = require('expand-home-dir')
        const propertiesParser = require('properties-parser')
        const wskprops = expandHomeDir('~/.wskprops')

        if ((!fs.existsSync(wskprops) || !propertiesParser.read(wskprops).AUTH) &&
                    !process.env.__OW_API_KEY) {
          // hmm, the user doesn't seem to have any credentials, yet
          error('')
          error('Please use ' + colors.yellow('ibmcloud login') + ' followed by ' + colors.green('ibmcloud wsk list') +
                          ' to acquire the necessary credentials.')
        }
      }

      process.exit(exitCode > 128 ? exitCode - 256 : exitCode)
      if (quit) quit()
    }

    return false
  })
}

/**
 * Insufficient arguments provided?
 *
 */
const insufficientArgs = () => argv.length === 0

/**
 * Opens the full UI
 *
 */
let electronCreateWindowFn
export const createWindow = (argv: Array<string>, subwindowPlease: boolean, subwindowPrefs) => {
  try {
    graphicalShellIsOpen = true
    setGraphicalShellIsOpen()

    const commandLine = argv
    if (commandContext) {
      commandLine.push(commandContext)
    }

    electronCreateWindowFn(commandLine, subwindowPlease, subwindowPrefs)
  } catch (err) {
    error(err)
  }
}

/**
 *
 *
 */
const initCommandContext = async () => {
  if (commandContext) {
    try {
      debug('setting command context', commandContext);
      (await import('../core/command-tree')).setDefaultCommandContext(JSON.parse(commandContext.substring(commandContext.indexOf('=') + 1)))
    } catch (err) {
      debug('Error initializing command context', err)
    }
  }
}

/**
 * Initialize headless mode
 *
 */
export const main = async (app, mainFunctions) => {
  debug('main')

  const { quit } = app
  repl.installOopsHandler(() => failure(quit)) // TODO should be repl.installOopsHandler

  electronCreateWindowFn = mainFunctions.createWindow

  // set up the fake dom
  mimicDom(app)

  /**
   * Evaluate the given command
   *
   */
  const evaluate = cmd => Promise.resolve(repl.exec(cmd))
    .then(success(quit))

  console.log = function () {
    if (arguments[0] !== undefined &&
        (!arguments[0].indexOf || (arguments[0].indexOf('::') < 0 && arguments[0].indexOf('Resolving') < 0 &&
                                   arguments[0].indexOf('using implicit context') < 0 &&
                                   arguments[0].indexOf('Using timeout') < 0 &&
                                   arguments[0].indexOf('Updates') < 0 &&
                                   arguments[0].indexOf("Couldn't set selectedTextBackgroundColor") < 0 &&
                                   arguments[0].indexOf('Unresolved') < 0 && arguments[0].indexOf('Processing catch-alls') < 0))) {
      log.apply(undefined, arguments)
    }
  }
  const trace = console.trace
  console.trace = () => {
    const tmp = console.error
    console.error = error
    trace()
    console.error = tmp
  }
  console.error = function () {
    if (!noAuth && typeof arguments[0] === 'string') {
      const args = Object.keys(arguments).map(key => {
        if (typeof arguments[key] === 'string') {
          const color = arguments[key].match(/warning:/i) ? 'yellow' : 'red'
          return colors[color](arguments[key])
        } else {
          return arguments[key]
        }
      })
      error(...args)
    }
  }

  try {
    if (!process.env.TRAVIS_JOB_ID && !process.env.RUNNING_SHELL_TEST && !process.env.CLOUD_SHELL_GO &&
       !process.env.KUI_DEV) {
      const { fetch, watch } = await import('../../plugins/bin/fetch-ui')
      const { userDataDir } = await import('../core/userdata')
      const stagingArea = userDataDir()
      debug('initiating UI fetcher', stagingArea)

      fetch(stagingArea)
      app.graphics = watch(stagingArea)
    }
  } catch (err) {
    debug('error loading graphics', err)
  }

  /** main work starts here */
  debug('bootstrap')
  pluginsInit(/* { app } */).then(async () => {
    debug('plugins initialized')

    await initCommandContext()

    const maybeRetry = err => {
      if (/*! namespace.current() || */ err.message === 'namespace uninitialized') {
        debug('delayed namespace loading')
        return namespace.init()
          .then(() => evaluate(cmd))
          .catch(failure(quit))
      } else {
        return failure(quit)(err)
      }
    }

    debug('invoking plugin preloader')
    await preload()
    debug('invoking plugin preloader... done')

    if (insufficientArgs()) {
      debug('insufficient args, invoking help command')
      return evaluate('help')
    }

    //
    // execute a single command from the CLI
    //
    const cmd = argv.map(_ => _.match(/\s+/) ? `"${_}"` : _).join(' ').trim()
    if (cmd && cmd.length > 0) {
      debug('about to execute command')
      return evaluate(cmd).catch(maybeRetry)
    } else {
      debug('exiting, no command')
      process.exit(0)
    }
  }).then(success(quit)).catch(failure(quit))
}
