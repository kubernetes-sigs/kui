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
import { OverflowMenu, OverflowMenuItem } from 'carbon-components-react'

import Props from '../model'
import Icons from '../../Icons'

import '../../../../../web/scss/components/DropDown/Carbon.scss'

export default class CarbonDropDown extends React.PureComponent<Props> {
  public render() {
    return (
      <OverflowMenu
        flipped
        menuOptionsClass={this.props.className}
        className={this.props.className}
        onClose={this.props.onClose && this.props.onClose.bind(this)}
      >
        {this.props.actions.map((_, idx) => {
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
        })}
      </OverflowMenu>
    )
  }
}
