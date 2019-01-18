/*
 * Copyright 2018 IBM Corporation
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

const debug = require('debug')('options parser')
const minimist = require('yargs-parser')
const path = require('path')

/**
 * Remove undefined mappings from the given map
 *
 */
const nix = map => {
  const nixed = {}

  for (let key in map) {
    if (map[key] !== undefined) {
      nixed[key] = map[key]
    }
  }

  return nixed
}

/**
 * Parse options
 *
 */
exports.parseOptions = () => new Promise((resolve, reject) => {
  debug('parsing options')

  // options from environment variables
  const envOptions = nix({
    config: process.env.CONFIG
  })

  // default value assignments for options
  const defaultOptions = {
    config: 'kui.json',
    templateDir: path.join(__dirname, '../templates'),
    buildDir: path.join(__dirname, '../build')
  }

  // options from command line flags
  const cliOptions = minimist(process.argv.slice(2))

  // union the three
  const options = Object.assign(defaultOptions, envOptions, cliOptions)
  debug('options', options)

  resolve(options)
})
