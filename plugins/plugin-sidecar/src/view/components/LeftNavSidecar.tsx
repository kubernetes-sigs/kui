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

/* eslint-disable @typescript-eslint/no-empty-function */

import * as React from 'react'
import { i18n, Tab, Button, REPL, NavResponse, MultiModalMode } from '@kui-shell/core'
import { Content, SideNavMenu, SideNavMenuItem, SideNav, SideNavItems } from 'carbon-components-react'

import KuiContent from './KuiContent'
import { getStateFromMMR } from './TopNavSidecar'
import { Props, BaseSidecar } from './BaseSidecar'

const strings = i18n('client', 'about')
// const strings2 = i18n('core-support')
const strings2 = strings

interface Navigation {
  title: string
  currentTabIndex: number
  tabs: MultiModalMode[]
  buttons?: Button[]
}

interface State {
  current: { nav: number; tab: number }
  allNavs: Navigation[]
}

/**
 *
 * LeftNavSidecar
 * -------------------------
 * | <TitleBar/>           |
 * -------------------------
 * | A1   |                |
 * |  a1  | <Content>      |
 * |  a2  |  <KuiContent/> |
 * | B1   | </Content>     |
 * |  b1  |                |
 * |  b2  |                |
 * -------------------------
 *  ^^^^^ <SideNav/>
 *   A1, B1: <SideNavMenu/>
 *   a1, b1: <SideNavMenuItem/>
 *
 */
export class LeftNavSidecar extends BaseSidecar<NavResponse, State> {
  public constructor(props: Props<NavResponse>) {
    super(props)

    // get state from each of the left navigation
    const navigations = Object.entries(props.response).map(([title, mmr]) => {
      const state = getStateFromMMR(props.tab, mmr)
      return Object.assign({ title }, state)
    })

    this.state = {
      allNavs: this.addExtraNav(navigations),
      current: { nav: 0, tab: navigations[0].currentTabIndex }
    }
  }

  protected addExtraNav(navs: Navigation[]) {
    const tabs = [{ mode: 'theme', label: 'Theme', contentFrom: 'themes' }]
    return navs.concat([{ title: strings2('Configure'), tabs, currentTabIndex: 0 }])
  }

  /** render menu options specified by client/config.d/about.json */
  private renderSideNavMenu(menuIdx: number) {
    const thisNav = this.state.allNavs[menuIdx]
    return (
      <SideNavMenu title={thisNav.title} isActive defaultExpanded className="sidecar-header-name-content">
        {thisNav.tabs.map((mode: MultiModalMode, idx: number) => (
          <SideNavMenuItem
            isActive={this.state.current.nav === menuIdx && this.state.current.tab === idx}
            key={mode.mode}
            href="javascript:void()" // needed for tab navigation
            onClick={() => {
              this.setState({ current: { nav: menuIdx, tab: idx } })
            }}
          >
            <span className="kui--mode-placeholder" data-mode={mode.mode}>
              {strings(mode.label || mode.mode)}
            </span>
          </SideNavMenuItem>
        ))}
      </SideNavMenu>
    )
  }

  /** render the leftnav part */
  protected nav() {
    return (
      <SideNav aria-label="Side navigation" expanded isChildOfHeader={false} isFixedNav>
        <SideNavItems>{this.state.allNavs.map((nav, idx) => this.renderSideNavMenu(idx))}</SideNavItems>
      </SideNav>
    )
  }

  protected headerBodyStyle() {
    return {}
  }

  protected bodyContent(tabIdx: number, navIdx = 0) {
    return (
      <KuiContent
        tab={this.props.tab}
        mode={this.state.allNavs[navIdx].tabs[tabIdx]}
        response={this.props.response[navIdx]}
      />
    )
  }

  protected bodyContainer(tabIdx: number, menuIdx: number) {
    return <Content>{this.bodyContent(tabIdx, menuIdx)}</Content>
  }

  public render() {
    return (
      <div style={this.containerStyle()} data-view-id={this.viewId()}>
        {this.title()}
        <div className="kui--sidecar-header-and-body" style={this.headerBodyStyle()}>
          {this.nav()}
          {this.bodyContainer(this.state.current.tab, this.state.current.nav)}
        </div>
      </div>
    )
  }
}

export default function renderLeftNavSidecar(tab: Tab, repl: REPL, response: NavResponse): React.ReactElement {
  return <LeftNavSidecar tab={tab} repl={repl} response={response} />
}
