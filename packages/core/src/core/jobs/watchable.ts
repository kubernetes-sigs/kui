/*
 * Copyright 2019 IBM Corporation
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

import { Abortable } from './job'
import { Entity } from '../../models/entity'
import { Row } from '../../webapp/models/table'

export interface Watcher {
  /**
   * the table renderer will call this function when the DOM
   * is ready to accept updates. when you have updates, please call
   * one or the other of the provided functions
   */
  init: (pusher: WatchPusher) => void
}

export interface Watchable {
  watch: Watcher & Abortable
}

/** callbacks to indicate state changes */
export interface WatchPusher {
  update: (response: Row) => void
  offline: (rowKey: string) => void

  done: () => void
  allOffline: () => void
  header: (response: Row) => void
}

export function isWatchable(model: Entity & Partial<Watchable>): model is Entity & Watchable {
  return model && model.watch && model.watch.init !== undefined
}
