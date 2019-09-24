/*
 * Copyright 2017,2019 IBM Corporation
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

import * as Debug from 'debug'
import * as wrk from 'wrk'
import * as parseDuration from 'parse-duration'

import { eventBus, REPL } from '@kui-shell/core'

import { wrkPath, wrkExeName } from './init'
import { generateScriptForAction, generateScriptForURL } from './scriptgen'

const debug = Debug('wrk/lt')

const findReverse = arr => {
  for (let idx = arr.length - 1; idx > 0; idx--) {
    if (arr[idx].N > 0) {
      return idx
    }
  }
  return -1
}

const find = arr => {
  for (let idx = 0; idx < arr.length - 1; idx++) {
    if (arr[idx].N > 0) {
      return idx
    }
  }
  return -1
}

const Latency = {
  /**
   * Try to explain why the slow hits are so much slower than the fast hits
   *
   */
  explain: latencyStacks => {
    if (latencyStacks) {
      console.error(latencyStacks)
      console.error(findReverse(latencyStacks))
      const { breakdown: fastest } = latencyStacks[find(latencyStacks) || 0] || { breakdown: undefined }
      const { breakdown: slowest } = latencyStacks[findReverse(latencyStacks) || latencyStacks.length - 1] || {
        breakdown: undefined
      }

      if (fastest && slowest) {
        // great, we have the data, now let's try to make sense of it
        const fastSum = Latency.sum(fastest)
        const slowSum = Latency.sum(slowest)
        const disparity = slowSum - fastSum

        if (disparity > 0) {
          // "key" here is a marker from openwhisk; we want
          // to find the markers that explain most of the
          // disparity between fast and slow activations
          const explanation = []
          for (const key in slowest) {
            const fast = fastest[key] || 0 // fastest might not have an entry
            const slow = slowest[key] // slow does, because that's what we're iterating over
            const delta = slow - fast // the average spread between slow and fast
            const covers = delta / disparity // how much of the disparity is covered?
            if (delta > 0) {
              explanation.push({ key, slow, fast, delta, covers })
            }
          }

          // sort the markers from biggest (slow-fast delta) to smallest (slow-fast delta)
          explanation.sort((a, b) => b.delta - a.delta)

          // how many explain deltas explain most of the disparity?
          /* const most = 0.99,                    // we want to explain 99% of the disparity
            dontBotherThreshold = 1 - most  // terminate when leftToExplain < dontBotherThreshold
            let mostlyIdx = 0,
            remaining = disparity,
            leftToExplain = 1
            while (mostlyIdx < explanation.length && leftToExplain > dontBotherThreshold) {
            if (explanation[mostlyIdx].covers > 0.01) {
            remaining -= explanation[mostlyIdx].delta
            leftToExplain = remaining / disparity // remaining/disparity is what is left to explain
            mostlyIdx++
            } else {
            // don't bother adding in tiny explanations
            break
            }
            } */

          return { explanation }
        }
      }
    }
  },

  /**
   * @return the sum of the values in the breakdown map
   *
   */
  sum: breakdown => {
    let sum = 0
    for (const key in breakdown) {
      sum += breakdown[key]
    }
    return sum
  }
}

const _lt = ({ url: altURL, results = [], options }) => ({ url, script }) =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise(async (resolve, reject) => {
    debug('url', url || altURL)

    // confirm that wrk is compiled and ready
    await REPL.qexec('wrk check')

    // request for early termination
    let terminateNow = false

    const { iters = 10000, timeout = 2000, duration = '10s', connections = 2 } = options

    const iter = (N, { dryRun = false } = {}) => {
      const nThreads = N * 1
      const nConns = N * connections // connections per thread

      debug('wrkPath', wrkPath())
      debug('wrkExeName', wrkExeName())

      // use wrk to drive the load
      wrk(
        {
          threads: nThreads,
          connections: nConns,
          duration: dryRun ? '2s' : duration,
          timeout,
          path: `./${wrkExeName()}`,
          execOptions: { cwd: wrkPath() },
          script,
          printLatency: true,
          url: url || altURL
        },
        (err, current) => {
          if (err) {
            console.error(err)
            reject(err)
          }

          if (dryRun) {
            // warm up run, don't report anything
            console.error('Trial run!')
            return iter(N)
          }

          debug('current', current)

          const first = results[0]
          const prev = results[results.length - 1]
          const fratio = !first ? 1 : parseDuration(current.latency90) / parseDuration(first.latency90)
          const pratio = !prev ? 1 : parseDuration(current.latency90) / parseDuration(prev.latency90)

          // try to explain why the slow hits are so slow
          const disparity = Latency.explain(current.latencyStacks)

          // add a few fields to the record
          const row = Object.assign(
            {
              N,
              fratio,
              pratio,
              disparity,
              timestamp: new Date().getTime()
            },
            current
          )

          /** push the current result onto the list of results */
          const push = () => {
            // notify the client of an incremental data point
            if (eventBus) {
              debug('row', row)
              eventBus.emit('/wrk/iter', row)
            }

            // and also push on the overall list of results
            results.push(row)

            return true
          }

          /** push the current result, then resolve the test */
          const pushResolve = () => push() && resolve(results)

          /* do NOT push the current result; just resolve the test */
          const nopushResolve = () => resolve(results)

          if (prev) {
            if (fratio === Infinity || pratio === Infinity) {
              console.error('Exiting due to infinite spike')
              return nopushResolve() // don't record the last finding
            } else if (fratio > 100) {
              console.error(`Exiting due to fratio ${fratio}`)
              return pushResolve()
            } else if (pratio > 100) {
              console.error(`Exiting due to pratio ${pratio}`)
              return pushResolve()
            } else if (current.non2xx3xx > 10) {
              console.error(`Exiting due to non2xx3xx ${current.non2xx3xx}`)
              return nopushResolve()
            } else if (current.connectErrors > 10) {
              console.error(`Exiting due to connectErrors ${current.connectErrors}`)
              return nopushResolve()
            } else if (current.readErrors > 10) {
              console.error(`Exiting due to readErrors ${current.readErrors}`)
              return nopushResolve()
            } else if (current.writeErrors > 10) {
              console.error(`Exiting due to writeErrors ${current.writeErrors}`)
              return nopushResolve()
            } else if (current.timeoutErrors > 10) {
              console.error(`Exiting due to timeoutErrors ${current.timeoutErrors}`)
              return nopushResolve()
            }
          }

          if (terminateNow) {
            console.error('Exiting due to termination request')
            pushResolve()
          } else if (N === iters) {
            console.error('Exiting due to maxIters')
            pushResolve()
          } else {
            // we're not terminating, so push the current result and continue
            push()
            iter(N + 1)
          }
        }
      )
    }

    iter(1, { dryRun: true })

    eventBus.on('/wrk/terminate', () => {
      terminateNow = true
    })
  })
    .then(result => {
      // cleanupCallback()
      return result
    })
    .catch(err => {
      // cleanupCallback()
      throw err
    })

/**
 * Start a load test against the given url
 *
 */
export const lt = options =>
  REPL.qexec(`wsk action get "${options.url}"`)
    .then(generateScriptForAction(options))
    .catch(generateScriptForURL(options))
    .then(_lt(options))
