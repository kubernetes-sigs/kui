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
import React from 'react'
import { Tabs, Tab } from 'carbon-components-react'

import {
  eventChannelUnsafe,
  Tab as KuiTab,
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
import { BreadcrumbView } from '../../spi/Breadcrumb'
import BaseSidecar, { Props, State } from './BaseSidecarV2'

import '../../../../web/css/static/ToolbarButton.scss'

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

  buttons: Button[]
  tabs: Readonly<MultiModalMode[]>
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

  return {
    currentTabIndex: defaultMode,
    defaultMode,
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
export default class TopNavSidecar extends BaseSidecar<MultiModalResponse, HistoryEntry & State> {
  public static contextType = KuiContext

  public constructor(props: Props<MultiModalResponse>) {
    super(props)
    this.state = this.getState(props.tab, props.response)
  }

  /** @return a `HistoryEntry` for the given `Response` */
  protected getState(tab: KuiTab, response: MultiModalResponse): HistoryEntry {
    return getStateFromMMR(tab, response)
  }

  protected headerBodyStyle() {
    return { 'flex-direction': 'column' }
  }

  /** return the pretty name or unadulterated name from the response */
  private prettyName(): string {
    return (
      this.props.response &&
      (this.props.response.prettyName || (this.props.response.metadata ? this.props.response.metadata.name : undefined))
    )
  }

  /** display the unadulterated name from the response as sidecar header */
  private namePart() {
    return (
      this.context.sidecarName === 'heroText' &&
      this.props.response &&
      this.props.response.metadata &&
      this.props.response.metadata.name && (
        <div className="header-left-bits">
          <div className="sidecar-header-text">
            <div className="sidecar-header-name" data-base-class="sidecar-header-name">
              <div className="sidecar-header-name-content" data-base-class="sidecar-header-name-content">
                {this.props.response.metadata.name}
              </div>
            </div>
          </div>
        </div>
      )
    )
  }

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

  // first div used to be sidecar-top-stripe
  private tabs() {
    return (
      <div className="kui--sidecar-tabs-container zoomable full-height" onClick={this._stopPropagation}>
        <Tabs
          className="sidecar-bottom-stripe-mode-bits sidecar-bottom-stripe-button-container"
          selected={this.current.currentTabIndex}
          onSelectionChange={(idx: number) => {
            // tell the views that we have changed focus
            this.broadcastFocusChange(idx)

            this.setState(curState => {
              return Object.assign({}, curState, { currentTabIndex: idx })
            })
          }}
        >
          {this.current.tabs.map((mode: MultiModalMode, idx: number) => (
            <Tab
              href="#"
              key={mode.mode}
              id={mode.mode}
              className="sidecar-bottom-stripe-button"
              label={mode.label || mode.mode}
              data-mode={mode.mode}
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
        args={{
          argsForMode: this.props.response.argsForMode,
          argvNoOptions: this.props.argvNoOptions,
          parsedOptions: this.props.parsedOptions
        }}
        response={this.props.response}
      />
    )
  }

  private tabContent(idx: number) {
    const { toolbarText } = this.props.response

    return (
      <div className="sidecar-content-container kui--tab-content">
        <div className="custom-content">
          <ToolbarContainer
            tab={this.props.tab}
            execUUID={this.props.execUUID}
            response={this.props.response}
            args={{ argvNoOptions: this.props.argvNoOptions, parsedOptions: this.props.parsedOptions }}
            toolbarText={toolbarText}
            noAlerts={this.current.currentTabIndex !== this.current.defaultMode}
            buttons={this.current.buttons}
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
        return when(this.props.response)
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
            <Badge key={idx} spec={badge} tab={this.props.tab} response={this.props.response} />
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

  private kindBreadcrumb(): BreadcrumbView {
    const { kind, onclick } = this.props.response
    return { label: kind, command: onclick && onclick.kind, className: 'kui--sidecar-kind' }
  }

  /** show name as breadcrumb when not showing context as hero text in sidecar header  */
  private nameBreadcrumb(): BreadcrumbView {
    const { onclick } = this.props.response

    return {
      label: this.prettyName(),
      command: onclick && onclick.name,
      isCurrentPage: true,
      className: 'kui--sidecar-entity-name'
    }
  }

  private versionBreadcrumb(): BreadcrumbView {
    return this.props.response.version
      ? { label: this.props.response.version, className: 'kui--version-breadcrumb' }
      : undefined
  }

  private nameHashBreadcrumb(): BreadcrumbView {
    const { onclick } = this.props.response
    return {
      label: this.props.response && this.props.response.nameHash,
      command: onclick && onclick.nameHash,
      deemphasize: true,
      className: 'kui--sidecar-entity-name-hash'
    }
  }

  private namespaceBreadcrumb(): BreadcrumbView {
    const {
      metadata: { namespace },
      onclick
    } = this.props.response
    return {
      label: namespace,
      command: onclick && onclick.namespace,
      deemphasize: true,
      className: 'kui--sidecar-entity-namespace'
    }
  }

  public render() {
    if (!this.current || !this.props.response) {
      if (this.props.onRender) {
        this.props.onRender(false)
      }
      return <div />
    } else {
      if (this.props.onRender) {
        this.props.onRender(true)
      }
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
          className={'kui--sidecar kui--inverted-color-context kui--sidecar-nested ' + this.width()}
          ref={dom => this.setState({ dom })}
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
          </div>
        </div>
      )
    } catch (err) {
      console.error(err)
    }
  }
}
