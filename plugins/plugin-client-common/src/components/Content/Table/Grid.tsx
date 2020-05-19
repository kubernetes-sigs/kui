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

import { Tab, REPL, Table as KuiTable } from '@kui-shell/core'

import * as React from 'react'

import { onClickForCell } from './TableCell'
import { NamedDataTableRow } from './kui2carbon'

/** parameters to Grid component */
export type Props<T extends KuiTable = KuiTable> = {
  tab: Tab
  repl: REPL
  response: T
  visibleRows: NamedDataTableRow[]
}

export const findGridableColumn = (response: KuiTable) => {
  return response.body[0] ? response.header.attributes.findIndex(cell => /STATUS|REASON/i.test(cell.key)) : -1
}

/**
 * A Grid table
 *
 */
export default class Grid<P extends Props> extends React.PureComponent<P> {
  public render() {
    const { tab, repl, response, visibleRows } = this.props

    const gridableColumn = findGridableColumn(response)

    const nCells = visibleRows.length
    const nColumns = Math.ceil(Math.sqrt(nCells))
    const style = { gridTemplateColumns: `repeat(${nColumns}, 1.375em)` }

    return (
      <div className="bx--data-table kui--data-table-as-grid" style={style}>
        {response.body.map((kuiRow, kidx) => {
          const badgeCell = gridableColumn !== -1 && kuiRow.attributes[gridableColumn]
          const title = `${kuiRow.name}: ${badgeCell ? badgeCell.value : ''}`
          const css = badgeCell ? badgeCell.css : 'kui--status-unknown'

          return (
            <span key={kidx} data-tag="badge" data-entity-name={kuiRow.name}>
              <span
                title={title}
                data-tag="badge-circle"
                className={css}
                onClick={onClickForCell(
                  kuiRow,
                  tab,
                  repl,
                  kuiRow.attributes.find(_ => _.onclick)
                )}
              />
            </span>
          )
        })}
      </div>
    )
  }
}
