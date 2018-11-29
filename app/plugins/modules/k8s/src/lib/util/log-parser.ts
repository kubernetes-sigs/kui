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

const debug = require('debug')('k8s/util/log-parser')

/**
 * Squash runs of the same log entry
 *
 */
const squashLogRuns = (isNotCloudLens: boolean, options: IOptions) => (soFar, logLine) => {
  let current
  if (!isNotCloudLens) {
    const columns = logLine.split(/\s+/)
    const logType = columns[0]
    const timestamp = columns[1]
    const origin = columns[3]
    const rawRest = columns.slice(4).join(' ')
    const runLength = 1

    let rest = rawRest
    try {
      if (options.asJSON) {
        rest = JSON.parse(rawRest)
      }
    } catch (err) {
      console.error(err)
    }
    current = { logType, timestamp, origin, rest, runLength }

  } else {
    try {
      const match = logLine.match(/^([^\s]+)\s+({.*})\s*$/)
      if (match) {
        const origin = match[1]
        const record = match[2]
        current = {
          logType: 'pair',
          origin,
          rest: options.asJSON ? JSON.parse(record) : record,
          runLength: 1
        }
      } else {
        current = { logType: 'raw', rest: logLine, runLength: 1 }
      }
    } catch (err) {
      current = { logType: 'raw', rest: logLine, runLength: 1 }
    }
  }

  const previous = soFar[soFar.length - 1]

  if (previous &&
      previous.logType && previous.logType === current.logType &&
      previous.origin === current.origin &&
      previous.rest === current.rest) {
    // squashable!
    previous.runLength++
  } else {
    // not squashable!
    soFar.push(current)
  }

  return soFar
}

interface IOptions {
  asHTML?: boolean
  asJSON?: boolean
}

/**
 * Format the kubectl access logs
 *
 */
export const formatLogs = (raw: string, options: IOptions = { asHTML: true }) => {
  const linesByCloudLens = raw.split(/^(?=[IEF][0-9]+)/m)
  const isNotCloudLens = linesByCloudLens.length === 1 && raw.indexOf('\n') >= 0

  const lines = isNotCloudLens
    ? raw.split(/[\n\r]/)
    : linesByCloudLens

  const logEntries = lines
    .slice(Math.max(0, lines.length - 1000)) // display no more than 1000 lines
    .filter(x => x)
    .filter(x => x.indexOf('Watch close') < 0)
    .reverse()
    .reduce(squashLogRuns(isNotCloudLens, options), [])

  if (!options.asHTML) {
    return logEntries
  } else {
    const container = document.createElement('div')
    container.classList.add('log-lines')

    logEntries.forEach(({ logType= '', timestamp= '', origin= '', rest, runLength }) => {
      // dom for the log line
      const logLine = document.createElement('div')
      logLine.classList.add('log-line')
      container.appendChild(logLine)

      // stdout or stderr?
      if (logType.match(/^I/)) {
        logLine.classList.add('logged-to-stdout')
      } else if (logType.match(/^[EF]/)) { // errors or failures
        logLine.classList.add('logged-to-stderr')
      }

      // timestamp rendering
      const timestampDom = document.createElement('div')
      timestampDom.className = 'log-field log-date entity-name-group'
      timestampDom.innerText = timestamp
      logLine.appendChild(timestampDom)

      // origin, e.g. filename and line number, rendering
      const originDom = document.createElement('div')
      originDom.className = 'entity-name'
      originDom.innerText = origin ? origin.replace(/]$/, '') : ''
      timestampDom.appendChild(originDom)

      // run length rendering
      if (runLength > 1) {
        const runLengthDom = document.createElement('div')
        runLengthDom.innerText = `(${runLength} times)`
        runLengthDom.classList.add('small-top-pad')
        runLengthDom.classList.add('red-text')
        timestampDom.appendChild(runLengthDom)
      }

      // log message rendering
      const restDom = document.createElement('div')
      restDom.className = 'log-field log-message'
      if (typeof rest === 'object') {
        const pre = document.createElement('pre')
        const code = document.createElement('code')
        code.innerText = JSON.stringify(rest)
        pre.appendChild(code)
        restDom.appendChild(pre)
      } else {
        restDom.innerText = rest
      }
      logLine.appendChild(restDom)
    })

    return container
  }
}
