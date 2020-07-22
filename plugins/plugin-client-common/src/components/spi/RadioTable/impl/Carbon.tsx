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
import {
  Breadcrumb,
  RadioTableRow,
  radioTableHintsAsCss,
  radioTableCellToString,
  cellShouldHaveBadge,
  i18n
} from '@kui-shell/core'

import {
  StructuredListWrapper,
  StructuredListHead,
  StructuredListRow,
  StructuredListCell,
  StructuredListBody,
  StructuredListInput
} from 'carbon-components-react'

import BaseProps from '../model'
import Icons from '../../Icons'
import { State as BaseState } from '../index'

import Card from '../../Card'
import Toolbar from '../../../Content/Table/Toolbar'

import '../../../../../web/scss/components/RadioTable/Carbon.scss'

const strings = i18n('plugin-client-common')

type Props = BaseProps &
  BaseState & {
    onChange: (selectedIdx: number) => void
  }

interface State {
  uuid: string
}

export default class CarbonRadioTable extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)

    this.state = {
      uuid: uuid()
    }
  }

  private async onChange(selectedIdx: number, onSelect: () => void) {
    // wow, carbon components isn't so great; we have to manage unchecking ourselves??
    const currentSelection = document.getElementById(this.id(this.props.selectedIdx)) as HTMLInputElement
    if (currentSelection) {
      currentSelection.checked = false
    }

    if (onSelect) {
      await onSelect()
    }

    this.props.onChange(selectedIdx + this.props.offset)
  }

  private id(idx: number): string {
    return `${this.state.uuid}-${idx}`
  }

  private topToolbar() {
    const { table } = this.props

    const titleBreadcrumb = table.title ? [{ label: table.title, className: 'kui--data-table-title' }] : []
    const breadcrumbs: Breadcrumb[] = titleBreadcrumb

    if (table.body.length > 1) {
      breadcrumbs.push({ label: strings('nRows', table.body.length) })
    }

    if (this.props.selectedIdx >= 0) {
      const selectedRow = this.props.table.body[this.props.selectedIdx]
      if (selectedRow.nameIdx !== undefined) {
        breadcrumbs.push({ label: radioTableCellToString(selectedRow.cells[selectedRow.nameIdx]) })
      }
    }

    return <Toolbar className="kui--data-table-toolbar-top" breadcrumbs={breadcrumbs.length > 0 && breadcrumbs} />
  }

  private row(row: RadioTableRow, ridx: number, head = false, onSelect?: () => void) {
    const isSelected = !head && ridx === this.props.selectedIdx - this.props.offset
    const name = this.id(ridx)

    // notes: label is needed for selection
    return (
      <StructuredListRow
        label
        head={head}
        key={ridx}
        className={
          'kui--radio-table-row' +
          (head ? ' kui--radio-table-row--header-row' : '') +
          (isSelected ? ' kui--inverted-color-context bx--structured-list-row--selected' : '')
        }
        data-name={row.nameIdx !== undefined ? radioTableCellToString(row.cells[row.nameIdx]) : name}
        data-is-selected={isSelected || undefined}
      >
        {!head && (
          <StructuredListInput
            defaultChecked={isSelected}
            id={name}
            name={name}
            value={name}
            onChange={this.onChange.bind(this, ridx, onSelect)}
          />
        )}

        <StructuredListCell>
          <Icons icon="Checkmark" className="bx--structured-list-svg" />
        </StructuredListCell>

        {row.cells.map((cell, cidx) => {
          const badgeHint = cellShouldHaveBadge(cell)

          return (
            <StructuredListCell
              head={head}
              key={cidx}
              title={(typeof cell !== 'string' && cell.title) || undefined}
              data-is-name={cidx === row.nameIdx ? true : undefined}
              data-key={typeof cell !== 'string' ? cell.key : undefined}
              className={`kui--radio-table-cell ${radioTableHintsAsCss(cell) || ''}`}
            >
              <span data-tag={badgeHint ? 'badge' : undefined}>
                {badgeHint && <span data-tag="badge-circle" className={badgeHint.toString()} />}

                <span className="kui--cell-inner-text">{radioTableCellToString(cell)}</span>
              </span>
            </StructuredListCell>
          )
        })}
      </StructuredListRow>
    )
  }

  private header() {
    return (
      <StructuredListHead className="kui--radio-table-header">
        {this.row(this.props.table.header, 0, true)}
      </StructuredListHead>
    )
  }

  private body() {
    return (
      <StructuredListBody className="kui--radio-table-body">
        {this.props.table.body.map((row, idx) => this.row(row, idx, false, row.onSelect))}
      </StructuredListBody>
    )
  }

  public render() {
    return (
      <div className="kui--data-table-wrapper kui--radio-table-wrapper kui--table-like-wrapper">
        <div className="kui--screenshotable">
          <Card
            header={this.props.title && this.topToolbar()}
            footerClassName="kui--inverted-color-context kui--no-padding"
          >
            <div className="kui--data-table-container">
              <StructuredListWrapper selection className="kui--radio-table kui--table-like">
                {this.header()}
                {this.body()}
              </StructuredListWrapper>
            </div>
          </Card>
        </div>
      </div>
    )
  }
}
