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
import { KeyCodes, inElectron } from '@kui-shell/core'

import Tab from './Tab'
import TabModel from '../TabModel'
import NewTabButton from './NewTabButton'

/**
 *
 * TabContainer
 * ----------------
 * | TopTabStripe | <--- you are here
 * |--------------|
 * |              |
 * | TabContent[] |
 * |              |
 * ----------------
 *
 */

/**
 *
 * TopTabStripe
 * ----------------------------
 * | Tab | Tab | NewTabButton |
 * |--------------------------|
 *   /\
 *   | activeIdx
 */

interface Props {
  tabs: TabModel[]
  activeIdx: number
  onNewTab: () => void
  onCloseTab: (idx: number) => void
  onSwitchTab: (idx: number) => void
}

export default class TopTabStripe extends React.PureComponent<Props> {
  public componentDidMount() {
    this.addKeyboardListeners()
  }

  /**
   * Register any keyboard event listeners
   *
   */
  private addKeyboardListeners() {
    if (inElectron()) {
      // switch tabs based on keyboard events
      document.addEventListener('keydown', event => {
        if (event.metaKey && event.shiftKey) {
          // shift-command+[]: switch to previous or next
          const whichDir = event.key
          if (whichDir === '[' || whichDir === ']') {
            const newIdx = whichDir === '[' ? this.props.activeIdx - 1 : this.props.activeIdx + 1
            this.props.onSwitchTab(newIdx)
          }
          event.stopPropagation()
          return
        }

        if (event.ctrlKey) {
          // ctrl+PgUp/PgDown: switch to previous or next
          const whichDir = event.keyCode
          if (whichDir === KeyCodes.PAGEUP || whichDir === KeyCodes.PAGEDOWN) {
            const newIdx = whichDir === KeyCodes.PAGEUP ? this.props.activeIdx - 1 : this.props.activeIdx + 1
            this.props.onSwitchTab(newIdx)
          }
          event.stopPropagation()
          return
        }

        if (event.metaKey) {
          // meta+number: switch to tab by index
          const whichTabStr = event.key
          if (/\d/.test(whichTabStr)) {
            event.stopPropagation()
            const whichTabIdx = parseInt(whichTabStr, 10)
            this.props.onSwitchTab(whichTabIdx - 1)
          }
        }
      })
    }
  }

  /**
   * React render handler
   *
   */
  public render() {
    return (
      <div className="left-tab-stripe kui-header">
        <div className="left-tab-stripe-buttons">
          {this.props.tabs.map((tab, idx) => (
            <Tab
              key={idx}
              idx={idx}
              uuid={tab.uuid}
              closeable={this.props.tabs.length > 1}
              active={idx === this.props.activeIdx}
              onCloseTab={(idx: number) => this.props.onCloseTab(idx)}
              onSwitchTab={(idx: number) => this.props.onSwitchTab(idx)}
            />
          ))}
        </div>
        <div className="left-tab-stripe-bottom-buttons">
          <NewTabButton
            onNewTab={() => {
              this.props.onNewTab()
            }}
          />

          <div id="kui--custom-top-tab-stripe-button-container"></div>
        </div>
      </div>
    )
  }
}
