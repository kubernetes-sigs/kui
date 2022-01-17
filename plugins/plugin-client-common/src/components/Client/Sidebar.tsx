/*
 * Copyright 2022 The Kubernetes Authors
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
import { encodeComponent, pexecInCurrentTab } from '@kui-shell/core'
import { PageSidebar } from '@patternfly/react-core'

import BrandingProps from './props/Branding'
import GuidebookProps, { isGuidebook, isMenu, MenuItem } from './props/Guidebooks'

const Nav = React.lazy(() => import('@patternfly/react-core').then(_ => ({ default: _.Nav })))
const NavItem = React.lazy(() => import('@patternfly/react-core').then(_ => ({ default: _.NavItem })))
const NavList = React.lazy(() => import('@patternfly/react-core').then(_ => ({ default: _.NavList })))
const NavExpandable = React.lazy(() => import('@patternfly/react-core').then(_ => ({ default: _.NavExpandable })))

type Props = BrandingProps &
  GuidebookProps & {
    /** unfurled? */
    isOpen: boolean

    /** visually indicate which nav item is active? */
    indicateActiveItem?: boolean
  }

interface State {
  /** in noTopTabs mode, we indicate selected guidebook in the NavItem below */
  currentGuidebook?: string
}

export default class Sidebar extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)
    this.state = {}
  }

  private get currentGuidebook() {
    return this.state.currentGuidebook
  }

  private nav() {
    // helps deal with isActive; if we don't have a currentGuidebook,
    // use the first one (for now)
    let first = !this.currentGuidebook

    const renderItem = (_: MenuItem, idx) => {
      const thisIsTheFirstNavItem = isGuidebook(_) && first
      if (thisIsTheFirstNavItem) {
        first = false
      }

      return isGuidebook(_) ? (
        <NavItem
          key={idx}
          data-title={_.notebook}
          className="kui--sidebar-nav-item"
          isActive={this.props.indicateActiveItem && (_.notebook === this.currentGuidebook || thisIsTheFirstNavItem)}
          onClick={() => {
            pexecInCurrentTab(`${this.props.guidebooksCommand || 'replay'} ${encodeComponent(_.filepath)}`)
            this.setState({ currentGuidebook: _.notebook })
          }}
        >
          {_.notebook}
        </NavItem>
      ) : isMenu(_) ? (
        <NavExpandable key={idx} isExpanded title={_.label} className="kui--sidebar-nav-menu" data-title={_.label}>
          {_.submenu.map(renderItem)}
        </NavExpandable>
      ) : (
        undefined
      )
    }

    return (
      <React.Suspense fallback={<div />}>
        <Nav className="kui--tab-container-sidebar-nav">
          <NavList>{this.props.guidebooks.map(renderItem)}</NavList>
        </Nav>
        {this.props.productName && this.props.version && (
          <div className="flex-align-end semi-bold kui--tab-container-sidebar-other">
            {this.props.productName} v{this.props.version}
          </div>
        )}
      </React.Suspense>
    )
  }

  public render() {
    return (
      <PageSidebar
        nav={this.props.isOpen && this.nav()}
        isNavOpen={this.props.isOpen}
        className="kui--tab-container-sidebar"
      />
    )
  }
}
