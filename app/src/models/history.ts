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

// localStorage key
const key = 'openwhisk.history'

export let lines = (typeof window !== 'undefined' && JSON.parse(window.localStorage.getItem(key))) || []

let cursor = lines.length // pointer to historic line
export const getCursor = () => cursor

/** change the cursor, protecting against under- and overflow */
const guardedChange = incr => {
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
  lines = []
  window.localStorage.setItem(key, JSON.stringify(lines))
  return true
}

/** add a line of repl history */
export const add = line => {
  if (lines.length === 0 || JSON.stringify(lines[lines.length - 1]) !== JSON.stringify(line)) {
    // don't add sequential duplicates
    lines.push(line)
    window.localStorage.setItem(key, JSON.stringify(lines))
    // console.log('history::add', cursor)
  }
  cursor = lines.length
  return cursor - 1
}

/** update a line of repl history -- for async operations */
export const update = (cursor, updateFn) => {
  // console.log('history::update', cursor)
  updateFn(lines[cursor])
  window.localStorage.setItem(key, JSON.stringify(lines))
}

/** return the given line of history */
export const line = idx => lines[idx]
export const lineByIncr = incr => line(guardedChange(incr))

/** go back/forward one entry */
export const previous = () => lineByIncr(-1)
export const next = () => lineByIncr(+1)
export const first = () => { cursor = 0; return line(cursor) }
export const last = () => { cursor = lines.length - 1; return line(cursor) }

type FilterFunction = (Object) => boolean

/**
 * Search the history model
 *
 * @param filter a search string, search regexp, or search function
 * @param startIdx if undefined or negative, start from the end, otherwise,
 * search backwards from the given index
 *
 */
export const findIndex = (filter: string | RegExp | FilterFunction, startIdx?: number) => {
  let filterFn: FilterFunction

  if (typeof filter === 'string') {
    const regexp = new RegExp(filter.replace(/([$.])/g, '\\$1'))
    filterFn = line => line.raw.match(regexp)
  } else if (filter instanceof RegExp) {
    filterFn = line => line.raw.match(filter)
  } else {
    filterFn = filter
  }

  for (let idx = startIdx !== undefined && startIdx >= 0 ? startIdx : lines.length - 1; idx >= 0; idx--) {
    if (filterFn(lines[idx])) {
      return idx
    }
  }
}
export const find = filter => {
  const idx = findIndex(filter)
  return idx !== undefined && lines[idx]
}
