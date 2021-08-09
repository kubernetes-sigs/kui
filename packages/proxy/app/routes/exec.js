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

const debug = require('debug')('proxy/exec')
const { dirname, join } = require('path')
const { exec, spawn } = require('child_process')
const express = require('express')
const { v4: uuid } = require('uuid')
const { parse: parseCookie } = require('cookie')

const sessionKey = 'kui_websocket_auth'

const mainPath = join(dirname(require.resolve('@kui-shell/core')), 'main/main.js')
const { main: wssMain } = require('@kui-shell/plugin-bash-like')
const { StdioChannelWebsocketSide } = require('@kui-shell/plugin-bash-like')

process.on('uncaughtException', async err => {
  debug('uncaughtException')
  debug(err)
  console.error(err.toString())
  process.exit(1)
})

process.on('exit', code => {
  debug('proxy exiting', code)
})

async function allocateUser() {
  debug('allocateUser')
  const uid = undefined
  const gid = undefined

  // inherit HOME if we haven't otherwise decided to use a specific
  // uid/gid for this tenant
  const HOME = uid === undefined && process.env.HOME

  return { uid, gid, HOME }
}

/** thin wrapper on child_process.exec */
function main(cmdline, execOptions, server, port, hostname, existingSession, locale) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const { uid, gid, HOME } = existingSession || (await allocateUser())

    const cwd = (execOptions.cwd === '~' ? HOME : execOptions.cwd) || HOME || '/'

    const options = {
      uid,
      gid,
      cwd,
      env: Object.assign(execOptions.env || {}, {
        TRAVIS_HOME: process.env.TRAVIS_HOME,
        HOME,
        PWD: cwd,
        LOCALE: locale,
        DEBUG: process.env.DEBUG,
        DEVMODE: true,
        TRAVIS_JOB_ID: process.env.TRAVIS_JOB_ID,
        KUBECONFIG: process.env.KUBECONFIG,
        KUI_HEADLESS: true,
        KUI_REPL_MODE: 'stdout',
        KUI_EXEC_OPTIONS: JSON.stringify(execOptions)
      })
    }

    const wsOpen = cmdline === 'bash websocket open'
    if (wsOpen) {
      // N is the random identifier for this connection
      const N = uuid()

      const session = existingSession || {
        uid,
        gid,
        token: uuid() // use a different uuid for the session cookie
      }
      const sessionToken = Buffer.from(JSON.stringify(session)).toString('base64')
      const cookie = { key: sessionKey, session }

      const { wss } = await wssMain(N, server, port, cookie)

      debug('spawning subprocess')
      const child = spawn(process.argv[0], [mainPath, 'bash', 'websocket', 'stdio'], options)

      child.on('error', err => {
        console.error('error spawning subprocess', err)
        reject(err)
      })

      child.on('exit', code => {
        debug('subprocess exit', code)
      })

      const channel = new StdioChannelWebsocketSide(wss)
      await channel.init(child, process.env.KUI_HEARTBEAT_INTERVAL || 30000)

      channel.once('closed', () => {
        debug('channel closed')
      })

      channel.once('open', () => {
        debug('channel open')

        const proto = process.env.KUI_USE_HTTP === 'true' ? 'ws' : 'wss'
        resolve({
          type: 'object',
          cookie: {
            key: sessionKey,
            value: sessionToken,
            path: `/bash/${N}`
          },
          response: {
            mode: 'raw',
            content: {
              proto,
              port: process.env.KUI_PROXY_COHOSTED ? -1 : port,
              path: `/bash/${N}`,
              uid,
              gid
            }
          }
        })
      })
    } else {
      debug('using plain exec', cmdline, options)
      exec(`${process.argv[0]} "${mainPath}" ${cmdline}`, options, (err, stdout, stderr) => {
        if (stderr) {
          console.error(stderr)
        }

        if (err) {
          reject(err)
        } else {
          debug('stdout', stdout)
          try {
            resolve(JSON.parse(stdout))
          } catch (err) {
            resolve({
              type: 'string',
              response: stdout
            })
          }
        }
      })
    }
  })
}

/**
 *
 * @param server an https server
 * @param port the port on which that server is listening
 *
 */
module.exports = (server, port) => {
  debug('initializing proxy executor', port)

  const exec = commandExtractor =>
    async function(req, res) {
      // debug('hostname', req.hostname)
      // debug('headers', req.headers)

      try {
        const { command, execOptions = {} } = commandExtractor(req)
        debug('command', command)

        // so that our catch (err) below is used upon command execution failure
        execOptions.rethrowErrors = true

        // parse the user's locale
        const locale = req.headers['accept-language'] && req.headers['accept-language'].split(',')[0]

        /* if (execOptions && execOptions.credentials) {
          // FIXME this should not be a global
          setValidCredentials(execOptions.credentials)
        } */

        /* const execOptionsWithServer = Object.assign({}, execOptions, {
          server,
          port,
          host: req.headers.host
          }) */
        const sessionToken = parseCookie(req.headers.cookie || '')[sessionKey]
        const session = sessionToken && JSON.parse(Buffer.from(sessionToken, 'base64').toString('utf-8'))
        const { type, cookie, response } = await main(command, execOptions, server, port, req.hostname, session, locale)

        if (cookie) {
          res.header('Access-Control-Allow-Credentials', 'true')
          res.cookie(cookie.key, cookie.value, {
            httpOnly: true, // clients are not allowed to read this cookie
            secure: process.env.KUI_USE_HTTP !== 'true', // https required?
            path: cookie.path // lock down the cookie to this channel's path
          })
        }

        // pre-shared key authorization
        if (process.env.KUI_PSK && process.env.KUI_PSK_COOKIE) {
          const token = process.env.KUI_PSK_COOKIE_SECRET
            ? req.signedCookies
              ? req.signedCookies[process.env.KUI_PSK_COOKIE]
              : undefined
            : req.cookies[process.env.KUI_PSK_COOKIE]

          if (token !== process.env.KUI_PSK) {
            // block to handle the token as a query param
            if (process.env.KUI_PSK_TOKEN && req.query.token && req.query.token === process.env.KUI_PSK_TOKEN) {
              res.cookie(process.env.KUI_PSK_COOKIE, process.env.KUI_PSK, {
                httpOnly: true,
                secure: process.env.KUI_USE_HTTP !== 'true',
                signed: true,
                secret: process.env.KUI_PSK_COOKIE_SECRET
              })

              res.redirect('/') // to hide the auth token
              return
            } else {
              res.status(403).send('Access Denied')
              return
            }
          }
        }

        const code = response.code || response.statusCode || 200
        res.status(code).json({ type, response })
      } catch (err) {
        console.error('exception in command execution', err.code, err.message, err)
        const possibleCode = err.code || err.statusCode
        const code = possibleCode && typeof possibleCode === 'number' ? possibleCode : 500
        res.status(code).send(err.message || err)
      }
    }

  const router = express.Router()

  /** GET exec */
  router.get(
    '/:command',
    exec(req => req.params)
  )

  /** POST exec */
  router.post(
    '/',
    exec(req => req.body)
  )

  return router
}
