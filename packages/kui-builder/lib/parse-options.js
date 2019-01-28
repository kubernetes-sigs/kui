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

const debug = require('debug')('kui-builder/parse-options')
const path = require('path')

/**
 * Parse options
 *
 */
module.exports = (env, overrides) => new Promise((resolve, reject) => {
  debug('parsing options', env, overrides)

  // default value assignments for options
  const defaultOptions = {
    // theme settings
    theme: require('../defaults/themes/kui'),

    // env settings, e.g. webpack versus standalone
    env: require('../defaults/envs/' + env),

    // allows for arbitrary injection of configuration parameters
    config: {},

    // build settings
    build: {
      templateDir: path.join(__dirname, '../../app/templates'),
      buildDir: path.join(__dirname, '../../app/build'), // target for index.html
      configDir: path.join(__dirname, '../../app/build') // target for config.json and package.json
    }
  }
  debug('defaultOptions', defaultOptions)

  // apply overrides to the defaults
  const options = Object.assign({}, defaultOptions)
  options.theme = Object.assign(options.theme, overrides.theme || {})
  options.env = Object.assign(options.env, overrides.env || {})
  options.config = Object.assign(options.config, overrides.config || {})
  options.build = Object.assign(options.build, overrides.build || {})

  debug('final options', options)
  resolve(options)
})
