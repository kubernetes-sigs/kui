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

import * as Debug from 'debug'

import { dirname, join } from 'path'
import { v4 as uuid } from 'uuid'
import * as prettyPrintDuration from 'pretty-ms'

import eventBus from '@kui-shell/core/core/events'
import UsageError from '@kui-shell/core/core/usage-error'
import { inBrowser } from '@kui-shell/core/core/capabilities'
import { flatten } from '@kui-shell/core/core/utility'
import * as repl from '@kui-shell/core/core/repl'
import { Tab } from '@kui-shell/core/webapp/cli'
import { removeAllDomChildren } from '@kui-shell/core/webapp/util/dom'
import { prettyPrintTime } from '@kui-shell/core/webapp/util/time'
import { getSidecar } from '@kui-shell/core/webapp/views/sidecar'
import { injectCSS } from '@kui-shell/core/webapp/util/inject'
import { EvaluatorArgs } from '@kui-shell/core/models/command'

import { ActivationListTable, currentNamespace } from '@kui-shell/plugin-openwhisk'

import { range as rangeParser } from './time'
import * as usage from '../usage'
import defaults from '../defaults'

const debug = Debug('plugins/grid/utils')
debug('loading')

export const nbsp = '\u00a0'
export const newline = '\u000a'
export const enDash = '\u2013'
export const emDash = '\u2014'
export const leftArrowHead = '\u25c0'
export const leftArrowHeadEmpty = '\u25c1'
export const rightArrowHead = '\u25b6'
export const rightArrowHeadEmpty = '\u25b7'

/** we may want to filter out activations with internal names */
export const isUUIDPattern = /.*[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

/** title to use when viewing general activity, i.e. without a name filter */
export const titleWhenNothingSelected = 'Recent Activity'

/** return the path attribute of the given activation */
export const pathOf = activation => `/${activation.annotations.find(({ key }) => key === 'path').value}`

/** make a filter by name */
const acceptAnything = x => x
const allBut = excludePattern => (!excludePattern ? acceptAnything : name => name.indexOf(excludePattern) < 0)
const accept = (includePattern, excluder) => name => name.indexOf(includePattern) >= 0 && excluder(name)
const makeFilter = (includePattern, excludePattern) => {
  if (!includePattern && !excludePattern) {
    return acceptAnything
  } else if (!includePattern) {
    return allBut(excludePattern)
  } else {
    return accept(includePattern, allBut(excludePattern))
  }
}

/**
 * foo => ${ns}/foo
 * ns/foo => ns/foo
 *
 */
const amendWithNamespace = async name => {
  const ns = await currentNamespace()
  if (name.indexOf(ns) >= 0) {
    if (name.charAt(0) === '/') return name.substring(1)
    else return name
  } else {
    return `${ns}/${name}`
  }
}

/**
 * Remove trigger and rule activations. These won't have an end
 * attribute. Also, take an optional name filter.
 *
 */
const filterOutNonActionActivations = filter => activations => {
  return activations.filter(_ => _.end && filter(pathOf(_)))
}

/**
 * Which tasks, e.g. actions or sequences referenced by name, does the
 * given app include? If the given app structure does not represent a
 * composition, then return the app's name. This fallback seems
 * reasonable, as the "tasks" in an action is [action]
 *
 */
const extractTasks = async app => {
  const { extractActionsFromAst } = await import('@kui-shell/plugin-apache-composer')
  const { namespace, name, ast } = app
  return [`/${namespace}/${name}`].concat(!ast ? [] : extractActionsFromAst(ast))
}

/**
 * If requested, filter by latency bucket
 *
 */
const filterByLatencyBucket = options => activations => {
  const { 'latency-bucket': latencyBucket } = options
  if (latencyBucket === undefined) {
    return activations
  } else {
    // TODO support options.full
    return activations.filter(_ => latencyBucket(_.end - _.start) === latencyBucket)
  }
}

/**
 * Is the given activation a successful one?
 * @see https://github.com/apache/incubator-openwhisk/blob/master/common/scala/src/main/scala/whisk/core/entity/ActivationResult.scala#L58
 *
 */
export const isSuccess = activation => activation.statusCode === 0
export const isNotSuccess = activation => activation.statusCode !== 0

/**
 * If requested, filter by success or failure
 *
 */
const filterBySuccess = ({ success, failure }) => activations => {
  if (!success && !failure) {
    return activations
  } else if (success) {
    return activations.filter(isSuccess)
  } else {
    return activations.filter(isNotSuccess)
  }
}

/**
 * Fetch the activation data from the OpenWhisk API
 *
 */
export const fetchActivationData /* FromBackend */ = (N, options) => {
  const { nocrawl = false, path, filter, include, exclude, skip = 0, batchSize = defaults.batchSize, all } = options
  let { name = '' } = options

  // see if the user requested a time range
  const timeRange = rangeParser(options)
  const upto = (timeRange && timeRange.upto) || options.upto // either something like --yesterday, or an explicit --upto
  const since = (timeRange && timeRange.since) || options.since // ibid...

  // name queries can only specify package/action or action; let's check for conformance
  const nameStr = '' + name // in case name is an number or boolean; yargs-parser converts them
  const nameSplit = nameStr.split(/\//)
  if (nameSplit.length === 4 && nameSplit[0].length === 0) {
    // then the pattern is /a/b/c, which split will return as ['', 'a', 'b', 'c']
    // the backend doesn't yet support namespace filters, so strip that off, too
    name = nameSplit.slice(2).join('/')
  } else if (nameSplit.length === 3 && name.charAt(0) === '/') {
    // the name query is /ns/action, where ns is the current
    // namespace; as above, we need to strip off ns
    name = nameSplit[2]
  } else {
    name = nameStr // make sure it's a string going forwards
  }

  const nameFilter = name ? `--name ${name}` : ''
  const uptoArg = upto ? ` --upto ${upto}` : '' // this is part of the openwhisk API; upto a millis since epoch
  const sinceArg = since ? ` --since ${since}` : '' // ibid; after a millis since epoch
  const fetch = extraSkip =>
    repl
      .qexec(`wsk activation list ${nameFilter} --skip ${skip + extraSkip} --limit ${batchSize}${uptoArg}${sinceArg}`)
      .then((activations: ActivationListTable) => activations.body)
      .catch(err => {
        // log but swallow errors, so that we can show the user something... hopefully, at least one of the fetches succeeds
        console.error(err)
        return []
      })

  debug('name filter', nameFilter || 'none')
  debug('upto', uptoArg || 'none')
  debug('since', sinceArg || 'none')

  /** fetch activations without an app/composer filter */
  const fetchNonApp = async () =>
    Promise.all(new Array(N).fill(0).map((_, idx) => fetch(idx * batchSize)))
      .then(flatten)
      .then(filterByLatencyBucket(options))
      .then(filterBySuccess(options))
      .then(
        filterOutNonActionActivations(
          path || filter || include
            ? makeFilter(path || filter || include, exclude)
            : name
            ? makeFilter(await amendWithNamespace(name), exclude)
            : acceptAnything
        )
      )
      .then(activations => {
        if (name && activations.length === 0) {
          // user asked to filter by name, and we found nothing. error out
          const err = new Error(`No activations of ${name} found`)
          err['code'] = 404
          throw err
        } else {
          return activations
        }
      })

  if (name && !nocrawl) {
    // then the user asked to filter; first see if this is an app
    return repl
      .qexec(`wsk app get "${name}"`)
      .then(extractTasks)
      .then(tasks => (all ? tasks.concat([name]) : tasks)) // if options.all, then add the app to the list of actions
      .then(tasks =>
        Promise.all(
          tasks.map(task =>
            fetchActivationData(N, {
              nocrawl: true,
              name: task,
              filter,
              include,
              exclude,
              skip,
              upto,
              since,
              batchSize
            })
          )
        )
      )
      .then(flatten)
      .then(filterByLatencyBucket(options))
      .then(filterBySuccess(options))
      .catch(err => {
        if (err.statusCode !== 404) {
          console.error(err)
        }
        return fetchNonApp()
      })
  } else {
    return fetchNonApp()
  }
}
// export const fetchActivationDataFromBackend = fetchActivationDataFromBackend

/**
 * Fetch the activation data from our local mirror
 *
 */
/* const fetchActivationDatas = (wsk, _1, _2, rest, fixedTimeRange) => {
    // --raw means return the raw collection, not a repl result
    // --fixedTimeRange will help us in keeping a fixed window of time across redraws
    return repl.qexec(`mirror query ${rest.join(' ')} --raw --fixedTimeRange ${fixedTimeRange||false}`)
} */

/**
 * Add our CSS to the document
 *
 */
export const injectContent = () => {
  if (inBrowser()) {
    injectCSS({
      css: require('@kui-shell/plugin-grid/web/css/table.css'),
      key: 'grid-visualization.table.css'
    })
  } else {
    const root = dirname(require.resolve('@kui-shell/plugin-grid/package.json'))
    injectCSS(join(root, 'web/css/table.css'))
  }

  injectCSS('https://cdnjs.cloudflare.com/ajax/libs/balloon-css/0.5.0/balloon.min.css') // tooltips
}

export const injectHTML = (container, file, css = '') => {
  const frame = document.createElement('iframe')
  frame.setAttribute('src', join(__dirname, '..', 'web', 'html', file))
  frame.className = css
  container.appendChild(frame)
}

/**
 * Add time range the total count information to given container
 *
 */
const strong = (container, N) => {
  const existing = container.querySelector(`strong:nth-of-type(${N})`)
  if (existing) {
    return existing
  } else {
    const element = document.createElement('strong')
    container.appendChild(element)
    return element
  }
}
export const displayTimeRange = ({ minTime, maxTime, totalCount }, container) => {
  removeAllDomChildren(container)

  if (totalCount === 0) {
    container.innerText = 'No activations to display'
  } else {
    const fresh = !container.querySelector('strong')

    if (fresh && container.innerText.length > 0) {
      // in case we had a previous totalCount === 0
      container.innerText = ''
    }

    strong(container, 1).innerText = totalCount

    if (fresh) container.appendChild(document.createTextNode(' activations | '))
    strong(container, 2).appendChild(prettyPrintTime(minTime, 'short'))

    if (fresh) container.appendChild(document.createTextNode(' | '))
    // strong(container, 3).innerText = prettyPrintTime(maxTime, 'short')
    strong(container, 3).innerText = prettyPrintDuration(maxTime - minTime, {
      compact: true
    })
  }
}

/**
 * Prepare the sidecar header for the drawing routines to fill in
 *
 */
export interface Header {
  leftHeader: Element
  rightHeader: Element
}
export const prepareHeader = (tab: Tab, isRedraw = false): Header => {
  const sidecar = getSidecar(tab)
  const leftHeader = sidecar.querySelector('.sidecar-header-secondary-content .custom-header-content')
  const rightHeader = sidecar.querySelector('.header-right-bits .custom-header-content')

  if (!isRedraw) {
    removeAllDomChildren(leftHeader)
    removeAllDomChildren(rightHeader)
  }

  return { leftHeader, rightHeader }
}

/**
 * The command handler for visualizing as a table
 *
 */
export type Renderer = (
  tab: Tab,
  options: Record<string, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
  header: Header,
  uuid: string,
  isRedraw?: boolean
) => void
export const visualize = (cmd, viewName: string, draw: Renderer, extraUsage, extraOptions?) => ({
  tab,
  argvNoOptions,
  parsedOptions: options
}: EvaluatorArgs) => {
  debug('visualize')

  // number of batches (of 200) to fetch
  const idx = argvNoOptions.indexOf(cmd)

  if (options.help || argvNoOptions[idx + 1] === 'help') {
    throw new UsageError(usage[cmd])
  }

  if (idx < 0) {
    throw new Error('Parse error')
  }

  const appName = argvNoOptions[idx + 1]
  const cliN = options.batches
  if (cliN) {
    try {
      parseInt(cliN, 10)
    } catch (e) {
      throw new Error('Please provide an integer value for the --batches argument')
    }
  }

  // add the CSS to the document
  injectContent()

  // to help with view replacement; so we don't clear ourselves, mostly
  const ourUUID = uuid()

  // let timeRange
  const fetchAndDraw = (isRedraw = false) => {
    const N = cliN || defaults.N
    if (N > defaults.maxN) {
      throw new Error(`Please provide a maximum value of ${defaults.maxN}`)
    }
    return (
      fetchActivationData(N, Object.assign(options, { name: appName }))
        /* .then(data => {
                if (!isRedraw) {
                    // remember the time range, so that the redraw can
                    // keep the same fixed window of time on every
                    // redraw
                    const {min, max} = data.reduce((range, activation) => {
                        if (!range.min || activation.start < range.min) {
                            range.min = activation.start
                        }
                        if (!range.max || activation.start > range.max) {
                            range.max = activation.start
                        }
                        return range
                    }, {})
                    timeRange = max - min
                }
                return data
            }) */
        .then(draw(tab, options, prepareHeader(tab, isRedraw), ourUUID, isRedraw))
    )
  }

  return fetchAndDraw().then(response => {
    // alter the sidecar header only once the rendering is done
    const sidecar = getSidecar(tab)

    const icon = sidecar.querySelector('.sidecar-header-icon') as HTMLElement
    icon.innerText = viewName

    const invokeListener = ({ name, namespace }) => {
      if (!appName || appName === name || appName === `/${namespace}/${name}`) {
        debug('invoke match for update')
        fetchAndDraw(true)
      }
    }
    const fireListener = () => {
      // TODO we can optimize this
      debug('trigger fire match for update')
      fetchAndDraw(true)
    }

    eventBus.on('/action/invoke', invokeListener)
    eventBus.on('/trigger/fire', fireListener)

    let poller
    let disabled = false
    if ((extraOptions && extraOptions.live) || options.live) {
      debug('live mode')
      // eventBus.on('/mirror/update', () => fetchAndDraw(true))
      poller = setInterval(() => {
        if (!disabled) {
          fetchAndDraw(true)
        }
      }, 5000)
    }

    eventBus.once('/sidecar/replace', (otherUUID: string) => {
      if (otherUUID !== ourUUID) {
        debug('disabling our listeners', ourUUID)
        disabled = true

        if (poller) {
          clearInterval(poller)
        }

        eventBus.removeListener('/action/invoke', invokeListener)
        eventBus.removeListener('/trigger/fire', fireListener)
      }
    })

    return response
  })
}

export const nLatencyBuckets = 6
const n100 = 2
const n1000 = 2
const n7000 = 2
export const latencyBuckets = [50, 100, 500, 1000, 3500, 3500]
export const latencyBucket = value => {
  const nBuckets = latencyBuckets.length
  // return Math.min(nBuckets - 1, value < 100 ? ~~(value / (100/6)) : value < 1000 ? 6 + ~~(value / (1000/5)) : value < 7000 ? 11 + ~~(value / (6000/5)) : nBuckets - 1)
  return Math.min(
    nBuckets - 1,
    value < 100
      ? ~~(value / (100 / n100))
      : value < 1000
      ? n100 + ~~(value / (900 / n1000))
      : value < 7000
      ? n100 + n1000 + ~~(value / (6000 / n7000))
      : nBuckets - 1
  )
}
const range = (top, buckets, idx, base = 0) =>
  `${prettyPrintDuration((top / buckets) * idx + 1 + base)}-${prettyPrintDuration((top / buckets) * (idx + 1) + base)}`
const bucketRanges = []
for (let idx = 0; idx < n100; idx++) bucketRanges.push(range(100, n100, idx))
for (let idx = 0; idx < n1000; idx++) bucketRanges.push(range(900, n1000, idx, 100))
for (let idx = 0; idx < n7000; idx++) bucketRanges.push(range(6000, n7000, idx, 1000))
export const latencyBucketRange = bucket => {
  return bucketRanges[bucket]
}

/**
 * Turn an options struct into a cli string
 *
 * @param options is the command line options struct given by the
 * user.
 *
 */
export const optionsToString = (options, except?) => {
  let str = ''
  for (const key in options) {
    // underscore comes from minimist
    if (
      key !== '_' &&
      options[key] !== undefined &&
      key !== 'name' &&
      key !== 'theme' &&
      key !== 'timeline' &&
      key !== 't' &&
      (!except || !except.find(_ => _ === key))
    ) {
      const dash = key.length === 1 ? '-' : '--'
      const prefix = options[key] === false ? 'no-' : '' // e.g. --no-help
      const value = options[key] === true || options[key] === false ? '' : ` ${options[key]}`

      if (!(dash === '-' && options[key] === false)) {
        // avoid -no-q, i.e. single dash
        str = `${str} ${dash}${prefix}${key}${value}`
      }
    }
  }

  return str
}
