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
import { KeyCodes } from '@kui-shell/core/mdist/api/Keys'
import { inElectron } from '@kui-shell/core/mdist/api/Capabilities'
import { isReadOnlyClient } from '@kui-shell/core/mdist/api/Client'
import { Button } from '@patternfly/react-core/dist/esm/components/Button'
import { Nav, NavList } from '@patternfly/react-core/dist/esm/components/Nav'
import {
  Masthead,
  MastheadMain,
  MastheadBrand,
  MastheadContent,
  MastheadToggle
} from '@patternfly/react-core/dist/esm/components/Masthead'

import TabModel from '../TabModel'
import KuiContext from '../context'
import NewTabButton from './NewTabButton'
import Tab, { TabConfiguration } from './Tab'
import InterfaceProps from '../props/Interface'
import SplitTerminalButton from './SplitTerminalButton'

import Icons from '../../spi/Icons'

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

type Props = TopTabStripeConfiguration &
  InterfaceProps & {
    tabs: TabModel[]
    activeIdx: number
    noTopTabs: boolean
    closeableTabs: boolean
    onNewTab: () => void
    onCloseTab: (idx: number) => void
    onSwitchTab: (idx: number) => void

    needsSidebar: boolean
    isSidebarOpen: boolean
    onToggleSidebar: () => void
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

  private readonly closeTab = (idx: number) => this.props.onCloseTab(idx)
  private readonly switchTab = (idx: number) => this.props.onSwitchTab(idx)

  /** Render tabs */
  private tabs() {
    return (
      !this.props.noTopTabs && (
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
                  closeable={this.props.closeableTabs}
                  active={idx === this.props.activeIdx}
                  onCloseTab={this.closeTab}
                  onSwitchTab={this.switchTab}
                />
              ))}
            </NavList>
          </Nav>
          {!isReadOnlyClient() && !(this.props.noNewTabButton && this.props.noNewSplitButton) && (
            <div className="kui--top-tab-buttons">
              {!this.props.noNewTabButton && <NewTabButton onNewTab={this.props.onNewTab} />}
              {!this.props.noNewSplitButton && <SplitTerminalButton />}
            </div>
          )}
        </React.Fragment>
      )
    )
  }

  private headerName() {
    return (
      <KuiContext.Consumer>
        {config => <div className="kui--header--name">{config.productName || 'Kui'}</div>}
      </KuiContext.Consumer>
    )
  }

  private sidebarToggle() {
    return (
      this.props.needsSidebar && (
        <MastheadToggle className="kui--top-tab-stripe-header--toggle">
          <Button
            variant="plain"
            aria-label="Global navigation"
            className="kui--top-tab-stripe-header--toggle-button"
            onClick={this.props.onToggleSidebar}
          >
            <Icons icon="Hamburger" className="kui--top-tab-stripe-header--toggle-button-icon" />
          </Button>
        </MastheadToggle>
      )
    )
  }

  /** <Masthead/> property */
  private readonly inset = { default: 'insetLg' as const }

  /** <Masthead/> property */
  private readonly display = { default: 'inline' as const }

  private header() {
    // Note: with @patternfly/react-core version 4.192.15, we have to
    // explicitly choose display and inset properties. Otherwise, the
    // Masthead component seems to determine these asynchronous, after
    // the initial render! Ugh, this results in an odd shifting
    // pattern after a few hundred milliseconds.
    return (
      <Masthead className="kui--top-tab-stripe-header" display={this.display} inset={this.inset}>
        {this.sidebarToggle()}
        <MastheadMain className="kui--top-tab-stripe-header--main">
          <MastheadBrand component="span" className="kui--top-tab-stripe-header--brand" tabIndex={-1}>
            {this.headerName()}
          </MastheadBrand>
          <MastheadContent className="kui--top-tab-stripe-header--content">{this.tabs()}</MastheadContent>
        </MastheadMain>
      </Masthead>
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
