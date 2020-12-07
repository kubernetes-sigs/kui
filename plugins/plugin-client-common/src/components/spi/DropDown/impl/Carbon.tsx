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
import { Dropdown, OverflowMenu, OverflowMenuItem } from 'carbon-components-react'

import Icons from '../../Icons'
import Props, { Action } from '../model'

import '../../../../../web/scss/components/DropDown/Carbon.scss'

export default class CarbonDropDown extends React.PureComponent<Props> {
  private isOpen = false

  /** re: isOpen, see the comment for the onOpen() method */
  private onClose() {
    if (this.isOpen) {
      if (this.props.onClose) {
        this.props.onClose()
      }
      this.isOpen = false
    }
  }

  private readonly _onClose = this.onClose.bind(this)

  /**
   * This will no longer be needed once we update to
   * carbon-components-react
   * 10.16. https://github.com/carbon-design-system/carbon/pull/6083
   *
   */
  private onOpen() {
    this.isOpen = true
  }

  private readonly _onOpen = this.onOpen.bind(this)

  /**
   * Ugh, Carbon has two separate components for
   * Dropdown. "OverflowMenu" is the kebab form, and "Dropdown" is the
   * caret toggler form.
   *
   */
  public render() {
    if (!this.props.toggle || this.props.toggle === 'kebab') {
      // note how this is the default option
      return this.kebab()
    } else {
      return this.dropdown()
    }
  }

  private className() {
    return 'kui--dropdown ' + (this.props.className || '')
  }

  /** @return the label for the entire caret-style Dropdown */
  private currentLabel() {
    const currentItem = this.props.actions.find(_ => _.isSelected)
    return currentItem ? currentItem.label : ''
  }

  /** @return the item label, for caret-style Dropdown */
  private readonly _itemToString = (item: Action) => item.label

  /** The onChange handler for caret-style Dropdown */
  private readonly _onChange = ({ selectedItem }: { selectedItem: Action }) => {
    const currentSelectedItem = this.props.actions.find(_ => _.isSelected)
    if (currentSelectedItem) {
      currentSelectedItem.isSelected = false
    }

    selectedItem.isSelected = true
    setTimeout(() => selectedItem.handler())
  }

  /** Use a caret style Dropdown */
  private dropdown() {
    // gap in @types/carbon-components-react
    const typeHacks = { className: this.className() }

    return (
      <Dropdown
        id=""
        titleText=""
        ariaLabel="dropdown"
        {...typeHacks}
        type={this.props.isPlain ? 'inline' : 'default'}
        onChange={this._onChange}
        items={this.props.actions}
        label={this.currentLabel()}
        size={this.props.isPlain ? 'sm' : 'xl'}
        itemToString={this._itemToString}
        direction={this.props.direction === 'up' ? 'top' : 'bottom'}
      ></Dropdown>
    )
  }

  /** Use a kebab style Dropdown */
  private kebab() {
    return (
      <OverflowMenu
        flipped
        menuOptionsClass={this.props.className}
        className={this.className()}
        onOpen={this._onOpen}
        onClose={this._onClose}
      >
        {this.kebabItems()}
      </OverflowMenu>
    )
  }

  /** Items for kebab-style Dropdown */
  private kebabItems() {
    return this.props.actions.map((_, idx) => {
      const selectedItem = (label: string, isSelected: boolean) => (
        <React.Fragment>
          <span className="small-right-pad" style={!isSelected ? { opacity: 0 } : undefined}>
            <Icons icon="Checkmark" data-mode="selected container" />
          </span>
          <div className="bx--overflow-menu-options__option-content">{label}</div>
        </React.Fragment>
      )

      return (
        <OverflowMenuItem
          hasDivider={_.hasDivider}
          key={idx}
          itemText={selectedItem(_.label, _.isSelected)}
          onClick={() => setTimeout(() => _.handler())}
          data-mode={_.label}
        />
      )
    })
  }
}
