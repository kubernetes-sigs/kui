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
import { v4 as uuid } from 'uuid'
import { RadioTableRow, radioTableHintsAsCss, radioTableCellToString, cellShouldHaveBadge } from '@kui-shell/core'

import { DataList, DataListItem, DataListCell, DataListItemRow, DataListItemCells } from '@patternfly/react-core'

import BaseProps from '../model'
import { State as BaseState, slice } from '../index'

import '../../../../../web/scss/components/RadioTable/PatternFly.scss'

type Props = BaseProps &
  BaseState & {
    onChange: (selectedIdx: number) => void
  }

interface State {
  uuid: string
}

export default class PatternFly4RadioTable extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)

    const _uuid = uuid()
    this.state = {
      uuid: _uuid
    }
  }

  /** row id */
  private id(idx: number) {
    return `${this.state.uuid}-${idx + this.props.offset}`
  }

  /** row id aria */
  private aria(idx: number) {
    return `${this.id(idx)}-aria`
  }

  private idxPartOfId(id: string): number {
    // 37 = uuid.v4 length plus "-"
    return parseInt(id.slice(37))
  }

  private async onSelectDataListItem(selectedDataListItemId: string) {
    const selectedIdx = this.idxPartOfId(selectedDataListItemId)
    const row = this.props.table.body[selectedIdx]
    if (row && row.onSelect) {
      await row.onSelect()
    }

    this.props.onChange(selectedIdx)
  }

  private row(row: RadioTableRow, ridx?: number) {
    const id = ridx !== undefined ? this.id(ridx) : `${this.state.uuid}-header`
    const aria = ridx !== undefined ? this.aria(ridx) : 'header'

    return (
      <DataListItem
        key={ridx || aria}
        aria-labelledby={aria}
        id={id}
        data-name={row.nameIdx !== undefined ? radioTableCellToString(row.cells[row.nameIdx]) : name}
      >
        <DataListItemRow>
          <DataListItemCells
            dataListCells={row.cells.map((cell, cidx) => {
              const badgeHint = cellShouldHaveBadge(cell)

              return (
                <DataListCell
                  key={cidx}
                  data-is-name={cidx === row.nameIdx ? true : undefined}
                  data-key={typeof cell !== 'string' && cell.key}
                  className={radioTableHintsAsCss(cell)}
                >
                  {badgeHint && <span data-tag={'badge-circle'} className={badgeHint.toString()} />}
                  <span id={cidx === 0 ? id : undefined}>{radioTableCellToString(cell)}</span>
                </DataListCell>
              )
            })}
          />
        </DataListItemRow>
      </DataListItem>
    )
  }

  private header() {
    return this.row(this.props.table.header)
  }

  private body() {
    return slice(this.props).map(this.row.bind(this))
  }

  public render() {
    const selectedDataListItemId = this.id(this.props.selectedIdx - this.props.offset)

    return (
      <DataList
        isCompact
        aria-label="radio table"
        selectedDataListItemId={selectedDataListItemId}
        onSelectDataListItem={this.onSelectDataListItem.bind(this)}
        className="kui--table-like"
      >
        {this.header()}
        {this.body()}
      </DataList>
    )
  }
}
