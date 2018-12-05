/*
 * Copyright 2017 IBM Corporation
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

import { fstatSync } from 'fs'
import * as colors from 'colors/safe'
import * as events from 'events'

import * as repl from '../core/repl'
import { prequire, preload, init as pluginsInit } from '../core/plugins'
import Store from './store'

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

const verbose = process.argv.find(_ => _ === '-v')
const rawOutput = process.argv.find(_ => _ === '--raw-output') // don't try to pretty-print the JSON; c.f. jq's --raw-output
const colorAlways = process.argv.find(_ => _ === '--color=always')
const neverColor = process.argv.find(_ => _ === '--no-color' || _ === '--no-colors')
const commandContextPattern = /--command-context/
const commandContext = process.argv.find(_ => !!_.match(commandContextPattern))
const argv = process.argv.slice(argStart).filter(arg => !arg.match(commandContextPattern) && arg !== '--kui-headless' && arg !== '-v' && arg !== '--raw-output' && arg !== '--no-color' && arg !== '--no-colors' && arg !== '--color=always' && arg !== '--ui')
const log = console.log
const error = console.error

debug('modules loaded')
debug('argv', process.argv)

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

  const prompt = (msg: string, block, nextBlock, options, completion) => new Promise(async (resolve, reject) => {
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
  })
}

const colorMap = {
  'var(--color-brand-01)': 'blue',
  'var(--color-brand-02)': 'blue',
  'var(--color-support-02)': 'blue'
}

/**
 * Try to pretty print one of our fake doms
 *
 */
interface IPrettyOptions {
  columnWidths?: { [key: number]: number },
  extraColor?: string
}
class DefaultPrettyOptions implements IPrettyOptions {
  constructor () {
    // empty
  }
}
let firstPrettyDom = true // so we can avoid initial newlines for headers
const prettyDom = (dom, logger = log, stream = process.stdout, _color, { columnWidths, extraColor: _extraColor }: IPrettyOptions = new DefaultPrettyOptions()) => {
  const isHeader = dom.nodeType === 'h1' || dom.nodeType === 'h2'
  const capitalize = dom.className.indexOf('bx--no-link') >= 0
  const hasMargin = dom.className.indexOf('bx--breadcrumb-item--slash') >= 0 ||
        dom.className.indexOf('left-pad') >= 0

  if (hasMargin) {
    stream.write(' ')
  }

  const extraColor = isHeader || dom.hasStyle('fontWeight', 'bold') ? 'bold'
    : dom.hasStyle('fontWeight', 500) ? 'green'
    : dom.hasStyle('fontSize', '0.875em') ? 'gray'
    : _extraColor || 'reset'
  const colorCode = dom.hasStyle('color') || _color
  const color = colorMap[colorCode] || colorCode
  // debug('colors', isHeader, color, extraColor)

  if (isHeader) {
    // an extra newline before headers
    if (firstPrettyDom) {
      // don't emit a header margin for the very first thing
      // we print
      firstPrettyDom = false
    } else {
      logger()
    }
  }

  if (dom.innerText) {
    const text = capitalize ? dom.innerText.charAt(0).toUpperCase() + dom.innerText.slice(1)
      : dom.innerText
    // debug('text', color, extraColor)
    stream.write(colors[color][extraColor](text))
  }

  const newline = () => {
    if (dom.nodeType === 'div' || isHeader) {
      // not perfect, but treat divs as line breakers
      logger()
    }
  }

  if (hasMargin) {
    stream.write(' ')
  }

  if (dom.innerText) {
    newline()
  }

  // recurse to the children of this fake DOM
  dom.children.forEach(child => prettyDom(child, logger, stream, _color, { extraColor }))

  // handle table rows and cells:
  if (dom.rows) {
    // scan the table for max column widths
    const columnWidths = []
    dom.rows.forEach(row => {
      if (row.cells) {
        row.cells.forEach((cell, idx) => {
          const length = cell.recursiveInnerTextLength()
          if (!columnWidths[idx]) columnWidths[idx] = length
          else columnWidths[idx] = Math.max(columnWidths[idx], length)
        })
      }
    })

    dom.rows.forEach(row => {
      prettyDom(row, logger, stream, _color, { columnWidths })
      logger() // insert a newline after every row
    })
  }
  if (dom.cells) {
    dom.cells.forEach((cell, idx) => {
      prettyDom(cell, logger, stream, _color)

      if (columnWidths && idx < dom.cells.length - 1) {
        // pad out this column to the column width (except we don't
        // need padding in the last column)
        const slop = columnWidths[idx] - cell.recursiveInnerTextLength()
        for (let jj = 0; jj < slop; jj++) {
          stream.write(' ')
        }

        // and then a few more to separate the columns
        stream.write('  ')
      }
    })
  }

  // trailing carriage return?
  if (isHeader && !dom.innerText) {
    logger()
  }
}

/**
 * Determine whether how pretty we should make the output; if stdout
 * is a pipe, then we shouldn't pass through colors, unless
 * the user specified --color=always.
 *
 */
const stdoutIsFIFO = process.platform !== 'win32' && fstatSync(1).isFIFO() // 1 is the file descriptor for stdout
const noColor = neverColor || (stdoutIsFIFO && !colorAlways)
debug('stdoutIsFIFO', stdoutIsFIFO, noColor)

/**
 * Pretty print an object as JSON. If the user asked for --raw-output,
 * only use the more primitive JSON.stringify. Otherwise, use the
 * `json-colorizer` npm to do some fancier rendering. Note how we avoid the use
 * of json-colorizer if the output is a pipe (see
 * https://github.com/ibm-functions/shell/issues/1075)
 *
 */
const prettyJSON = (msg, logger = log) => {
  const serialized = JSON.stringify(msg, undefined, 2) // Warning: Don't pass the JSON structure 'msg' directly to json-colorizer! json-colorizer doesn't give us a pretty format and only colorizes the JSON structure.

  if (rawOutput || noColor) {
    debug('prettyJSON raw')
    return logger(serialized)
  } else {
    debug('prettyJSON using json-colorizer')
    const colorize = require('json-colorizer')
    return logger(colorize(serialized))
  }
}

/**
 * Render a name with an optional package name
 *
 */
const pn = (actionName: string, packageName?: string) => colors.dim(`${packageName ? packageName + '/' : ''}`) + colors.blue(actionName)

/**
 * Render a date; if it is from today, show just the time
 *
 */
const prettyDate = millis => {
  const date = new Date(millis)
  const now = new Date()
  if (date.getUTCFullYear() === now.getUTCFullYear() &&
        date.getUTCMonth() === now.getUTCMonth() &&
        date.getUTCDate() === now.getUTCDate()) {
    return date.toLocaleTimeString()
  } else {
    return date.toLocaleString()
  }
}

/**
 * Turn an entity into a row, because this entity came as part of an
 * array of entities
 *
 */
const pp = _ => colors.dim(_ ? 'public' : 'private') // pretty publish
const pk = _ => colors.green(_.find(({ key }) => key === 'exec').value) // pretty kind

const rowify = {
  composition: ({ name, packageName, version, fsm, type }) => ({ name: pn(name, packageName), type }),
  session: ({ sessionId, name, success, status, start }) => ({ sessionId, app: pn(name), start: colors.dim(prettyDate(start)), status: status === 'pending' ? colors.yellow(status) : success ? colors.green(status) : colors.red(status) }),
  activations: ({ activationId, name }) => ({ activationId, name: pn(name) }),
  actions: ({ name, packageName, publish, annotations, version, header }) => ({ name: pn(name, packageName), 'published?': pp(publish), kind: pk(annotations), version: colors.dim(version) }),
  triggers: ({ name, publish }) => ({ name: pn(name), 'published?': pp(publish) }),
  packages: ({ name, publish, binding }) => ({ name: pn(name), 'published?': pp(publish), binding }),
  plugins: ({ name, attributes }) => {
    return { name: pn(name), version: colors.dim(attributes.find(({ key }) => key === 'version').value) }
  },
  _default: ({ key, name, attributes }) => {
    const row = { }

    row[key || 'name'] = pn(name)

    attributes.forEach(attr => {
      if (!attr.placeholderValue) {
        row[attr.key] = attr.value
      }
    })

    return row
  }
}
rowify['sequence'] = rowify.actions // same formatter...
rowify['composer'] = rowify['sequence'] // same formatter...
rowify['binding'] = rowify.packages // same formatter...
rowify['live'] = rowify.session // same formatter...

/**
 * Pretty print routine that dispatches to the underlying smarter
 * pretty printers (such as prettyDom and prettyjson)
 *
 */
const print = (msg, logger = log, stream = process.stdout, color = 'reset', ok = 'ok') => {
  debug('printing in this color: %s', color)

  if (verbose && typeof msg === 'string') {
    debug('printing raw JSON, due to -v')
    return prettyJSON(msg, logger)
  }

  if (msg && !graphicalShellIsOpen) {
    try {
      if (msg === true) {
        // true is the graphical shell's way of telling the repl to print 'ok'
        debug('printing plain true')
        logger(colors.green(ok))
      } else if (msg.context) {
        // a changeDirectory response; print the underlying message
        return print(msg.message, logger, stream, color)
      } else if (typeof msg === 'object') {
        debug('printing some sort of javascript object')

        if (msg._isFakeDom) {
          // msg is a DOM facade
          debug('printing fake dom')

          if (msg.className.indexOf('usage-error-wrapper') >= 0) {
            // print usage errors to stdout
            stream = process.stdout
            logger = log
            // color = 'reset'
          }

          prettyDom(msg, logger, stream, color)
          logger()
        } else if (msg.then) {
          // msg is a promise; resolve it and try again
          debug('printing promise')
          return msg.then(msg => print(msg, logger, stream, color, ok))
        } else if (msg.message && msg.message._isFakeDom) {
          // msg.message is a DOM facade
          prettyDom(msg.message, logger, stream, color)
          logger()
        } else if (Array.isArray(msg)) {
          // msg is an array of stuff
          debug('printing array')
          if (msg.length > 0) {
            try {
              if (typeof msg[0] === 'string') {
                // then we have a simple array of strings, not entities
                msg.forEach(_ => {
                  const logline = _.split(/(stdout|stderr)/)
                  if (logline && logline.length === 3 && !rawOutput) {
                    // then this is a log line
                    const color = logline[1] === 'stdout' ? 'reset' : 'red'

                    logger(colors.dim(new Date(logline[0].trim()).toLocaleString()) + // timestamp
                           // + ' ' + colors.yellow(logline[1])                    // stream (stdout, stderr)
                           colors[color](logline[2].replace(/^:/, ''))) // log message
                  } else {
                    // otherwise, we're not sure what this is,
                    // so do not attempt to render it in a special way
                    logger(_)
                  }
                })
                return logger(colors.green(ok))
              } else if (Array.isArray(msg[0])) {
                msg.map(_ => print(_, logger, stream, color, ok))
              } else {
                // strip off header row, as we'll make our own
                msg = msg.filter(row => !row.header && (!row.outerCSS || !row.outerCSS.match(/header-cell/)))
                const print = rowify[msg[0].prettyType || msg[0].type] || rowify._default
                logger(require('columnify')(msg.map(print), { headingTransform: _ => colors.dim(_) }))
              }
            } catch (err) {
              error(err)
            }
          }
        } else if (msg.verb && msg.name && (msg.verb === 'create' || msg.verb === 'update')) {
          // msg is an openwhisk entity, that has just been created or updated
          debug('printing create or update')
          const isWebExported = msg.annotations && msg.annotations.find(({ key }) => key === 'web-export')
          if (isWebExported) {
            const contentType = (msg.annotations && msg.annotations.find(({ key }) => key === 'content-type-extension')) || { value: 'json' }
            const https = msg.apiHost.startsWith('https://') || msg.apiHost.startsWith('http://') ? ''
              : msg.apiHost === 'localhost' ? 'http://' : 'https://'
            const urlText = `${https}${msg.apiHost}/api/v1/web/${msg.namespace}/${!msg.packageName ? 'default/' : ''}${msg.name}.${contentType.value}`
            logger(colors.blue(urlText))
          }
          logger(colors.green(`${ok}:`) + ` updated ${msg.type.replace(/s$/, '')} ${msg.name}`)
        } else if (msg.verb === 'delete') {
          debug('printing delete')
          logger(colors.green(`${ok}:`) + ` deleted ${msg.type.replace(/s$/, '')} ${msg.name}`)
        } else if (msg.verb === 'async' && msg.activationId /* && msg.response */) {
          // The returned msgs of action and app are different
          msg.type === 'activations' ? logger(colors.green(`${ok}:`) + ` invoked ${msg.entity.name} with id ${msg.activationId}`)
            : logger(colors.green(`${ok}:`) + ` invoked ${msg.name} with id ${msg.activationId}`)
        } else if (msg.verb === 'get' && msg.activationId /* && msg.response */) {
          // msg is an openwhisk entity representing an invocation
          // commenting out this line diverges us from bx wsk output, but we're ok with that:
          // logger(colors.green(`${ok}:`) + ` got activation ${msg.activationId}`)
          debug('printing get OpenWhisk activation')
          delete msg.prettyType
          delete msg.verb
          delete msg.publish
          delete msg.type
          delete msg.apiHost
          delete msg.modes
          delete msg.version
          delete msg.entity
          if (msg.activatonId && msg.sessionid) delete msg.activationId // don't display both
          prettyJSON(msg, logger)
        } else {
          // otherwise, print it as generic JSON
          if (msg.verb === 'get') {
            delete msg.exec
            delete msg.verb
            delete msg.publish
            delete msg.type
            delete msg.apiHost
            delete msg.modes
            delete msg.version
          }
          prettyJSON(msg, logger)
        }
      } else if (typeof msg === 'string') {
        // logger(colors.green(`${ok}: `) + msg)
        logger(msg)
      } else {
        logger(colors[color](msg))
      }
    } catch (err) {
      debug('got an error', err)
      logger(colors.red(msg))
    }
  }
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
