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
import sameCommand from '../util/same'
import { Tabs, Tab } from 'carbon-components-react'

import {
  eventBus,
  eventChannelUnsafe,
  Tab as KuiTab,
  ParsedOptions,
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
import ToolbarContainer from './ToolbarContainer'
import { BreadcrumbView } from '../../spi/Breadcrumb'
import { BaseSidecar, Props, SidecarHistoryEntry, cwd } from './BaseSidecar'
import KuiContext from '../../Client/context'

import '../../../../web/css/static/ToolbarButton.scss'

/** Lazily load KuiContent; see https://github.com/IBM/kui/issues/3746 */
const KuiContent = React.lazy(() => import('../../Content/KuiContent'))

const debug = Debug('plugin-sidecar/components/TopNavSidecar')

/**
 * One history entry, which is a `MultiModalResponse`, further parsed
 * out into buttons and tabs, and a pointer to the `currentTabIndex`.
 *
 */
interface HistoryEntry extends SidecarHistoryEntry {
  currentTabIndex: number

  buttons: Button[]
  tabs: Readonly<MultiModalMode[]>
  response: Readonly<MultiModalResponse>
  defaultMode: number
}

export function getStateFromMMR(
  tab: KuiTab,
  response: MultiModalResponse,
  execUUID: string,
  argvNoOptions: string[],
  parsedOptions: ParsedOptions
): HistoryEntry {
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
    execUUID,
    cwd: cwd(),
    argvNoOptions,
    parsedOptions,
    currentTabIndex: defaultMode,
    defaultMode,
    tabs,
    buttons,
    response
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
export default class TopNavSidecar extends BaseSidecar<MultiModalResponse, HistoryEntry> {
  public static contextType = KuiContext

  public constructor(props: Props) {
    super(props)

    const onResponse = this.onResponse.bind(this)
    eventBus.onMultiModalResponse(this.props.uuid, onResponse, false)
    this.cleaners.push(() => eventBus.offMultiModalResponse(this.props.uuid, onResponse))

    this.state = {
      repl: undefined,
      tab: undefined,
      dom: undefined,

      history: undefined,
      current: undefined
    }
  }

  /** Consult our History model for a match */
  protected lookupHistory(
    response: MultiModalResponse,
    argvNoOptions: string[],
    parsedOptions: ParsedOptions,
    cwd: string
  ) {
    const equals = sameCommand(argvNoOptions, parsedOptions, cwd)

    return this.state.history.findIndex((entry: HistoryEntry) => {
      return entry && response.comparator && response.comparator === entry.response.comparator
        ? response.comparator(response, entry.response)
        : equals(entry)
    })
  }

  /** @return a `HistoryEntry` for the given `Response` */
  protected getState(
    tab: KuiTab,
    response: MultiModalResponse,
    execUUID,
    argvNoOptions: string[],
    parsedOptions: ParsedOptions
  ): HistoryEntry {
    return getStateFromMMR(tab, response, execUUID, argvNoOptions, parsedOptions)
  }

  protected headerBodyStyle() {
    return { 'flex-direction': 'column' }
  }

  /** return the pretty name or unadulterated name from the response */
  private prettyName(): string {
    return (
      this.current.response &&
      (this.current.response.prettyName ||
        (this.current.response.metadata ? this.current.response.metadata.name : undefined))
    )
  }

  /** display the unadulterated name from the response as sidecar header */
  private namePart() {
    return (
      <div className="header-left-bits">
        <div className="sidecar-header-text">
          <div className="sidecar-header-name" data-base-class="sidecar-header-name">
            <div className="sidecar-header-name-content" data-base-class="sidecar-header-name-content">
              {this.context.sidecarName === 'heroText' && this.current.response && this.current.response.metadata
                ? this.current.response.metadata.name
                : undefined}
            </div>
          </div>
        </div>
      </div>
    )
  }

  /** Tell the world that we have changed the focused mode */
  private broadcastFocusChange(idx: number) {
    // de-focus the old mode
    const oldMode = this.current.tabs[this.state.current.currentTabIndex]
    eventChannelUnsafe.emit(`/mode/focus/off/tab/${this.props.uuid}/mode/${oldMode.mode}`, oldMode)

    // re-focus the new mode
    const newMode = this.current.tabs[idx]
    eventChannelUnsafe.emit(`/mode/focus/on/tab/${this.props.uuid}/mode/${newMode.mode}`, newMode)
  }

  // first div used to be sidecar-top-stripe
  private tabs() {
    return (
      <div className="zoomable full-height">
        <div className="full-height">
          <Tabs
            className="sidecar-bottom-stripe-mode-bits sidecar-bottom-stripe-button-container"
            triggerHref="#"
            selected={this.current.currentTabIndex}
            onSelectionChange={(idx: number) => {
              // tell the views that we have changed focus
              this.broadcastFocusChange(idx)

              this.setState(({ current, history }) => {
                const newCurrent = Object.assign({}, current, { currentTabIndex: idx })
                history.updateActive(newCurrent)
                return {
                  current: newCurrent
                }
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
                onMouseDown={event => event.preventDefault()}
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
    const mode = this.current.tabs[idx]

    return (
      <KuiContent
        tab={this.state.tab}
        mode={mode}
        isActive={idx === this.current.currentTabIndex}
        args={{
          argsForMode: this.current.response.argsForMode,
          argvNoOptions: this.state.current.argvNoOptions,
          parsedOptions: this.state.current.parsedOptions
        }}
        response={this.current.response}
      />
    )
  }

  private tabContent(idx: number) {
    const { toolbarText } = this.current.response

    return (
      <div className="sidecar-content-container">
        <div className="custom-content">
          <ToolbarContainer
            key={this.current.execUUID}
            tab={this.state.tab}
            response={this.current.response}
            args={{ argvNoOptions: this.state.current.argvNoOptions, parsedOptions: this.state.current.parsedOptions }}
            toolbarText={toolbarText}
            noAlerts={this.current.currentTabIndex !== this.state.current.defaultMode}
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
        return when(this.current.response)
      } catch (err) {
        debug('warning: registered badge threw an exception during filter', err)
        return false
      }
    })

    return (
      <div className="badges">
        {badges.map(({ badge }, idx) => (
          <Badge key={idx} spec={badge} tab={this.state.tab} response={this.current.response} />
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

  private kindBreadcrumb(): BreadcrumbView {
    const { kind, onclick } = this.current.response
    return { label: kind, command: onclick && onclick.kind, className: 'kui--sidecar-kind' }
  }

  /** show name as breadcrumb when not showing context as hero text in sidecar header  */
  private nameBreadcrumb(): BreadcrumbView {
    const { onclick } = this.current.response

    return {
      label: this.prettyName(),
      command: onclick && onclick.name,
      isCurrentPage: true,
      className: 'kui--sidecar-entity-name'
    }
  }

  private versionBreadcrumb(): BreadcrumbView {
    return this.current.response.version
      ? { label: this.current.response.version, className: 'kui--version-breadcrumb' }
      : undefined
  }

  private nameHashBreadcrumb(): BreadcrumbView {
    const { onclick } = this.current.response
    return {
      label: this.current.response && this.current.response.nameHash,
      command: onclick && onclick.nameHash,
      deemphasize: true,
      className: 'kui--sidecar-entity-name-hash'
    }
  }

  private namespaceBreadcrumb(): BreadcrumbView {
    const {
      metadata: { namespace },
      onclick
    } = this.current.response
    return {
      label: namespace,
      command: onclick && onclick.namespace,
      deemphasize: true,
      className: 'kui--sidecar-entity-namespace'
    }
  }

  public render() {
    if (!this.current || !this.current.response) {
      return <div />
    }

    const nameBreadCrumbs =
      this.context.sidecarName === 'breadcrumb'
        ? [this.nameBreadcrumb(), this.versionBreadcrumb(), this.nameHashBreadcrumb()]
        : []

    try {
      const breadcrumbs = [this.namespaceBreadcrumb(), this.kindBreadcrumb()].concat(nameBreadCrumbs).filter(_ => _)

      // Note: data-view helps with tests
      return (
        <div
          className={'kui--sidecar kui--inverted-color-context ' + this.width()}
          ref={dom => this.setState({ dom })}
          data-view="topnav"
        >
          {this.title({
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
