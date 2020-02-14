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
import {
  i18n,
  Tab,
  REPL,
  MultiModalResponse,
  addRelevantModes,
  isResourceWithMetadata,
  isResourceByReference,
  MultiModalMode
} from '@kui-shell/core'
import { Content, SideNavMenu, SideNavMenuItem, SideNav, SideNavItems } from 'carbon-components-react'

import KuiContent from './KuiContent'

import { productName } from '@kui-shell/client/config.d/name.json'

import '../../web/css/static/sidecar.css'
import '@kui-shell/plugin-sidecar/web/css/static/sidecar-main.css'
const strings = i18n('client', 'about')
// const strings2 = i18n('core-support')
const strings2 = strings

// import LeftNavHeader from './LeftNavHeader'

interface Props {
  repl: REPL
  tab: Tab
  response: MultiModalResponse
}

interface State {
  currentTabIndex: number
  nClientProvidedModes: number
  allModes: MultiModalMode[]
}

export class LeftNavSidecar extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)

    const { tab, response } = props
    const allModes = response.modes

    // consult the view registrar for registered view modes
    // relevant to this resource
    const command = ''
    if (isResourceWithMetadata(response)) {
      addRelevantModes(tab, allModes, command, { resource: response })
    } else if (isResourceByReference(response)) {
      addRelevantModes(tab, allModes, command, response)
    }

    const nClientProvidedModes = allModes.length
    allModes.push({ mode: 'builtin-theme', contentFrom: 'themes' })

    const defaultMode = allModes.findIndex(_ => _.defaultMode)

    this.state = {
      nClientProvidedModes,
      currentTabIndex: defaultMode !== -1 ? defaultMode : 0,
      allModes
    }
  }

  /** render menu options specified by client/config.d/about.json */
  private clientProvided() {
    return (
      <SideNavMenu title={productName} isActive defaultExpanded className="sidecar-header-name-content">
        {this.state.allModes.slice(0, this.state.nClientProvidedModes).map((mode: MultiModalMode, id: number) => (
          <SideNavMenuItem
            isActive={this.state.currentTabIndex === id}
            key={mode.mode}
            href="javascript:void()" // needed for tab navigation
            onClick={() => this.setState({ currentTabIndex: id })}
          >
            <span className="kui--mode-placeholder" data-mode={mode.mode}>
              {strings(mode.label || mode.mode)}
            </span>
          </SideNavMenuItem>
        ))}
      </SideNavMenu>
    )
  }

  /** render built in menu options, i.e. those not provided by the client/config.d/about.json */
  private builtins() {
    return (
      <SideNavMenu title={strings2('Configure')} isActive defaultExpanded>
        <SideNavMenuItem
          key="theme"
          isActive={this.state.currentTabIndex === this.state.nClientProvidedModes}
          href="javascript:void()" // needed for tab navigation
          onClick={() => this.setState({ currentTabIndex: this.state.allModes.length - 1 })}
        >
          <span className="kui--mode-placeholder" data-mode="theme">
            {strings2('Theme')}
          </span>
        </SideNavMenuItem>
      </SideNavMenu>
    )
  }

  /** render the leftnav part */
  private leftnav() {
    return (
      <SideNav aria-label="Side navigation" expanded isChildOfHeader={false} isFixedNav>
        <SideNavItems>
          {this.clientProvided()}
          {this.builtins()}
        </SideNavItems>
      </SideNav>
    )
  }

  public render() {
    return (
      <div style={{ display: 'flex', flex: 1 }}>
        {this.leftnav()}

        <Content>
          <KuiContent tab={this.props.tab} mode={this.state.allModes[this.state.currentTabIndex]} />
        </Content>
      </div>
    )
  }
}

export default function renderLeftNavSidecar(tab: Tab, repl: REPL, response: MultiModalResponse) {
  return <LeftNavSidecar tab={tab} repl={repl} response={response} />
}
