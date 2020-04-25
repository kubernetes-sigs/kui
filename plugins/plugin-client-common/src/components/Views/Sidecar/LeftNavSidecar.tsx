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
import {
  eventChannelUnsafe,
  i18n,
  Tab,
  Button,
  NavResponse,
  MultiModalMode,
  ParsedOptions,
  Link,
  isLinkWithCommand
} from '@kui-shell/core'
import { Content, SideNavLink, SideNavMenu, SideNavMenuItem, SideNav, SideNavItems } from 'carbon-components-react'

import Width from './width'
import { getStateFromMMR } from './TopNavSidecar'
import { BaseHistoryEntry, BaseSidecar, Props, cwd } from './BaseSidecar'

import 'carbon-components/scss/components/ui-shell/_content.scss'
import 'carbon-components/scss/components/ui-shell/_side-nav.scss'

/** Lazily load KuiContent; see https://github.com/IBM/kui/issues/3746 */
const KuiContent = React.lazy(() => import('../../Content/KuiContent'))

const strings = i18n('client', 'about')

interface Navigation {
  title: string
  currentTabIndex: number
  tabs: MultiModalMode[]
  buttons?: Button[]
}

interface HistoryEntry extends BaseHistoryEntry {
  current: { menuIdx: number; tabIdx: number }
  allNavs: Navigation[]
  allLinks: Link[]

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
      width: Width.Closed,
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

  /** matching the old `flex: 3.5` compared to `flex: 4` for the Terminal */
  protected defaultWidth() {
    return '46.67%'
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

  /** render menu options specified by client/config.d/about.json */
  private renderSideNavMenu(menuIdx: number) {
    const thisNav = this.current.allNavs[menuIdx]
    return (
      <SideNavMenu
        title={strings(thisNav.title)}
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
            isActive={this.current.current.menuIdx === menuIdx && this.current.current.tabIdx === idx}
            onClick={() => {
              this.setState(({ current, history }) => {
                const newCurrent = Object.assign({}, current, { current: { menuIdx: menuIdx, tabIdx: idx } })
                history.updateActive(newCurrent)
                return {
                  current: newCurrent
                }
              })
            }}
            onMouseDown={event => event.preventDefault()}
          >
            <span className="kui--mode-placeholder" data-mode={mode.mode}>
              {strings(mode.label || mode.mode)}
            </span>
          </SideNavMenuItem>
        ))}
      </SideNavMenu>
    )
  }

  private renderSideNavLink(idx: number, link: Link) {
    if (isLinkWithCommand(link)) {
      return (
        <SideNavLink
          className="kui--nav-command-link"
          data-link={strings(link.label)}
          key={idx}
          href="#"
          onClick={() => this.state.tab.REPL.pexec(link.command)}
        >
          {strings(link.label)}
        </SideNavLink>
      )
    } else {
      return (
        <SideNavLink
          className="kui--nav-href-link"
          data-link={strings(link.label)}
          key={idx}
          target="_blank"
          href={link.href}
        >
          {strings(link.label)}
        </SideNavLink>
      )
    }
  }

  /** render the leftnav part */
  protected nav() {
    return (
      <SideNav aria-label="Side navigation" expanded isChildOfHeader={false} isFixedNav>
        <SideNavItems>
          {this.current.allNavs.map((nav, idx) => this.renderSideNavMenu(idx))}
          {this.current.allLinks.map((link, idx) => this.renderSideNavLink(idx, link))}
        </SideNavItems>
      </SideNav>
    )
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
    return <Content>{this.bodyContent(tabIdx, menuIdx)}</Content>
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
