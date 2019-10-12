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

import { UI } from '@kui-shell/core'

/**
 * e.g. 2017-06-15T14:41:15.60027911Z  stdout:
 *
 */
const logPatterns = {
  logLine: /^\s*(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.[\d]+Z)\s+(\w+):\s+(.*)/
}

/**
 * Beautify the given stringified json, placing it inside the given dom container
 *
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const prettyJSON = (raw: Record<string, any>, container: HTMLElement) => {
  container.innerText = JSON.stringify(raw, undefined, 2)
}

/**
 * Render the given field of the given entity in the given dom container
 *
 */
export default async (
  container: HTMLElement,
  entity: Record<string, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
  field: string,
  noRetry = false // eslint-disable-line @typescript-eslint/no-unused-vars
) => {
  if (field === 'raw') {
    // special case for displaying the record, raw, in its entirety
    const value = Object.assign({}, entity)
    delete value.modes
    delete value['apiHost']
    delete value.verb
    delete value.type
    delete value.isEntity
    delete value.prettyType
    delete value.prettyKind
    const raw = JSON.stringify(value, undefined, 2)

    if (raw.length < 10 * 1024) {
      container.innerText = raw
    } else {
      // too big to beautify; try to elide the code bits and
      // then we'll re-check
      const raw = JSON.stringify(
        value,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (key: string, value: any) => {
          if (key === 'code' && JSON.stringify(value).length > 1024) {
            // maybe this is why we're too big??
            return '\u2026'
          } else {
            return value
          }
        },
        4
      )

      // re-checking!
      if (raw.length > 1 * 1024 * 1024) {
        // oof, still too big, crop and add a tail ellision
        container.innerText = raw.substring(0, 1 * 1024 * 1024) + '\u2026'
      } else {
        // yay, eliding the code helped
        container.innerText = raw
      }
    }
    return
  }

  let value = entity[field]
  if (!value || value.length === 0) {
    container.innerText = `This entity has no ${field}`
  } else if (typeof value === 'string') {
    // render the value like a string
    if (field === 'source') {
      // hmm, let's not beautify the source code. maybe we will revisit this, later
      // const beautify = value => require('js-beautify')(value, { wrap_line_length: 80 })
      container.innerText = value
    } else {
      container.innerText = value
    }
  } else if (field === 'logs' && Array.isArray(value)) {
    const logTable = document.createElement('div')
    logTable.className = 'log-lines'
    UI.empty(container)
    container.appendChild(logTable)

    let previousTimestamp: Date
    value.forEach((logLine: string) => {
      const lineDom = document.createElement('div')
      lineDom.className = 'log-line'
      logTable.appendChild(lineDom)

      const match = logLine.match(logPatterns.logLine)

      if (match) {
        const date = document.createElement('div')
        // const type = document.createElement('div')
        const mesg = document.createElement('div')
        lineDom.appendChild(date)
        // lineDom.appendChild(type)
        lineDom.appendChild(mesg)

        lineDom.className = `${lineDom.className} logged-to-${match[2]}` // add stderr/stdout to the line's CSS class

        date.className = 'log-field log-date hljs-attribute'
        // type.className = 'log-field log-type'
        mesg.className = 'log-field log-message slight-smaller-text'

        try {
          const timestamp = new Date(match[1])
          date.appendChild(UI.PrettyPrinters.time(timestamp, 'short', previousTimestamp))
          previousTimestamp = timestamp
        } catch (e) {
          date.innerText = match[1]
        }
        // type.innerText = match[2]

        if (match[3].indexOf('{') >= 0) {
          // possibly JSON?
          try {
            mesg.innerText = JSON.stringify(JSON.parse(match[3]), undefined, 2)
          } catch (err) {
            // not json!
            mesg.innerText = match[3]
          }
        } else {
          // not json!
          mesg.innerText = match[3]
        }
      } else if (typeof logLine === 'string') {
        // unparseable log line, so splat out the raw text
        lineDom.innerText = logLine
      } else if (typeof logLine === 'object') {
        const code = document.createElement('code')
        code.appendChild(document.createTextNode(JSON.stringify(logLine, undefined, 2)))
        lineDom.appendChild(code)
      } else {
        // unparseable log line, so splat out the raw text
        lineDom.appendChild(document.createTextNode(logLine))
      }
    })
  } else {
    // render the value like a JSON object
    // for now, we just render it as raw JSON, TODO: some sort of fancier key-value pair visualization?
    if (field === 'parameters' || field === 'annotations') {
      // special case here: the parameters field is really a map, but stored as an array of key-value pairs
      interface KeyValueMap {
        [key: string]: string
      }
      value = value.reduce((M: KeyValueMap, kv) => {
        M[kv.key] = kv.value
        return M
      }, {})
    }
    const prettier = JSON.stringify(value, undefined, 2)

    // apply the syntax highlighter to the JSON
    container.innerText = prettier
  }
}
