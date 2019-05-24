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

import store from '@kui-shell/core/models/store'
import { getTabIndex, getCurrentTab } from '@kui-shell/core/webapp/cli'
import * as Debug from 'debug'

const debug = Debug('plugins/history')

// localStorage key; note: the value here holds no meaning, it is a
// historical artifact, at this point
const key = 'openwhisk.history'

export let history: Map<number,HistoryLine> = (typeof window !== 'undefined' && JSON.parse(store().getItem(key))) || {}

export interface HistoryLine {
  entityType?: string
  verb?: string
  response?: any
  raw?: string
}

export let lines: HistoryLine[] = []

let cursor = lines.length // pointer to historic line
export const getCursor = (): number => cursor

const syncHistory = () => {
  history = (typeof window !== 'undefined' && JSON.parse(store().getItem(key))) || {}

  const tabHistory = history[getTabIndex(getCurrentTab())]
  lines = typeof tabHistory !== 'undefined' ? tabHistory : []

  cursor = lines.length
}

/** change the cursor, protecting against under- and overflow */
const guardedChange = (incr: number): number => {
  syncHistory()
  const newCursor = cursor + incr

  if (newCursor < 0) cursor = 0
  else if (newCursor > lines.length) cursor = lines.length
  else cursor = newCursor

  // console.log('history::newCursor', cursor, lines.length, lines[cursor])
  return cursor
}

/**
 * Clear out all history
 *
 */
export const wipe = () => {
  delete history[getTabIndex(getCurrentTab())]
  store().setItem(key, JSON.stringify(history))
  return true
}

/** add a line of repl history */
export const add = (line: HistoryLine) => {
  syncHistory()
  if (lines.length === 0 || JSON.stringify(lines[lines.length - 1]) !== JSON.stringify(line)) {
    // don't add sequential duplicates
    lines.push(line)
    history[getTabIndex(getCurrentTab())] = lines
    store().setItem(key, JSON.stringify(history))
  }
  cursor = lines.length
  return cursor - 1
}

/** update a line of repl history -- for async operations */
export const update = (cursor: number, updateFn) => {
  syncHistory()
  updateFn(lines[cursor])
  history[getTabIndex(getCurrentTab())] = lines
  store().setItem(key, JSON.stringify(history))
}

/** return the given line of history */
export const line = (idx: number): HistoryLine => { syncHistory(); return lines[idx] }
export const lineByIncr = (incr: number): HistoryLine => { syncHistory(); return line(guardedChange(incr)) }

/** go back/forward one entry */
export const previous = (): HistoryLine => lineByIncr(-1)
export const next = (): HistoryLine => lineByIncr(+1)
export const first = (): HistoryLine => { syncHistory(); cursor = 0; return line(cursor) }
export const last = (): HistoryLine => { syncHistory(); cursor = lines.length - 1; return line(cursor) }

type FilterFunction = (line: HistoryLine) => boolean

/**
 * Search the history model
 *
 * @param filter a search string, search regexp, or search function
 * @param startIdx if undefined or negative, start from the end, otherwise,
 * search backwards from the given index
 *
 */
export const findIndex = (filter: string | RegExp | FilterFunction, startIdx?: number): number => {
  let filterFn: FilterFunction
  syncHistory()
  if (typeof filter === 'string') {
    const regexp = new RegExp(filter.replace(/([$.])/g, '\\$1'))
    filterFn = (line: HistoryLine) => regexp.test(line.raw)
  } else if (filter instanceof RegExp) {
    filterFn = (line: HistoryLine) => filter.test(line.raw)
  } else {
    filterFn = filter
  }

  for (let idx = startIdx !== undefined && startIdx >= 0 ? startIdx : lines.length - 1; idx >= 0; idx--) {
    if (filterFn(lines[idx])) {
      return idx
    }
  }
}
export const find = (filter: FilterFunction): HistoryLine => {
  syncHistory()
  const idx = findIndex(filter)
  return idx !== undefined && lines[idx]
}
