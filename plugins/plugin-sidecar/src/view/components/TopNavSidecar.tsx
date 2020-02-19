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

import Debug from 'debug'
import * as React from 'react'
import { Tabs, Tab } from 'carbon-components-react'
import {
  eventBus,
  getTabId,
  Tab as KuiTab,
  REPL,
  MultiModalMode,
  MultiModalResponse,
  isResourceWithMetadata,
  addRelevantModes,
  isResourceByReference,
  badgeRegistrar,
  isButton,
  Button
} from '@kui-shell/core'
import KuiContent from './KuiContent'

import Badge from './Badge'
import TitleBar from './TitleBar'
import ToolbarContainer from './ToolbarContainer'

const debug = Debug('plugin-sidecar/components/TopNavSidecar')

interface Props {
  repl: REPL
  tab: KuiTab
  response: MultiModalResponse
}

interface State {
  currentTabIndex: number
  buttons: Button[]
  tabs: MultiModalMode[]
}

export function getStateFromMMR(tab: KuiTab, response: MultiModalResponse): State {
  const allModes = response.modes.slice(0)

  // consult the view registrar for registered view modes
  // relevant to this resource
  const command = ''
  if (isResourceWithMetadata(response)) {
    addRelevantModes(tab, allModes, command, { resource: response })
  } else if (isResourceByReference(response)) {
    addRelevantModes(tab, allModes, command, response)
  }

  // defaultMode: if the response specified one, then look for it;
  // otherwise, use the mode that considers itself default;
  // otherwise use the first
  const defaultModeFromResponse = response.defaultMode ? allModes.findIndex(_ => _.mode === response.defaultMode) : -1
  const defaultModeFromModel =
    defaultModeFromResponse === -1 ? allModes.findIndex(_ => _.defaultMode) : defaultModeFromResponse
  const defaultMode = defaultModeFromModel === -1 ? 0 : defaultModeFromModel

  const tabs = allModes.filter(_ => !isButton(_))

  // re: as any: yay tsc, there are several open issue for this;
  // it's related to isButton using generics
  const buttonsFromRegistrar: Button[] = (allModes.filter(isButton) as any) as Button[]
  const buttonsFromResponse = response.buttons || []
  const buttons = buttonsFromResponse.concat(buttonsFromRegistrar)

  return {
    currentTabIndex: defaultMode,
    tabs,
    buttons
  }
}
/**
 *
 * TopNavSidecar
 * -----------------------
 * | <TitleBar/>         |
 * -----------------------
 * | nameHash?           |
 * | name                |
 * |---------------------|
 * | Tab | Tab |  ...    | <Tab/> from here down
 * |---------------------|
 * | <Toolbar/>          |   <ToolbarContainer/> from here down
 * |---------------------|
 * | <KuiContent/>       |
 * |                     |
 * -----------------------
 *
 */
class TopNavSidecar extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)
    this.state = getStateFromMMR(props.tab, props.response)
  }

  protected headerBodyStyle() {
    return { 'flex-direction': 'column' }
  }

  protected isFixedWidth() {
    return false
  }

  private nameHash() {
    const { nameHash } = this.props.response

    if (nameHash) {
      const onclick = this.props.response.onclick && this.props.response.onclick.nameHash
      return (
        <span
          className={'entity-name-hash' + (onclick ? ' clickable' : '')}
          onClick={onclick && (() => this.props.repl.pexec(onclick))}
        >
          {nameHash}
        </span>
      )
    }
  }

  private name() {
    const onclick = this.props.response.onclick && this.props.response.onclick.name
    return (
      <div className="entity-name-line">
        <span
          className={'entity-name' + (onclick ? ' clickable' : '')}
          onClick={onclick && (() => this.props.repl.pexec(onclick))}
        >
          {this.props.response.metadata.name}
        </span>
      </div>
    )
  }

  private namePart() {
    return (
      <div className="header-left-bits">
        <div className="sidecar-header-text">
          <div className="sidecar-header-name" data-base-class="sidecar-header-name">
            <div className="sidecar-header-name-content" data-base-class="sidecar-header-name-content">
              {this.nameHash()}
              {this.name()}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // first div used to be sidecar-top-stripe
  private tabs() {
    return (
      <div className="zoomable full-height">
        <div className="full-height">
          <Tabs
            className="sidecar-bottom-stripe-mode-bits sidecar-bottom-stripe-button-container"
            triggerHref="#"
            selected={this.state.currentTabIndex}
            onSelectionChange={(idx: number) => this.setState({ currentTabIndex: idx })}
          >
            {this.state.tabs.map((mode: MultiModalMode, idx: number) => (
              <Tab
                href="#"
                key={mode.mode}
                id={mode.mode}
                tabIndex={0}
                className="sidecar-bottom-stripe-button"
                label={mode.label || mode.mode}
                data-mode={mode.mode}
                handleTabKeyDown={() => false}
                handleTabAnchorFocus={() => false}
                handleTabClick={() => false}
              >
                {this.tabContent(idx)}
              </Tab>
            ))}
          </Tabs>
        </div>
      </div>
    )
  }

  protected bodyContent(idx: number) {
    return <KuiContent tab={this.props.tab} mode={this.state.tabs[idx]} response={this.props.response} />
  }

  private tabContent(idx: number) {
    const { toolbarText } = this.props.response

    return (
      <div className="sidecar-content-container">
        <div className="custom-content zoomable">
          <ToolbarContainer
            tab={this.props.tab}
            response={this.props.response}
            toolbarText={toolbarText}
            buttons={this.state.buttons}
          >
            {this.bodyContent(idx)}
          </ToolbarContainer>
        </div>{' '}
      </div>
    )
  }

  /** Return a collection of badge elements */
  private badges() {
    const badges = badgeRegistrar.filter(({ when }) => {
      // filter out any irrelevant badges (for this resource)
      try {
        return when(this.props.response)
      } catch (err) {
        debug('warning: registered badge threw an exception during filter', err)
        return false
      }
    })

    return (
      <div className="badges">
        {badges.map(({ badge }, idx) => (
          <Badge key={idx} spec={badge} />
        ))}
      </div>
    )
  }

  private header() {
    return (
      <header className="sidecar-header">
        <div className="header-main-content">
          <div className="kui--sidecar-header-and-toolbar">
            <div className="header-top-bits">
              {this.namePart()}

              <div className="header-right-bits">
                <div className="custom-header-content">{this.badges()}</div>
              </div>
            </div>
          </div>
        </div>
      </header>
    )
  }

  protected containerStyle() {
    return { display: 'flex', flex: 1, 'overflow-y': 'hidden', 'flex-direction': 'column' }
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
      <div style={this.containerStyle()}>
        {this.title()}
        <div className="kui--sidecar-header-and-body" style={{ flexDirection: 'column' }}>
          {this.header()}
          {this.tabs()}
        </div>
      </div>
    )
  }
}

export default function renderTopNavSidecar(tab: KuiTab, repl: REPL, response: MultiModalResponse): React.ReactElement {
  return <TopNavSidecar tab={tab} repl={repl} response={response} />
}
