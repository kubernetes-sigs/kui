/*
 * Copyright 2020 The Kubernetes Authors
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

import TrieSearch from 'trie-search'

import { getCurrentContext } from '../commands/context'

const trie = new TrieSearch<string>() // Command<KResponse, ParsedOptions>>()
const trieWithoutContext = new TrieSearch<string>() // Command<KResponse, ParsedOptions>>()

export { trie as commandsTrie }

/**
 * Enter newly registered command in the trie
 *
 */
export function registerTypeahead(route: string) {
  trie.map(route, route)

  const routeWithoutImplicitContext = route.replace(new RegExp(`^/${getCurrentContext()}`), '')
  trieWithoutContext.map(routeWithoutImplicitContext, routeWithoutImplicitContext)
}

/**
 * User expressed `base`, and it matches the full `route`. Return the
 * relevant suffix of `route`, expressed with whitespace.
 *
 */
function extend(base: string[], route: string | void): string | void {
  if (route) {
    const that = route.split(/\//)
    const N = Math.min(base.length, that.length)

    let idx = 0
    for (; idx < N; idx++) {
      if (base[idx] !== that[idx]) {
        break
      }
    }

    if (idx < N) {
      // kubectl g -> et (no extra)
      // kubectl f -> oo bar (hypothetical, but imagine there were a unique multi-word match)
      const extra = that.slice(idx + 1).join(' ')
      return that[idx].slice(base[idx].length) + (extra ? ` ${extra}` : '')
    } else {
      // add only the "extra"
      return that.slice(idx).join(' ')
    }
  }
}

function findMinimalCommonPrefix(matches: string[]): string | void {
  if (matches.length > 0) {
    const N = matches.reduce((N, match) => (N === -1 ? match.length : Math.min(N, match.length)), -1)
    for (let idx = 0; idx < N; idx++) {
      const k = matches[0][idx]
      for (let jdx = 1; jdx < matches.length; jdx++) {
        if (matches[jdx][idx] !== k) {
          return matches[0].slice(0, idx)
        }
      }
    }

    return matches[0]
  }
}

function typeaheadMatch(prefix: string): string[] {
  if (prefix.length === 0) {
    return []
  } else {
    // look up first without context, then with implicit context
    const try1 = trieWithoutContext.get(prefix)
    const results = try1.length === 0 ? trie.get(prefix) : try1

    return Array.from(new Set(results))
  }
}

/**
 * Typeahead find lookup
 *
 * @return list of matches
 *
 */
export default function typeahead(prefix: string): string[] {
  const desired = `${prefix.charAt(0) === '/' ? '' : '/'}${prefix.replace(/^\s+/, '').split(/\s+/).join('/')}`

  const match = findMinimalCommonPrefix(typeaheadMatch(desired))
  const maybe = extend(desired.split(/\//), match)
  if (maybe) {
    return [maybe]
  } else {
    return []
  }
}
