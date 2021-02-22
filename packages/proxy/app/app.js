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

const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')

const ExecRouter = require('./routes/exec')

const app = express()

app.use(
  cors({ origin: 'http://localhost:9080', credentials: true })
  // TODO cors config, e.g.
  // { origin: 'https://localhost:8080' }
)
app.use(express.json())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// helps with ctrl-c when running in a docker container
process.on('SIGINT', () => process.exit())

exports.setServer = (server, port) => {
  app.use('/exec', ExecRouter(server, port))
}

exports.app = app
