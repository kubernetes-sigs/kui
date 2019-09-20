/*
 * Copyright 2017-18 IBM Corporation
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

/**
 * For testing, we sometimes want to disable certain features, to
 * validate error handling.
 *
 */

import * as Debug from 'debug'
const debug = Debug('core/fuzz-testing')
debug('loading')

/**
 * Block access to a given filepath?
 *
 */
const nope = (filepath: string) => {
  return filepath.toString().indexOf('.wskprops') >= 0 || filepath.toString().indexOf('.cf/config.json') >= 0
}

/**
 * Some standard fuzz-testing parameters
 *
 */
const fuzzies = {
  noAuth: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require('fs')
    const rf = fs.readFile
    const rfs = fs.readFileSync

    fs.readFile = function(filepath: string, options, cb) {
      if (nope(filepath)) {
        debug('fs.readFile blocked', filepath)
        rf('fjdioafjadisofjadsoifasfsdfjadisfjadisofjasifas', options ? cb : options)
      } else {
        if (!cb) {
          rf(filepath, options)
        } else {
          rf(filepath, options, cb)
        }
      }
    }

    fs.readFileSync = function(filepath: string, options) {
      if (nope(filepath)) {
        console.error(`fs.readFileSync blocked ${filepath}`)
        return rfs('fjdioafjadisofjadsoifasfsdfjadisfjadisofjasifas')
      } else {
        return rfs(filepath, options)
      }
    }
  }
}

export default fuzz => {
  if (typeof fuzz === 'string') {
    fuzz = JSON.parse(fuzz)
  }

  // debug('options', fuzz.rules)

  ;(fuzz.rules || []).forEach(rule => {
    // intentionally unprotected against failures, because we
    // want the test to fail
    debug('rule', rule)
    fuzzies[rule]()
  })

  return fuzz.prefs
}
