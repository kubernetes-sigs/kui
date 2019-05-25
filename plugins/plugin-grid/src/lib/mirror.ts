/*
 * Copyright 2017 IBM Corporation
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
 * Milliseconds to wait between queries to the OpenWhisk backend
 *
 */
/* const politeWait = 100,
      quiesceWait = 4000  // if we found nothing, in the poller, wait a bit longer
*/

/**
 * Variables to help with managing cancellation requests
 *
 */
/* let currentBackgroundWorker, killRequested */

/**
 * Ingest the given list of activations. The termination condition is
 * a bit ugly. I can't find a clean way to distinguish "some
 * ingestion conflicts" from "all ingestions conflicted", without
 * parsing out the error message. Hence the errorPattern, here.
 *
 */
/* const errorPattern = {
    pattern: /(\d+) of (\d+) operations/,
    nUnsuccessful: match => match[1],
    nTotal: match => match[2]
}
const ingest = (store, activations, keepAlive) => {
    return store.bulkAdd(activations)
        .then(res => {
            console.error(`################### mirror::ingested ${activations.length} documents`, typeof res, res)
        }).catch(err => {
            // determine whether we are well and truly done, be
            // parsing out the error message.
            //
            // It'll look something like "blah blah: n of m operations
            // blah blah", where n is the number of unsuccessful
            // ingestions and m is the number of requested ingestions.
            //
            const m = err.message.match(errorPattern.pattern)
            if (m && errorPattern.nUnsuccessful(m) === errorPattern.nTotal(m)) {
                // consider "done" as being indicated by n === m
                if (keepAlive) {
                    return true
                } else {
                    doneWithMirror(store)
                }
            }
        })
} */

/**
 * Return the localStorage key for the given attribute
 *
 */
/* const lsKey = attr => `wsk.activation-viz-plugin.mirror.${namespace.current()}.${attr}`
const lsSince = () => lsKey('since')
const lsUpto = () => lsKey('upto') */

/**
 * Purge all database contents
 *
 */
/* const purge = ({ block, nextBlock }) => {
    localStorage.removeItem(lsSince())
    localStorage.removeItem(lsUpto())

    return repl.prompt('DANGER! Please confirm', block, nextBlock, {
        placeholder: 'You are about to remove all of your mirrored activations. Please type "yes" to confirm.'
    }, options => {
        if (options.field !== 'yes') {
            //
            // the user didn't type 'yes', get out of here!
            //
            return Promise.reject('Operation cancelled')
        } else {
            const Dexie = require('dexie'),
                  ns = namespace.current()
            return Dexie.delete(ns)
                .then(() => true)
        }
    })
} */

/**
 * Initialize the dexie db
 *
 */
/* const init = () => {
    const Dexie = require('dexie'),
          ns = namespace.current(),
          db = new Dexie(ns),
          store = {
              activations: '&activationId,start,end,name,namespace,response.success'
          }

    db.version(1).stores(store)
    return db.activations
} */

/**
 * Command handler for mirror stop
 *
 */
/* const kill = () => {
    if (currentBackgroundWorker) {
        clearTimeout(currentBackgroundWorker)
        currentBackgroundWorker = false
        killRequested = true
    }
    return true
} */

/**
 * (1) Kill the background task, and (2) notify the user that we're done mirroring.
 *
 */
/* const doneWithMirror = store => {
    kill()             // (1)
    stats(store)()     // (2)
        .then(body => new Notification('OpenWhisk Activation Mirroring Complete', { body }))
} */

/**
 * Command handler for mirror stats
 *
 */
/* const stats = store => () => {
    const count = store.count()
    return Promise.all([count])
        .then( ([count]) => {
            return `Your local mirror contains ${count} activations`
        })
} */

/**
 * Query the mirror
 *
 */
/* const query = store => ({ argv, options }) => {
    const idx = argv.indexOf('query') + 1,
          A = argv[idx],
          B = argv[idx + 1],
          date = new Date(), y = date.getFullYear(), m = date.getMonth(), now = date.getTime(),
          oneDay = 24 * 60 * 60 * 1000,
          startOfToday = date.getTime() - (date % oneDay)

    let from, to, prettyPrintedRange, prettyAdjective
    if (A === 'today') {
        from = startOfToday
        to = now
        prettyPrintedRange = A
    } else if (A === 'yesterday') {
        from = startOfToday - oneDay
        to = startOfToday
        prettyPrintedRange = A
    } else if (B === 'month' || B === 'months') {
        if (A === 'this') {
            from = new Date(y, m, 1).getTime()
            to = new Date(y, m + 1, 0).getTime()
            prettyPrintedRange = 'this month'
        } else if (A === 'last') {
            from = new Date(y, m - 1, 1).getTime()
            to = new Date(y, m, 0).getTime()
            prettyPrintedRange = 'last month'
        } else if (argv[idx + 2] === 'ago') {
            try {
                const n = parseInt(A)
                from = new Date(y, m - n, 1).getTime()
                to = new Date(y, m - n + 1, 0).getTime()
            } catch (e) {
            }
        }
    } else if (B === 'year' || B === 'years') {
        if (A === 'this') {
            from = new Date(y, 0, 1).getTime()
            to = new Date(y, 12, 0).getTime()
            prettyPrintedRange = 'this year'
        } else if (A === 'last') {
            from = new Date(y - 1, 0, 1).getTime()
            to = new Date(y, 0, 0).getTime()
            prettyPrintedRange = 'last year'
        }
    } else if (B === 'week' || B === 'weeks') {
        const startOfWeek = (startOfToday - date.getDay() * oneDay)
        if (A === 'this') {
            from = startOfWeek
            to = now
            prettyPrintedRange = 'this week'
        } else if (A === 'last') {
            from = startOfWeek - 7 * oneDay
            to = startOfWeek
            prettyPrintedRange = 'last week'
        } else if (argv[idx + 2] === 'ago') {
            try {
                const n = parseInt(A)
                from = startOfWeek - n * 7 * oneDay
                to = startOfWeek - (n - 1) * 7 * oneDay
            } catch (e) {
            }
        }
    }

    if (!from && !to) {
        // default to the past 7 days
        from = now - 7 * oneDay
        to = now
        prettyPrintedRange = 'in the past 7 days'
    }

    if (options.name) {
        prettyPrintedRange = `${prettyPrintedRange} with name ${options.name}`
    }

    if (options.fixedTimeRange && options.fixedTimeRange !== 'false') {
        // if to - from > fixedTimeRange, we need to bump from up by that delta
        const correction = Math.max(0, to - from - options.fixedTimeRange)
        from += correction
    }

    if (from && to) {
        let collection = store.where('start').between(from, to)

        // hmm, can't use an index for this :(
        if (options.name) {
            collection = collection.and(_ => _.name.indexOf(options.name) >= 0)
        }

        if (options.raw) {
            return collection.sortBy('start')
        } else {
            return collection.count().then(count => `You had ${count} ${prettyAdjective ? prettyAdjective + ' ' : ''}activations ${prettyPrintedRange || 'in that time interval'}`)
        }
    } else {
        throw new Error('Please specify a time range or "last/this week/month/year"')
    }
} */

/**
 * Poll for new activations
 *
 */
/* const poll = (store) => {
    const { fetchActivationDataFromBackend } = require('./util'),
          parallelism = 1

    // (1) fetch and (2) ingest one batch, and then (3) call ourselves recursively
    const once = since => fetchActivationDataFromBackend(parallelism, { since })         // (1)
          .then(activations => {
              if (activations.length === 0) {
                  console.log('mirror:poll quiescing for a bit')
                  currentBackgroundWorker = setTimeout(() => once(since), quiesceWait) // (3)

              } else if (!killRequested) {
                  const {min:earliestStart,max:latestEnd} = activations.reduce(({min,max}, activation) => {
                      if (!min) min = activation.start
                      else min = Math.min(min, activation.start)

                      if (!max) max = activation.end
                      else max = Math.max(max, activation.end)

                      return {min, max}
                  }, {})

                  const //upto = earliestEnd,
                        since = Math.max(localStorage.getItem(lsSince()) || 0,
                                         latestEnd)

                  let waitTime = politeWait
                  ingest(store, activations, true)                                   // (2) true: stay alive, even if nothing new
                      .then(res => {
                          if (res) {
                              // nothing new
                              waitTime = quiesceWait
                          } else {
                              // the poll found new activations
                              eventBus.emit('/mirror/update', true)
                          }

                          currentBackgroundWorker = setTimeout(() => once(latestEnd), waitTime)     // (3)
                          localStorage.setItem(lsSince(), since)
                      })
              } else {
                  killRequested = false
                  return true
              }
          })

    killRequested = false
    const since = localStorage.getItem(lsSince())
    console.log('Starting poller at since=' + since)
    currentBackgroundWorker = setTimeout(() => once(since), 0)

    return 'Activation poller active'
} */

/**
 * Command handler for mirror
 *
 */
/* const mirror = ({ argvNoOptions: argv, parsedOptions: options }) => {
    const { fetchActivationDataFromBackend } = require('./util'),
          parallelism = 4,
          store = init(),
          idx = argv.findIndex(_ => _ === 'mirror'),
          subCommand = argv[idx + 1]

    if (subCommand === 'help') {
        throw new Error(usage())
    } else if (subCommand === 'stop' || subCommand === 'kill') {
        return kill()
    } else if (subCommand === 'purge') {
        return purge({ block, nextBlock })
    } else if (subCommand === 'query') {
        return query(store)({ argv,options })
    } else if (subCommand === 'stats') {
        return stats(store)()
    } else if (subCommand === 'poll') {
        return poll(store)
    }

    // start new mirror
    if (currentBackgroundWorker) {
        throw new Error('Mirror already underway')
    }

    // (1) fetch and (2) ingest one batch, and then (3) call ourselves recursively
    const once = upto => fetchActivationDataFromBackend(parallelism, { upto })         // (1)
          .then(activations => {
              if (activations.length === 0) {
                  doneWithMirror(store)
              } else if (!killRequested) {
                  const {min:earliestEnd,max:latestStart} = activations.reduce(({min,max}, activation) => {
                      if (!min) min = activation.end
                      else min = Math.min(min, activation.end)

                      if (!max) max = activation.start
                      else max = Math.max(max, activation.start)

                      return {min, max}
                  }, {})

                  const upto = earliestEnd,
                        since = Math.max(localStorage.getItem(lsSince()) || 0,
                                         latestStart)

                  ingest(store, activations)                                                // (2)
                  currentBackgroundWorker = setTimeout(() => once(earliestEnd), politeWait) // (3)

                  localStorage.setItem(lsSince(), since)
                  localStorage.setItem(lsUpto(), upto)
              } else {
                  killRequested = false
                  return true
              }
          })

    killRequested = false
    const upto = localStorage.getItem(lsUpto())
    console.log('Starting mirror at upto=' + upto)
    currentBackgroundWorker = setTimeout(() => once(upto), 0)

    return 'Mirroring commenced'
} */

/**
 * This is the module
 *
 */
/* module.exports = async (commandTree) => {
    synonyms('activations').forEach(syn => {
        commandTree.listen(`/wsk/${syn}/mirror`, mirror, { docs: 'Mirror activations locally' })
    })
} */
