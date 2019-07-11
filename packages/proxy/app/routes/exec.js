/*
 * Copyright 2019 IBM Corporation
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
const { exec, spawn } = require('child_process')
const express = require('express')

/* const { main } = require('../../kui/node_modules/@kui-shell/core')
const {
  setValidCredentials
} = require('../../kui/node_modules/@kui-shell/core/core/capabilities') */

const mainPath = require.resolve('../../kui/node_modules/@kui-shell/core')
const { main: wssMain } = require('../../kui/node_modules/@kui-shell/plugin-bash-like/pty/server')
const { StdioChannelWebsocketSide } = require('../../kui/node_modules/@kui-shell/plugin-bash-like/pty/stdio-channel')

let serverIdx = 0

/** thin wrapper on child_process.exec */
function main(cmdline, execOptions, server, port, host) {
  return new Promise(async (resolve, reject) => {
    const uid = undefined
    const gid = undefined

    const options = {
      uid,
      gid,
      cwd: execOptions.cwd || '/',
      env: Object.assign(execOptions.env, {
        DEBUG: process.env.DEBUG,
        DEVMODE: true,
        KUI_HEADLESS: true,
        KUI_REPL_MODE: 'stdout',
        KUI_EXEC_OPTIONS: JSON.stringify(execOptions)
      })
    }

    const wsOpen = cmdline === 'bash websocket open'
    if (wsOpen) {
      const N = serverIdx++
      const { wss } = await wssMain(N, server, port)

      const child = spawn(process.argv[0], [mainPath, 'bash', 'websocket', 'stdio'], options)

      child.on('error', err => {
        reject(err)
      })

      child.on('exit', code => {
        debug('subprocess exit', code)
      })

      const channel = new StdioChannelWebsocketSide(wss)
      await channel.init(child)

      channel.on('open', () => {
        const proto = process.env.KUI_USE_HTTP === 'true' ? 'ws' : 'wss'
        resolve({
          type: 'object',
          response: {
            url: `${proto}://${host}/bash/${N}`,
            uid,
            gid
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
          resolve(JSON.parse(stdout))
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

        /* if (execOptions && execOptions.credentials) {
          // FIXME this should not be a global
          setValidCredentials(execOptions.credentials)
        } */

        /* const execOptionsWithServer = Object.assign({}, execOptions, {
          server,
          port,
          host: req.headers.host
        }) */
        const { type, response } = await main(command, execOptions, server, port, req.headers.host)
        if (type !== 'object') {
          res.send(response)
        } else {
          const code = response.code || response.statusCode || 200
          res.status(code).json(response)
        }
      } catch (err) {
        debug('exception in command execution', err.code, err.message, err)
        const possibleCode = err.code || err.statusCode
        const code = possibleCode && typeof possibleCode === 'number' ? possibleCode : 500
        res.status(code).send(err.message || err)
      }
    }

  const router = express.Router()

  /** GET exec */
  router.get('/:command', exec(req => req.params))

  /** POST exec */
  router.post('/', exec(req => req.body))

  return router
}
