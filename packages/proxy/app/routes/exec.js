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
const express = require('express')

process.env.KUI_HEADLESS = true
process.env.KUI_REPL_MODE = true

const { main } = require('../../kui/node_modules/@kui-shell/core')
const {
  setValidCredentials
} = require('../../kui/node_modules/@kui-shell/core/core/capabilities')

/**
 *
 * @param server an https server
 * @param port the port on which that server is listening
 *
 */
module.exports = (server, port) => {
  debug('initializing proxy executor', port)

  const exec = commandExtractor =>
    async function(req, res, next) {
      // debug('hostname', req.hostname)
      // debug('headers', req.headers)

      try {
        const { command, execOptions = {} } = commandExtractor(req)
        debug('command', command)

        // so that our catch (err) below is used upon command execution failure
        execOptions.rethrowErrors = true

        if (execOptions && execOptions.credentials) {
          // FIXME this should not be a global
          setValidCredentials(execOptions.credentials)
        }

        const execOptionsWithServer = Object.assign({}, execOptions, {
          server,
          port,
          host: req.headers.host
        })
        const response = await main(
          ['', ...command.split(' ')],
          process.env,
          execOptionsWithServer
        )
        if (typeof response === 'string') {
          res.send(response)
        } else {
          const code = response.code || response.statusCode || 200
          res.status(code).json(response)
        }
      } catch (err) {
        debug('exception in command execution', err.code, err.message, err)
        const code = err.code || err.statusCode || 500
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
