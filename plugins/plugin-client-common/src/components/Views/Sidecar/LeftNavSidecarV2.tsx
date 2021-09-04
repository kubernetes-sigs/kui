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

/* eslint-disable @typescript-eslint/no-empty-function */

import React from 'react'
import { Tab, NavResponse } from '@kui-shell/core'

import Width from './width'
import { Loading } from '../../..'
import { getStateFromMMR } from './TopNavSidecarV2'
import Navigation, { NavigationModel } from '../../spi/Navigation'
import BaseSidecar, { Props, State } from './BaseSidecarV2'

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
export default class LeftNavSidecar extends BaseSidecar<NavResponse, NavigationModel & State> {
  public constructor(props: Props<NavResponse>) {
    super(props)
    this.state = this.getState(props.tab, props.response)
  }

  /** 30/70 split between the Terminal and the LeftNavSidecar */
  protected defaultWidth(): Width {
    return Width.Split70
  }

  /** @return State for the given `Response` */
  protected getState(tab: Tab, response: NavResponse): NavigationModel & State {
    const navigations = []
    // get state from each of the left navigation
    response.menus.forEach(menu => {
      const state = getStateFromMMR(tab, { modes: menu.items })
      navigations.push(Object.assign({ title: menu.label }, state))
    })

    return {
      allNavs: navigations,
      allLinks: response.links || [],
      current: { menuIdx: 0, tabIdx: navigations[0].currentTabIndex },
      response
    }
  }

  private changeCurrent(menuIdx: number, tabIdx: number) {
    this.setState(({ current }) => {
      const newCurrent: NavigationModel['current'] = Object.assign({}, current, { menuIdx, tabIdx })
      return {
        current: newCurrent
      }
    })
  }

  private readonly _onChange = this.changeCurrent.bind(this)

  /** render the leftnav part */
  protected nav() {
    return <Navigation tab={this.props.tab} current={this.current} changeCurrent={this._onChange} />
  }

  protected bodyContent(tabIdx: number, menuIdx = 0) {
    return (
      <React.Suspense fallback={<div />}>
        <KuiContent
          key={`${menuIdx}-${tabIdx}`} // helps react distinguish similar KuiContents, see: https://github.com/IBM/kui/issues/3837
          tab={this.props.tab}
          mode={this.current.allNavs[menuIdx].tabs[tabIdx]}
          isActive={true}
          args={{
            argsForMode: undefined, // TODO: this.props.response.argsForMode,
            argvNoOptions: this.props.argvNoOptions,
            parsedOptions: this.props.parsedOptions
          }}
          response={{ modes: this.current.response.menus[menuIdx].items }}
          execUUID={this.props.execUUID}
        />
      </React.Suspense>
    )
  }

  protected bodyContainer(tabIdx: number, menuIdx: number) {
    return <div className="kui--sidecar-content">{this.bodyContent(tabIdx, menuIdx)}</div>
  }

  public render() {
    if (!this.current || !this.current.response) {
      return <Loading />
    }

    return (
      <div
        className={'kui--sidecar kui--nav-view kui--sidecar-nested ' + this.width()}
        ref={this.dom}
        data-view="leftnav"
      >
        {' '}
        {/* data-view helps with tests */}
        {this.title({ breadcrumbs: this.current.response.breadcrumbs })}
        <div className="kui--sidecar-header-and-body zoomable">
          {this.nav()}
          {this.bodyContainer(this.current.current.tabIdx, this.current.current.menuIdx)}
        </div>
      </div>
    )
  }
}
