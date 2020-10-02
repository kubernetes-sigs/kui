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

import React from 'react'
import { Dropdown, DropdownItem, DropdownSeparator, KebabToggle } from '@patternfly/react-core'

import Props, { Action } from '../model'
import Icons from '../../Icons'

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
        <DropdownItem
          key="action"
          component="button"
          onClick={() => setTimeout(() => item.handler())}
          data-mode={item.label}
        >
          <span className="small-right-pad" style={!item.isSelected ? { opacity: 0 } : undefined}>
            <Icons icon="Checkmark" data-mode="selected container" />
          </span>
          {item.label}
        </DropdownItem>
      )
    })

    return renderItems
  }

  public render() {
    if (this.props.actions.length === 0) {
      return <React.Fragment />
    }

    return (
      <Dropdown
        className={this.props.className}
        onSelect={() => {
          this.setState(curState => ({ isOpen: !curState.isOpen }))
          if (this.props.onClose) {
            this.props.onClose()
          }
        }}
        toggle={
          <KebabToggle
            onToggle={isOpen => {
              this.setState({ isOpen })
            }}
          />
        }
        isOpen={this.state && this.state.isOpen}
        isPlain
        dropdownItems={this.renderDropDownItems(this.props.actions)}
        position="right"
      />
    )
  }
}
