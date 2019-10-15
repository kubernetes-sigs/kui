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

import Commands from '@kui-shell/core/api/commands'
import { prettyPrintTime } from '@kui-shell/core/api/pretty-print'

const debug = Debug('k8s/util/log-parser')

/**
 * Timestamp format. Usually one of 'long', 'short', or 'narrow',
 * corresponding roughly e.g. to 'Thursday' versus 'Thu' versus 'T'.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString
 *
 */
const timestampFormat = 'short'

/**
 * Squash runs of the same log entry
 *
 */
const squashLogRuns = (isNotCloudLens: boolean, options: Options) => (
  soFar: ZaprEntry[],
  logLine: string
): ZaprEntry[] => {
  let current: ZaprEntry

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
    current = {
      logType,
      timestamp,
      origin,
      rest,
      runLength,
      rawTimestamp: timestamp,
      provider: ''
    }
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
          runLength: 1,
          timestamp: '',
          rawTimestamp: '',
          provider: ''
        }
      } else {
        current = {
          logType: 'raw',
          rest: logLine,
          runLength: 1,
          timestamp: '',
          rawTimestamp: '',
          provider: '',
          origin: ''
        }
      }
    } catch (err) {
      current = {
        logType: 'raw',
        rest: logLine,
        runLength: 1,
        timestamp: '',
        rawTimestamp: '',
        provider: '',
        origin: ''
      }
    }
  }

  const previous = soFar[soFar.length - 1]

  if (
    previous &&
    previous.logType &&
    previous.logType === current.logType &&
    previous.origin === current.origin &&
    previous.rest === current.rest
  ) {
    // squashable!
    previous.runLength++
  } else {
    // not squashable!
    soFar.push(current)
  }

  return soFar
}

interface Options {
  asHTML?: boolean
  asJSON?: boolean
}

interface ZaprEntry {
  timestamp: string | Text | Element
  rawTimestamp: string
  logType: string
  provider: string
  origin: string
  rest: string | Record<string, string>
  runLength?: number
}

/**
 * sigh...
 *
 * Array.prorotype.findIndex does not accept a start index;
 * and Array.prototype.indexOf does not accept a pattern
 *
 */
function findIndex(A: string[], pattern: RegExp, startIdx: number): number {
  for (let idx = startIdx; idx < A.length; idx++) {
    if (A[idx].match(pattern)) {
      return idx
    }
  }
  return -1
}

/**
 * Parser for zapr-formatted logs
 *
 * @return undefined if we don't have any log entries
 *
 */
const parseZapr = (raw: string): ZaprEntry[] => {
  const pattern = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d+Z)\s+(DEBUG|INFO|ERROR)\s+([^\s]+)\s+([^\s]+)\s+(.*)$/m

  const records = raw.split(pattern).filter(x => x !== '\n')
  const lines = []

  let idx = 0
  while (true) {
    const nextIdx = findIndex(records, /(DEBUG|INFO|ERROR)/, idx)
    if (nextIdx >= idx + 1) {
      const startIdx = nextIdx - 1
      for (let preIdx = idx; preIdx < startIdx; preIdx++) {
        const maybe = records[preIdx].match(/^\n?(\d{4}\/\d{2}\/\d{2}\s+\d{2}:\d{2}:\d{2})\s+(.*)\n$/)
        if (maybe) {
          lines.push({
            timestamp: maybe[1],
            logType: 'INFO',
            provider: '',
            origin: '',
            rest: maybe[2]
          })
        } else {
          lines.push({
            timestamp: '',
            logType: 'INFO',
            provider: '',
            origin: '',
            rest: records[preIdx].replace(/^\n(.*)\n$/, '$1')
          })
        }
      }
      lines.push({
        timestamp: records[startIdx],
        logType: records[startIdx + 1],
        provider: records[startIdx + 2],
        origin: records[startIdx + 3],
        rest: records[startIdx + 4]
      })

      idx = startIdx + 5
    } else {
      break
    }
  }

  // return undefined if we don't have any log entries
  debug('zapr?', lines.length > 0, lines)
  return lines.length > 0 && lines
}

/**
 * Parser for CloudLens-formatted logs
 *
 * @return undefined if we don't have any log entries
 *
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseCloudLens = (raw: string, execOptions: Commands.ExecOptions, options: Options): any[] => {
  const pattern = /^(?=[IEF][0-9]+)/m
  const linesByCloudLens = raw.split(pattern)

  return linesByCloudLens
    .slice(Math.max(0, linesByCloudLens.length - 1000)) // display no more than 1000 lines
    .filter(x => x)
    .filter(x => x.indexOf('Watch close') < 0)
    .reverse()
    .reduce(squashLogRuns(false, options), [])
}

/**
 * Parser for istio logs
 *
 */
const parseIstio = (raw: string, execOptions: Commands.ExecOptions): ZaprEntry[] => {
  let prevTimestamp: string

  return raw
    .split(/[\n\r]/)
    .map(line => {
      try {
        const record: Record<string, string> = JSON.parse(line)
        const timestamp = record.time || record.timestamp || record.date
        const logType = record.level || record.logType || ''
        const origin = record.instance || record.provider || record.caller || ''

        const zapr: ZaprEntry = {
          timestamp: timestamp
            ? prettyPrintTime(timestamp, timestampFormat, prevTimestamp, Commands.withLanguage(execOptions))
            : '',
          rawTimestamp: timestamp,
          logType,
          provider: record.logger,
          origin,
          rest: record.msg || record
        }

        if (timestamp) {
          prevTimestamp = timestamp
        }

        return zapr
      } catch (err) {
        // not JSON

        // 2019-02-22T15:22:52.837196Z     info    Monitored certs: []envoy.CertSource{envoy.CertSource{Directory:"/etc/certs/", Files:[]string{"cert-chain.pem", "key.pem", "root-cert.pem"}}}
        const pattern1 = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z)\s+([^\s]+)\s+([\s\S]*)$/
        let match = line.split(pattern1)
        const timestampIndex = 1
        let logTypeIndex = 2
        let restIndex = 3
        let originIndex: number // none
        let providerIndex: number // none

        // [2019-02-22 15:22:54.048][16][info][upstream] external/envoy/source/common/upstream/cluster_manager_impl.cc:494] add/update cluster outbound|9093||istio-telemetry.istio-system.svc.cluster.local during init
        if (!match || match.length === 1) {
          const pattern2 = /^\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d+)\]\[(\d+)\]\[(.*)\]\[(.*)\]\s+(.*:\d+)\]\s+(.*)$/
          match = line.split(pattern2)

          if (match && match.length > 1) {
            // success
            logTypeIndex = 3
            originIndex = 5
            providerIndex = 4
            restIndex = 6
          } else {
            // [2019-03-29T23:14:17.109Z] "GET /ratings/0HTTP/1.1" 200 - 0 48 2 2 "-" "Apache-CXF/3.1.14" "d89018c8-792f-42a6-ab04-c863f9daed88" "ratings:9080" "172.30.166.214:9080" outbound|9080||ratings.default.svc.cluster.local - 172.21.130.75:9080 172.30.48.86:37582
            const pattern3 = /^\[(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z)\]\s+"([^"]+)"\s+(\d+)\s+(.*)$/
            match = line.split(pattern3)
            logTypeIndex = -1
            originIndex = 2
            providerIndex = 3
            restIndex = 4
          }
        }

        const timestamp = (match && match[timestampIndex]) || ''
        const logType = (match && match[logTypeIndex]) || 'info'
        const origin = (match && match[originIndex]) || ''
        const provider = (match && match[providerIndex]) || ''
        const rest = (match && match[restIndex]) || line

        const zapr: ZaprEntry = {
          timestamp:
            timestamp && prettyPrintTime(timestamp, timestampFormat, prevTimestamp, Commands.withLanguage(execOptions)),
          rawTimestamp: timestamp,
          logType,
          provider,
          origin,
          rest
        }

        if (timestamp) {
          prevTimestamp = timestamp
        }
        return zapr
      }
    })
    .reduce((lines: ZaprEntry[], line: ZaprEntry, idx) => {
      // try to reduce down log entries with the same (timestamp, origin, provider)
      if (idx > 0) {
        const prevLine = lines[lines.length - 1]

        if (
          line.origin === prevLine.origin &&
          line.provider === prevLine.provider &&
          line.rawTimestamp !== undefined &&
          line.rawTimestamp === prevLine.rawTimestamp
        ) {
          debug('concat')
          prevLine.rest = `${prevLine.rest}\n${line.rest}`
        } else {
          lines.push(line)
        }
      } else {
        lines.push(line)
      }

      return lines
    }, [])
}

/** filter out empty log entries */
const notEmpty = (_: ZaprEntry) => _.timestamp || _.rest || _.origin || _.provider

/**
 * Format the kubectl access logs
 *
 */
export const formatLogs = (raw: string, execOptions: Commands.ExecOptions, options: Options = { asHTML: true }) => {
  const logEntries: ZaprEntry[] =
    parseZapr(raw) || parseIstio(raw, execOptions) || parseCloudLens(raw, execOptions, options)
  debug('logEntries', logEntries)

  if (!options.asHTML) {
    return logEntries
  } else {
    const container = document.createElement('div')
    container.classList.add('log-lines')
    // container.classList.add('fixed-table-layout')

    const doWeHaveAnyFirstColumns =
      logEntries.findIndex(_ => !!(_.timestamp || _.origin || _.provider || _.runLength > 1)) >= 0

    logEntries
      .filter(notEmpty)
      .forEach(({ logType = '', timestamp = '', origin = '', provider = '', rest, runLength = 1 }) => {
        // dom for the log line
        const logLine = document.createElement('div')
        logLine.classList.add('log-line')
        container.appendChild(logLine)

        // stdout or stderr?
        if (logType.match(/^I/) || logType.match(/^INFO$/i)) {
          logLine.classList.add('logged-to-stdout')
        } else if (logType.match(/^[EF]/) || logType.match(/^(ERROR|WARN)/i)) {
          // errors or failures
          logLine.classList.add('logged-to-stderr')
        }

        // timestamp rendering
        if (doWeHaveAnyFirstColumns) {
          const timestampDom = document.createElement('td')
          timestampDom.className = 'log-field log-date entity-name-group hljs-attribute'
          if (typeof timestamp === 'string') {
            // due to td styling issues, some CSS attrs are on td > span
            const inner = document.createElement('span')
            inner.innerText = timestamp
            timestampDom.appendChild(inner)
          } else {
            timestampDom.appendChild(timestamp)
          }
          logLine.appendChild(timestampDom)

          // origin, e.g. filename and line number, rendering
          if (origin) {
            const originDom = document.createElement('span')
            originDom.className = 'entity-name'
            originDom.innerText = origin ? origin.replace(/]$/, '') : ''
            timestampDom.appendChild(originDom)
          }

          if (provider) {
            const providerDom = document.createElement('span')
            providerDom.className = 'entity-name provider-name'
            providerDom.innerText = provider ? provider.replace(/]$/, '') : ''
            timestampDom.appendChild(providerDom)
          }

          // run length rendering
          if (runLength > 1) {
            const runLengthDom = document.createElement('div')
            runLengthDom.innerText = `(${runLength} times)`
            runLengthDom.classList.add('small-top-pad')
            runLengthDom.classList.add('red-text')
            timestampDom.appendChild(runLengthDom)
          }
        }

        // log message rendering
        const restDom = document.createElement('td')
        restDom.className = 'log-field log-message slightly-smaller-text'

        if (typeof rest === 'object') {
          const pre = document.createElement('pre')
          const code = document.createElement('code')
          code.innerText = JSON.stringify(rest, undefined, 2)
          pre.appendChild(code)
          restDom.appendChild(pre)
        } else {
          const pre = document.createElement('pre')
          pre.classList.add('pre-wrap')
          pre.classList.add('break-all')
          restDom.appendChild(pre)

          // see if rest is of the form "a: b"
          const trySplit = rest.split(/^(.*:)(\s+.*)?$/)
          if (trySplit && trySplit.length > 1) {
            const a = document.createElement('span')
            a.classList.add('map-key')
            a.innerText = trySplit[1]
            pre.appendChild(a)

            if (trySplit[2]) {
              // we could just have a:<EOL>
              const b = document.createElement('span')
              b.classList.add('map-value')
              b.innerText = trySplit[2]
              pre.appendChild(b)
            }
          } else {
            pre.innerText = rest
          }
        }
        logLine.appendChild(restDom)
      })

    const wrapper = document.createElement('div')
    wrapper.classList.add('padding-content')
    wrapper.classList.add('scrollable')
    wrapper.classList.add('scrollable-auto')
    wrapper.classList.add('monospace')
    wrapper.classList.add('smaller-text')
    wrapper.appendChild(container)

    return wrapper
  }
}
