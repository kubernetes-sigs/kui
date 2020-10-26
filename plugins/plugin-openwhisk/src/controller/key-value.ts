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

/**
 * Logic for parsing:
 * 1) limits, e.g. --memory 5M
 * 2) key-value parameters e.g. -p key value -a key value
 *
 */

import Debug from 'debug'
import { KeyVal, Limits } from 'openwhisk'
import parseDuration from 'parse-duration'
import { existsSync, readFileSync } from 'fs'
import { expandHomeDir } from '@kui-shell/core'

import { standardOptions } from './aliases'

const debug = Debug('openwhisk/key-value')

export interface KeyValOptions {
  parameters: KeyVal[]
  annotations: KeyVal[]
  limits: Limits
}

/**
 * File types to treat as binary
 *
 */
const isBinary = {
  yml: true, // not JSON friendly
  svg: true, // not JSON friendly
  xml: true, // not JSON friendly
  pem: true,
  png: true,
  jpg: true,
  jpeg: true,
  tiff: true,
  pdf: true,
  zip: true,
  gz: true,
  bz2: true,
  aiff: true,
  wav: true,
  ogg: true,
  mov: true,
  mp4: true
}

function isNumeric(input) {
  // a rough approximation
  // eslint-disable-next-line eqeqeq
  return input - 0 == input && ('' + input).trim().length > 0
}

/**
 * Handle one parameter-file argument
 *
 * @return the next argv index
 *
 */
function parseOneParamFile(idx: number, argv: string[], parameters: KeyVal[]): number {
  const file = argv[++idx]
  const params = JSON.parse(readFileSync(expandHomeDir(file)).toString())

  for (const key in params) {
    parameters.push({ key, value: params[key] })
  }

  return idx + 1
}

/**
 * Handle one limit argument
 *
 * @return the next argv index
 *
 */
function parseOneLimit(idx: number, argv: string[], key: 'timeout' | 'memory' | 'logs', limits: Limits): number {
  const valueString = argv[idx + 1]
  let value = parseInt(valueString, 10)

  // check that the value is a valid integer
  if (!isNumeric(valueString)) {
    if (key === 'timeout' && valueString && (valueString.endsWith('s') || valueString.endsWith('m'))) {
      value = parseDuration(valueString)
    } else {
      throw new Error(
        `Invalid ${key} limit: expected integer, but got ${valueString === undefined ? 'nothing' : valueString}.`
      )
    }
  }

  if (key === 'timeout') {
    limits.timeout = value
  } else if (key === 'memory') {
    limits.memory = value
  } else {
    limits.logs = value
  }

  return idx + 2
}

/**
 * Handle one key-value argument
 *
 * @return the next argv index
 *
 */
function parseOneKeyValue(idx: number, argv: string[], kv: KeyVal[]): number {
  if (!argv[idx + 1] || !argv[idx + 2]) {
    return idx + 1
  }

  if (argv[idx + 1].charAt(0) === '-') {
    try {
      // it might be a negative number...
      JSON.parse(argv[idx + 1])
    } catch (e) {
      throw new Error(`Parse error: expected string, got an option ${argv[idx + 1]}`)
      // return idx + 1
    }
  }
  if (argv[idx + 2].charAt(0) === '-') {
    try {
      // it might be a negative number...
      JSON.parse(argv[idx + 2])
    } catch (e) {
      throw Error(`Parse error: expected string, got an option ${argv[idx + 2]}`)
      // return idx + 1
    }
  }

  const paramName = argv[++idx]
  let paramValue = argv[++idx]
  let startQuote: string
  if (paramValue.startsWith('"')) {
    startQuote = '"'
  } else if (paramValue.startsWith("'")) {
    startQuote = "'"
  }
  if (startQuote) {
    while (!argv[idx].endsWith(startQuote)) {
      paramValue = `${paramValue} ${argv[++idx]}`
    }
    // paramValue = paramValue.replace(new RegExp(startQuote, 'g'), '')
  }

  if (paramValue.charAt(0) === '$') {
    paramValue = process.env[paramValue]
  }

  if (paramValue.charAt(0) === '@') {
    // this is an @file form of parameter. read in the file
    // !!!!!!! FIXME cap the size of the file to avoid bombing out
    if (paramValue.charAt(1) === '$') {
      debug('filename from env var', paramValue.substring(2))
      paramValue = `@${process.env[paramValue.substring(2)]}`
    }

    const location = expandHomeDir(paramValue.substring(1))
    if (!existsSync(location)) {
      throw new Error(`Requested parameter @file does not exist: ${location}`)
    } else {
      const extension = location.substring(location.lastIndexOf('.') + 1)
      const encoding = isBinary[extension] ? 'base64' : 'utf8'
      debug('encoding', encoding)

      paramValue = readFileSync(location).toString(encoding)
    }
  }

  // see if the value is JSON
  try {
    paramValue = JSON.parse(paramValue)
  } catch (e) {
    // console.error('NOT JSON', paramValue, typeof paramValue, argv)
    // console.error(e)
  }

  kv.push({
    key: paramName,
    value: paramValue
  })

  return idx + 1
}

function remove(idxBefore: number, idx: number, argv: string[]) {
  for (let i = idxBefore; i < idx; i++) {
    argv[i] = undefined
  }
}

/**
 * Parse the key-value and limit options from the given `argv`, and
 * return the residual `argvNoOptions` with all options stripped
 * off. Also return the index of the `name` that follows the given
 * `verb`.
 *
 */
export function kvOptions(
  argv: string[],
  verb: string
): { kv: KeyValOptions; argvNoOptions: string[]; nameIdx: number } {
  const options: KeyValOptions = {
    parameters: [],
    annotations: [],
    limits: {}
  }

  for (let idx = 0; idx < argv.length; ) {
    const opt = argv[idx]
    const idxBefore = idx
    if (opt === '-p' || opt === '--param') {
      idx = parseOneKeyValue(idx, argv, options.parameters)
      remove(idxBefore, idx, argv)
    } else if (opt === '-a' || opt === '--annotation') {
      idx = parseOneKeyValue(idx, argv, options.annotations)
      remove(idxBefore, idx, argv)
    } else if (opt === '-P' || opt === '--param-file') {
      idx = parseOneParamFile(idx, argv, options.parameters)
      remove(idxBefore, idx, argv)
    } else if (opt === '-m' || opt === '--memory') {
      idx = parseOneLimit(idx, argv, 'memory', options.limits)
      remove(idxBefore, idx, argv)
    } else if (opt === '-l' || opt === '--logsize') {
      idx = parseOneLimit(idx, argv, 'logs', options.limits)
      remove(idxBefore, idx, argv)
    } else if (opt === '-t' || opt === '--timeout') {
      idx = parseOneLimit(idx, argv, 'timeout', options.limits)
      remove(idxBefore, idx, argv)
    } else {
      idx++
    }
  }

  // we've stripped off the key-value parameters, replacing them with
  // `undefined` as we went
  const noOpts = argv
    .filter(_ => _)
    .map((_, idx, A) => {
      if (/^-/.test(_)) {
        return undefined
      } else if (idx > 0 && /^-/.test(A[idx - 1])) {
        const stripped = A[idx - 1].replace(/^-+/, '')
        if (!standardOptions.flags.boolean.includes(stripped)) {
          return undefined
        } else {
          return _
        }
      } else {
        return _
      }
    })
    .filter(_ => _)

  const nameIdx = noOpts.indexOf(verb) + 1

  return {
    kv: options,
    argvNoOptions: noOpts,
    nameIdx
  }
}

export default kvOptions
