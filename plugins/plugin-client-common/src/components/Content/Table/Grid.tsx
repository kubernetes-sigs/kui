/*
 * Copyright 2020 IBM Corporation
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

import * as React from 'react'
import * as prettyPrintDuration from 'pretty-ms'
import { Tab, REPL, Table as KuiTable, Row as KuiRow } from '@kui-shell/core'

import ErrorCell from './ErrorCell'
import { onClickForCell } from './TableCell'
import { NamedDataTableRow } from './kui2carbon'

/** parameters to Grid component */
export type Props<T extends KuiTable = KuiTable> = {
  tab: Tab
  repl: REPL
  response: T
  visibleRows: NamedDataTableRow[]
  justUpdated: Record<string, boolean> // rowKey index
}

export const findGridableColumn = (response: KuiTable) => {
  return response.durationColumnIdx >= 0
    ? response.durationColumnIdx
    : response.statusColumnIdx !== undefined
    ? response.statusColumnIdx - 1
    : response.body[0]
    ? response.header.attributes.findIndex(cell => /STATUS|REASON/i.test(cell.key))
    : -1
}

const thresholds = [2000, 4000, 6000, 8000]

export function nDurationBuckets() {
  return 5
}

export function durationRangeOfSplit(idx: number) {
  return idx === 0
    ? `<{prettyPrintDuration(thresholds[0])}`
    : idx === thresholds.length
    ? `>${prettyPrintDuration(thresholds[idx - 1])}`
    : `${prettyPrintDuration(thresholds[idx - 1])}\u2014${prettyPrintDuration(thresholds[idx])}`
}

export function durationBucket(duration: number) {
  if (duration < thresholds[0]) {
    return 0
  } else if (duration < thresholds[1]) {
    return 1
  } else if (duration < thresholds[2]) {
    return 3
  } else if (duration < thresholds[3]) {
    return 4
  } else {
    return 5
  }
}

export function durationCssForBucket(idx: number) {
  return `color-latency${idx}`
}

export function durationCss(duration: number, isError: boolean) {
  if (isError) {
    return 'red-background'
  } else {
    return durationCssForBucket(durationBucket(duration))
  }
}

/**
 * A Grid table
 *
 */
export default class Grid<P extends Props> extends React.PureComponent<P> {
  private durationCss(row: KuiRow, isError: boolean) {
    const { durationColumnIdx } = this.props.response
    const duration = parseInt(row.attributes[durationColumnIdx].value, 10)
    return durationCss(duration, isError)
  }

  public render() {
    const { tab, repl, response, visibleRows } = this.props

    const colorByDuration = response.durationColumnIdx >= 0
    const gridableColumn = findGridableColumn(response)

    const nCells = visibleRows.length
    const nColumns = Math.ceil(Math.sqrt(nCells))
    const style = { gridTemplateColumns: `repeat(${nColumns}, 1.25rem)` }

    return (
      <div className="bx--data-table kui--data-table-as-grid" style={style}>
        {response.body.map((kuiRow, kidx) => {
          const badgeCell = gridableColumn !== -1 && kuiRow.attributes[gridableColumn]
          const title = `${kuiRow.name}\n${badgeCell ? badgeCell.value : ''}`
          const statusCss = badgeCell ? badgeCell.css : 'kui--status-unknown'
          const isError = /red-background/.test(statusCss)
          const css = colorByDuration ? this.durationCss(kuiRow, isError) : statusCss

          // cell label, to be displayed inside of the grid cell
          const label = <span className="kui--grid-cell-label">{kuiRow.name.slice(0, 2)}</span>

          const props = {
            title,
            key: css, // force restart of animation if color changes
            'data-tag': 'badge-circle',
            'data-color-by': colorByDuration ? 'duration' : 'status',
            'data-just-updated': this.props.justUpdated[kuiRow.rowKey || kuiRow.name],
            className: css,
            onClick: onClickForCell(
              kuiRow,
              tab,
              repl,
              kuiRow.attributes.find(_ => _.onclick)
            )
          }

          return (
            <span key={kidx} data-tag="badge" data-entity-name={kuiRow.name}>
              <span {...props}>{/red-background/.test(css) ? <ErrorCell /> : label}</span>
            </span>
          )
        })}
      </div>
    )
  }
}
