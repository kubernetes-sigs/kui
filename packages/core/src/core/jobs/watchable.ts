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

import { Entity } from '../../models/entity'
import { Row } from '../../webapp/models/table'

export interface Watchable {
  watch: Poller | Pusher
}

export type Poller = Partial<Toggleable> & {
  refreshCommand: string
  watchInterval?: number
  watchLimit?: number
}

/** NOTE: Toggleable is not implemented */
interface Toggleable {
  watchByDefault: boolean
}

export interface Pusher {
  /**
   * Contract: the table renderer will call this function when the DOM
   * is ready to accept updates. when you have updates, please call
   * one or the other of the provided functions
   */
  init: (update: WatchedRowHasUpdate, offline: WactchedRowisOffline) => void
}

/** callbacks to indicate state changes */
type WatchedRowHasUpdate = (response: Row) => void
type WactchedRowisOffline = (rowKey: string) => void

function isPoller(model: Poller | Pusher): model is Poller {
  return (model as Poller).refreshCommand !== undefined
}

export function isPusher(model: Poller | Pusher): model is Pusher {
  return (model as Pusher).init !== undefined
}

export function isWatchable(model: Entity & Partial<Watchable>): model is Entity & Watchable {
  return model && model.watch && (isPoller(model.watch) || isPusher(model.watch))
}
