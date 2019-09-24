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

import { Commands, eventBus } from '@kui-shell/core'

import { lt as loadTest } from './lt'
import { addRow } from './table'
import { initUI, response } from './graphics'
import * as history from './history'

const debug = Debug('wrk/wrk')

/**
 * Start a load test, hooked up to graphics
 *
 */
export const start = ({ tab, argvNoOptions: args, parsedOptions: options }: Commands.EvaluatorArgs) => {
  const url = args[args.indexOf('wrk') + 1] || options.url
  debug('url', url)

  const testName = options.name || url

  if (!url || options.help) {
    throw new Error('Usage: wrk <url>')
  }

  // reigster as a listener for load test updates, for the table
  const graphics = initUI()
  const handler = addRow(graphics)

  eventBus.on('/wrk/iter', handler)
  handler() // add header row to the table

  /**
   * Deregister event listeners, record the final result in persistent storage
   *
   */
  const finishUp = dataset => {
    // deregister as a listener for load test updates
    eventBus.removeListener('/wrk/iter', handler)

    // stash the dataset, for future consumption
    history.remember(dataset, testName)
  }

  // start the load run
  loadTest({ url, options }).then(finishUp)

  return response(tab, graphics, { url, testName })
}

/**
 * End the current load test
 *
 */
export const end = (): boolean => {
  eventBus.emit('/wrk/terminate')
  return true
}
