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
import { eventBus, i18n, Tab, Button, NavResponse, MultiModalMode } from '@kui-shell/core'
import { Content, SideNavMenu, SideNavMenuItem, SideNav, SideNavItems } from 'carbon-components-react'

import Width from './width'
import { getStateFromMMR } from './TopNavSidecar'
import { BaseState, BaseSidecar, Props } from './BaseSidecar'

import 'carbon-components/scss/components/ui-shell/_content.scss'
import 'carbon-components/scss/components/ui-shell/_side-nav.scss'

/** Lazily load KuiContent; see https://github.com/IBM/kui/issues/3746 */
const KuiContent = React.lazy(() => import('./KuiContent'))

const strings = i18n('client', 'about')
// const strings2 = i18n('core-support')
const strings2 = strings

interface Navigation {
  title: string
  currentTabIndex: number
  tabs: MultiModalMode[]
  buttons?: Button[]
}

interface State extends BaseState {
  current: { nav: number; tab: number }
  allNavs: Navigation[]

  response: NavResponse
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
export default class LeftNavSidecar extends BaseSidecar<NavResponse, State> {
  public constructor(props: Props<NavResponse>) {
    super(props)

    if (!this.isManaged()) {
      const channel = '/command/complete/fromuser/NavResponse'
      const onResponse = this.onResponse.bind(this)
      eventBus.on(channel, onResponse)
      this.cleaners.push(() => eventBus.off(channel, onResponse))

      this.state = {
        repl: undefined,
        tab: undefined,
        width: Width.Default,

        allNavs: undefined,
        current: undefined,
        response: undefined
      }
    } else {
      this.state = this.getState(props.tab, props.response)
    }
  }

  /** matching the old `flex: 3.5` compared to `flex: 4` for the Terminal */
  protected defaultWidth() {
    return '46.67%'
  }

  private getState(tab: Tab, response: NavResponse): State {
    // get state from each of the left navigation
    const navigations = Object.entries(response).map(([title, mmr]) => {
      const state = getStateFromMMR(tab, mmr)
      return Object.assign({ title }, state)
    })

    return {
      tab,
      repl: tab.REPL,
      width: Width.Default,

      allNavs: this.addExtraNav(navigations),
      current: { nav: 0, tab: navigations[0].currentTabIndex },
      response
    }
  }

  protected isFixedWidth() {
    return true
  }

  private onResponse(tab: Tab, response: NavResponse) {
    this.setState(this.getState(tab, response))
  }

  protected addExtraNav(navs: Navigation[]) {
    const tabs = [{ mode: 'theme', label: 'Theme', contentFrom: 'themes' }]
    return navs.concat([{ title: strings2('Configure'), tabs, currentTabIndex: 0 }])
  }

  /** render menu options specified by client/config.d/about.json */
  private renderSideNavMenu(menuIdx: number) {
    const thisNav = this.state.allNavs[menuIdx]
    return (
      <SideNavMenu
        title={thisNav.title}
        key={menuIdx}
        isActive
        defaultExpanded
        className={menuIdx === 0 ? 'sidecar-header-name-content' : undefined}
      >
        {thisNav.tabs.map((mode: MultiModalMode, idx: number) => (
          <SideNavMenuItem
            href="#" // needed for tab navigation
            key={idx} // if you make this mode.mode, then data-mode doesn't work
            data-mode={mode.mode} // needed for tests
            isActive={this.state.current.nav === menuIdx && this.state.current.tab === idx}
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
      <React.Suspense fallback={<div />}>
        <KuiContent
          tab={this.state.tab}
          mode={this.state.allNavs[navIdx].tabs[tabIdx]}
          response={Object.values(this.state.response)[navIdx]}
        />
      </React.Suspense>
    )
  }

  protected bodyContainer(tabIdx: number, menuIdx: number) {
    return <Content>{this.bodyContent(tabIdx, menuIdx)}</Content>
  }

  public render() {
    if (!this.state.response) {
      return <div />
    }

    return (
      <div className={'kui--sidecar kui--nav-view kui--screenshotable ' + this.width()} data-view="leftnav">
        {' '}
        {/* data-view helps with tests */}
        {this.title()}
        <div className="kui--sidecar-header-and-body" style={this.headerBodyStyle()}>
          {this.nav()}
          {this.bodyContainer(this.state.current.tab, this.state.current.nav)}
        </div>
      </div>
    )
  }
}
