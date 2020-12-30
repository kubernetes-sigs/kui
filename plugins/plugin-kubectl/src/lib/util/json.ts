/*
 * Copyright 2020 IBM Corporation
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

import { Streamable } from '@kui-shell/core'

/**
 * A simple streaming JSON parser.
 * TODO: make this a real stream
 *
 */
export default function mkGenerator<T extends Streamable>(
  stream: NodeJS.ReadableStream,
  onData: (obj: T) => void,
  onExit: (exitCode: number) => void
) {
  let escaping = false
  let inQuotes = false
  let depth = 0
  let bundle = ''

  if (onExit) {
    stream.on('done', onExit)
  }

  if (onData) {
    stream.on('data', _data => {
      const data = _data.toString()

      for (let idx = 0; idx < data.length; idx++) {
        const ch = data.charAt(idx)
        const escaped = escaping
        escaping = false
        bundle += ch

        if (!inQuotes && ch === '{') {
          depth++
        }
        if (!escaped && ch === '"') {
          inQuotes = !inQuotes
        }
        if (!escaped && ch === '\\') {
          escaping = true
        }
        if (!inQuotes && ch === '}') {
          if (--depth === 0) {
            let obj: T
            try {
              obj = JSON.parse(bundle) as T
              onData(obj)
            } catch (err) {
              console.error('Error parsing bundle', bundle, err)
            }
            bundle = ''
          }
        }
      }
    })
  }
}
