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

import { Cell, Row, Table } from '@kui-shell/core'
import TrafficLight, { toTrafficLight } from '../../../lib/model/traffic-light'

/** Do not i18n! */
export const Kind = 'Kind'
export const Status = 'Status'

export const standardStatusHeader: Table['header'] = {
  name: 'Name',
  attributes: [
    {
      key: Kind,
      value: Kind
    },
    {
      key: Status,
      value: Status
    }
  ]
}

export function rowWith(
  name: string,
  kind: string,
  status: string,
  trafficLight: TrafficLight,
  originalRow?: Row,
  extraAttrs: Cell[] = []
): Row {
  const overlay: Row = {
    name,
    attributes: extraAttrs.concat([
      {
        key: Kind,
        value: kind
      },
      {
        key: Status,
        value: status,
        tag: 'badge',
        css: trafficLight
      }
    ])
  }

  if (originalRow) {
    return Object.assign({}, originalRow, overlay)
  } else {
    return overlay
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function unifyHeaders(headers: Table['header'][]): Table['header'] {
  return standardStatusHeader
}

function getFromLabel(object: Row['object'], field: string): string {
  return object.metadata && object.metadata.labels ? object.metadata.labels[field] : undefined
}

function getFromSelector(object: Row['object'], field: string) {
  if (object.spec && object.spec.selector && object.spec.selector.matchLabels) {
    return object.spec.selector.matchLabels[field]
  }
}

export function unifyRow(row: Row, kind: string): Row {
  const name = row.name

  const badgeColumnIdx = row.attributes.findIndex(_ => _.tag === 'badge')
  const status = badgeColumnIdx >= 0 ? row.attributes[badgeColumnIdx].value : 'Unknown'
  const trafficLight = badgeColumnIdx >= 0 ? toTrafficLight(row.attributes[badgeColumnIdx].css) : TrafficLight.Gray

  const extraAttrs: Cell[] = []
  const tier = row.object
    ? getFromLabel(row.object, 'tier') ||
      getFromLabel(row.object, 'app.kubernetes.io/component') ||
      getFromSelector(row.object, 'tier')
    : ''

  extraAttrs.push({ key: 'Tier', value: tier, outerCSS: 'kui--hide-in-narrower-windows' })

  const app = row.object
    ? getFromLabel(row.object, 'app') ||
      getFromLabel(row.object, 'app.kubernetes.io/name') ||
      getFromSelector(row.object, 'app')
    : ''

  extraAttrs.push({ key: 'Application', value: app, outerCSS: 'kui--hide-in-narrower-windows' })

  return rowWith(name, kind, status, trafficLight, row, extraAttrs)
}

export function unifyRows(rows: Table['body'], kinds: string | string[]): Table['body'] {
  return rows.map((row, idx) => {
    const kind = Array.isArray(kinds) ? kinds[idx] : kinds
    return unifyRow(row, kind)
  })
}

export function unifyTable(table: Table, kind: string): Table {
  const overlay: Table = {
    header: unifyHeaders([table.header]),
    body: unifyRows(table.body, kind)
  }
  return Object.assign({}, table, overlay)
}
