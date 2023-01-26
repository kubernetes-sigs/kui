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
import { Nav, NavExpandable, NavItem, NavList } from '@patternfly/react-core/dist/esm/components/Nav'

import { i18n } from '@kui-shell/core/mdist/api/i18n'
import { MultiModalMode, Link, isLinkWithCommand } from '@kui-shell/core/mdist/api/Response'

import NavigationProps from '../model'

import '../../../../../web/scss/components/Navigation/Patternfly.scss'

const strings = i18n('client', 'about')

export default class PatternflyNavigation extends React.PureComponent<NavigationProps> {
  /** render menu options specified by client/config.d/about.json */
  private renderSideNavMenu(menuIdx: number) {
    const thisNav = this.props.current.allNavs[menuIdx]
    return (
      <NavExpandable
        title={strings(thisNav.title)}
        key={menuIdx}
        isActive={this.props.current.current.menuIdx === menuIdx}
        isExpanded={true}
        className={menuIdx === 0 ? 'sidecar-header-name-content' : undefined}
      >
        {thisNav.tabs.map((mode: MultiModalMode, idx: number) => {
          const isActive = this.props.current.current.menuIdx === menuIdx && this.props.current.current.tabIdx === idx
          return (
            <NavItem
              href="#" // needed for tab navigation
              key={idx} // if you make this mode.mode, then data-mode doesn't work
              data-mode={mode.mode} // needed for tests
              isActive={isActive}
              onClick={evt => {
                evt.stopPropagation()
                this.props.changeCurrent(menuIdx, idx)
              }}
              onMouseDown={event => event.preventDefault()}
            >
              <span className="kui--mode-placeholder" data-mode={mode.mode} data-current={isActive}>
                {strings(mode.label || mode.mode)}
              </span>
            </NavItem>
          )
        })}
      </NavExpandable>
    )
  }

  private renderSideNavLink(idx: number, link: Link) {
    if (isLinkWithCommand(link)) {
      return (
        <NavItem
          className="kui--nav-command-link"
          data-link={strings(link.label)}
          key={idx}
          to="#"
          onClick={() => this.props.tab.REPL.pexec(link.command)}
        >
          {strings(link.label)}
        </NavItem>
      )
    } else {
      return (
        <NavItem
          className="kui--nav-href-link"
          data-link={strings(link.label)}
          key={idx}
          target="_blank"
          to={link.href}
        >
          {strings(link.label)}
        </NavItem>
      )
    }
  }

  public render() {
    return (
      <Nav aria-label="Side navigation" theme="dark">
        <NavList>
          {this.props.current.allNavs.map((nav, idx) => this.renderSideNavMenu(idx))}
          {this.props.current.allLinks.map((link, idx) => this.renderSideNavLink(idx, link))}
        </NavList>
      </Nav>
    )
  }
}
