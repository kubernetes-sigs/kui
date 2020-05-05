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
import { MultiModalMode, Link, isLinkWithCommand, i18n } from '@kui-shell/core'
import { SideNavLink, SideNavMenu, SideNavMenuItem, SideNav, SideNavItems } from 'carbon-components-react'

import NavigationProps from '../model'

import '../../../../../web/scss/components/Navigation/Carbon.scss'

const strings = i18n('client', 'about')

export default class CarbonSideNav extends React.PureComponent<NavigationProps> {
  /** render menu options specified by client/config.d/about.json */
  private renderSideNavMenu(menuIdx: number) {
    const thisNav = this.props.current.allNavs[menuIdx]
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
            isActive={this.props.current.current.menuIdx === menuIdx && this.props.current.current.tabIdx === idx}
            onClick={() => this.props.changeCurrent(menuIdx, idx)}
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
          onClick={() => this.props.tab.REPL.pexec(link.command)}
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

  public render() {
    return (
      <SideNav aria-label="Side navigation" expanded isChildOfHeader={false} isFixedNav>
        <SideNavItems>
          {this.props.current.allNavs.map((nav, idx) => this.renderSideNavMenu(idx))}
          {this.props.current.allLinks.map((link, idx) => this.renderSideNavLink(idx, link))}
        </SideNavItems>
      </SideNav>
    )
  }
}
