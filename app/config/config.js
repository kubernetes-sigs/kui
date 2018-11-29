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

const debug = require('debug')('config parser')
const path = require('path')

/**
 * Default options
 *
 */
const defaultOptions = () => {
  debug('using default options')

  const { parseOptions } = require('./options')
  return parseOptions()
}

/**
 * Parse the variable mapping file
 *
 */
exports.parseConfig = (options = defaultOptions()) => new Promise((resolve, reject) => {
  if (!options.config) {
    reject(new Error('Please specify a config file, either via a CONFIG env var or a --config command line option'))
  } else {
    const config = require(path.join(
      __dirname,
      './envs/',
      options.config + (options.config.endsWith('.json') ? '' : '.json')))

    resolve(config)
  }
})

exports.parseConfigs = (options = defaultOptions(), environment = { config: 'standalone' }) => {
  return Promise.all([
    exports.parseConfig(options),
    exports.parseConfig(environment)
  ])
    .then(([a, b]) => Object.assign({}, a, b))
}
