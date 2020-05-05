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
import { eventChannelUnsafe, Tab, NavResponse, ParsedOptions } from '@kui-shell/core'

import Width from './width'
import Navigation, { HistoryEntry } from '../../spi/Navigation'
import { getStateFromMMR } from './TopNavSidecar'
import { BaseSidecar, Props, cwd } from './BaseSidecar'

/** Lazily load KuiContent; see https://github.com/IBM/kui/issues/3746 */
const KuiContent = React.lazy(() => import('../../Content/KuiContent'))

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
export default class LeftNavSidecar extends BaseSidecar<NavResponse, HistoryEntry> {
  public constructor(props: Props) {
    super(props)

    const channel = `/command/complete/fromuser/NavResponse/${this.props.uuid}`
    const onResponse = this.onResponse.bind(this)
    eventChannelUnsafe.on(channel, onResponse)
    this.cleaners.push(() => eventChannelUnsafe.off(channel, onResponse))

    this.state = {
      repl: undefined,
      tab: undefined,
      history: undefined,
      current: undefined
    }
  }

  /** Is getState() idempotent? i.e. Will two command executions that satisfy `sameCommand` always produce the same response? */
  protected idempotent() {
    return true
  }

  /** Should we display Back/Forward arrows for history navigation? */
  protected useArrowNavigation() {
    return false
  }

  /** 30/70 split between the Terminal and the LeftNavSidecar */
  protected defaultWidth(): Width {
    return Width.Split70
  }

  /** @return a `HistoryEntry` for the given `Response` */
  protected getState(
    tab: Tab,
    response: NavResponse,
    argvNoOptions: string[],
    parsedOptions: ParsedOptions
  ): HistoryEntry {
    const navigations = []
    // get state from each of the left navigation
    response.menus.forEach(menu => {
      const state = getStateFromMMR(tab, { modes: menu.items }, argvNoOptions, parsedOptions)
      navigations.push(Object.assign({ title: menu.label }, state))
    })

    return {
      cwd: cwd(),
      argvNoOptions,
      parsedOptions,
      allNavs: navigations,
      allLinks: response.links || [],
      current: { menuIdx: 0, tabIdx: navigations[0].currentTabIndex },
      response
    }
  }

  protected isFixedWidth() {
    return true
  }

  private changeCurrent(menuIdx: number, tabIdx: number) {
    this.setState(({ current, history }) => {
      const newCurrent = Object.assign({}, current, { current: { menuIdx, tabIdx } })
      history.updateActive(newCurrent)
      return {
        current: newCurrent
      }
    })
  }

  /** render the leftnav part */
  protected nav() {
    return <Navigation tab={this.state.tab} current={this.current} changeCurrent={this.changeCurrent.bind(this)} />
  }

  protected headerBodyStyle() {
    return {}
  }

  protected bodyContent(tabIdx: number, menuIdx = 0) {
    return (
      <React.Suspense fallback={<div />}>
        <KuiContent
          key={`${menuIdx}-${tabIdx}`} // helps react distinguish similar KuiContents, see: https://github.com/IBM/kui/issues/3837
          tab={this.state.tab}
          mode={this.current.allNavs[menuIdx].tabs[tabIdx]}
          args={{ argvNoOptions: this.state.current.argvNoOptions, parsedOptions: this.state.current.parsedOptions }}
          response={{ modes: this.current.response.menus[menuIdx].items }}
        />
      </React.Suspense>
    )
  }

  protected bodyContainer(tabIdx: number, menuIdx: number) {
    return <div className="kui--sidecar-content">{this.bodyContent(tabIdx, menuIdx)}</div>
  }

  public render() {
    if (!this.current || !this.current.response) {
      return <div />
    }

    return (
      <div
        className={'kui--sidecar kui--inverted-color-context kui--nav-view kui--screenshotable ' + this.width()}
        data-view="leftnav"
      >
        {' '}
        {/* data-view helps with tests */}
        {this.title({ breadcrumbs: this.current.response.breadcrumbs })}
        <div className="kui--sidecar-header-and-body zoomable" style={this.headerBodyStyle()}>
          {this.nav()}
          {this.bodyContainer(this.current.current.tabIdx, this.current.current.menuIdx)}
        </div>
      </div>
    )
  }
}
