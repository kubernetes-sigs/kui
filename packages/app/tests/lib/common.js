/*
 * Copyright 2017-19 IBM Corporation
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

const ui = require('./ui')
require('colors')

/** non-headless targets in travis use the clients/default version */
exports.expectedVersion =
  process.env.TRAVIS_JOB_ID &&
  (process.env.MOCHA_RUN_TARGET === 'electron' || process.env.MOCHA_RUN_TARGET === 'webpack')
    ? '0.0.1'
    : require('@kui-shell/settings/package.json').version

/**
 * Mimic the request-promise functionality, but with retry
 *
 */
exports.rp = opts => {
  const rp = require('request-promise')
  const withRetry = require('promise-retry')

  return withRetry((retry, iter) => {
    return rp(Object.assign({ timeout: 20000 }, typeof opts === 'string' ? { url: opts } : opts)).catch(err => {
      const isNormalError = err && (err.statusCode === 400 || err.statusCode === 404 || err.statusCode === 409)
      if (!isNormalError && iter < 10) {
        console.error(err)
        retry()
      } else {
        console.error(`Error in rp with opts=${JSON.stringify(opts)}`)
        throw err
      }
    })
  })
}

/**
 * Wait, if needed, for a proxy session
 *
 */
exports.waitForSession = (ctx, noProxySessionWait = false) => {
  if (process.env.MOCHA_RUN_TARGET === 'webpack' && process.env.KUI_USE_PROXY === 'true' && !noProxySessionWait) {
    // wait for the proxy session to be established
    try {
      return ctx.app.client.waitForExist(`${ui.selectors.CURRENT_TAB}.kui--session-init-done`)
    } catch (err) {
      throw new Error('error waiting for proxy session init')
    }
  }
}

/**
 * Try to avoid restarting electron if we can; then, when all is said
 * and done, quit that singleton electron
 *
 */
let app
after(async () => {
  if (app && app.isRunning()) {
    await app.stop()
  }
})

/** reload the app */
exports.refresh = async (ctx, wait = true, clean = false) => {
  await ctx.app.client.refresh()
  if (clean) {
    await ctx.app.client.localStorage('DELETE') // clean out local storage
  }
  if (wait) {
    await exports.waitForSession(ctx)
    await ui.cli.waitForRepl(ctx.app)
  }
}

/** restart the app */
exports.restart = async ctx => {
  await ctx.app.restart()
  return exports.waitForSession(ctx)
}

/**
 * Get the electron parts set up, and return an Application
 * instance. Note that this won't actually start the electron process,
 * which can subsequently be done by calling `start()` on the return
 * value of this function.
 *
 */
const prepareElectron = (fuzz, popup = false) => {
  const Application = require('spectron').Application
  const electron = require('electron') // relative to __dirname
  const appMain = process.env.APP_MAIN || '../../build/packages/app/src/main/main.js' // relative to the tests/ directory

  const env = {}
  if (fuzz) {
    env.___IBM_FSH_FUZZ = JSON.stringify(fuzz)
  }

  const opts = {
    env,
    chromeDriverArgs: ['--no-sandbox'],
    startTimeout: process.env.TIMEOUT || 20000, // see https://github.com/IBM/kui/issues/2227
    waitTimeout: process.env.TIMEOUT || 20000
  }

  if (process.env.PORT_OFFSET) {
    opts.port = 9515 + parseInt(process.env.PORT_OFFSET, 10)

    const userDataDir = `/tmp/kui-profile-${process.env.PORT_OFFSET}`
    opts.chromeDriverArgs.push(`--user-data-dir=${userDataDir}`)

    console.log(`Using chromedriver port ${opts.port}`)
    console.log(`Using chromedriver user-data-dir ${userDataDir}`)
  }

  if (process.env.MOCHA_RUN_TARGET === 'webpack') {
    console.log(`Testing Webpack against chromium`)
    opts.path = electron // this means spectron will use electron located in node_modules
    opts.args = ['../app/tests/lib/main.js'] // relative to the tests/ directory
  } else if (process.env.TEST_FROM_BUILD) {
    console.log(`Using build-based assets: ${process.env.TEST_FROM_BUILD}`)
    opts.path = process.env.TEST_FROM_BUILD
  } else {
    console.log('Using filesystem-based assets')
    opts.path = electron // this means spectron will use electron located in node_modules
    opts.args = [appMain] // in this mode, we need to specify the main.js to use
  }

  if (process.env.CHROMEDRIVER_PORT) {
    opts.port = process.env.CHROMEDRIVER_PORT
  }
  if (process.env.WSKNG_NODE_DEBUG) {
    // pass WSKNG_DEBUG on to NODE_DEBUG for the application
    opts.env.NODE_DEBUG = process.env.WSKNG_NODE_DEBUG
  }
  if (process.env.DEBUG) {
    opts.env.DEBUG = process.env.DEBUG
  }

  if (popup) {
    opts.env.KUI_POPUP = JSON.stringify(popup)
  }

  return new Application(opts)
}

exports.prepareElectron = prepareElectron

/**
 * This is the method that will be called before a test begins
 *
 * @param fuzz lets you blank out certain portions of the world
 * @param noApp do not spawn the electron parts
 *
 */
exports.before = (ctx, { fuzz, noApp = false, popup, afterStart, beforeStart, noProxySessionWait = false } = {}) => {
  if (process.env.TRAVIS_JOB_ID) {
    ctx.retries(1) // don't retry the mocha.it in local testing
  }

  return async function() {
    // by default, we expect not to have to destroy the app when this
    // describe is done
    ctx._kuiDestroyAfter = false

    if (!noApp) {
      if (app && !popup) {
        if (!beforeStart && !afterStart) {
          ctx.app = app
          try {
            await exports.refresh(ctx, !noProxySessionWait, true)
            return
          } catch (err) {
            console.error('error refreshing in before for reuse start', err)
            throw err
          }
        }
      }
      ctx.app = prepareElectron(fuzz, popup)
      if (popup) {
        // for popups, we want to destroy the app when the describe is done
        ctx._kuiDestroyAfter = true
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
                // .then(() => ctx.title && ctx.app.browserWindow.setTitle(ctx.title)) // set the window title to the current test
                .then(() => exports.waitForSession(ctx, noProxySessionWait))
                .then(() => ctx.app.client.localStorage('DELETE')) // clean out local storage
                .then(() => !noProxySessionWait && ui.cli.waitForRepl(ctx.app))
            ) // should have an active repl
          }

      ctx.timeout(process.env.TIMEOUT || 60000)
      await start()

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
exports.after = (ctx, f) => async () => {
  if (f) await f()

  //
  // write out test coverage data from the renderer process
  //
  /* const nyc = new (require('nyc'))(),
          tempDirectory = require('path').resolve(nyc._tempDirectory)
    nyc.createTempDirectory()
    const C = ctx.app.client.execute(tempDirectory => {
        const config = { tempDirectory },             // the nyc config
              nyc = new (require('nyc'))(config)      // create the nyc instance
        nyc.createTempDirectory()                     // in case we are the first to the line
        nyc.writeCoverageFile()                       // write out the coverage data for the renderer code
    }, tempDirectory) */

  // when we're done with a test suite, look for any important
  // SEVERE errors in the chrome console logs. try to ignore
  // intentional failures as much as possible!
  const anyFailed = ctx.tests && ctx.tests.some(test => test.state === 'failed')

  // print out log messages from the electron app, if any of the tests
  // failed
  if (anyFailed && ctx.app && ctx.app.client) {
    ctx.app.client.getRenderProcessLogs().then(logs =>
      logs
        .filter(log => !/SFMono/.test(log.message))
        .filter(log => !/fonts.gstatic/.test(log.message))
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
            console.log(`${log.source} ${log.level}`.bold.red, logMessage)
          }
        })
    )
  }

  if (ctx.app && ctx.app.isRunning() && ctx._kuiDestroyAfter) {
    return ctx.app.stop()
  }
}

exports.oops = (ctx, wait = false) => async err => {
  try {
    if (process.env.MOCHA_RUN_TARGET) {
      console.log(`Error: mochaTarget=${process.env.MOCHA_RUN_TARGET} testTitle=${ctx.title}`)
    }
    console.log(err)

    const promises = []

    if (ctx.app) {
      try {
        promises.push(
          ctx.app.client.getHTML(ui.selectors.OUTPUT_LAST).then(html => {
            console.log('here is the output of the prior output:')
            console.log(html.replace(/<style>.*<\/style>/, ''))
          })
        )
        promises.push(
          ctx.app.client.getHTML(ui.selectors.PROMPT_BLOCK_FINAL).then(html => {
            console.log('here is the content of the last block:')
            console.log(html.replace(/<style>.*<\/style>/, ''))
          })
        )
      } catch (err) {
        console.error('error trying to get the output of the last block', err)
      }

      promises.push(
        ctx.app.client.getMainProcessLogs().then(logs =>
          logs.forEach(log => {
            if (log.indexOf('INFO:CONSOLE') < 0) {
              // don't log console messages, as these will show up in getRenderProcessLogs
              console.log('MAIN'.bold.cyan, log)
            }
          })
        )
      )
      promises.push(
        // filter out the "Not allowed to load local resource" font loading errors
        ctx.app.client.getRenderProcessLogs().then(logs =>
          logs
            .filter(log => !/SFMono/.test(log.message))
            .filter(log => !/fonts.gstatic/.test(log.message))
            .forEach(log => {
              if (log.message.indexOf('%c') === -1) {
                console.log('RENDER'.bold.yellow, log.message.red)
              } else {
                // clean up the render log message. e.g.RENDER console-api INFO /home/travis/build/composer/cloudshell/dist/build/IBM Cloud Shell-linux-x64/resources/app.asar/plugins/node_modules/debug/src/browser.js 182:10 "%chelp %cloading%c +0ms"
                const logMessage = log.message.substring(log.message.indexOf('%c') + 2).replace(/%c|%s|"/g, '')
                console.log('RENDER'.bold.yellow, logMessage)
              }
            })
        )
      )

      promises.push(
        ctx.app.client
          .getText(ui.selectors.OOPS)
          .then(anyErrors => {
            if (anyErrors) {
              console.log('Error from the UI'.bold.magenta, anyErrors)
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
  // return new Promise((resolve, reject) => setTimeout(() => { reject(err) }, 100000))
  throw err
}

/** only execute the test in local */
exports.localIt = (msg, func) => {
  if (process.env.MOCHA_RUN_TARGET !== 'webpack') return it(msg, func)
}

/** only execute the test suite in local */
exports.localDescribe = (msg, func) => {
  if (process.env.MOCHA_RUN_TARGET !== 'webpack') return describe(msg, func)
}

/** only execute the test suite in an environment that has docker */
exports.dockerDescribe = (msg, func) => {
  if (process.env.MOCHA_RUN_TARGET !== 'webpack' && (!process.env.TRAVIS_JOB_ID || process.platform === 'linux')) {
    // currently only linux supports docker when running in travis
    return describe(msg, func)
  }
}

/** only execute the test in non-proxy browser */
exports.remoteIt = (msg, func) => {
  if (process.env.MOCHA_RUN_TARGET === 'webpack') return it(msg, func)
}

/** only execute the test suite in electron or proxy+browser clients */
exports.pDescribe = (msg, func) => {
  if (process.env.MOCHA_RUN_TARGET !== 'webpack' || process.env.KUI_USE_PROXY === 'true') return it(msg, func)
}

/** only execute the test in proxy+browser client */
exports.proxyIt = (msg, func) => {
  if (process.env.MOCHA_RUN_TARGET === 'webpack' && process.env.KUI_USE_PROXY === 'true') return it(msg, func)
}

/** only execute the test in electron or proxy+browser client */
exports.pit = (msg, func) => {
  if (process.env.MOCHA_RUN_TARGET !== 'webpack' || process.env.KUI_USE_PROXY === 'true') return it(msg, func)
}
