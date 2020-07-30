/*
 * Copyright 2017-19 IBM Corporation
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

export const patterns = {
  commentLine: /\s+#.*$/,
  dash: /-([^\s]*)/,
  whitespace: /\s/
}

/**
 * Escape the given value so that it is compatible with command line execution
 *
 */
const escape = (str: string) => str.replace(patterns.dash, "'-$1'")

/**
 * Resolve the given string as a possible reference to an environment
 * variable; e.g. $FOO should resolve to 3 if process.env.FOO has
 * value 3.
 *
 */
const resolveEnvVar = (variable: string): string => {
  const envValue = process.env[variable.substring(1)]
  return envValue ? escape(envValue) : variable
}

/**
 * Split the given string into an argv
 *
 */
export interface Split {
  A: string[]
  endIndices: number[]
}

const endsWithQuoteSpace = (str: string, idx: number, lookFor: string): boolean => {
  for (let ii = idx + 1; ii < str.length; ii++) {
    if (str.charAt(ii) === lookFor) {
      return ii === str.length - 1 || /\s/.test(str.charAt(ii + 1))
    }
  }

  return false
}

export const _split = (
  str: string,
  removeOuterQuotes = true,
  returnIndices = false,
  removeInlineOuterQuotes = false
): Split | string[] => {
  const A: string[] = []
  const endIndices: number[] = []
  const stack: string[] = []

  let cur = ''

  const removedLastOpenQuote: boolean[] = []
  let escapeActive = false
  for (let idx = 0; idx < str.length; idx++) {
    let char = str.charAt(idx)

    if (char === '\\') {
      if (!escapeActive) {
        escapeActive = true
        char = str.charAt(++idx)
      } else {
        escapeActive = false
        cur += '\\'
        continue
      }
    } else if (escapeActive) {
      escapeActive = false
    }

    if (stack.length === 0 && !escapeActive && patterns.whitespace.test(char)) {
      if (cur.length > 0) {
        A.push(resolveEnvVar(cur))
        endIndices.push(idx)
        cur = ''
      }
      continue
    }

    const last = stack.length > 0 && stack[stack.length - 1]

    if (char === '{') {
      stack.push(char)
    } else if (char === '}' && last === '{') {
      stack.pop()
    }

    if (!escapeActive && (char === "'" || char === '"')) {
      if (char === last) {
        // found matching close quote
        stack.pop()
        const removedLast = removedLastOpenQuote.pop()

        if (stack.length > 0 || !removedLast) {
          // add the outer quotes?
          cur += char
        }
      } else {
        // found open quote
        const removeQuote =
          removeOuterQuotes &&
          endsWithQuoteSpace(str, idx, char) &&
          (idx === 0 ||
            (stack.length === 0 && (removeInlineOuterQuotes || patterns.whitespace.test(str.charAt(idx - 1)))))

        removedLastOpenQuote.push(removeQuote)

        if (stack.length > 0 || !removeQuote) {
          // add the outer quotes?
          cur += char
        }

        stack.push(char)
      }
    } else {
      // not a quote
      cur += char
    }
  }

  if (cur.length > 0) {
    A.push(resolveEnvVar(cur))
    endIndices.push(str.length)
  }

  if (returnIndices) {
    return { A, endIndices }
  } else {
    return A
  }
}

export const split = (str: string, removeOuterQuotes = true, removeInlineOuterQuotes = false): string[] => {
  return _split(str, removeOuterQuotes, undefined, removeInlineOuterQuotes) as string[]
}
