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

import { ParsedOptions } from '../models/command'

/**
 * Turn an options struct into a cli string
 *
 * @param options is the command line options struct given by the
 * user.
 *
 */
export const optionsToString = (options: ParsedOptions) => {
  let str = ''
  for (const key in options) {
    // underscore comes from minimist
    if (
      key !== '_' &&
      options[key] !== undefined &&
      key !== 'name' &&
      key !== 'theme' &&
      typeof options[key] !== 'object'
    ) {
      const dash = key.length === 1 ? '-' : '--'
      const prefix = options[key] === false ? 'no-' : '' // e.g. --no-help
      const value = options[key] === true || options[key] === false ? '' : ` ${options[key]}`

      if (!(dash === '-' && options[key] === false)) {
        // avoid -no-q, i.e. single dash
        str = `${str} ${dash}${prefix}${key}${value}`
      }
    }
  }

  return str
}

/**
 * Check for unknown options
 *
 */
export const hasUnknownOptions = (options: ParsedOptions, expected: string[]) => {
  const M = expected.reduce((M, key) => {
    M[key] = true
    return M
  }, {} as Record<string, boolean>)
  for (const opt in options) {
    // underscore comes from minimist
    if (opt !== '_' && !M[opt]) {
      throw new Error(`Unexpected option ${opt}`)
    }
  }
}

/** flatten an array of arrays */
export function flatten<T>(arrays: T[][]): T[] {
  return [].concat(...arrays)
}
