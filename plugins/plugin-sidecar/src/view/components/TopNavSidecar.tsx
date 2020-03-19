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

import Width from './width'
import Badge from './Badge'
import ToolbarContainer from './ToolbarContainer'
import { BaseHistoryEntry, BaseSidecar, Props } from './BaseSidecar'

import 'carbon-components/scss/components/tabs/_tabs.scss'

/** Lazily load KuiContent; see https://github.com/IBM/kui/issues/3746 */
const KuiContent = React.lazy(() => import('./KuiContent'))

const debug = Debug('plugin-sidecar/components/TopNavSidecar')

/**
 * One history entry, which is a `MultiModalResponse`, further parsed
 * out into buttons and tabs, and a pointer to the `currentTabIndex`.
 *
 */
interface HistoryEntry extends BaseHistoryEntry {
  currentTabIndex: number

  buttons: Button[]
  tabs: Readonly<MultiModalMode[]>
  response: Readonly<MultiModalResponse>
}

export function getStateFromMMR(
  tab: KuiTab,
  response: MultiModalResponse,
  argvNoOptions: string[],
  parsedOptions: ParsedOptions
): HistoryEntry {
  let allModes = response.modes.slice(0)

  // consult the view registrar for registered view modes
  // relevant to this resource
  const command = ''
  if (isResourceWithMetadata(response)) {
    addRelevantModes(tab, allModes, command, { resource: response })
  } else if (isResourceByReference(response)) {
    addRelevantModes(tab, allModes, command, response)
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
    argvNoOptions,
    parsedOptions,
    currentTabIndex: defaultMode,
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
  public constructor(props: Props) {
    super(props)

    const channel = '/command/complete/fromuser/MultiModalResponse'
    const onResponse = this.onResponse.bind(this)
    eventBus.on(channel, onResponse)
    this.cleaners.push(() => eventBus.off(channel, onResponse))

    this.state = {
      repl: undefined,
      tab: undefined,
      width: Width.Default,

      history: undefined,
      current: undefined
    }
  }

  /** @return a `HistoryEntry` for the given `Response` */
  protected getState(
    tab: KuiTab,
    response: MultiModalResponse,
    argvNoOptions: string[],
    parsedOptions: ParsedOptions
  ): HistoryEntry {
    return getStateFromMMR(tab, response, argvNoOptions, parsedOptions)
  }

  protected headerBodyStyle() {
    return { 'flex-direction': 'column' }
  }

  private nameHash() {
    const { nameHash } = this.current.response

    if (nameHash) {
      const onclick = this.current.response.onclick && this.current.response.onclick.nameHash
      return (
        <span
          className={'entity-name-hash' + (onclick ? ' clickable' : '')}
          onClick={onclick && (() => this.state.repl.pexec(onclick))}
        >
          {nameHash}
        </span>
      )
    }
  }

  private name() {
    const onclick = this.current.response.onclick && this.current.response.onclick.name
    return (
      <div className="entity-name-line">
        <span
          className={'entity-name' + (onclick ? ' clickable' : '')}
          onClick={onclick && (() => this.state.repl.pexec(onclick))}
        >
          {this.current.response.metadata.name}
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
            selected={this.current.currentTabIndex}
            onSelectionChange={(idx: number) =>
              this.setState(({ current }) => ({
                current: Object.assign({}, current, { currentTabIndex: idx })
              }))
            }
          >
            {this.current.tabs.map((mode: MultiModalMode, idx: number) => (
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
    return (
      <KuiContent
        key={this.state.history.key}
        tab={this.state.tab}
        mode={this.current.tabs[idx]}
        args={{ argvNoOptions: this.state.current.argvNoOptions, parsedOptions: this.state.current.parsedOptions }}
        response={this.current.response}
      />
    )
  }

  private tabContent(idx: number) {
    const { toolbarText } = this.current.response

    return (
      <div className="sidecar-content-container">
        <div className="custom-content zoomable">
          <ToolbarContainer
            tab={this.state.tab}
            response={this.current.response}
            args={{ argvNoOptions: this.state.current.argvNoOptions, parsedOptions: this.state.current.parsedOptions }}
            toolbarText={toolbarText}
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

  public render() {
    if (!this.current || !this.current.response) {
      return <div />
    }
    try {
      const {
        kind,
        metadata: { namespace },
        onclick
      } = this.current.response
      const onClickNamespace = onclick && onclick.namespace && (() => this.state.repl.pexec(onclick.namespace))

      return (
        <div
          className={'kui--sidecar kui--inverted-color-context kui--screenshotable ' + this.width()}
          data-view="topnav"
        >
          {/* data-view helps with tests */}
          {this.title({
            kind,
            namespace,
            name:
              this.current.response && this.current.response.metadata ? this.current.response.metadata.name : undefined,
            onClickNamespace
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
