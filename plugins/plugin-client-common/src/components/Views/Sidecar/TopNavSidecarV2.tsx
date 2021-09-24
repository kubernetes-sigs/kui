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

import Debug from 'debug'
import React from 'react'
import { Tabs, Tab, TabTitleText } from '@patternfly/react-core'

import {
  eventChannelUnsafe,
  Tab as KuiTab,
  ToolbarText,
  MultiModalMode,
  MultiModalResponse,
  isResourceWithMetadata,
  addRelevantModes,
  isResourceByReference,
  badgeRegistrar,
  isButton,
  Button
} from '@kui-shell/core'

import Badge from './Badge'
import KuiContext from '../../Client/context'
import ToolbarContainer from './ToolbarContainer'
import Toolbar from './Toolbar'
import { BreadcrumbView } from '../../spi/Breadcrumb'
import BaseSidecar, { Props, State } from './BaseSidecarV2'

import '../../../../web/css/static/ToolbarButton.scss'
import '../../../../web/scss/components/Sidecar/PatternFly.scss'

/** Lazily load KuiContent; see https://github.com/IBM/kui/issues/3746 */
const KuiContent = React.lazy(() => import('../../Content/KuiContent'))

const debug = Debug('plugin-sidecar/components/TopNavSidecar')

/**
 * One history entry, which is a `MultiModalResponse`, further parsed
 * out into buttons and tabs, and a pointer to the `currentTabIndex`.
 *
 */
interface HistoryEntry {
  currentTabIndex: number

  viewButtons: Button[]
  drilldownButtons: Button[]

  tabs: Readonly<MultiModalMode[]>
  toolbarText: ToolbarText
  defaultMode: number
}

export function getStateFromMMR(tab: KuiTab, response: MultiModalResponse): HistoryEntry {
  let allModes = response.modes.slice(0)

  // consult the view registrar for registered view modes
  // relevant to this resource
  const cmd = ''
  if (isResourceWithMetadata(response)) {
    addRelevantModes(tab, allModes, cmd, { resource: response })
  } else if (isResourceByReference(response)) {
    addRelevantModes(tab, allModes, cmd, response)
  }

  // obey the `order` constraints of the modes
  allModes = allModes.sort((a, b) => {
    return (a.order || 0) - (b.order || 0)
  })

  // defaultMode: if the response specified one, then look for it;
  // otherwise, use the mode that considers itself default;
  // otherwise use the first
  const tabs = allModes.filter(_ => !isButton(_))
  const defaultModeFromResponse = response.defaultMode ? tabs.findIndex(_ => _.mode === response.defaultMode) : -1
  const defaultModeFromModel =
    defaultModeFromResponse === -1 ? tabs.findIndex(_ => _.defaultMode) : defaultModeFromResponse
  const defaultMode = defaultModeFromModel === -1 ? 0 : defaultModeFromModel

  // re: as any: yay tsc, there are several open issue for this;
  // it's related to isButton using generics
  const buttonsFromRegistrar: Button[] = (allModes.filter(isButton) as any) as Button[]
  const buttonsFromResponse = response.buttons || []
  const buttons = buttonsFromResponse.concat(buttonsFromRegistrar)

  // toolbarText: if the default mode specified one, then use it;
  // otherwise, use the one specified by response
  const toolbarText = (tabs[defaultMode] && tabs[defaultMode].toolbarText) || response.toolbarText

  return {
    currentTabIndex: defaultMode,
    defaultMode,
    tabs,
    toolbarText,
    viewButtons: buttons.filter(_ => !(_.kind === 'drilldown' && _.showRelatedResource)),
    drilldownButtons: buttons.filter(_ => _.kind === 'drilldown' && _.showRelatedResource)
  }
}

type TopNavState = HistoryEntry &
  State & {
    response: MultiModalResponse
    toolbarText: MultiModalResponse['toolbarText']
    args: {
      argsForMode: MultiModalResponse['argsForMode']
      argvNoOptions: Props<MultiModalResponse>['argvNoOptions']
      parsedOptions: Props<MultiModalResponse>['parsedOptions']
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
export default class TopNavSidecar extends BaseSidecar<MultiModalResponse, TopNavState> {
  public static contextType = KuiContext

  public constructor(props: Props<MultiModalResponse>) {
    super(props)
    this.state = TopNavSidecar.getDerivedStateFromProps(props)
  }

  /** @return a `HistoryEntry` for the given `Response` */
  public static getDerivedStateFromProps(props: Props<MultiModalResponse>, state?: TopNavState): TopNavState {
    const { tab, response } = props

    if (!state || state.response !== response) {
      const args = {
        argsForMode: response.argsForMode,
        argvNoOptions: props.argvNoOptions,
        parsedOptions: props.parsedOptions
      }
      return Object.assign(
        state || {},
        { response, toolbarText: response.toolbarText, args },
        getStateFromMMR(tab, response)
      )
    } else {
      return state
    }
  }

  protected headerBodyStyle() {
    return { 'flex-direction': 'column' }
  }

  /** return the pretty name or unadulterated name from the response */
  private prettyName(): string {
    return (
      this.state.response &&
      (this.state.response.prettyName || (this.state.response.metadata ? this.state.response.metadata.name : undefined))
    )
  }

  /** display the unadulterated name from the response as sidecar header */
  private namePart() {
    return (
      this.context.sidecarName === 'heroText' &&
      this.state.response &&
      this.state.response.metadata &&
      this.state.response.metadata.name && (
        <div className="header-left-bits">
          <div className="sidecar-header-text">
            <div className="sidecar-header-name" data-base-class="sidecar-header-name">
              <div className="sidecar-header-name-content" data-base-class="sidecar-header-name-content">
                {this.state.response.metadata.name}
              </div>
            </div>
          </div>
        </div>
      )
    )
  }

  /** ToolbarContainer updated the toolbar */
  private didUpdateToolbar(toolbarText: MultiModalResponse['toolbarText']) {
    this.setState({ toolbarText })
  }

  private readonly _didUpdateToolbar = this.didUpdateToolbar.bind(this)

  /** Special case with no hero name, but badges... we need a filler element */
  private fillerNamePart() {
    return <div className="header-left-bits" />
  }

  /** Tell the world that we have changed the focused mode */
  private broadcastFocusChange(idx: number) {
    // de-focus the old mode
    const oldMode = this.current.tabs[this.current.currentTabIndex]
    eventChannelUnsafe.emit(`/mode/focus/off/tab/${this.props.uuid}/mode/${oldMode.mode}`, oldMode)

    // re-focus the new mode
    const newMode = this.current.tabs[idx]
    eventChannelUnsafe.emit(`/mode/focus/on/tab/${this.props.uuid}/mode/${newMode.mode}`, newMode)
  }

  /** eventKey property for a Tab */
  private eventKey(idx: number) {
    return idx
  }

  /** idx from the encoded eventKey */
  private idxFromEventKey(eventKey: number) {
    return eventKey
  }

  /** User has changed selected Tab */
  private onSelect(_, eventKey: number) {
    const idx = this.idxFromEventKey(eventKey)

    // tell the views that we have changed focus
    this.broadcastFocusChange(idx)

    this.setState(curState => {
      const toolbarText = curState.tabs[idx].toolbarText || curState.toolbarText
      return Object.assign({}, curState, { currentTabIndex: idx, toolbarText })
    })
  }

  private readonly _onSelect = this.onSelect.bind(this)

  // first div used to be sidecar-top-stripe
  private tabs() {
    return (
      <div className="kui--sidecar-tabs-container zoomable full-height" onClick={this._stopPropagation}>
        <Tabs
          className="sidecar-bottom-stripe-mode-bits sidecar-bottom-stripe-button-container kui--sidecar-tabs"
          activeKey={this.eventKey(this.current.currentTabIndex)}
          onSelect={this._onSelect}
        >
          {this.current.tabs.map((mode: MultiModalMode, idx: number) => (
            <Tab
              key={mode.mode}
              id={mode.mode}
              eventKey={this.eventKey(idx)}
              className="sidecar-bottom-stripe-button kui--sidecar-tab"
              title={<TabTitleText className="kui--sidecar-tab-label">{mode.label || mode.mode}</TabTitleText>}
              data-mode={mode.mode}
              data-is-selected={idx === this.current.currentTabIndex || undefined}
              onMouseDown={this._preventDefault}
            >
              {this.tabContent(idx)}
            </Tab>
          ))}
        </Tabs>
      </div>
    )
  }

  protected bodyContent(idx: number) {
    const mode = this.current.tabs[idx]

    return (
      <KuiContent
        tab={this.props.tab}
        mode={mode}
        isActive={idx === this.current.currentTabIndex}
        args={this.state.args}
        response={this.state.response}
        execUUID={this.props.execUUID}
      />
    )
  }

  private tabContent(idx: number) {
    return (
      <div
        className="sidecar-content-container kui--tab-content"
        hidden={idx !== this.current.currentTabIndex || undefined}
      >
        <div className="custom-content">
          <ToolbarContainer
            tab={this.props.tab}
            execUUID={this.props.execUUID}
            response={this.state.response}
            args={this.state.args}
            didUpdateToolbar={this._didUpdateToolbar}
            toolbarText={this.state.toolbarText}
            noAlerts={this.current.currentTabIndex !== this.current.defaultMode}
            buttons={this.current.viewButtons}
          >
            {this.bodyContent(idx)}
          </ToolbarContainer>
        </div>
      </div>
    )
  }

  /** Return a collection of badge elements */
  private badges() {
    const badges = badgeRegistrar.filter(({ when }) => {
      // filter out any irrelevant badges (for this resource)
      try {
        return when(this.state.response)
      } catch (err) {
        debug('warning: registered badge threw an exception during filter', err)
        return false
      }
    })

    return (
      badges &&
      badges.length > 0 && (
        <div className="badges">
          {badges.map(({ badge }, idx) => (
            <Badge key={idx} spec={badge} tab={this.props.tab} response={this.state.response} />
          ))}
        </div>
      )
    )
  }

  private header() {
    const namePart = this.namePart()
    const badges = this.badges()

    if (namePart || badges) {
      return (
        <header className="sidecar-header">
          <div className="header-main-content">
            <div className="kui--sidecar-header-and-toolbar">
              <div className="header-top-bits">
                {namePart || this.fillerNamePart()}

                <div className="header-right-bits">
                  <div className="custom-header-content">{badges}</div>
                </div>
              </div>
            </div>
          </div>
        </header>
      )
    }
  }

  private footer() {
    return (
      <Toolbar
        bottom={true}
        tab={this.props.tab}
        execUUID={this.props.execUUID}
        response={this.state.response}
        args={this.state.args}
        buttons={this.current.drilldownButtons}
      />
    )
  }

  private kindBreadcrumb(): BreadcrumbView {
    const { kind, onclick } = this.state.response
    return { label: kind, command: onclick && onclick.kind, className: 'kui--sidecar-kind' }
  }

  /** show name as breadcrumb when not showing context as hero text in sidecar header  */
  private nameBreadcrumb(): BreadcrumbView {
    const { onclick } = this.state.response

    return {
      label: this.prettyName(),
      command: onclick && onclick.name,
      isCurrentPage: true,
      className: 'kui--sidecar-entity-name'
    }
  }

  private versionBreadcrumb(): BreadcrumbView {
    return this.state.response.version
      ? { label: this.state.response.version, className: 'kui--version-breadcrumb' }
      : undefined
  }

  private nameHashBreadcrumb(): BreadcrumbView {
    const { onclick } = this.state.response
    return {
      label: this.state.response && this.state.response.nameHash,
      command: onclick && onclick.nameHash,
      deemphasize: true,
      className: 'kui--sidecar-entity-name-hash'
    }
  }

  private namespaceBreadcrumb(): BreadcrumbView {
    const {
      metadata: { namespace },
      onclick
    } = this.state.response
    return {
      label: namespace,
      command: onclick && onclick.namespace,
      deemphasize: true,
      className: 'kui--sidecar-entity-namespace'
    }
  }

  public render() {
    if (!this.current || !this.state.response) {
      if (this.props.onRender) {
        this.props.onRender(false)
      }
      return <div />
    } else if (this.props.onRender) {
      // needs to be async'd; see https://github.com/kubernetes-sigs/kui/issues/7539
      setTimeout(() => this.props.onRender(true))
    }

    const nameBreadCrumbs =
      this.context.sidecarName === 'breadcrumb'
        ? [this.nameBreadcrumb(), this.versionBreadcrumb(), this.nameHashBreadcrumb()]
        : []

    // we want to show the titlebar, in order to show the breadcrumbs
    const showingBreadcrumbs = true

    try {
      const breadcrumbs = [this.kindBreadcrumb()]
        .concat(nameBreadCrumbs)
        .concat(this.namespaceBreadcrumb())
        .filter(_ => _)

      // Note: data-view helps with tests
      return (
        <div
          className={'kui--sidecar kui--sidecar-nested ' + this.width()}
          ref={this.dom}
          data-view="topnav"
          onClick={this._stopPropagation}
        >
          {showingBreadcrumbs &&
            this.title({
              breadcrumbs
            })}
          <div className="kui--sidecar-header-and-body" style={{ flexDirection: 'column' }}>
            {this.header()}
            {this.tabs()}
            {this.footer()}
          </div>
        </div>
      )
    } catch (err) {
      console.error(err)
    }
  }
}
