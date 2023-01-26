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

import React from 'react'
import { pexecInCurrentTab } from '@kui-shell/core/mdist/api/Exec'
import { radioTableCellToString } from '@kui-shell/core/mdist/api/Table'

import Props from './model'
import DropDown from '../DropDown'

export interface State {
  selectedIdx: number
}

export default class RadioTableSpi extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)

    this.state = { selectedIdx: props.table.defaultSelectedIdx }
  }

  public render() {
    return (
      <DropDown
        toggle="caret"
        actions={this.props.table.body.map((_, idx) => ({
          label: radioTableCellToString(_.cells[_.nameIdx || 0]),
          isSelected: this.state.selectedIdx === idx,
          handler: () => pexecInCurrentTab(_.onSelect)
        }))}
        position="left"
      />
    )
  }
}
