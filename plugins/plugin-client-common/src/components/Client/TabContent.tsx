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
import { eventChannelUnsafe, eventBus, Tab as KuiTab, TabState, initializeSession } from '@kui-shell/core'

import KuiContext from './context'
const Confirm = React.lazy(() => import('../Views/Confirm'))

import getSize from '../Views/Terminal/getSize'
import SessionInitStatus from './SessionInitStatus'
import ScrollableTerminal, { TerminalOptions } from '../Views/Terminal/ScrollableTerminal'
import { initializeState, MutabilityContext, MutabilityState, toggleReadOnlyBit } from './MutabilityContext'

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
}

type Props = TabContentOptions &
  WithTabUUID & {
    active: boolean
    state: TabState
    snapshot?: Buffer
    tabTitle?: string
  }

type State = Partial<WithTab> & {
  sessionInit: SessionInitStatus
  sessionInitError?: Error
  showSessionInitDone: boolean

  /** Does this tab have a bottom strip layout? */
  hasBottomStrip: boolean

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

  public constructor(props: Props) {
    super(props)

    this.state = {
      tab: React.createRef(),
      sessionInit: 'NotYet',
      showSessionInitDone: true,
      hasBottomStrip: false,
      _terminal: React.createRef(),
      mutability: initializeState(this.props.snapshot)
    }
  }

  public componentDidMount() {
    this.oneTimeInit()

    const onTabNew = () => {
      this.setState({ sessionInit: 'Done' })

      setTimeout(() => {
        if (this.state._terminal.current) {
          this.state._terminal.current.doFocusIfNeeded()
        }
      }, 300)

      try {
        if (this.props.onTabReady) {
          this.props.onTabReady(this.state.tab.current)
        }
      } catch (err) {
        console.error('Error in onTabReady', err)
      }
    }
    eventChannelUnsafe.once(`/tab/new/${this.props.uuid}`, onTabNew)
    this.cleaners.push(() => eventChannelUnsafe.off(`/tab/new/${this.props.uuid}`, onTabNew))

    const onError = (sessionInitError: Error) => {
      this.setState({ sessionInit: 'Error', sessionInitError })
    }
    eventChannelUnsafe.on(`/tab/new/error/${this.props.uuid}`, onError)
    this.cleaners.push(() => eventChannelUnsafe.off(`/tab/new/error/${this.props.uuid}`, onError))

    const onOffline = this.onOffline.bind(this)
    eventBus.onWithTabId('/tab/offline', this.props.uuid, onOffline)
    this.cleaners.push(() => eventBus.offWithTabId('/tab/offline', this.props.uuid, onOffline))

    const onEditToggle = this.toggleEditMode
    eventBus.onWithTabId('/kui/tab/edit/toggle', this.props.uuid, onEditToggle)
    this.cleaners.push(() => eventBus.offWithTabId('/kui/tab/edit/toggle', this.props.uuid, onEditToggle))
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
    eventChannelUnsafe.emit(`/tab/new/error/${uuid}`, sessionInitError)
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
            eventBus.emit('/tab/new', state.tab.current)
            eventChannelUnsafe.emit(`/tab/new/${props.uuid}`, state.tab.current)
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
    }
  }

  public componentWillUnmount() {
    eventBus.emit('/tab/close', this.state.tab.current)
    this.cleaners.forEach(cleaner => cleaner())
  }

  private defaultLoading() {
    // this is a failsafe
    return 'Please wait while we connect to your cluster'
  }

  /** Enter/exit mode where one split is displayed along the bottom */
  private readonly _toggleBottomStripMode = () =>
    this.setState(curState => ({ hasBottomStrip: !curState.hasBottomStrip }))

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
              ref={this.state._terminal}
              hasBottomStrip={this.state.hasBottomStrip}
              willToggleBottomStripMode={this._toggleBottomStripMode}
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
    if (this.state.sessionInit !== 'Done') {
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

  private graft(node: React.ReactNode | {}, key?: number) {
    if (React.isValidElement(node)) {
      // ^^^ this check avoids tsc errors
      return React.cloneElement(node, {
        key,
        uuid: this.props.uuid,
        active: this.props.active
      })
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
      (this.props.active ? ' visible' : '') +
      (!this.state.tabClassList ? '' : ' ' + Object.keys(this.state.tabClassList).join(' '))
    )
  }

  private body() {
    if (!this.props.active && !this._firstRenderDone) {
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
    this.activateHandlers.forEach(handler => handler(this.props.active))

    return (
      <MutabilityContext.Provider value={this.state.mutability}>
        <div
          ref={this.state.tab}
          className={this.tabClassName()}
          data-tab-id={this.props.uuid}
          data-has-bottom-strip={this.state.hasBottomStrip || undefined}
        >
          {this.body()}
        </div>
      </MutabilityContext.Provider>
    )
  }
}
