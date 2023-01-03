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
import { Capabilities, Events, Tab as KuiTab, TabState, initializeSession, pexecInCurrentTab } from '@kui-shell/core'

import KuiContext from './context'
const Confirm = React.lazy(() => import('../Views/Confirm'))

import getSize from '../Views/Terminal/getSize'
import SessionInitStatus from './SessionInitStatus'
import ScrollableTerminal, { TerminalOptions } from '../Views/Terminal/ScrollableTerminal'
import {
  initializeState,
  MutabilityContext,
  MutabilityState,
  toggleReadOnlyBit,
  setReadOnlyBit
} from './MutabilityContext'

type Cleaner = () => void

interface WithTabUUID {
  uuid: string
}

interface WithTab<T extends KuiTab | React.RefObject<KuiTab> = React.RefObject<KuiTab>> {
  tab: T
  tabClassList: Record<string, boolean>
}

export type TabContentOptions = TerminalOptions & {
  /** [Optional] elements to be placed below the Terminal */
  bottom?: React.ReactElement<WithTabUUID & WithTab<KuiTab>>

  onTabReady?: (tab: KuiTab) => void

  willSetTitle?: (uuid: string, title: string) => void
}

type Props = TabContentOptions &
  WithTabUUID &
  React.PropsWithChildren<{
    active: boolean
    state: TabState
    tabTitle?: string
    initialCommandLine?: string
  }>

type State = Partial<WithTab> & {
  active: boolean
  sessionInit: SessionInitStatus
  sessionInitError?: Error
  showSessionInitDone: boolean

  /** Terminal readiness */
  isTerminalReady: boolean

  /** Does this tab have a left strip layout? */
  hasLeftStrip: boolean

  /** Does this tab have a right strip layout? */
  hasRightStrip: boolean

  /** grab a ref (below) so that we can maintain focus */
  _terminal: React.RefObject<ScrollableTerminal>
  mutability: MutabilityState
}

/**
 *
 * TabContent
 * ----------------  <Tab/> from here down
 * | ST  |        |
 * |     |        |
 * |     |        |
 * |     |        |
 * |     |        |
 * |     |        |
 * ----------------
 *  ST: <ScrollableTerminal/>
 *
 */
export default class TabContent extends React.PureComponent<Props, State> {
  private _firstRenderDone = false

  private readonly cleaners: Cleaner[] = []

  /** switching back or away from this tab */
  private activateHandlers: ((isActive: boolean) => void)[] = []

  private readonly toggleEditMode = () => {
    this.setState(state => ({
      mutability: toggleReadOnlyBit(state.mutability)
    }))
  }

  private readonly setEditMode = (value: boolean) => () => {
    this.setState(state => ({
      mutability: setReadOnlyBit(state.mutability, value)
    }))
  }

  public constructor(props: Props) {
    super(props)

    this.state = {
      active: props.active,
      tab: React.createRef(),
      sessionInit: 'NotYet',
      showSessionInitDone: true,
      isTerminalReady: false,
      hasLeftStrip: false,
      hasRightStrip: false,
      _terminal: React.createRef(),
      mutability: initializeState()
    }
  }

  public static getDerivedStateFromProps(props: Props, state: State) {
    const isNowActive = props.active
    const isCurrentlyActive = state.active
    state.active = props.active

    if (isNowActive && !isCurrentlyActive) {
      // see https://github.com/kubernetes-sigs/kui/issues/8208
      TabContent.delayedFocus(state, 0)
    }

    return state
  }

  public static delayedFocus(state: State, delayMillis = 300) {
    if (state.active) {
      setTimeout(() => {
        if (state.active && state._terminal.current) {
          state._terminal.current.doFocusIfNeeded()
        }
      }, delayMillis)
    }
  }

  /**
   * This method fires `this.props.onTabReady` after *both* the tab is
   * ready and the terminal is ready.
   */
  private maybeFireTabReady(isTabReady: boolean, isTerminalReady: boolean) {
    try {
      if (this.props.onTabReady && isTabReady && isTerminalReady) {
        this.props.onTabReady(this.state.tab.current)
      }
    } catch (err) {
      console.error('Error in onTabReady', err)
    }
  }

  public componentDidMount() {
    const onTabNew = () => {
      this.setState({ sessionInit: 'Done' })
      TabContent.delayedFocus(this.state)
      this.maybeFireTabReady(true, this.state.isTerminalReady)
    }

    Events.eventChannelUnsafe.once(`/tab/new/${this.props.uuid}`, onTabNew)
    this.cleaners.push(() => Events.eventChannelUnsafe.off(`/tab/new/${this.props.uuid}`, onTabNew))

    const onError = (sessionInitError: Error) => {
      this.setState({ sessionInit: 'Error', sessionInitError })
    }
    Events.eventChannelUnsafe.on(`/tab/new/error/${this.props.uuid}`, onError)
    this.cleaners.push(() => Events.eventChannelUnsafe.off(`/tab/new/error/${this.props.uuid}`, onError))

    const onOffline = this.onOffline.bind(this)
    Events.eventBus.onWithTabId('/tab/offline', this.props.uuid, onOffline)
    this.cleaners.push(() => Events.eventBus.offWithTabId('/tab/offline', this.props.uuid, onOffline))

    Events.eventBus.onWithTabId('/kui/tab/edit/toggle', this.props.uuid, this.toggleEditMode)
    this.cleaners.push(() => Events.eventBus.offWithTabId('/kui/tab/edit/toggle', this.props.uuid, this.toggleEditMode))

    const onEditSet = this.setEditMode(true)
    Events.eventBus.onWithTabId('/kui/tab/edit/set', this.props.uuid, onEditSet)
    this.cleaners.push(() => Events.eventBus.offWithTabId('/kui/tab/edit/set', this.props.uuid, onEditSet))

    const onEditUnset = this.setEditMode(false)
    Events.eventBus.onWithTabId('/kui/tab/edit/unset', this.props.uuid, onEditUnset)
    this.cleaners.push(() => Events.eventBus.offWithTabId('/kui/tab/edit/unset', this.props.uuid, onEditUnset))

    this.oneTimeInit()
    this.execCommand()
  }

  private execCommand() {
    if (this.props.initialCommandLine) {
      setTimeout(async () => {
        // execute a command onReady?
        while (true) {
          const hack = this.state.tab.current.querySelector(
            '.kui--tab-content.visible .kui--scrollback[data-position="default"]'
          )
          if (hack) {
            break
          } else {
            await new Promise(resolve => setTimeout(resolve, 500))
          }
        }

        try {
          // const quiet = tabModel.exec && tabModel.exec === 'qexec'
          pexecInCurrentTab(this.props.initialCommandLine, this.state.tab.current)
        } catch (err) {
          console.error('Error executing initial command line in new tab', err)
        }
      })
    }
  }

  private async onOffline() {
    this.setState({
      sessionInit: 'Reinit'
    })

    initializeSession(this.state.tab.current)
      .then(() => {
        this.setState({
          sessionInit: 'Done' as const
        })
      })
      .catch(TabContent.onSessionInitError.bind(undefined, this.props.uuid))
  }

  private static onSessionInitError(uuid: string, sessionInitError: Error) {
    Events.eventChannelUnsafe.emit(`/tab/new/error/${uuid}`, sessionInitError)
  }

  private oneTimeInit() {
    const { props, state } = this

    if (state.sessionInit === 'NotYet') {
      this.initTab(this.state.tab.current)

      try {
        state.tab.current.state = props.state
        // session init hook goes here
        initializeSession(state.tab.current)
          .then(() => {
            Events.eventBus.emit('/tab/new', state.tab.current)
            Events.eventChannelUnsafe.emit(`/tab/new/${props.uuid}`, state.tab.current)
          })
          .catch(TabContent.onSessionInitError.bind(undefined, props.uuid))

        // TabContent.hackResizer(state)

        return {
          sessionInit: 'InProgress'
        }
      } catch (err) {
        console.error(err)
      }
    }
  }

  private initTab(tab: KuiTab) {
    if (tab) {
      tab.uuid = this.props.uuid

      const c = tab
      tab.getSize = getSize.bind(c)
      tab.scrollToBottom = () => {
        c.scrollTop = c.scrollHeight
      }
      tab.onActivate = (handler: (isActive: boolean) => void) => {
        this.activateHandlers.push(handler)
      }
      tab.offActivate = (handler: (isActive: boolean) => void) => {
        const idx = this.activateHandlers.findIndex(_ => _ === handler)
        if (idx >= 0) {
          this.activateHandlers.splice(idx, 1)
        }
      }

      tab.addClass = (cls: string) => {
        this.setState(curState => {
          if (!curState.tabClassList || !curState.tabClassList[cls]) {
            return {
              tabClassList: Object.assign({}, curState.tabClassList, { [cls]: true })
            }
          }
        })
      }
      tab.addTopClass = tab.addClass

      tab.removeClass = (cls: string) => {
        this.setState(curState => {
          if (curState.tabClassList && curState.tabClassList[cls]) {
            const update = Object.assign({}, curState.tabClassList)
            delete update[cls]
            return {
              tabClassList: update
            }
          }
        })
      }
      tab.removeTopClass = tab.removeClass

      tab.setTitle = (title: string) => {
        if (this.props.willSetTitle) {
          this.props.willSetTitle(this.props.uuid, title)
        }
      }
    }
  }

  public componentWillUnmount() {
    Events.eventBus.emit('/tab/close', this.state.tab.current)
    this.cleaners.forEach(cleaner => cleaner())
  }

  private defaultLoading() {
    // this is a failsafe
    return 'Please wait while we connect to your cluster'
  }

  /** Reset any notion of left strip etc. */
  private readonly _resetSplitLayout = () => this.setState({ hasLeftStrip: false, hasRightStrip: false })

  /** Enter/exit mode where one split is displayed along the left */
  private readonly _toggleLeftStripMode = () => this.setState(curState => ({ hasLeftStrip: !curState.hasLeftStrip }))

  /** Enter/exit mode where one split is displayed along the right */
  private readonly _toggleRightStripMode = () => this.setState(curState => ({ hasRightStrip: !curState.hasRightStrip }))

  /** Toggle attribute on Tab DOM */
  private readonly _toggleAttribute = (attr: string) => {
    if (this.state.tab.current) {
      this.state.tab.current.toggleAttribute(attr)
    }
  }

  /** Request to clear the contents of the ScrollableTerminal */
  private readonly _onClear = () => {
    this.setState({ showSessionInitDone: false })

    // reset the status stripe on clearing of the terminal
    // eslint false positive:
    // eslint-disable-next-line react/no-direct-mutation-state
    this.state.tab.current.state.desiredStatusStripeDecoration = { type: 'default' }
  }

  /** Terminal is ready for action */
  private readonly _onTerminalReady = () => {
    this.setState({ isTerminalReady: true })
    this.maybeFireTabReady(true, this.state.sessionInit === 'Done')
  }

  private terminal() {
    if (this.state.sessionInit !== 'NotYet') {
      return (
        <KuiContext.Consumer>
          {config => (
            <ScrollableTerminal
              {...this.props}
              tab={this.state.tab.current}
              sessionInit={this.state.sessionInit}
              config={config}
              toggleAttribute={this._toggleAttribute}
              onClear={this._onClear}
              onReady={this._onTerminalReady}
              ref={this.state._terminal}
              hasLeftStrip={this.state.hasLeftStrip}
              hasRightStrip={this.state.hasRightStrip}
              willToggleLeftStripMode={this._toggleLeftStripMode}
              willToggleRightStripMode={this._toggleRightStripMode}
              resetSplitLayout={this._resetSplitLayout}
              noActiveInput={this.props.noActiveInput || !this.state.mutability.editable}
            >
              {this.children()}
            </ScrollableTerminal>
          )}
        </KuiContext.Consumer>
      )
    }
  }

  /** Use client-provided (or default) proxy disconnected notice, if warranted */
  private proxyDisconnectNotice() {
    if (Capabilities.inBrowser() && this.state.sessionInit !== 'Done') {
      return (
        <KuiContext.Consumer>
          {config => (
            <React.Suspense fallback={<div />}>
              {this.state.sessionInit === 'Error' && config.loadingError
                ? config.loadingError(this.state.sessionInitError)
                : this.state.sessionInit === 'Reinit' && config.reinit
                ? config.reinit
                : this.state.sessionInit !== 'Done' && (config.loading || this.defaultLoading())}
            </React.Suspense>
          )}
        </KuiContext.Consumer>
      )
    }
  }

  private graft(node: Props['children'], key?: number) {
    if (React.isValidElement(node)) {
      // ^^^ this check avoids tsc errors
      return React.cloneElement(
        node as React.ReactElement<{ key?: number; uuid: Props['uuid']; active: State['active'] }>,
        {
          key,
          uuid: this.props.uuid,
          active: this.state.active
        }
      )
    } else {
      return node
    }
  }

  /** Graft on the REPL focus management */
  private children() {
    if (Array.isArray(this.props.children)) {
      return this.props.children.map((child, idx) => this.graft(child, idx))
    } else {
      return this.graft(this.props.children)
    }
  }

  /** Graft on the tab uuid */
  private bottom() {
    if (React.isValidElement(this.props.bottom)) {
      // ^^^ this check avoids tsc errors
      return React.cloneElement(this.props.bottom, {
        uuid: this.props.uuid,
        tab: this.state.tab.current
      })
    } else {
      return this.props.bottom
    }
  }

  /** Construct the `className` property of the tab element */
  private tabClassName() {
    return (
      'kui--tab-content' +
      (this.state.active ? ' visible' : '') +
      (!this.state.tabClassList ? '' : ' ' + Object.keys(this.state.tabClassList).join(' '))
    )
  }

  private body() {
    if (!this.state.active && !this._firstRenderDone) {
      return <React.Fragment />
    }

    this._firstRenderDone = true

    return (
      <React.Fragment>
        <div className="kui--rows">
          {this.proxyDisconnectNotice()}
          <div className="kui--columns" style={{ position: 'relative' }}>
            {this.terminal()}
          </div>
          {this.bottom()}
        </div>
        {this.state.tab.current && (
          <React.Suspense fallback={<div />}>
            <Confirm tab={this.state.tab.current} uuid={this.props.uuid} />
          </React.Suspense>
        )}
      </React.Fragment>
    )
  }

  public render() {
    this.activateHandlers.forEach(handler => handler(this.state.active))

    return (
      <MutabilityContext.Provider value={this.state.mutability}>
        <div
          ref={this.state.tab}
          className={this.tabClassName()}
          data-tab-id={this.props.uuid}
          data-has-left-strip={this.state.hasLeftStrip || undefined}
          data-has-right-strip={this.state.hasRightStrip || undefined}
        >
          {this.body()}
        </div>
      </MutabilityContext.Provider>
    )
  }
}
