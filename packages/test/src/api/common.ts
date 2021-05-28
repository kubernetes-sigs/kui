/*
 * Copyright 2019 The Kubernetes Authors
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

import { join, relative } from 'path'
import * as colors from 'colors'
import { Func, Suite, HookFunction, after as mochaAfter } from 'mocha'
import { Application } from 'spectron'

import { version } from '@kui-shell/client/package.json'

import * as CLI from './cli'
import * as Selectors from './selectors'

const TMP = require('os').tmpdir()

colors.enable()

const codeCoverageNyc = () =>
  process.env.TRAVIS_BUILD_DIR
    ? join(process.env.TRAVIS_BUILD_DIR, 'node_modules/nyc')
    : join(process.env.TEST_SUITE_ROOT, '../nyc')
const codeCoverageRoot = () => relative(process.env.TEST_ROOT, join(process.env.TEST_SUITE_ROOT, 'core'))
const codeCoverageTempDirectory = () =>
  process.env.TRAVIS_BUILD_DIR
    ? join(process.env.TRAVIS_BUILD_DIR, 'packages/test/.nyc_output')
    : join(process.env.TEST_ROOT, '.nyc_output')

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface ISuite extends Suite {
  app: Application
  _kuiDestroyAfter?: boolean
}

/**
 * Were we asked to generate code coverage data? The logic here is: if
 * we were asked for codecov, i.e. NYC is defined, then outside of
 * travis, always do it; inside of travis, only do it for electron
 * targets (i.e. not for headless and not for webpack).
 *
 */
function codeCoverageDesired() {
  return process.env.NYC !== undefined && (!process.env.TRAVIS_JOB_ID || process.env.MOCHA_RUN_TARGET === 'electron')
}

/**
 * Write out any code coverage data we might have accumulated
 *
 */
declare let __coverage__: Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
async function writeCodeCoverage(app: Application) {
  if (codeCoverageDesired() && app && app.client) {
    console.log('Writing code coverage data')
    await app.client.executeAsync(
      function() {
        const tempDirectory: string = arguments[0] // eslint-disable-line prefer-rest-params
        const nycModule: string = arguments[1] // eslint-disable-line prefer-rest-params
        const root: string = arguments[2] // eslint-disable-line prefer-rest-params
        const TMP: string = arguments[3] // eslint-disable-line prefer-rest-params
        const done: () => void = arguments[4] // eslint-disable-line prefer-rest-params

        // Notes: in several places, the nyc constructor assumes
        // process.cwd() exists; in some of our tests, e.g. those that
        // cd around, this might not be the case. So: before we invoke
        // the constructor, change to an extant directory
        process.chdir(TMP)

        // Create the nyc instance
        const NYC = require(nycModule)
        const nyc = new NYC({ tempDirectory, cwd: root })

        // in case we are the first to the line
        nyc.createTempDirectory()

        // Notes: the nyc impl of this removes all of our coverage data due to its
        // this.exclude.shouldInstrument filter (on our about line 343 of its index.js)
        // nyc.writeCoverageFile()

        // see https://github.com/IBM/kui/issues/3217 for some discussion
        Object.keys(__coverage__).forEach(function(absFile) {
          const map = JSON.parse(require('fs').readFileSync(`${absFile}.map`))
          nyc.sourceMaps._sourceMapCache.registerMap(absFile, map)
        }, nyc)

        // so... instead we take care of writeCoverageFile ourselves
        const coverage = nyc.sourceMaps.remapCoverage(__coverage__)
        const coverageFilename = require('path').resolve(tempDirectory, nyc.processInfo.uuid + '.json')
        require('fs').writeFileSync(coverageFilename, JSON.stringify(coverage), 'utf-8')
        setTimeout(done, 0)
      },
      codeCoverageTempDirectory(),
      codeCoverageNyc(),
      codeCoverageRoot(),
      TMP
    )
  }
}

/**
 * Try to avoid restarting electron if we can; then, when all is said
 * and done, quit that singleton electron
 *
 */
let app: Application
mochaAfter(async () => {
  if (app && app.isRunning()) {
    await app.stop()
  }
})

/**
 * Get the electron parts set up, and return an Application
 * instance. Note that this won't actually start the electron process,
 * which can subsequently be done by calling `start()` on the return
 * value of this function.
 *
 */

interface SpectronOptions {
  env: Record<string, string>
  chromeDriverArgs: string[]
  startTimeout: number
  waitTimeout: number
  port?: number
  path?: typeof Electron | string
  args?: string[]
  chromeDriverLogPath?: string
  webdriverLogPath?: string
}

const waitTimeout = parseInt(process.env.TIMEOUT) || 60000

const prepareElectron = (popup: string[]) => {
  const Application = require('spectron').Application
  const electron = require('electron') // relative to __dirname
  const appMain = process.env.APP_MAIN || '../../node_modules/@kui-shell/core/dist/main/main.js' // relative to the tests/ directory

  const opts: SpectronOptions = {
    env: {},
    chromeDriverArgs: ['--no-sandbox'],
    // chromeDriverLogPath: '/tmp/cd.log',
    // webdriverLogPath: '/tmp',
    startTimeout: parseInt(process.env.TIMEOUT) || 60000, // see https://github.com/IBM/kui/issues/2227
    waitTimeout
  }

  /* if (!popup && (process.env.HEADLESS !== undefined || process.env.TRAVIS_JOB_ID !== undefined)) {
    console.log('Using chromedriver in headless mode')
    opts.chromeDriverArgs.push('--headless')
  } else {
    console.log('Using chromedriver NOT in headless mode')
  } */

  if (process.env.PORT_OFFSET) {
    const offset = parseInt(process.env.PORT_OFFSET, 10)

    opts.port = 9515 + offset
    opts.chromeDriverArgs.push(`--remote-debugging-port=${57289 + offset}`)

    const userDataDir = join(TMP, `kui-profile-${process.env.PORT_OFFSET}`)
    opts.chromeDriverArgs.push(`--user-data-dir=${userDataDir}`)

    console.log(`Using chromedriver port ${opts['port']}`)
    console.log(`Using chromedriver user-data-dir ${userDataDir}`)
  }

  if (process.env.MOCHA_RUN_TARGET === 'webpack') {
    console.log(`Testing Webpack against chromium`)
    opts['path'] = electron // this means spectron will use electron located in node_modules
    opts['args'] = [join(process.env.TEST_SUITE_ROOT, 'core/tests/lib/main.js')]
  } else if (process.env.TEST_FROM_BUILD) {
    console.log(`Using build-based assets: ${process.env.TEST_FROM_BUILD}`)
    opts['path'] = process.env.TEST_FROM_BUILD
  } else {
    console.log('Using filesystem-based assets')
    opts['path'] = electron // this means spectron will use electron located in node_modules
    opts['args'] = [appMain] // in this mode, we need to specify the main.js to use
  }

  if (process.env.CHROMEDRIVER_PORT) {
    opts['port'] = parseInt(process.env.CHROMEDRIVER_PORT)
  }
  if (process.env.WSKNG_NODE_DEBUG) {
    // pass WSKNG_DEBUG on to NODE_DEBUG for the application
    opts.env['NODE_DEBUG'] = process.env.WSKNG_NODE_DEBUG
  }
  if (process.env.DEBUG) {
    opts.env['DEBUG'] = process.env.DEBUG
  }

  if (popup) {
    // used in spawn-electron.ts
    opts.env['KUI_POPUP'] = JSON.stringify(popup)
    opts.env['KUI_POPUP_WINDOW_RESIZE'] = 'true'
  }

  return new Application(opts)
}

/** Add app.client commands */
function addCommands(ctx: ISuite) {
  // add an isActive command; isFocused is not what we want
  if (ctx.app && ctx.app.client) {
    // ref: https://github.com/webdriverio/webdriverio/issues/1362#issuecomment-224042781
    ctx.app.client.addCommand('isActive', selector => {
      return ctx.app.client.execute(selector => {
        const focused = document.activeElement

        if (!focused || focused === document.body) {
          return false
        } else if (document.querySelector) {
          return document.querySelector(selector) === focused
        }

        return false
      }, selector)
    })
  }
}

/** restart the app */
export const restart = async (ctx: ISuite) => {
  try {
    await ctx.app.restart()
    addCommands(ctx)
  } catch (err) {
    const errorIsNavigatedError: boolean =
      err.message.includes('Inspected target navigated or closed') ||
      err.message.includes('cannot determine loading status') ||
      err.message.includes('Inspected target navigated or closed')

    if (!errorIsNavigatedError) {
      throw err
    }
  }

  return CLI.waitForSession(ctx)
}

/** reload the app */
export const refresh = async (ctx: ISuite, wait = true, clean = false) => {
  try {
    await ctx.app.client.refresh()
  } catch (err) {
    const errorIsNavigatedError: boolean =
      err.message.includes('Inspected target navigated or closed') ||
      err.message.includes('cannot determine loading status') ||
      err.message.includes('Inspected target navigated or closed')

    if (!errorIsNavigatedError) {
      throw err
    }
  }

  if (clean) {
    await ctx.app.client.execute(() => localStorage.clear())
  }
  if (wait) {
    await CLI.waitForSession(ctx)
    await CLI.waitForRepl(ctx.app)
  }
}

export interface BeforeOptions {
  noApp?: boolean
  popup?: string[]
  noProxySessionWait?: boolean
  afterStart?: () => Promise<void>
  beforeStart?: () => Promise<void>
}

/**
 * This is the method that will be called before a test begins
 *
 */
export const before = (ctx: ISuite, options?: BeforeOptions): HookFunction => {
  const noApp = (options && options.noApp) || false
  const popup = options && options.popup
  const beforeStart = options && options.beforeStart
  const afterStart = options && options.afterStart
  const noProxySessionWait = options && options.noProxySessionWait

  if (process.env.TRAVIS_JOB_ID) {
    ctx.retries(1) // don't retry the mocha.it in local testing
  }

  return async function() {
    // by default, we expect not to have to destroy the app when this
    // describe is done
    ctx['_kuiDestroyAfter'] = false

    if (popup) {
      // e.g. used in CLI.waitForRepl to find the prompt
      process.env.KUI_POPUP = 'true'
    } else {
      delete process.env.KUI_POPUP
    }

    if (!noApp) {
      if (app && !popup) {
        if (!beforeStart && !afterStart) {
          ctx.app = app
          try {
            await refresh(ctx, !noProxySessionWait, true)
            return
          } catch (err) {
            const errorIsNavigatedError: boolean =
              err.message.includes('Inspected target navigated or closed') ||
              err.message.includes('cannot determine loading status') ||
              err.message.includes('Inspected target navigated or closed')
            if (!errorIsNavigatedError) {
              console.error('error refreshing in before for reuse start', err)
              throw err
            }
          }
        }
      }
      ctx.app = prepareElectron(popup)
      if (popup) {
        // for popups, we want to destroy the app when the describe is done
        ctx['_kuiDestroyAfter'] = true
      } else {
        app = ctx.app
      }
    }

    try {
      if (beforeStart) {
        await beforeStart()
      }

      // start the app, if requested
      const start = noApp
        ? () => Promise.resolve()
        : () => {
            return (
              ctx.app
                .start() // this will launch electron
                // commenting out setTitle due to buggy spectron (?) "Cannot call function 'setTitle' on missing remote object 1"
                // .then(() => ctx.title && ctx['app].browserWindow.setTitle(ctx.title)) // set the window title to the current test
                .then(() => CLI.waitForSession(ctx, noProxySessionWait))
                .then(() => ctx.app.client.execute(() => localStorage.clear()))
                .then(() => !noProxySessionWait && CLI.waitForRepl(ctx.app))
            ) // should have an active repl
          }

      ctx.timeout(process.env.TIMEOUT || 60000)
      await start()

      // add app.client commands
      addCommands(ctx)

      // see https://github.com/electron-userland/spectron/issues/763
      // and https://github.com/webdriverio/webdriverio/issues/6092
      // in short: with webdriverio v5+, the implicit timeout has to be 0
      // but spectron is hard-coded to have implicit==pageLoad==script
      if (!noApp && ctx.app) {
        ctx.app.client.setTimeout({ implicit: 0, pageLoad: waitTimeout, script: waitTimeout })
      }

      if (afterStart) {
        await afterStart()
      }
    } catch (err) {
      console.error('error refreshing in before for fresh start', err)
      throw err
    }
  }
}

/**
 * This is the method that will be called when a test completes
 *
 */
export const after = (ctx: ISuite, f?: () => void): HookFunction => async () => {
  if (f) await f()

  await writeCodeCoverage(ctx.app)

  // when we're done with a test suite, look for any important
  // SEVERE errors in the chrome console logs. try to ignore
  // intentional failures as much as possible!
  const anyFailed = ctx.tests && ctx.tests.some(test => test.state === 'failed')

  // print out log messages from the electron app, if any of the tests
  // failed
  if (anyFailed && ctx.app && ctx.app.client) {
    ctx.app.client.getRenderProcessLogs().then(logs =>
      logs
        .map(log => log as { level: string; message: string })
        .filter(log => !/SFMono/.test(log.message))
        .filter(log => !/fonts.gstatic/.test(log.message))
        .filter(log => !/webpack-dev-server/.test(log.message))
        .forEach(log => {
          if (
            log.level === 'SEVERE' && // only console.error messages
            log.message.indexOf('The requested resource was not found') < 0 && // composer file not found
            log.message.indexOf('Error compiling app source') < 0 &&
            log.message.indexOf('ReferenceError') < 0 &&
            log.message.indexOf('SyntaxError') < 0 &&
            log.message.indexOf('ENOENT') < 0 && // we probably caused file not found errors
            log.message.indexOf('UsageError') < 0 && // we probably caused repl usage errors
            log.message.indexOf('Usage:') < 0 && // we probably caused repl usage errors
            log.message.indexOf('Unexpected option') < 0 // we probably caused command misuse
          ) {
            const logMessage = log.message.substring(log.message.indexOf('%c') + 2).replace(/%c|%s|"/g, '')
            console.log(`${log.level}`.red.bold, logMessage)
          }
        })
    )
  }

  if (ctx.app && ctx.app.isRunning() && ctx['_kuiDestroyAfter']) {
    return ctx.app.stop()
  }
}

export const oops = (ctx: ISuite, wait = false) => async (err: Error) => {
  try {
    if (process.env.MOCHA_RUN_TARGET) {
      console.log(`Error: mochaTarget=${process.env.MOCHA_RUN_TARGET} testTitle=${ctx.title}`)
    }
    console.log(err)

    const promises = []

    if (ctx.app) {
      try {
        promises.push(
          await ctx.app.client
            .$(Selectors.OUTPUT_LAST)
            .then(_ => _.getHTML())
            .then(html => {
              console.log('here is the output of the prior output:')
              console.log(html.replace(/<style>.*<\/style>/, ''))
            })
            .catch(err => {
              console.error('error trying to get the output of the previous block', err)
            })
        )
        promises.push(
          await ctx.app.client
            .$(Selectors.PROMPT_BLOCK_FINAL)
            .then(_ => _.getHTML())
            .then(html => {
              console.log('here is the content of the last block:')
              console.log(html.replace(/<style>.*<\/style>/, ''))
            })
            .catch(err => {
              console.error('error trying to get the output of the final block', err)
            })
        )
      } catch (err) {
        console.error('error trying to get output html', err)
      }

      promises.push(
        ctx.app.client.getMainProcessLogs().then(logs =>
          logs.forEach(log => {
            if (log.indexOf('INFO:CONSOLE') < 0 && log.indexOf('FontService') < 0) {
              // don't log console messages, as these will show up in getRenderProcessLogs
              console.log('MAIN'.cyan.bold, log)
            }
          })
        )
      )
      promises.push(
        // filter out the "Not allowed to load local resource" font loading errors
        ctx.app.client
          .getRenderProcessLogs()
          .then(logs => logs as { message: string }[])
          .then(logs =>
            logs
              .filter(log => !/SFMono/.test(log.message))
              .filter(log => !/fonts.gstatic/.test(log.message))
              .filter(log => !/webpack-dev-server/.test(log.message))
              .forEach(log => {
                if (log.message.indexOf('%c') === -1) {
                  console.log('RENDER'.yellow.bold, log.message.red)
                } else {
                  // clean up the render log message. e.g.RENDER console-api INFO /home/travis/build/composer/cloudshell/dist/build/IBM Cloud Shell-linux-x64/resources/app.asar/plugins/node_modules/debug/src/browser.js 182:10 "%chelp %cloading%c +0ms"
                  const logMessage = log.message.substring(log.message.indexOf('%c') + 2).replace(/%c|%s|"/g, '')
                  console.log('RENDER'.yellow.bold, logMessage)
                }
              })
          )
      )

      promises.push(
        await ctx.app.client
          .$$(Selectors.OOPS)
          .then(elts => Promise.all(elts.map(_ => _.getText())))
          .then(anyErrors => {
            if (anyErrors) {
              console.log('Error from the UI'.magenta.bold, anyErrors)
            }
          })
          .catch(() => {
            // it's ok if there are no such error elements on the page
          })
      )
    }

    if (wait) {
      await Promise.all(promises)
    }
  } catch (err2) {
    // log our common.oops error
    console.error('error in common.oops', err2)
  }

  // swap these two if you want to debug failures locally
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      reject(err)
    }, 100000)
  )
  // throw err
}

/** only execute the test in local */
export const localIt = (msg: string, func: Func) => {
  if (process.env.MOCHA_RUN_TARGET !== 'webpack') return it(msg, func)
}

/** only execute the test suite in local */
export const localDescribe = (msg: string, suite: (this: Suite) => void) => {
  if (process.env.MOCHA_RUN_TARGET !== 'webpack') return describe(msg, suite)
}

/** only execute the test suite in an environment that has docker */
export const dockerDescribe = (msg: string, suite: (this: Suite) => void) => {
  if (process.env.MOCHA_RUN_TARGET !== 'webpack' && (!process.env.TRAVIS_JOB_ID || process.platform === 'linux')) {
    // currently only linux supports docker when running in travis
    return describe(msg, suite)
  }
}

/** only execute the test in non-proxy browser */
export const remoteIt = (msg: string, func: Func) => {
  if (process.env.MOCHA_RUN_TARGET === 'webpack') return it(msg, func)
}

/** only execute the test suite in proxy+browser clients */
export const proxyDescribe = (msg: string, suite: (this: Suite) => void) => {
  if (process.env.MOCHA_RUN_TARGET === 'webpack' && process.env.KUI_USE_PROXY === 'true') return describe(msg, suite)
}

/** only execute the test suite in electron or proxy+browser clients */
export const pDescribe = (msg: string, suite: (this: Suite) => void) => {
  if (process.env.MOCHA_RUN_TARGET !== 'webpack' || process.env.KUI_USE_PROXY === 'true') return describe(msg, suite)
}

/** only execute the test in proxy+browser client */
export const proxyIt = (msg: string, func: Func) => {
  if (process.env.MOCHA_RUN_TARGET === 'webpack' && process.env.KUI_USE_PROXY === 'true') return it(msg, func)
}

/** only execute the test in electron or proxy+browser client */
export const pit = (msg: string, func: Func) => {
  if (process.env.MOCHA_RUN_TARGET !== 'webpack' || process.env.KUI_USE_PROXY === 'true') return it(msg, func)
}

/** non-headless targets in travis use the clients/default version */
export const expectedVersion = version

/**
 * This helps with webpack/browser-based tests, where we can't rely
 * on env vars to transit "in debug mode". E.g. see ExecIntoPod
 *
 */
declare let __KUI_RUNNING_KUI_TEST: boolean
export function setDebugMode(this: ISuite) {
  it('should inject RUNNING_KUI_TEST', () => {
    return this.app.client
      .execute(() => {
        __KUI_RUNNING_KUI_TEST = true
      })
      .catch(oops(this, true))
  })
}
