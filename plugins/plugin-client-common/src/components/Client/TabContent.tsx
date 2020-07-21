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

import SplitPane from 'react-split-pane'
import * as React from 'react'
import { eventChannelUnsafe, eventBus, Tab as KuiTab, TabState, initializeSession } from '@kui-shell/core'

import Icons from '../spi/Icons'
import KuiContext from './context'
import Confirm from '../Views/Confirm'
import { TopTabButton } from './TabModel'
import Width from '../Views/Sidecar/width'

import getSize from '../Views/Terminal/getSize'
import ScrollableTerminal, { TerminalOptions } from '../Views/Terminal/ScrollableTerminal'

import '../../../web/css/static/split-pane.scss'

type Cleaner = () => void

interface WithTabUUID {
  uuid: string
}

interface WithTab {
  tab: KuiTab
  tabClassList: Record<string, boolean>
}

export type TabContentOptions = TerminalOptions & {
  /** [Optional] elements to be placed below the Terminal */
  bottom?: React.ReactElement<WithTabUUID & WithTab>
}

type Props = TabContentOptions &
  WithTabUUID & {
    active: boolean
    state: TabState
    onTabReady?: (tab: KuiTab) => void
    willUpdateTopTabButtons?: (buttons: TopTabButton[]) => void
  }

type CurrentlyShowing = 'TerminalOnly' | 'TerminalPlusSidecar' | 'TerminalPlusWatcher' | 'TerminalSidecarWatcher'
type SessionInitStatus = 'NotYet' | 'InProgress' | 'Reinit' | 'Done' | 'Error'

type State = Partial<WithTab> & {
  sessionInit: SessionInitStatus
  sessionInitError?: Error
  showSessionInitDone: boolean

  sidecarWidth: Width
  priorSidecarWidth: Width /* prior to closing */
  sidecarHasContent: boolean

  splitPaneImpl?: SplitPane
  splitPaneImplHacked?: boolean

  activeView: CurrentlyShowing
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
  private readonly cleaners: Cleaner[] = []

  /** switching back or away from this tab */
  private activateHandlers: ((isActive: boolean) => void)[] = []

  /** grab a ref (below) so that we can maintain focus */
  private _terminal: ScrollableTerminal

  public constructor(props: Props) {
    super(props)

    this.state = {
      tab: undefined,
      sessionInit: 'NotYet',
      showSessionInitDone: true,
      sidecarWidth: Width.Closed,
      priorSidecarWidth: Width.Closed,
      sidecarHasContent: false,
      activeView: 'TerminalOnly'
    }
  }

  public componentDidMount() {
    const onTabNew = () => {
      this.setState({ sessionInit: 'Done' })

      if (this.props.onTabReady) {
        this.props.onTabReady(this.state.tab)
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

    // see https://github.com/IBM/kui/issues/4683
    eventBus.onceCommandStarts(this.props.uuid, () => {
      this.setState({ showSessionInitDone: false })
    })
  }

  private async onOffline() {
    this.setState({
      sessionInit: 'Reinit'
    })

    initializeSession(this.state.tab)
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

  /** emit /tab/new event, if we have now a tab, but have not yet
   * emitted the event */
  public static getDerivedStateFromProps(props: Props, state: State) {
    if (state.tab && state.sessionInit === 'NotYet') {
      try {
        state.tab.state = props.state
        // session init hook goes here
        initializeSession(state.tab)
          .then(() => {
            eventBus.emit('/tab/new', state.tab)
            eventChannelUnsafe.emit(`/tab/new/${props.uuid}`)
          })
          .catch(TabContent.onSessionInitError.bind(undefined, props.uuid))

        // TabContent.hackResizer(state)

        return {
          sessionInit: 'InProgress'
        }
      } catch (err) {
        console.error(err)
      }
    } else {
      return state
    }
  }

  /** Hmm, SplitPane doesn't yet allow for styling of the Resizer */
  /* private static hackResizer(state: State) {
    const resizer = state.splitPaneImpl['splitPane'].querySelector('.Resizer')
    const a = document.createElement('span')
    const b = document.createElement('span')
    const c = document.createElement('span')
    resizer.appendChild(a)
    resizer.appendChild(b)
    resizer.appendChild(c)
    a.classList.add('resizer-thumb-fill')
    c.classList.add('resizer-thumb-fill')
    b.classList.add('resizer-thumb')
  } */

  public componentWillUnmount() {
    eventBus.emit('/tab/close', this.state.tab)
    this.cleaners.forEach(cleaner => cleaner())
  }

  private defaultLoading() {
    // this is a failsafe
    return 'Please wait while we connect to your cluster'
  }

  private terminal() {
    if (this.state.sessionInit !== 'Done') {
      return (
        <KuiContext.Consumer>
          {config => {
            if (this.state.sessionInit === 'Error' && config.loadingError) {
              return config.loadingError(this.state.sessionInitError)
            } else if (this.state.sessionInit === 'Reinit' && config.reinit) {
              return config.reinit
            }

            return config.loading || this.defaultLoading()
          }}
        </KuiContext.Consumer>
      )
    } else {
      return (
        <React.Fragment>
          <KuiContext.Consumer>
            {config => (
              <ScrollableTerminal
                {...this.props}
                tab={this.state.tab}
                config={config}
                sidecarWidth={this.state.sidecarWidth}
                closeSidecar={() => this.setState({ sidecarWidth: Width.Closed })}
                onClear={() => {
                  this.setState({ showSessionInitDone: false })
                }}
                ref={c => {
                  // so that we can refocus/blur
                  this._terminal = c
                }}
              >
                {this.children()}
              </ScrollableTerminal>
            )}
          </KuiContext.Consumer>
        </React.Fragment>
      )
    }
  }

  private onWillChangeSize(desiredWidth: Width) {
    this.setState(curState => {
      eventBus.emitTabLayoutChange(curState.tab.uuid)

      const sidecarWidth = desiredWidth

      const activeView: CurrentlyShowing = sidecarWidth === Width.Closed ? 'TerminalOnly' : 'TerminalPlusSidecar'

      const newState = {
        sidecarHasContent: true,
        sidecarWidth,
        priorSidecarWidth: curState.sidecarWidth,
        activeView
      }

      this.updateTopTabButtons(newState)
      return newState
    })
  }

  private show(activeView: CurrentlyShowing) {
    this.setState(curState => {
      const showSidecar = activeView === 'TerminalPlusSidecar' || activeView === 'TerminalSidecarWatcher'
      const sidecarWidth = showSidecar ? Width.Split60 : Width.Closed

      const newState = {
        sidecarWidth,
        activeView,
        priorSidecarWidth: curState.sidecarWidth,
        sidecarHasContent: curState.sidecarHasContent
      }

      this.updateTopTabButtons(newState)
      return newState
    })
  }

  /** Switch to the given view, if we aren't already there */
  private showIfNot(desiredView: CurrentlyShowing) {
    if (this.state.activeView !== desiredView) {
      this.show(desiredView)
    }
  }

  private onWillLoseFocus() {
    if (this._terminal) {
      this._terminal.doFocus()
    }
  }

  private graft(node: React.ReactNode | {}, key?: number) {
    if (React.isValidElement(node)) {
      // ^^^ this check avoids tsc errors
      return React.cloneElement(node, {
        key,
        uuid: this.props.uuid,
        active: this.props.active,
        width: this.state.sidecarWidth,
        willChangeSize: this.onWillChangeSize.bind(this),
        willLoseFocus: this.onWillLoseFocus.bind(this)
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
        tab: this.state.tab
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

  public render() {
    this.activateHandlers.forEach(handler => handler(this.props.active))

    return (
      <React.Fragment>
        <div
          ref={c => {
            const tab = c as KuiTab
            this.setState({ tab })

            if (tab) {
              tab.uuid = this.props.uuid

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
          }}
          className={this.tabClassName()}
          data-tab-id={this.props.uuid}
        >
          <div className="kui--rows">
            <div className="kui--columns" style={{ position: 'relative' }}>
              {this.leftRightSplit()}
            </div>
            {this.bottom()}
          </div>
          {this.state.tab && <Confirm tab={this.state.tab} uuid={this.props.uuid} />}
        </div>
      </React.Fragment>
    )
  }

  /**
   * [ Terminal | Sidecar ]
   */
  private leftRightSplit() {
    return this.terminal()

    /* return (
      <SplitPane
        ref={c => {
          this.setState({ splitPaneImpl: c })
        }}
        split="vertical"
        resizerStyle={this.state.sidecarWidth === Width.Maximized && { display: 'none' }}
        minSize={0}
        className={this.state.sidecarWidth === Width.Closed ? 'kui--sidecar-closed' : undefined}
        size={this.state.sidecarWidth}
        primary="second"
      >
        {this.terminal()}
        {this.children()}
      </SplitPane>
    ) */
  }

  /**
   * If given, use the top tab button controller to provide the
   * latest button model.
   *
   */
  private updateTopTabButtons(newState: Pick<State, 'activeView' | 'sidecarHasContent'>) {
    if (this.props.willUpdateTopTabButtons) {
      this.props.willUpdateTopTabButtons([this.terminalButton(newState), this.sidecarButton(newState)].filter(_ => _))
    }
  }

  /**
   * Note how we use the argument `state` to initialize things, but we
   * intentionally use this.state in the onClick. The onClick handler
   * may be invoked after any number of onClicks in this or other
   * buttons. So it must pay attention to the *current* state, not the
   * state at the time of creation.
   *
   */
  private terminalButton(state: Pick<State, 'activeView'>): TopTabButton {
    const key = 'show only terminal'

    return {
      icon: (
        <Icons
          icon="TerminalOnly"
          key={key}
          data-mode={key}
          data-active={state.activeView === 'TerminalOnly' || undefined}
          onClick={this.showIfNot.bind(this, 'TerminalOnly')}
        />
      )
    }
  }

  /** Caution: see the Note for this.terminalButton, re: `state` versus `this.state` */
  private sidecarButton(state: Pick<State, 'activeView' | 'sidecarHasContent'>): TopTabButton {
    if (state.sidecarHasContent) {
      const key = 'show terminal and sidecar'

      return {
        icon: (
          <Icons
            icon="TerminalPlusSidecar"
            key={key}
            data-mode={key}
            data-active={state.activeView === 'TerminalPlusSidecar' || undefined}
            onClick={this.showIfNot.bind(this, 'TerminalPlusSidecar')}
          />
        )
      }
    }
  }
}
