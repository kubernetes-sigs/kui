/*
 * Copyright 2017-18 IBM Corporation
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
 * This plugin introduces /wsk/testing/loadtest, to help with driving
 * load. It adds a synonym "lt" for this command.
 *
 */

import Debug from 'debug'

import { Arguments, ParsedOptions, Registrar } from '@kui-shell/core'

import { kvOptions } from '../key-value'
import { clientOptions, getClient } from '../../client/get'

const debug = Debug('plugins/openwhisk/cmds/load-test')

// eslint-disable-next-line @typescript-eslint/no-var-requires
const prettyPrintDuration = require('pretty-ms')

/**
 * Usage information
 *
 */
const usage = (verb: string) =>
  `Usage: ${verb} <action> [--numIters|-n N] [--numThreads|-t M] [--thinkTime|-s millis] [--validator|-v ...]`

const costFns = {
  duration: {
    cost: (duration: string) => duration, // nothing fancy, duration alone is our measure
    pretty: prettyPrintDuration, // use the pretty-ms module to render durations

    summary: D =>
      D.N === 0
        ? `No such recent activity of ${D.name}`
        : `The <strong>average</strong> duration of <strong>${D.N}</strong> ${
            D.N === 1 ? 'activation' : 'activations'
          } ${D.name ? 'of ' + D.name : ''} was <strong>${prettyPrintDuration(D.totalCost / D.N)}</strong>.`
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatOneGroup = (name: string, data: any[], costFn) => {
  if (data.length === 0) {
    return document.createTextNode('No activity')
  }

  data.sort((a, b) => a - b)

  const totalCost = data.reduce((sum, value) => sum + value, 0)

  /** return the nth percentile in the cumulative distribution */
  const n = N => data[Math.floor((data.length * N) / 100)]

  const dom = document.createElement('div')
  const summary = document.createElement('div')
  summary.innerHTML = costFn.summary({ N: data.length, name, totalCost })
  dom.appendChild(summary)

  if (data.length > 0) {
    const breakdown = document.createElement('div')
    breakdown.style.display = 'table'
    breakdown.style.margin = '1ex 3em 0'
    dom.appendChild(breakdown)
    const Ns = [25, 50, 90, 95, 99]
    Ns.forEach(N => {
      const breakdownN = document.createElement('div')
      breakdownN.style.display = 'table-row'
      breakdown.appendChild(breakdownN)

      const label = document.createElement('span')
      label.className = 'deemphasize'
      label.innerText = `${N}th`
      label.style.display = 'table-cell'
      label.style.padding = '0.5ex'
      breakdownN.appendChild(label)

      const value = document.createElement('span')
      value.innerText = costFn.pretty(n(N) || 0)
      value.style.display = 'table-cell'
      value.style.padding = '0.5ex'
      breakdownN.appendChild(value)
    })
  }

  return dom
}

/**
 * Format a result for display in the wskng repl
 *    more or less, we format a table here. coudl be cleaner, go for it!
 *
 */
const formatResultForRepl = (costFn, name: string) => (groups, numErrors) => {
  if (numErrors === true) {
    // this means we used a validator that said "true" meaning all's good
    numErrors = 0
  }

  const result = document.createElement('div')
  result.style.display = 'flex'
  result.style.flexDirection = 'column'
  result.style.marginTop = '1ex'

  const valid = document.createElement('div')
  result.appendChild(valid)
  valid.innerText = `Run was ${numErrors === true || numErrors === 0 ? 'valid' : 'INVALID'}${
    numErrors > 0 ? ' with ' + numErrors + ' errors' : ''
  }`
  valid.className = numErrors === 0 ? 'green-text' : 'oops'

  const table = document.createElement('div')
  result.appendChild(table)
  table.style.display = 'flex'
  table.style.flexWrap = 'wrap'
  for (const version in groups) {
    const cell = document.createElement('div')
    table.appendChild(cell)

    if (version !== 'all') {
      // all would mean there is no grouping
      cell.style.margin = '1em'
      cell.style.display = 'flex'
      cell.style.flexDirection = 'column'
      cell.style.alignItems = 'center'

      const cellLabel = document.createElement('div')
      cellLabel.className = 'deemphasize'
      cellLabel.style.padding = '0.5ex'
      cellLabel.style.marginBottom = '0.5ex'
      cellLabel.innerText = `${version}`
      cell.appendChild(cellLabel)
    }

    cell.appendChild(formatOneGroup(name, groups[version] || [], costFn))
  }

  return result
}

const makeValidator = (template, { numThreads, numIters }) => {
  if (!template) return () => true // every successful activation is valid

  return results => {
    const sandbox = {
      results,
      numIters,
      numThreads
    }
    require('vm').runInNewContext(template, sandbox)

    const validRun = sandbox['numErrors'] === 0

    if (!validRun) {
      console.error('load-test::validity failure', sandbox)
    }
    return sandbox['numErrors']
  }
}

interface Options extends ParsedOptions {
  numIters?: number
  numThreads?: number
  thinkTime?: number
  validator?: string
}

/**
 * The loadtest command handler
 *
 */
const loadtest = (verb: string) => ({ argv, parsedOptions, execOptions }: Arguments<Options>) => {
  const { kv, nameIdx } = kvOptions(argv, verb)

  const action = argv[nameIdx]
  const numThreads = parsedOptions.numThreads || 4
  const numIters = parsedOptions.numIters || 10
  const thinkTime = Object.prototype.hasOwnProperty.call(parsedOptions, 'thinkTime') ? parsedOptions.thinkTime : 100

  debug('action', action)
  debug('numThreads', numThreads)
  debug('numIters', numIters)
  debug('thinkTime', thinkTime)

  if (!action) {
    throw new Error(usage(verb))
  }

  const results = []
  const validator = makeValidator(parsedOptions.validator, { numThreads, numIters })

  console.error(`loadtest action=${action} numThreads=${numThreads} numIters=${numIters} thinkTime=${thinkTime}`)

  interface Tally {
    durations: {
      success: number[]
      failure: number[]
    }
    numErrors?: number
  }

  return new Promise<Tally>(resolve => {
    // tally of results
    const tally: Tally = {
      durations: {
        success: [],
        failure: []
      }
    }

    // a count down latch, so that we know when we're done
    let latch = numThreads
    const countDown = () => {
      if (--latch === 0) {
        resolve(tally)
      }
    }

    // this is the worker
    const spawn = (iter: number) => {
      if (iter === numIters) {
        countDown()
      } else {
        // invoke the action with the given parameters
        const params = kv.parameters.reduce((M, kv) => {
          M[kv.key] = kv.value
          return M
        }, {})

        getClient(execOptions)
          .actions.invoke(Object.assign({ name: action, params: params || {}, blocking: true }, clientOptions))
          .then(activation => {
            const duration = activation.end - activation.start
            if (activation.response && activation.response.success) {
              results.push(activation.response.result)
              tally.durations.success.push(duration)
            } else {
              tally.durations.failure.push(duration)
            }

            // proceed to the next iter
            spawn(iter + 1)
            // setTimeout(() => spawn(iter + 1, activation), thinkTime)
          })
          .catch(activation => {
            console.error(activation)
            const duration = activation.end && activation.start ? activation.end - activation.start : 0
            tally.durations.failure.push(duration)

            // proceed to the next iter
            spawn(iter + 1)
            // setTimeout(() => spawn(iter + 1), thinkTime)
          })
      }
    }

    // spawn the workers
    for (let idx = 0; idx < numThreads; idx++) {
      setTimeout(() => spawn(0), 0)
    }
  }).then(tally => {
    return formatResultForRepl(costFns.duration, action)(tally.durations, validator && validator(results))
  })
}

/** this is the auth body */
export default async (commandTree: Registrar) => {
  const loadtestCmd = commandTree.listen('/wsk/testing/lt', loadtest('lt'), {
    usage: {
      command: 'lt',
      docs: 'Drive load against a selected action'
    }
  })
  commandTree.synonym('/wsk/testing/loadtest', loadtest('loadtest'), loadtestCmd, {
    usage: {
      command: 'loadtest',
      docs: 'Drive load against a selected action'
    }
  })
}
