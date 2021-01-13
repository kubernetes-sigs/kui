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

import React from 'react'
import { Tab, REPL, Table as KuiTable, Row as KuiRow } from '@kui-shell/core'

import ErrorCell from './ErrorCell'
import { onClickForCell } from './TableCell'
import { NamedDataTableRow } from './kui2carbon'
import DefaultColoring, { Coloring } from './Coloring'

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
    ? response.statusColumnIdx
    : response.body[0]
    ? response.header.attributes.findIndex(cell => /STATUS|REASON/i.test(cell.key))
    : -1
}

interface State {
  coloring: Coloring
}

/**
 * A Grid table
 *
 */
export default class Grid<P extends Props> extends React.PureComponent<P, State> {
  public constructor(props: P) {
    super(props)
    this.state = Grid.getDerivedStateFromProps(props)
  }

  public static getDerivedStateFromProps(props: Props) {
    return {
      coloring: new DefaultColoring(props.response)
    }
  }

  private durationCss(row: KuiRow, isError: boolean) {
    const { durationColumnIdx } = this.props.response
    if (row.attributes[durationColumnIdx]) {
      const duration = parseInt(row.attributes[durationColumnIdx].value, 10)
      return this.state.coloring.durationCss(duration, isError)
    } else {
      return ''
    }
  }

  public render() {
    const gridableColumn = findGridableColumn(this.props.response)

    if (gridableColumn < 0) {
      return this.renderWithNames()
    } else {
      return this.renderWithBadges(gridableColumn)
    }
  }

  /** Render as a grid of names */
  private renderWithNames() {
    const longest = this.props.response.body.reduce((max, row) => (max.length < row.name.length ? row.name : max), '')

    let ex = 0
    let em = 2 // <-- for good measure
    for (let idx = 0; idx < longest.length; idx++) {
      const char = longest.charAt(idx)
      if (char === 'm') em++
      else ex++
    }

    return (
      <div
        className="grid-layout"
        style={{ gridTemplateColumns: `repeat(auto-fill, minmax(calc(${ex}ex + ${em}em), auto))` }}
      >
        {this.props.response.body.map(_ => (
          <div key={_.name} data-name={_.name} className={_.css}>
            <span
              className={_.onclick && 'clickable'}
              onClick={onClickForCell(_, this.props.tab, this.props.repl, _.onclick)}
            >
              {_.name}
            </span>
          </div>
        ))}
      </div>
    )
  }

  /** Render as a grid of [] square/circle badges */
  private renderWithBadges(gridableColumn: number) {
    const { tab, repl, response, visibleRows } = this.props

    const nCells = visibleRows.length
    const nColumns = Math.ceil(Math.sqrt(nCells))
    const style = { gridTemplateColumns: `repeat(${nColumns}, 1.25rem)` }
    const colorByDuration = response.colorBy === 'duration' || (!response.colorBy && response.durationColumnIdx >= 0)

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
            <span key={kidx} data-tag="badge" data-entity-name={kuiRow.name} className="kui--grid-cell">
              <span {...props}>{/red-background/.test(css) ? <ErrorCell /> : label}</span>
            </span>
          )
        })}
      </div>
    )
  }
}
