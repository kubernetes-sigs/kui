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

import React from 'react'
import { i18n } from '@kui-shell/core'
import { SideNavMenu, SideNavMenuItem, SideNav, SideNavItems } from 'carbon-components-react'

import '../../web/css/static/About.scss'
import 'carbon-components/scss/components/ui-shell/_content.scss'
import 'carbon-components/scss/components/ui-shell/_side-nav.scss'

const strings = i18n('client', 'about')

interface Props {
  expanded: boolean
}

interface State {
  current: { nav: number; tab: number }
}

export default class About extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)

    this.state = {
      current: { nav: 0, tab: 0 }
    }
  }

  private configure(menuIdx: number) {
    return (
      <SideNavMenu title={strings('Configure')} isActive defaultExpanded>
        <SideNavMenuItem
          href="#" // needed for tab navigation
          key={0}
          data-mode={'theme'} // needed for tests
          isActive={this.state.current.nav === menuIdx && this.state.current.tab === 0}
          onClick={() => {
            this.setState({ current: { nav: menuIdx, tab: 0 } })
          }}
        >
          <span className="kui--mode-placeholder" data-mode="theme">
            {strings('Theme')}
          </span>
        </SideNavMenuItem>
      </SideNavMenu>
    )
  }

  public render() {
    return (
      <SideNav aria-label="Side navigation" {...this.props} isChildOfHeader isFixedNav>
        <SideNavItems>
          {/* this.state.allNavs.map((nav, idx) => this.renderSideNavMenu(idx)) */}
          {this.configure(0)}
        </SideNavItems>
      </SideNav>
    )
  }
}
