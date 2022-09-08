/*
 * Copyright 2017 The Kubernetes Authors
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

import Debug from 'debug'
const debug = Debug('core/fuzz-testing')
debug('loading')

/**
 * Block access to a given filepath?
 *
 */
const nope = (filepath: string) => {
  return filepath.toString().indexOf('.wskprops') >= 0 || filepath.toString().indexOf('.cf/config.json') >= 0
}

type ReadFileOptions = { encoding?: string | null; flag?: string } | string | undefined | null
type ReadFileSyncOptions = { encoding?: null; flag?: string } | null

/**
 * Some standard fuzz-testing parameters
 *
 */
const fuzzies: Record<string, () => Promise<void>> = {
  noAuth: async () => {
    const fs = require('fs')
    const rf = fs.readFile
    const rfs = fs.readFileSync

    fs.readFile = function (
      filepath: string,
      options: ReadFileOptions,
      cb: (err: NodeJS.ErrnoException | null, data: string | Buffer) => void
    ) {
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

    fs.readFileSync = function (filepath: string, options?: ReadFileSyncOptions) {
      if (nope(filepath)) {
        console.error(`fs.readFileSync blocked ${filepath}`)
        return rfs('fjdioafjadisofjadsoifasfsdfjadisfjadisofjasifas')
      } else {
        return rfs(filepath, options)
      }
    }
  }
}

export default async (_fuzz: string) => {
  const fuzz = JSON.parse(_fuzz) as { rules: string[]; prefs?: Record<string, string | boolean | number> }
  // debug('options', fuzz.rules)

  await Promise.all(
    (fuzz.rules || []).map(async rule => {
      // intentionally unprotected against failures, because we
      // want the test to fail
      debug('rule', rule)
      await fuzzies[rule]()
    })
  )

  return fuzz.prefs
}
