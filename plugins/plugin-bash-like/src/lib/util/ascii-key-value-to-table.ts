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

/**
 * Match strings that look like this:
 *   k1=v1
 *   k2=v2
 *    ...
 *
 * and capture the `(k1,v1)` pairs. The return value will be:
 *   `[ { name: 'k1', attributes: [ { name: 'v1' } ] }, ... ]`
 */
interface Attr {
  name: string
  value: string
  css: string
}
interface Pair {
  type: string
  name: string
  onclick: boolean
  attributes: Attr[]
}
export default (str: string): Pair[] | void => {
  const kvPattern = /^([^=]+)=(.+)$/gm

  let match = kvPattern.exec(str)
  if (match) {
    const matches = []

    do {
      const value = {
        name: 'value',
        onclick: false,
        value: match[2],
        css: 'normal-wrap break-all'
      }
      matches.push({ type: 'key-value', name: match[1], attributes: [value] })
    } while ((match = kvPattern.exec(str)))

    // make sure we've captured all of the rows
    const nLines = str.split(/\n/).filter(x => x).length
    return nLines === matches.length && matches
  }
}
