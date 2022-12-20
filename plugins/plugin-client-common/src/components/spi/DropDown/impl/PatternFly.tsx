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
import {
  Dropdown,
  DropdownItem,
  DropdownSeparator,
  KebabToggle,
  DropdownToggle
} from '@patternfly/react-core/dist/esm/components/Dropdown'

import Icons from '../../Icons'
import Props, { Action } from '../model'
import CaretUpIcon from '@patternfly/react-icons/dist/js/icons/caret-down-icon'

import '../../../../../web/scss/components/DropDown/PatternFly.scss'

interface State {
  isOpen: boolean
}

export default class PatternFlyDropDown extends React.PureComponent<Props, State> {
  private renderDropDownItems(actions: Action[]) {
    const renderItems = []

    actions.forEach(item => {
      if (item.hasDivider) {
        renderItems.push(<DropdownSeparator key="separator" />)
      }

      renderItems.push(
        <DropdownItem key={item.label} component="button" className="kui--dropdown__menu-item" data-mode={item.label}>
          <span className="small-right-pad" style={!item.isSelected ? { opacity: 0 } : undefined}>
            <Icons icon="Checkmark" data-mode="selected container" />
          </span>
          {item.label}
        </DropdownItem>
      )
    })

    return renderItems
  }

  private onToggle(isOpen: boolean) {
    this.setState({ isOpen })
  }

  private readonly _onToggle = this.onToggle.bind(this)

  private onSelect(evt: React.SyntheticEvent<HTMLDivElement>) {
    const selectedItemLabel = (evt.target as HTMLElement).getAttribute('data-mode')
    const selectedItem = this.props.actions.find(_ => _.label === selectedItemLabel)
    if (selectedItem) {
      const currentSelectedItem = this.props.actions.find(_ => _.isSelected)
      if (currentSelectedItem) {
        currentSelectedItem.isSelected = false
      }
      selectedItem.isSelected = true
      setTimeout(() => selectedItem.handler())
    } else {
      console.error('Internal error: could not find item model for selected item', evt.target, this.props.actions)
    }

    this.setState(curState => ({ isOpen: !curState.isOpen }))
    if (this.props.onClose) {
      this.props.onClose()
    }
  }

  private readonly _onSelect = this.onSelect.bind(this)

  /** @return the label for the entire caret-style Dropdown */
  private currentLabel() {
    const currentItem = this.props.actions.find(_ => _.isSelected)
    return currentItem ? currentItem.label : ''
  }

  public render() {
    if (this.props.actions.length === 0) {
      return <React.Fragment />
    }

    return (
      <Dropdown
        title={this.props.title}
        className={'kui--dropdown ' + (this.props.className || '')}
        onSelect={this._onSelect}
        isPlain={this.props.isPlain}
        toggle={
          !this.props.toggle || this.props.toggle === 'kebab' ? (
            <KebabToggle className="kui--dropdown__toggle" onToggle={this._onToggle} />
          ) : (
            <DropdownToggle
              className="kui--dropdown__toggle"
              onToggle={this._onToggle}
              toggleIndicator={CaretUpIcon}
              icon={this.props.icon}
            >
              {this.currentLabel()}
            </DropdownToggle>
          )
        }
        isOpen={this.state && this.state.isOpen}
        dropdownItems={this.renderDropDownItems(this.props.actions)}
        direction={this.props.direction}
        position={this.props.position || 'right'}
      />
    )
  }
}
