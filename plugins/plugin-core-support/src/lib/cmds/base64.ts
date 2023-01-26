/*
 * Copyright 2018 The Kubernetes Authors
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

import Debug from 'debug'
import type { Registrar } from '@kui-shell/core'

const debug = Debug('plugins/core-support/base64')

/**
 * The command usage model
 *
 */
const usage = {
  command: 'base64',
  strict: 'base64',
  hidden: true,
  required: [{ name: 'string', docs: 'The string to encode or decode' }],
  optional: [
    {
      name: '--decode',
      alias: '-d',
      boolean: true,
      docs: 'Decode the given string'
    },
    {
      name: '--break',
      alias: '-b',
      numeric: true,
      docs: 'break encoded string into num character lines'
    }
  ]
}

/**
 * Break the given string into lines with a maximum number of
 * characters, if so instructed
 *
 */
const breakout = (str: string, options) => {
  if (options.break > 0) {
    let dest = ''
    for (let idx = 0; idx < str.length; idx += options.break) {
      dest = dest + str.slice(idx, Math.min(str.length, idx + options.break)) + '\n'
    }
    return dest
  } else {
    return str
  }
}

/**
 * The command handlers
 *
 */
export default (commandTree: Registrar) => {
  debug('init')

  commandTree.listen(
    '/base64',
    ({ argvNoOptions, parsedOptions: options }) => {
      const str = argvNoOptions[1]
      debug('str', str, argvNoOptions)

      if (options.decode) {
        debug('decoding')
        return breakout(Buffer.from(str, 'base64').toString(), options)
      } else {
        debug('encoding')
        return breakout(Buffer.from(str).toString('base64'), options)
      }
    },
    { usage }
  )
}
