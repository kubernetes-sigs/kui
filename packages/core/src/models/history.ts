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

import store from './store'

// localStorage key; note: the value here holds no meaning, it is a
// historical artifact, at this point
const key = 'openwhisk.history'

type FilterFunction = (line: HistoryLine) => boolean

export interface HistoryLine {
  entityType?: string
  verb?: string
  response?: any // eslint-disable-line @typescript-eslint/no-explicit-any
  raw?: string
}

export class HistoryModel {
  private _lines: HistoryLine[]
  private _cursor: number

  // re: eslint-disable; we don't want to publicize this beyond the
  // core, but still want it accessible within this file; eslint
  // doesn't seem to allow for this, by default.
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  constructor() {
    this._lines = (typeof window !== 'undefined' && JSON.parse(store().getItem(key))) || []
    this._cursor = this._lines.length // pointer to historic line
  }

  /** return the given line of history */
  public line(idx: number): HistoryLine {
    return this._lines[idx]
  }

  public slice(start: number, end: number): HistoryLine[] {
    return this._lines.slice(start, end)
  }

  public get cursor(): number {
    return this._cursor
  }

  /** change the cursor, protecting against under- and overflow */
  private guardedChange(incr: number): number {
    const newCursor = this._cursor + incr

    if (newCursor < 0) {
      this._cursor = 0
    } else if (newCursor > this._lines.length) {
      this._cursor = this._lines.length
    } else {
      this._cursor = newCursor
    }

    // console.log('history::newCursor', cursor, lines.length, lines[cursor])
    return this._cursor
  }

  /**
   * Clear out all history
   *
   */
  public wipe() {
    this._lines = []
    store().setItem(key, JSON.stringify(this._lines))
    return true
  }

  /** add a line of repl history */
  public add(line: HistoryLine): number {
    if (this._lines.length === 0 || JSON.stringify(this._lines[this._lines.length - 1]) !== JSON.stringify(line)) {
      // don't add sequential duplicates
      this._lines.push(line)
      store().setItem(key, JSON.stringify(this._lines))
      // console.log('history::add', cursor)
    }
    this._cursor = this._lines.length
    return this._cursor - 1
  }

  /** update a line of repl history -- for async operations */
  public update(cursor: number, updateFn: (line: HistoryLine) => void) {
    // console.log('history::update', cursor)
    updateFn(this._lines[cursor])
    store().setItem(key, JSON.stringify(this._lines))
  }

  public lineByIncr(incr: number): HistoryLine {
    return this.line(this.guardedChange(incr))
  }

  /** go back one entry */
  public previous(): HistoryLine {
    return this.lineByIncr(-1)
  }

  /** go forward one entry */
  public next(): HistoryLine {
    return this.lineByIncr(+1)
  }

  /** return to the oldest entry */
  public first(): HistoryLine {
    this._cursor = 0
    return this.line(this._cursor)
  }

  /** return to the newest entry */
  public last(): HistoryLine {
    this._cursor = this._lines.length - 1
    return this.line(this.cursor)
  }

  /**
   * Search the history model
   *
   * @param filter a search string, search regexp, or search function
   * @param startIdx if undefined or negative, start from the end, otherwise,
   * search backwards from the given index
   *
   */
  public findIndex(filter: string | RegExp | FilterFunction, startIdx?: number): number {
    let filterFn: FilterFunction

    if (typeof filter === 'string') {
      const regexp = new RegExp(filter.replace(/([$.])/g, '\\$1'))
      filterFn = (line: HistoryLine) => regexp.test(line.raw)
    } else if (filter instanceof RegExp) {
      filterFn = (line: HistoryLine) => filter.test(line.raw)
    } else {
      filterFn = filter
    }

    for (let idx = startIdx !== undefined && startIdx >= 0 ? startIdx : this._lines.length - 1; idx >= 0; idx--) {
      if (filterFn(this._lines[idx])) {
        return idx
      }
    }
  }

  /**
   * Search the history model
   *
   * @param filter a search string, search regexp, or search function
   *
   */
  public find(filter: FilterFunction): HistoryLine {
    const idx = this.findIndex(filter)
    return idx !== undefined && this._lines[idx]
  }
}

// For now, we have a single global history. We could make this
// per-tab state; see https://github.com/IBM/kui/issues/1299
export const History = new HistoryModel()
export default History
