/*
 * Copyright 2021 The Kubernetes Authors
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
import { Divider, Select, SelectGroup, SelectOption } from '@patternfly/react-core'

import { flatten, pexecInCurrentTab } from '@kui-shell/core'

import Props, { SelectOptions, isGrouped, isDivider } from '../model'

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

  private async onClick(option: SelectOptions) {
    if (option.command) {
      if (typeof option.command === 'string') {
        pexecInCurrentTab(option.command)
      } else {
        pexecInCurrentTab(await option.command())
      }
    }
  }

  private readonly _onClicks = isGrouped(this.props)
    ? flatten(
        this.props.groups.map(group =>
          isDivider(group) ? [] : group.options.map(option => this.onClick.bind(this, option))
        )
      )
    : this.props.options.map(option => this.onClick.bind(this, option))

  private readonly _onSelect = this.onSelect.bind(this)
  private readonly _onToggle = this.onToggle.bind(this)

  /** @return UI for the given option */
  private option(option: SelectOptions, index: number) {
    return (
      <SelectOption
        className="kui--select-option"
        data-value={option.label}
        key={index}
        value={option.label}
        isSelected={option.isSelected}
        description={option.description}
        onClick={this._onClicks[index]}
        isDisabled={option.isDisabled}
      />
    )
  }

  /** @return UI for all of the options */
  private options() {
    if (isGrouped(this.props)) {
      let runningIdx = 0
      const groups = this.props.groups.map((group, idx1) =>
        isDivider(group) ? (
          <Divider key={`divider-${idx1}`} />
        ) : (
          <SelectGroup label={group.label} key={`group-${idx1}`}>
            {group.options.map(option => this.option(option, runningIdx++))}
          </SelectGroup>
        )
      )

      return groups
    } else {
      return this.props.options.map((option, idx) => this.option(option, idx))
    }
  }

  public render() {
    return (
      <Select
        className={'kui--select' + (this.props.className ? ' ' + this.props.className : '')}
        isOpen={this.state.isOpen}
        variant={this.props.variant}
        typeAheadAriaLabel="Select from the Options"
        selections={this.state.selected}
        isGrouped={isGrouped(this.props)}
        maxHeight={this.props.maxHeight}
        onToggle={this._onToggle}
        onSelect={this._onSelect}
        isDisabled={this.props.isDisabled}
      >
        {this.options()}
      </Select>
    )
  }
}
