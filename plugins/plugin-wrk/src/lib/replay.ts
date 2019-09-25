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

import { Commands, eventBus, UI } from '@kui-shell/core'

import * as history from './history'
import { initUI, response } from './graphics'
import { addRow } from './table'

/** have some fun with replay... add a pause, in milliseconds, between each iter */
const playbackPause = 0

interface Options {
  noTable?: boolean
  label?: string
}

class DefaultOptions implements Options {
  noTable = false // eslint-disable-line @typescript-eslint/explicit-member-accessibility
}

/**
 * Replay a previous dataset
 *
 */
export const replay = (
  tab: UI.Tab,
  { url, dataset, testName },
  graphics = initUI(),
  options: Options = new DefaultOptions()
) => {
  const resp = response(tab, graphics, Object.assign({ url, testName }, options))

  if (!options.noTable) {
    // add header row to the table
    addRow(resp.graphics)()
  }

  const iter = (idx = 0) => {
    if (idx < dataset.length) {
      const row = dataset[idx]
      eventBus.emit('/wrk/iter', row)

      if (!options.noTable) {
        addRow(resp.graphics)(row)
      }

      // replay the next iter
      setTimeout(() => iter(idx + 1), playbackPause)
    }
  }
  setTimeout(iter, 650)

  return resp
}

/**
 * Visualize the most recent data set
 *
 */
export const last = ({ tab }: Commands.Arguments) => {
  const last = history.last()
  if (!last) {
    throw new Error('You have no load test runs available for viewing')
  }

  return replay(tab, last)
}

/**
 * Visualize the idx-th most recent data set
 *
 */
export const show = ({ tab, argvNoOptions: args, parsedOptions: options }: Commands.Arguments) => {
  const idx = args[args.indexOf('show') + 1]
  if (idx === undefined || options.help) {
    console.error(idx, args)
    throw new Error('Usage: wrk show <index>')
  }

  const dataset = history.get(parseInt(idx, 10))
  if (!dataset) {
    throw new Error('The requested load test run is not available for viewing')
  }

  return replay(tab, dataset, undefined, { label: `Run #${idx}` })
}
