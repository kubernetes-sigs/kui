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

/* eslint-disable prefer-rest-params, prefer-spread */

import Debug from 'debug'
const debug = Debug('main/headless')
debug('loading')

import { installOopsHandler, exec } from '../core/repl'
import mimicDom from '../util/mimic-dom'
import { preload, init as pluginsInit } from '../core/plugins'
import { CodedError } from '../models/errors'
import UsageError from '../core/usage-error'
import { ExecOptions } from '../models/execOptions'
import ISubwindowPrefs from '../models/SubwindowPrefs'

// set the headless capability
import { Media, setMedia } from '../core/capabilities'
setMedia(Media.Headless)

// by default, we'll exit with an exit code of 0 when success is
// called; this bit is necessary, as process.exit doesn't seem to
// really exit the first time
let exitCode = 0

// electron pops up a window by default, for uncaught exceptions
process.on('uncaughtException', async (err: Error) => {
  debug('uncaughtException')
  debug(err)
  const colors = await import('colors/safe')
  console.error(colors.red(err.toString()))
  process.exit(1)
})

process.on('exit', code => {
  debug('exiting', code)
})

let argStart = 1
if (process.env.DEVMODE) {
  // then we're running in dev mode, where the app is started with
  // an extra argument, e.g. "electron ."
  argStart = 2
}

const commandContextPattern = /--command-context/
let commandContext: string

const log = console.log
const error = console.error

debug('modules loaded')

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
const noAuth = false

/** completion handlers for success and failure */
const success = quit => async out => {
  debug('success!')
  if (process.env.KUI_REPL_MODE) {
    debug('returning repl mode result')
    return out
  }

  const { print } = await import('./headless-pretty-print')
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
const failure = (quit, execOptions?: ExecOptions) => async (err: CodedError) => {
  if (execOptions && execOptions.rethrowErrors) {
    throw err
  }

  const code = err.code || err.statusCode
  debug('failure', code, err)

  let completion = Promise.resolve()

  if (!noAuth) {
    // we're not in a corner case of having no credentials, so print
    // the error

    if (process.env.TEST_CODE_ONLY && err.statusCode) {
      // client asked us to emit only the error code
      error(err.statusCode)
    } else {
      let msg
      if (UsageError.isUsageError(err)) {
        msg = UsageError.getFormattedMessage(err)
      } else {
        const { oopsMessage } = await import('../core/oops')
        msg = oopsMessage(err)
      }

      if (typeof msg === 'string') {
        const colors = await import('colors/safe')
        if (process.env.TEST_INCLUDE_CODE && err.statusCode) {
          // client asked for the code and the message
          error(colors.blue(err.statusCode.toString()) + ' ' + colors.red(msg))
        } else {
          // client did not ask for the error code
          error(colors.red(msg))
        }
      } else {
        const { print } = await import('./headless-pretty-print')
        completion = print(msg, error, process.stderr, 'red', 'error') || Promise.resolve()
      }
    }
  } else {
    error(`No credentials found. Consider trying again with "kui help" command.`)
  }

  return completion.then(() => {
    if (!graphicalShellIsOpen) {
      // if the graphical shell isn't open, then we're done here
      exitCode = typeof code === 'number' ? code : 1

      if (!process.env.KUI_REPL_MODE) {
        process.exit(exitCode > 128 ? exitCode - 256 : exitCode)

        // eslint-disable-next-line no-unreachable
        if (quit) {
          quit()
        }
      }
    }

    return false
  })
}

/**
 * Insufficient arguments provided?
 *
 */
const insufficientArgs = (argv: string[]) => argv.length === 0 || (argv.length === 1 && /(-h)|(--help)/.test(argv[0]))

/**
 * Opens the full UI
 *
 */
let electronCreateWindowFn
export const createWindow = async (argv: string[], subwindowPlease: boolean, subwindowPrefs: ISubwindowPrefs) => {
  try {
    graphicalShellIsOpen = true
    const { setGraphicalShellIsOpen } = await import('./headless-pretty-print')
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
const initCommandContext = async (commandContext: string) => {
  if (commandContext) {
    try {
      debug('setting command context', commandContext)
      ;(await import('../core/command-tree')).setDefaultCommandContext(
        JSON.parse(commandContext.substring(commandContext.indexOf('=') + 1))
      )
    } catch (err) {
      debug('Error initializing command context', err)
    }
  }
}

/**
 * Initialize headless mode
 *
 */
export const main = async (app, mainFunctions, rawArgv = process.argv, execOptions?: ExecOptions) => {
  debug('main')

  // get this started right away, to amortize the cost of loading the
  // prescan model; this saves us around 5ms as of 20190709
  const waitForPlugins = pluginsInit()

  const ourCommandContext = rawArgv.find(_ => !!_.match(commandContextPattern))
  debug('commandContext', ourCommandContext)
  if (!commandContext && ourCommandContext) {
    commandContext = ourCommandContext
  }

  const argv = rawArgv
    .slice(argStart)
    .filter(
      arg =>
        !arg.match(commandContextPattern) &&
        arg !== '--kui-headless' &&
        arg !== '-v' &&
        arg !== '--raw-output' &&
        arg !== '--no-color' &&
        arg !== '--no-colors' &&
        arg !== '--color=always' &&
        arg !== '--ui'
    )
  debug('argv', argv)

  const { quit } = app
  installOopsHandler(() => failure(quit, execOptions)) // TODO should be repl.installOopsHandler

  electronCreateWindowFn = mainFunctions.createWindow

  // set up the fake dom
  mimicDom()

  /**
   * Evaluate the given command
   *
   */
  const evaluate = (cmd: string) => Promise.resolve(exec(cmd, execOptions)).then(success(quit))

  const trace = console.trace
  console.trace = () => {
    const tmp = console.error
    console.error = error
    trace()
    console.error = tmp
  }
  console.error = async function() {
    if (!noAuth && typeof arguments[0] === 'string') {
      const colors = await import('colors/safe')
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
    if (
      !process.env.TRAVIS_JOB_ID &&
      !process.env.RUNNING_SHELL_TEST &&
      !process.env.CLOUD_SHELL_GO &&
      !process.env.KUI_REPL_MODE &&
      !process.env.KUI_DEV
    ) {
      const { fetch, watch } = await import('../webapp/util/fetch-ui')
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
  return waitForPlugins
    .then(async (initWasPerformed: boolean) => {
      debug('plugins initialized')

      if (initWasPerformed) {
        await initCommandContext(commandContext)
      }

      const maybeRetry = (err: Error) => {
        // nothing, yet
        return failure(quit, execOptions)(err)
      }

      // warning: this must occur before insufficientArgs as,
      // currently, the help command is registered as a preload
      // handler. i'm not sure why, but that's how it works right now.
      if (initWasPerformed) {
        debug('invoking plugin preloader')
        await preload()
        debug('invoking plugin preloader... done')
      }

      if (insufficientArgs(argv)) {
        debug('insufficient args, invoking help command')
        return evaluate('help')
      }

      //
      // execute a single command from the CLI
      //
      const cmd = argv
        .map(_ => (_.match(/\s+/) ? `"${_}"` : _))
        .join(' ')
        .trim()
      if (cmd && cmd.length > 0) {
        debug('about to execute command')
        return evaluate(cmd).catch(maybeRetry)
      } else {
        debug('exiting, no command')
        if (!process.env.KUI_REPL_MODE) {
          process.exit(0)
        }
      }
    })
    .catch(failure(quit, execOptions))
}

/**
 * Bootstrap headless mode
 *
 */
export async function initHeadless(
  argv: string[],
  force = false,
  isRunningHeadless = false,
  execOptions?: ExecOptions
) {
  if (/* noHeadless !== true && */ force || isRunningHeadless) {
    debug('initHeadless')

    const app = {
      quit: () => process.exit(0)
    }

    //
    // HEADLESS MODE
    //
    try {
      return main(
        app,
        {
          createWindow: async (
            executeThisArgvPlease: string[],
            subwindowPlease: boolean,
            subwindowPrefs: ISubwindowPrefs
          ) => {
            // craft a createWindow that has a first argument of true, which will indicate `noHeadless`
            // because this will be called for cases where we want a headless -> GUI transition
            const { createWindow: createElectronWindow } = await import('./spawn-electron')
            return createElectronWindow(true, executeThisArgvPlease, subwindowPlease, subwindowPrefs)
          }
        },
        argv,
        execOptions
      )
    } catch (err) {
      // oof, something real bad happened
      console.error('Internal Error, please report this bug:')
      console.error(err)
      if (!process.env.KUI_REPL_MODE) {
        process.exit(1)
      } else {
        throw err
      }
    }
  } else {
    // in case the second argument isn't undefined...
    /* if (noHeadless !== true) {
      executeThisArgvPlease = undefined
    } */
  }
} /* initHeadless */
