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

import Debug from 'debug'
const debug = Debug('k8s/formatters/redact')

/**
 * If a redacted string is very long, this limit governs maximum
 * number of redact characters to draw
 *
 */
const MAX_REDACT_LENGTH = 40

/**
 * Make a regexp pattern for the given key
 *
 */
const pattern = (key: string): RegExp => {
  const pat = `(\\s+)(${key}:)(\\s*)([>|][-+]?\\n)?(.+)`
  debug('pat', pat)
  return new RegExp(pat, 'g')
}

/**
 * The rule set of redaction patterns
 *
 */
const patterns = [
  pattern('auth'),
  pattern('insecure'),
  pattern('password'),
  pattern('token'),
  pattern('user'),
  pattern('user_name'),
  pattern('username')
]

/**
 * A RegExp replace handler function that redacts a given 'key: value'
 * to appear instead as 'key: xxx' where the number of x's equals the
 * length of the value (as a string), and using unicode \u2588 as the
 * redaction character.
 *
 */
const keyValueRedactor = (_, precedingWhitespace, key, interstitialWhitespace, maybeContinuation, value) => {
  return `${precedingWhitespace}${key}${interstitialWhitespace}${maybeContinuation || ''}${new Array(
    Math.min(MAX_REDACT_LENGTH, value.length)
  )
    .fill('\u2588')
    .join('')}`
}

/**
 * Redact the given string, using the given pattern
 *
 */
const redactWithPattern = (str: string, pattern: RegExp): string => {
  return str.replace(pattern, keyValueRedactor)
}

/**
 * Redact the given YAML
 *
 */
// export const redactYAML = (str: string, options?): string => {
export const redactYAML = (str: string): string => {
  return patterns.reduce(redactWithPattern, str)
}

/**
 * Redact the given JSON
 *
 */
// export const redactJSON = (obj: any, options?): any => {
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const redactJSON = (obj: any): any => {
  // FIXME
  return obj
}
