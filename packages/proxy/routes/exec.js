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

const express = require('express')
const router = express.Router()

process.env.KUI_HEADLESS = true
process.env.KUI_REPL_MODE = true

const { main } = require('@kui-shell/core')
const { setValidCredentials } = require('@kui-shell/core/build/packages/app/src/core/capabilities')

const exec = (commandExtractor) => async function (req, res, next) {
  const { command, execOptions } = commandExtractor(req)

  console.log('CCCCCCCCCCCC', req.body)
  if (execOptions && execOptions.credentials) {
    // FIXME this should not be a global
    setValidCredentials(execOptions.credentials)
  }

  const response = await main([ '', ...command.split(' ') ], process.env, execOptions)
  if (typeof response === 'string') {
    res.send(response)
  } else {
    const code = response.code || 200
    res.status(code).json(response)
  }
}

/** GET exec */
router.get('/:command', exec(req => req.params))

/** POST exec */
router.post('/', exec(req => req.body))

module.exports = router
