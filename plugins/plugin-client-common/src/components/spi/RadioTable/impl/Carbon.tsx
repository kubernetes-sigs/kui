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

import { CheckmarkFilled16 as Checkmark } from '@carbon/icons-react'
import {
  StructuredListWrapper,
  StructuredListHead,
  StructuredListRow,
  StructuredListCell,
  StructuredListBody,
  StructuredListInput
} from 'carbon-components-react'

import BaseProps from '../model'
import { State as BaseState } from '../index'

import '../../../../../web/scss/components/StructuredList/Carbon.scss'

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
    ;(document.getElementById(this.id(this.props.selectedIdx)) as HTMLInputElement).checked = false

    if (onSelect) {
      await onSelect()
    }

    this.props.onChange(selectedIdx)
  }

  private id(idx: number): string {
    return `${this.state.uuid}-${idx}`
  }

  private row(row: RadioTableRow, idx: number, head: boolean, onSelect?: () => void) {
    const isSelected = !head && idx === this.props.selectedIdx
    const name = this.id(idx)

    // notes: label is needed for selection
    return (
      <StructuredListRow label head={head} key={idx} data-name={row.name || name}>
        {!head && (
          <StructuredListInput
            defaultChecked={isSelected}
            id={name}
            name={name}
            value={name}
            onChange={this.onChange.bind(this, idx, onSelect)}
          />
        )}

        <StructuredListCell>{isSelected && <Checkmark className="bx--structured-list-svg" />}</StructuredListCell>

        {row.cells.map((_, idx) => (
          <StructuredListCell head={head} key={idx} data-key={typeof _ !== 'string' && _.key}>
            {typeof _ === 'string' ? _ : _.value}
          </StructuredListCell>
        ))}
      </StructuredListRow>
    )
  }

  private header() {
    return <StructuredListHead>{this.row(this.props.table.header, 0, true)}</StructuredListHead>
  }

  private body() {
    return (
      <StructuredListBody>
        {this.props.table.body.map((row, idx) => this.row(row, idx, false, row.onSelect))}
      </StructuredListBody>
    )
  }

  public render() {
    return (
      <StructuredListWrapper selection className="kui--radio-table kui--screenshotable">
        {this.header()}
        {this.body()}
      </StructuredListWrapper>
    )
  }
}
