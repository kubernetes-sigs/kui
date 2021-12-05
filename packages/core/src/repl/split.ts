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

export const patterns = {
  suffixComments: /^(\s*[^#\s].*)\s+#.*$/,
  prefixComments: /^\s*#(.*)$/,
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

const driveLetter = /^\w:\\/
export const _split = (
  str: string,
  removeOuterQuotes = true,
  returnIndices = false,
  removeInlineOuterQuotes = false,
  splitBy = ' ',
  startIdx = 0,
  endIdx = str.length
): Split | string[] => {
  const A: string[] = []
  const endIndices: number[] = []
  const stack: string[] = []

  let cur = ''

  let isWindowsDrivePath = process.platform === 'win32' && driveLetter.test(str)

  const removedLastOpenQuote: boolean[] = []
  let escapeActive = false
  for (let idx = startIdx; idx < endIdx; idx++) {
    const char = str.charAt(idx)

    if (char === splitBy) {
      if (
        splitBy === ' ' &&
        process.platform === 'win32' &&
        idx < str.length - 3 &&
        /\w/.test(str.charAt(idx + 1)) &&
        str.charAt(idx + 2) === ':' &&
        str.charAt(idx + 3) === '\\'
      ) {
        isWindowsDrivePath = true
      }
    } else if (!isWindowsDrivePath && char === '\\' && (idx === endIdx - 1 || str.charAt(idx + 1) !== '0')) {
      // careful about \0 for octal escape

      if (!escapeActive) {
        escapeActive = true
        if (/\n/.test(str.charAt(idx + 1))) {
          // see https://github.com/kubernetes-sigs/kui/issues/8274
          idx++
        }
        continue
        // char = str.charAt(++idx)
        // if (!removeOuterQuotes) {
        // cur += '\\'
        // }
      } else {
        escapeActive = false
        cur += '\\'
        continue
      }
    } else if (escapeActive) {
      escapeActive = false
    } else if (char === '#' && cur.length === 0 && stack.length === 0) {
      // stop parsing till end of line
      if (idx < str.length - 2 && str[idx + 1] === splitBy) {
        // e.g. "kubectl get pod#comment"
        A.push(char)
        cur = str.slice(idx + 1)
      } else {
        // e.g. "# comment"
        cur = str.slice(idx)
      }
      break
    }

    if (stack.length === 0 && !escapeActive && char === splitBy) {
      if (cur.length > 0) {
        A.push(resolveEnvVar(cur))
        endIndices.push(idx)
        cur = ''
      }
      continue
    }

    const last = stack.length > 0 && stack[stack.length - 1]

    if (char === '{' && stack.length === 0) {
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
      } else if (stack.length === 0 || stack[stack.length - 1] !== "'") {
        // found open quote, but double quotes inside of single quotes don't count
        const removeQuote =
          removeOuterQuotes &&
          endsWithQuoteSpace(str, idx, char) &&
          (idx === 0 || (stack.length === 0 && (removeInlineOuterQuotes || str.charAt(idx - 1) === splitBy)))

        removedLastOpenQuote.push(removeQuote)

        if (stack.length > 0 || !removeQuote) {
          // add the outer quotes?
          cur += char
        }

        stack.push(char)
      } else {
        // not to be treated as an open quote
        cur += char
      }
    } else {
      // not a quote
      cur += char
    }
  }

  if (A.length === 0 && /#\s*/.test(cur)) {
    // special case for str being "#" or "# "
    cur = cur.trim()
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

export const split = (
  str: string,
  removeOuterQuotes = true,
  removeInlineOuterQuotes = false,
  splitBy?: string,
  startIdx = 0,
  endIdx = str.length
): string[] => {
  return _split(str, removeOuterQuotes, undefined, removeInlineOuterQuotes, splitBy, startIdx, endIdx) as string[]
}

/** Look for cmd1; cmd2 patterns */
export function semiSplit(command: string): string[] {
  if (command.indexOf(';') < 0) {
    return []
  } else {
    const argv = split(command, false)

    let inStatement = false
    let statementTerminator = ''
    return argv.reduce(
      (sofar, a, idx) => {
        if (a === 'while' || a === 'for' || a === 'if' || a === 'case') {
          inStatement = true
          statementTerminator = a === 'if' ? 'fi' : a === 'case' ? 'esac' : 'done'
        } else if (inStatement && a === statementTerminator) {
          inStatement = false
        }

        if (!inStatement && a === ';') {
          sofar.A.push(sofar.cur)
          sofar.cur = ''
        } else if ((!inStatement && /;$/.test(a)) || idx === argv.length - 1) {
          sofar.A.push(sofar.cur + ' ' + a)
          sofar.cur = ''
        } else {
          sofar.cur += ' ' + a
        }
        return sofar
      },
      { A: [], cur: '' }
    ).A
  }
}
