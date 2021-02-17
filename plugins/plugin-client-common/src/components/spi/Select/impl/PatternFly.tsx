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

import React from 'react'
import { Select, SelectOption } from '@patternfly/react-core'

import { pexecInCurrentTab } from '@kui-shell/core'

import Props, { SelectOptions } from '../model'

interface State {
  isOpen: boolean
  selected: string
}

import '../../../../../web/scss/components/Select/PatternFly.scss'

export default class PatternFlySelect extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)

    this.state = { isOpen: props.isOpen, selected: props.selected }
  }

  private onToggle(expanded: boolean) {
    if (this.props.isClosable !== false) {
      if (expanded) {
        if (!this.state.isOpen) {
          this.setState({ isOpen: true })
        }
      } else {
        this.setState({ isOpen: false })
      }
    }
  }

  private onSelect(_, value) {
    this.setState(curState => ({
      isOpen: this.props.isClosable !== false ? false : curState.isOpen,
      selected: typeof value === 'string' ? value : undefined
    }))
  }

  private onClick(option: SelectOptions) {
    if (option.command) {
      pexecInCurrentTab(option.command)
    }
  }

  private readonly _onClicks = this.props.options.map(option => this.onClick.bind(this, option))
  private readonly _onSelect = this.onSelect.bind(this)
  private readonly _onToggle = this.onToggle.bind(this)

  public render() {
    return (
      <Select
        className={'kui--select' + (this.props.className ? ' ' + this.props.className : '')}
        isOpen={this.state.isOpen}
        variant={this.props.variant}
        typeAheadAriaLabel="Select from the Options"
        selections={this.state.selected}
        maxHeight={this.props.maxHeight}
        onToggle={this._onToggle}
        onSelect={this._onSelect}
      >
        {this.props.options.map((option, index) => (
          <SelectOption
            className="kui--select-option"
            data-value={option.label}
            key={index}
            value={option.label}
            isSelected={option.isSelected}
            description={option.description}
            onClick={this._onClicks[index]}
          />
        ))}
      </Select>
    )
  }
}
