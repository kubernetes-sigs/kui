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
  i18n,
  eventBus,
  Tab,
  getTabId,
  Button,
  REPL,
  MultiModalResponse,
  addRelevantModes,
  isButton,
  isResourceWithMetadata,
  isResourceByReference,
  MultiModalMode
} from '@kui-shell/core'
import { Content, SideNavMenu, SideNavMenuItem, SideNav, SideNavItems } from 'carbon-components-react'

import TitleBar from './TitleBar'
import KuiContent from './KuiContent'

import { productName } from '@kui-shell/client/config.d/name.json'

import '../../../web/css/static/sidecar.css'
import '../../../web/css/static/sidecar-main.css'

const strings = i18n('client', 'about')
// const strings2 = i18n('core-support')
const strings2 = strings

interface Props {
  repl: REPL
  tab: Tab
  response: MultiModalResponse
}

interface State {
  currentTabIndex: number
  nClientProvidedModes: number
  tabs: MultiModalMode[]
  buttons: Button[]
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
export class LeftNavSidecar extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)

    const { tab, response } = props
    const allModes = response.modes.slice(0)

    // consult the view registrar for registered view modes
    // relevant to this resource
    const command = ''
    if (isResourceWithMetadata(response)) {
      addRelevantModes(tab, allModes, command, { resource: response })
    } else if (isResourceByReference(response)) {
      addRelevantModes(tab, allModes, command, response)
    }

    const nClientProvidedModes = allModes.length
    const allModes2 = this.addExtraModes(allModes)

    // defaultMode: if the response specified one, then look for it;
    // otherwise, use the mode that considers itself default;
    // otherwise use the first
    const defaultModeFromResponse = props.response.defaultMode
      ? allModes2.findIndex(_ => _.mode === props.response.defaultMode)
      : -1
    const defaultModeFromModel =
      defaultModeFromResponse === -1 ? allModes2.findIndex(_ => _.defaultMode) : defaultModeFromResponse
    const defaultMode = defaultModeFromModel === -1 ? 0 : defaultModeFromModel

    const tabs = allModes2.filter(_ => !isButton(_))

    // re: as any: yay tsc, there are several open issue for this;
    // it's related to isButton using generics
    const buttonsFromRegistrar: Button[] = (allModes.filter(isButton) as any) as Button[]
    const buttonsFromResponse = props.response.buttons || []
    const buttons = buttonsFromResponse.concat(buttonsFromRegistrar)

    this.state = {
      nClientProvidedModes,
      currentTabIndex: defaultMode,
      tabs,
      buttons
    }
  }

  protected addExtraModes(tabs: MultiModalMode[]) {
    return tabs.concat([{ mode: 'builtin-theme', contentFrom: 'themes' }])
  }

  /** render menu options specified by client/config.d/about.json */
  private clientProvided() {
    return (
      <SideNavMenu title={productName} isActive defaultExpanded className="sidecar-header-name-content">
        {this.state.tabs.slice(0, this.state.nClientProvidedModes).map((mode: MultiModalMode, idx: number) => (
          <SideNavMenuItem
            isActive={this.state.currentTabIndex === idx}
            key={mode.mode}
            href="javascript:void()" // needed for tab navigation
            onClick={() => this.setState({ currentTabIndex: idx })}
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
          onClick={() => this.setState({ currentTabIndex: this.state.tabs.length - 1 })}
        >
          <span className="kui--mode-placeholder" data-mode="theme">
            {strings2('Theme')}
          </span>
        </SideNavMenuItem>
      </SideNavMenu>
    )
  }

  /** render the leftnav part */
  protected nav() {
    return (
      <SideNav aria-label="Side navigation" expanded isChildOfHeader={false} isFixedNav>
        <SideNavItems>
          {this.clientProvided()}
          {this.builtins()}
        </SideNavItems>
      </SideNav>
    )
  }

  protected containerStyle() {
    return { display: 'flex', flex: 1, 'overflow-y': 'hidden', 'flex-direction': 'column' }
  }

  protected headerBodyStyle() {
    return {}
  }

  protected bodyContent(idx: number) {
    return <KuiContent tab={this.props.tab} mode={this.state.tabs[idx]} response={this.props.response} />
  }

  protected bodyContainer(idx: number) {
    return <Content>{this.bodyContent(idx)}</Content>
  }

  protected isFixedWidth() {
    return true
  }

  protected onMaximize() {
    eventBus.emit(`/sidecar/maximize/${getTabId(this.props.tab)}`, this.props.tab)
  }

  protected onRestore() {
    eventBus.emit(`/sidecar/restore/${getTabId(this.props.tab)}`, this.props.tab)
  }

  protected onMinimize() {
    eventBus.emit(`/sidecar/minimize/${getTabId(this.props.tab)}`, this.props.tab)
  }

  protected onClose() {
    eventBus.emit(`/sidecar/close/${getTabId(this.props.tab)}`, this.props.tab)
  }

  protected title() {
    return (
      <TitleBar
        fixedWidth={this.isFixedWidth()}
        kind={this.props.response.kind}
        namespace={this.props.response.metadata.namespace}
        onClickNamespace={
          this.props.response.onclick &&
          this.props.response.onclick.namespace &&
          (() => this.props.repl.pexec(this.props.response.onclick.namespace))
        }
        onScreenshot={() => this.props.repl.pexec('screenshot sidecar')}
        onMaximize={this.onMaximize.bind(this)}
        onRestore={this.onRestore.bind(this)}
        onMinimize={this.onMinimize.bind(this)}
        onClose={this.onClose.bind(this)}
      />
    )
  }

  protected viewId() {
    return 'kui-default-sidecar'
  }

  public render() {
    return (
      <div style={this.containerStyle()} data-view-id={this.viewId()}>
        {this.title()}
        <div className="kui--sidecar-header-and-body" style={this.headerBodyStyle()}>
          {this.nav()}
          {this.bodyContainer(this.state.currentTabIndex)}
        </div>
      </div>
    )
  }
}

export default function renderLeftNavSidecar(tab: Tab, repl: REPL, response: MultiModalResponse): React.ReactElement {
  return <LeftNavSidecar tab={tab} repl={repl} response={response} />
}
