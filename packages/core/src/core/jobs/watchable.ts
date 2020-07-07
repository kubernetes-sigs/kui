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
  /**
   *
   * @param response Updated row model
   *
   * @param batch? is this part of a batch update? Updates to the view
   * will be deferred until a call to batchUpdateDone()
   *
   * @param changed? allows push provider to specify whether this
   * update should be visualized as a change to the model [default:
   * true]
   */
  update: (response: Row, batch?: boolean, changed?: boolean) => void

  /** A batch of calls to `update` is complete */
  batchUpdateDone: () => void

  /** The given keyed row is gone */
  offline: (rowKey: string) => void

  /** No more updates will be performed */
  done: () => void

  /** The entire underlying model has disappared */
  allOffline: () => void

  /** The header model has changed */
  header: (response: Row) => void

  footer: (streams: string[]) => void
}

export function isWatchable(model: Entity & Partial<Watchable>): model is Entity & Watchable {
  return model && model.watch && model.watch.init !== undefined
}
