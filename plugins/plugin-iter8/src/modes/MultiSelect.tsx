/*
 * Copyright 2021 IBM Corporation
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

/* Origin: https://www.patternfly.org/2020.04/documentation/react/components/select */

import React from 'react'
import { Select, SelectOption, SelectVariant } from '@patternfly/react-core'

interface Props {
  id?: string
  options: string[]
  ariaLabelledBy?: string
  ariaLabelTypeAhead?: string
  placeholderText?: string
  onChange: (selected: string[]) => void
}

interface State {
  selected: string[]
  isExpanded: boolean
}

export default class MultiSelect extends React.PureComponent<Props, State> {
  public constructor(props) {
    super(props)

    this.state = {
      isExpanded: false,
      selected: []
    }
  }

  private onToggle(isExpanded: boolean) {
    this.setState({
      isExpanded
    })
  }

  private readonly _onToggle = this.onToggle.bind(this)

  private onSelect(event: React.MouseEvent | React.ChangeEvent, selection: string) {
    const { selected } = this.state
    if (selected.includes(selection)) {
      this.setState(curState => {
        const selected = curState.selected.filter(item => item !== selection)
        this.props.onChange(selected)
        return {
          selected
        }
      })
    } else {
      this.setState(curState => {
        const selected = [...curState.selected, selection]
        this.props.onChange(selected)
        return {
          selected
        }
      })
    }
  }

  private readonly _onSelect = this.onSelect.bind(this)

  private clearSelection() {
    this.setState({
      selected: [],
      isExpanded: false
    })
  }

  private readonly _clearSelection = this.clearSelection.bind(this)

  public render() {
    const { selected } = this.state

    return (
      <Select
        id={this.props.id}
        selections={selected}
        onToggle={this._onToggle}
        onSelect={this._onSelect}
        onClear={this._clearSelection}
        variant={SelectVariant.typeaheadMulti}
        placeholderText={this.props.placeholderText}
        aria-labelled-by={this.props.ariaLabelledBy}
        typeAheadAriaLabel={this.props.ariaLabelTypeAhead}
      >
        {this.props.options.map((option, idx) => (
          <SelectOption key={idx} value={option} />
        ))}
      </Select>
    )
  }
}
