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
import { Header, HeaderName, HeaderMenuButton, HeaderNavigation } from 'carbon-components-react'

import About from '../About'
import TabModel from '../TabModel'
import NewTabButton from './NewTabButton'
import Tab, { TabConfiguration } from './Tab'

import 'carbon-components/scss/components/ui-shell/_header.scss'
import 'carbon-components/scss/components/ui-shell/_ui-shell.scss'
import '../../../web/css/static/TopTabStripe.scss'

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

export type TopTabStripeConfiguration = TabConfiguration

type Props = TopTabStripeConfiguration & {
  tabs: TabModel[]
  activeIdx: number
  onNewTab: () => void
  onCloseTab: (idx: number) => void
  onSwitchTab: (idx: number) => void
}

/** @types/carbon-react is insufficient here; filling in the gaps for now */
type CarbonHeaderArgs = { onClickSideNavExpand: React.MouseEventHandler; isSideNavExpanded: boolean }

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

  /** Render tabs */
  private tabs() {
    return (
      <HeaderNavigation aria-label="Tabs">
        {this.props.tabs.map((tab, idx) => (
          <Tab
            {...this.props}
            key={idx}
            idx={idx}
            uuid={tab.uuid}
            closeable={this.props.tabs.length > 1}
            active={idx === this.props.activeIdx}
            onCloseTab={(idx: number) => this.props.onCloseTab(idx)}
            onSwitchTab={(idx: number) => this.props.onSwitchTab(idx)}
          />
        ))}
        <div className="kui--top-tab-buttons">
          <NewTabButton
            onNewTab={() => {
              this.props.onNewTab()
            }}
          />

          <div id="kui--custom-top-tab-stripe-button-container"></div>
        </div>
      </HeaderNavigation>
    )
  }

  private sidenav(args: CarbonHeaderArgs) {
    return <About expanded={args.isSideNavExpanded} />
  }

  private headerMenu(args: CarbonHeaderArgs) {
    return (
      <HeaderMenuButton
        aria-label="Open menu"
        isCollapsible
        onClick={args.onClickSideNavExpand}
        isActive={args.isSideNavExpanded}
      />
    )
  }

  private headerName() {
    return <HeaderName prefix="">{this.props.productName}</HeaderName>
  }

  /**
   * React render handler
   *
   */
  public render() {
    return (
      <Header aria-label="Header" className="kui--top-tab-stripe">
        {/* this.headerMenu(args) */}
        {this.headerName()}
        {this.tabs()}
        {/* this.sidenav(args) */}
      </Header>
    )
  }
}
