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
import { Nav, NavList, PageHeader } from '@patternfly/react-core'
import { Capabilities, KeyCodes, isReadOnlyClient } from '@kui-shell/core'

import TabModel from '../TabModel'
import KuiContext from '../context'
import NewTabButton from './NewTabButton'
import Tab, { TabConfiguration } from './Tab'
import SplitTerminalButton from './SplitTerminalButton'

import '../../../../web/scss/components/TopTabStripe/_index.scss'

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
    if (Capabilities.inElectron()) {
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
      <React.Fragment>
        <Nav aria-label="Tabs" variant="horizontal" className="kui--header-tabs">
          <NavList className="kui--tab-list">
            {this.props.tabs.map((tab, idx) => (
              <Tab
                {...this.props}
                key={idx}
                idx={idx}
                uuid={tab.uuid}
                title={tab.title}
                closeable={this.props.tabs.length > 1 && !isReadOnlyClient()}
                active={idx === this.props.activeIdx}
                onCloseTab={(idx: number) => this.props.onCloseTab(idx)}
                onSwitchTab={(idx: number) => this.props.onSwitchTab(idx)}
              />
            ))}
          </NavList>
        </Nav>
        {!isReadOnlyClient() && (
          <div className="kui--top-tab-buttons">
            <NewTabButton onNewTab={this.props.onNewTab} />
            <SplitTerminalButton />
          </div>
        )}
      </React.Fragment>
    )
  }

  private headerName() {
    return (
      <KuiContext.Consumer>
        {config => (
          <div prefix="" className="kui--header--name">
            {config.productName || 'Kui'}
          </div>
        )}
      </KuiContext.Consumer>
    )
  }

  private header() {
    const logoProps = {
      /*      href: 'https://patternfly.org',
      onClick: () => console.log('clicked logo'),
      target: '_blank' */
    }

    return (
      <PageHeader
        className="kui--top-tab-stripe-header"
        logo={this.headerName()}
        logoProps={logoProps}
        logoComponent="span"
        topNav={this.tabs()}
      />
    )
  }

  /**
   * React render handler
   *
   */
  public render() {
    return this.header()
  }
}
