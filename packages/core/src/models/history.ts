/*
 * Copyright 2017 The Kubernetes Authors
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
import store from './store'

/** Legacy localStorage key for long-time Kui users */
const legacyKey = 'openwhisk.history'

/** localStorage key */
const Key = 'kui-shell.history'

/** We will persist no more than this number of history entries per Tab */
const MAX_HISTORY = 250

const debug = Debug('core/history')

type FilterFunction = (line: HistoryLine) => boolean

/** One History entry */
export interface HistoryLine {
  /** The raw command line */
  raw: string
}

/** A tuple of History entries, one per Tab (as specified by its given uuid) */
export class HistoryModel {
  private _lines: HistoryLine[]
  private _cursor: number

  /** Facilitate copying master history to new Tabs */
  private static masterUUID: string

  // re: eslint-disable; we don't want to publicize this beyond the
  // core, but still want it accessible within this file; eslint
  // doesn't seem to allow for this, by default.
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  constructor(private readonly uuid: string) {
    let lines = typeof window !== 'undefined' && this.restore()
    if (!lines && typeof window !== 'undefined') {
      const raw = store().getItem(legacyKey)
      lines = JSON.parse(raw)
      store().setItem(this.key(), raw)
      const backupKey = `${legacyKey}.bak`
      store().setItem(backupKey, raw)
      store().removeItem(legacyKey)
      debug('legacy history copied over, backed up in this key', backupKey)
    }

    this._lines = lines || []

    if (!HistoryModel.masterUUID) {
      debug('setting master', uuid)
      HistoryModel.masterUUID = uuid
    } else if (!lines || lines.length === 0) {
      this._lines = this.restore(HistoryModel.masterUUID) || []
      debug('copying history from master', HistoryModel.masterUUID, this._lines)
      this.save()
    }

    if (this._lines.length > MAX_HISTORY) {
      debug('cropping history', this._lines.length)
      this._lines = this._lines.slice(-MAX_HISTORY)
      this.save()
    }

    this._cursor = this._lines.length // pointer to historic line
  }

  /** The persistence key for this tab */
  private key(uuid = this.uuid) {
    return `${Key}.${uuid}`
  }

  /** return the given line of history */
  public line(idx: number): HistoryLine {
    return this._lines[idx]
  }

  public slice(start: number, end?: number): HistoryLine[] {
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

  /** Low-level save to persistent storage */
  private save(lines = this._lines, uuid = this.uuid) {
    store().setItem(this.key(uuid), JSON.stringify(lines))
  }

  /** Low-level restore from persistent storage */
  private restore(uuid = this.uuid) {
    try {
      const model = JSON.parse(store().getItem(this.key(uuid)))
      debug('restoring', uuid, model)
      return model
    } catch (err) {
      debug('corrupt history', uuid, err)
      this.save([], uuid) // invalidate the corrupt state
      return []
    }
  }

  /**
   * Clear out all history
   *
   */
  public wipe() {
    this._lines = []
    this.save()
    return true
  }

  /** add a line of repl history */
  public add(line: Pick<HistoryLine, 'raw'>): number {
    if (this._lines.length === 0 || this._lines[this._lines.length - 1].raw !== line.raw) {
      // don't add sequential duplicates
      this._lines.push(line)
      this.save()
      // console.log('history::add', cursor)
    }
    this._cursor = this._lines.length
    return this._cursor - 1
  }

  /** update a line of repl history -- for async operations */
  public async update(cursor: number, updateFn: (line: HistoryLine) => void | Promise<void>) {
    // console.log('history::update', cursor)
    await updateFn(this._lines[cursor])
    this.save()
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

    return -1
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

/** Here, we cache the deserialized form, indexed by Tab.uuid */
const cache: Record<string, HistoryModel> = {}

/** @return the HistoryModel for the given Tab, as identified by `uuid` */
export function getHistoryForTab(uuid: string): HistoryModel {
  if (!cache[uuid]) {
    cache[uuid] = new HistoryModel(uuid)
  }

  return cache[uuid]
}

export default HistoryModel
