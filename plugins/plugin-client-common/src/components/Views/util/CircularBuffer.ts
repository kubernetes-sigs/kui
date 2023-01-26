/*
 * Copyright 2020 The Kubernetes Authors
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

import { v4 as uuid } from 'uuid'
import type { ParsedOptions } from '@kui-shell/core'

export interface BaseHistoryEntry {
  cwd: string
  argvNoOptions: string[]
  parsedOptions: ParsedOptions
}

type InternalEntry<T extends BaseHistoryEntry> = T & {
  key: string
  prev: number
  next: number
}

export default class CircularBuffer<T extends BaseHistoryEntry> {
  private readonly entries: InternalEntry<T>[]
  private activeIdx: number
  private prev: number
  private next: number
  private insertionIdx: number
  private _length: number

  public constructor(first: T, capacity = 15) {
    this.entries = new Array<InternalEntry<T>>(capacity)
    this.activeIdx = 0
    this.prev = -1
    this.next = -1
    this.insertionIdx = 1 % capacity
    this._length = 1
    this.entries[0] = this.entry(first, { prev: this.prev, next: this.next })
  }

  private entry(asGiven: T, updatePointer: { prev: number; next: number }): InternalEntry<T> {
    return Object.assign(asGiven, { key: uuid(), prev: updatePointer.prev, next: updatePointer.next })
  }

  public get length() {
    return this._length
  }

  public get key() {
    return this.peek().key
  }

  public findIndex(predicate: (t: T, idx?: number, A?: T[]) => boolean) {
    return this.entries.findIndex(predicate)
  }

  public update(idx: number, t: T) {
    if (idx !== this.activeIdx) {
      this.next = -1
      this.prev = this.activeIdx
      this.entries[idx] = this.entry(t, { prev: this.prev, next: this.next })
      this.entries[this.prev].next = idx
    } else {
      this.entries[idx] = this.entry(t, { prev: this.entries[idx].prev, next: this.entries[idx].next })
    }

    this.activeIdx = idx
  }

  /** update at this.activeIdx */
  public updateActive(t: T) {
    this.update(this.activeIdx, t)
  }

  public push(entry: T) {
    this.next = -1
    this.prev = this.activeIdx
    const idx = this.insertionIdx
    this.entries[idx] = this.entry(entry, { prev: this.prev, next: this.next })
    this.entries[this.prev].next = idx

    this.activeIdx = idx
    this.insertionIdx = (idx + 1) % this.entries.length
    this._length = Math.min(this._length + 1, this.entries.length)
  }

  /** pop the entry at idx */
  public popAt(idx: number) {
    while (idx < this._length - 1) {
      const nextEntry = this.entries[idx + 1]
      this.entries[idx] = this.entry(nextEntry, { prev: nextEntry.prev, next: nextEntry.next })
      idx += 1
    }

    delete this.entries[idx]
    this.activeIdx = idx - 1
    this.insertionIdx = idx % this.entries.length
    this._length = this._length - 1
  }

  public before() {
    this.activeIdx = this.prev
    this.next = this.entries[this.prev].next
    this.prev = this.entries[this.prev].prev

    return this.peekAt(this.activeIdx)
  }

  public hasBefore() {
    return this.prev >= 0
  }

  public hasAfter() {
    return this.next >= 0
  }

  public hasBuffer() {
    return this.hasBefore() || this.hasAfter()
  }

  public after() {
    this.activeIdx = this.next
    this.prev = this.entries[this.next].prev
    this.next = this.entries[this.next].next
    return this.peekAt(this.activeIdx)
  }

  public hasLeft() {
    return this.activeIdx > 0
  }

  public peek() {
    return this.peekAt(this.activeIdx)
  }

  public peekAt(idx: number) {
    return this.entries[idx]
  }
}
