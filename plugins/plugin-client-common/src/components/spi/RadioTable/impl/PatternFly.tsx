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
import { RadioTableRow } from '@kui-shell/core'

import {
  DataList,
  DataListItem,
  DataListCell,
  DataListItemRow,
  //  DataListCheck,
  DataListItemCells
  //  DataListAction
} from '@patternfly/react-core'

import BaseProps from '../model'
import { State as BaseState } from '../index'

type Props = BaseProps &
  BaseState & {
    onChange: (selectedIdx: number) => void
  }

import '../../../../../web/scss/components/RadioTable/PatternFly.scss'

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
  private static id(uuid: string, idx: number) {
    return `${uuid}-${idx}`
  }

  /** row id */
  private static aria(uuid: string, idx: number) {
    return `${PatternFly4RadioTable.id(uuid, idx)}-aria`
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

  private row(row: RadioTableRow, ridx: number) {
    const id = PatternFly4RadioTable.id(this.state.uuid, ridx)
    const aria = PatternFly4RadioTable.aria(this.state.uuid, ridx)

    return (
      <DataListItem key={ridx} aria-labelledby={aria} id={id}>
        <DataListItemRow>
          <DataListItemCells
            dataListCells={row.cells.map((_, cidx) => (
              <DataListCell key={cidx} data-key={typeof _ !== 'string' && _.key}>
                <span id={cidx === 0 ? id : undefined}>{typeof _ === 'string' ? _ : _.value}</span>
              </DataListCell>
            ))}
          />
        </DataListItemRow>
      </DataListItem>
    )
  }

  private header() {
    /* return (
      <StructuredListHead>
        {this.row(this.props.table.header, 0, true)}
      </StructuredListHead>
      ) */
    return <div />
  }

  private body() {
    return <React.Fragment>{this.props.table.body.map((row, idx) => this.row(row, idx))}</React.Fragment>
  }

  public render() {
    const selectedDataListItemId = PatternFly4RadioTable.id(this.state.uuid, this.props.selectedIdx)

    return (
      <DataList
        isCompact
        aria-label="radio table"
        className="kui--screenshotable"
        selectedDataListItemId={selectedDataListItemId}
        onSelectDataListItem={this.onSelectDataListItem.bind(this)}
      >
        {this.header()}
        {this.body()}
      </DataList>
    )
  }
}
