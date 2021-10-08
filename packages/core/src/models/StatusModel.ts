/*
 * Copyright 2021 The Kubernetes Authors
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

import { Entity } from './entity'

export type Status = 'success' | 'in-progress' | 'warning' | 'error' | 'unknown'

export interface LineItem {
  title: string
  description: string
  status: Status | (() => Promise<Status>)
}

export interface TileAction {
  /** Label for e.g. Button UI */
  label: string

  /** Should the button be shown? */
  isVisible: (items: LineItem[]) => boolean | Promise<boolean>

  /** What happens when the button is clicked? @return updated items */
  onClick: (items: LineItem[]) => Promise<LineItem[]>
}

export interface Tile {
  title: string
  description: string

  items: LineItem[]
  actions: TileAction[]
}

export interface Section {
  title: string
  tiles: Tile[]
}

export default interface StatusModel {
  apiVersion: 'kui-shell/v1'
  kind: 'StatusModel'
  metadata: {
    name: string
  }
  spec: {
    sections: Section[]
  }
}

export function isStatusModel(entity: Entity): entity is StatusModel {
  const response = entity as StatusModel
  return (
    response.apiVersion === 'kui-shell/v1' &&
    response.kind === 'StatusModel' &&
    typeof response.spec === 'object' &&
    Array.isArray(response.spec.sections)
  )
}

/**
 * Combine status into a rollup summary. Our lattice is 5x4 with
 * (rollup, status) each takeing on values from 'unknown', 'error',
 * 'warning', 'in-progress', and 'success' (but status can't be
 * unknown).
 */
function unionStatus(rollup: Status, status: Status): Status {
  if (status === 'in-progress' || rollup === 'in-progress') {
    // x + in-progress = in-progress
    // this covers 7 cells (x)
    //   E I W S
    // E . x . .
    // I x x x x
    // W . x . .
    // S . x . .
    // U . . . .
    return status
  } else if (rollup === 'unknown' || rollup === status) {
    // unknown + x = x
    // the first covers another 4 cells (x)
    // the second covers another 3 (y)
    // y * . .
    // * * * *  <-- * from above
    // . * y .
    // . . . y
    // x x x x
    return status
  } else if ((status === 'success' && rollup !== 'success') || (status !== 'success' && rollup === 'success')) {
    // success + non-success = warning
    // this first covers another 2 (x)
    // this second covers another 3 (y)
    //   E I W S
    // E * * . x
    // I * * * *  <-- * from above
    // W . * * x
    // S y y y *
    // U * * * *
    return 'warning'
  } else {
    // we are left with
    //  (rollup=error, status=warning)
    //  (rollup=warning, status=error)
    //   E I W S
    // E * * x *
    // I * * * *  <-- * from above
    // W x * * *
    // S * * * *
    // U * * * *
    return 'warning'
  }
}

/** Roll up the status of the LineItems */
export function aggregateStatusModelStatus(tile: Tile): Promise<Status> {
  return Promise.all(tile.items.map(_ => (typeof _.status === 'string' ? _.status : _.status()))).then(_ =>
    _.reduce(unionStatus, 'unknown')
  )
}
