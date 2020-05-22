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
import { eventChannelUnsafe, eventBus, Tab as KuiTab, TabState, initializeSession, i18n } from '@kui-shell/core'

import Icons from '../spi/Icons'
import KuiContext from './context'
import Confirm from '../Views/Confirm'
import Loading from '../Content/Loading'
import Width from '../Views/Sidecar/width'
import WatchPane, { Height } from '../Views/WatchPane'
import ScrollableTerminal, { TerminalOptions } from '../Views/Terminal/ScrollableTerminal'

import '../../../web/css/static/split-pane.scss'

type Cleaner = () => void

const strings = i18n('client')

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

  primaryHeight: Height
  watchPaneHasContent: boolean

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
      watchPaneHasContent: false,
      primaryHeight: Height.NotSplit,
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
    const firstCommandIsExecuted = `/command/start/fromuser/${this.props.uuid}`
    eventChannelUnsafe.once(firstCommandIsExecuted, () => {
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

        TabContent.hackResizer(state)

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
  private static hackResizer(state: State) {
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
  }

  public componentWillUnmount() {
    eventBus.emit('/tab/close', this.state.tab)
    this.cleaners.forEach(cleaner => cleaner())
  }

  private defaultLoading() {
    return <Loading description={strings('Please wait while we connect to your cloud')} />
  }

  private sessionInitDoneMessage() {
    return (
      this.state.showSessionInitDone &&
      this.state.sidecarWidth === Width.Closed && (
        <KuiContext.Consumer>
          {config =>
            config.loadingDone && (
              <div className="kui--repl-message kui--session-init-done">
                <span className="repl-block">{config.loadingDone(this.state.tab.REPL)}</span>
              </div>
            )
          }
        </KuiContext.Consumer>
      )
    )
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
          {this.sessionInitDoneMessage()}
          <ScrollableTerminal
            {...this.props}
            tab={this.state.tab}
            sidecarIsVisible={this.state.sidecarWidth !== Width.Closed}
            closeSidecar={() => this.setState({ sidecarWidth: Width.Closed })}
            onClear={() => {
              this.setState({ showSessionInitDone: false })
            }}
            ref={c => {
              // so that we can refocus/blur
              this._terminal = c
            }}
          />
        </React.Fragment>
      )
    }
  }

  private onWillChangeSize(desiredWidth: Width) {
    this.setState(curState => {
      const sidecarWidth = desiredWidth
      const watchPaneOpen = curState.primaryHeight === Height.Split

      const activeView =
        sidecarWidth === Width.Closed
          ? watchPaneOpen
            ? 'TerminalPlusWatcher'
            : 'TerminalOnly'
          : watchPaneOpen
          ? 'TerminalSidecarWatcher'
          : 'TerminalPlusSidecar'

      return {
        sidecarHasContent: true,
        sidecarWidth,
        priorSidecarWidth: curState.sidecarWidth,
        activeView
      }
    })
  }

  private show(activeView: CurrentlyShowing) {
    this.setState(curState => {
      const showSidecar = activeView === 'TerminalPlusSidecar' || activeView === 'TerminalSidecarWatcher'
      const showWatchPane = activeView === 'TerminalPlusWatcher' || activeView === 'TerminalSidecarWatcher'

      const sidecarWidth = showSidecar ? Width.Split60 : Width.Closed
      const primaryHeight = showWatchPane ? Height.Split : Height.NotSplit

      return { sidecarWidth, activeView, priorSidecarWidth: curState.sidecarWidth, primaryHeight }
    })
  }

  private openWatchPane() {
    const notWatching = this.state.activeView === 'TerminalOnly' || this.state.activeView === 'TerminalPlusSidecar'

    if (notWatching) {
      this.setState(curState => {
        const sidecarClosed = curState.sidecarWidth === Width.Closed

        return {
          activeView: sidecarClosed ? 'TerminalPlusWatcher' : 'TerminalSidecarWatcher',
          watchPaneHasContent: true,
          primaryHeight: Height.Split
        }
      })
    }
  }

  private closeWatchPane() {
    this.setState(curState => {
      return {
        activeView: curState.activeView === 'TerminalSidecarWatcher' ? 'TerminalPlusSidecar' : 'TerminalOnly',
        watchPaneHasContent: false,
        primaryHeight: Height.NotSplit
      }
    })
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
              {this.topDownSplit()}
            </div>
            {this.bottom()}
          </div>
          {this.state.tab && <Confirm tab={this.state.tab} uuid={this.props.uuid} />}
        </div>

        {this.topTabButtons()}
      </React.Fragment>
    )
  }

  /**
   *  Terminal | Sidecar
   *  ------------------
   *      WatchPane
   */
  private topDownSplit() {
    return (
      <SplitPane
        split="horizontal"
        allowResize={false}
        size={this.state.primaryHeight}
        className={this.state.primaryHeight === Height.NotSplit ? 'kui--watch-pane-closed' : undefined}
      >
        {this.leftRightSplit()}
        <WatchPane
          uuid={this.props.uuid}
          tab={this.state.tab}
          openWatchPane={this.openWatchPane.bind(this)}
          closeWatchPane={this.closeWatchPane.bind(this)}
        />
      </SplitPane>
    )
  }

  /**
   * [ Terminal | Sidecar ]
   */
  private leftRightSplit() {
    return (
      <SplitPane
        ref={c => {
          this.setState({ splitPaneImpl: c })
        }}
        split="vertical"
        resizerStyle={this.state.sidecarWidth === Width.Maximized && { display: 'none' }}
        minSize={0}
        className={this.state.sidecarWidth === Width.Closed ? 'kui--sidecar-closed' : undefined}
        size={this.state.sidecarWidth}
        style={{ height: 'inherit' }} // otherwise; height will be 100% and watch pane will be hidden
        primary="second"
      >
        {this.terminal()}
        {this.children()}
      </SplitPane>
    )
  }

  /**
   * Buttons that are placed in the TopTabStripe and which controller
   * the visibility of various views.
   */
  protected topTabButtons() {
    if (this.props.active && (this.state.sidecarHasContent || this.state.watchPaneHasContent)) {
      const buttonNum = this.state.sidecarHasContent && this.state.watchPaneHasContent ? 4 : 2

      return (
        <div
          id="kui--custom-top-tab-stripe-button-container"
          num-button={buttonNum} // helps with css to calculate the right position of the container
          className="kui--hide-in-narrower-windows" // re: kui--hide-in-narrower-windows, see https://github.com/IBM/kui/issues/4459
        >
          <Icons
            icon="TerminalOnly"
            data-mode="show only terminal"
            data-active={this.state.activeView === 'TerminalOnly' || undefined}
            onClick={this.state.activeView !== 'TerminalOnly' ? () => this.show('TerminalOnly') : undefined}
          />

          {this.state.sidecarHasContent && (
            <Icons
              icon="TerminalPlusSidecar"
              data-mode="show terminal and sidecar"
              data-active={this.state.activeView === 'TerminalPlusSidecar' || undefined}
              onClick={
                this.state.activeView !== 'TerminalPlusSidecar' ? () => this.show('TerminalPlusSidecar') : undefined
              }
            />
          )}

          {this.state.watchPaneHasContent && (
            <Icons
              icon="TerminalPlusWatcher"
              data-mode="show terminal and watcher"
              data-active={this.state.activeView === 'TerminalPlusWatcher' || undefined}
              onClick={
                this.state.activeView !== 'TerminalPlusWatcher' ? () => this.show('TerminalPlusWatcher') : undefined
              }
            />
          )}

          {this.state.watchPaneHasContent && this.state.sidecarHasContent && (
            <Icons
              icon="TerminalSidecarWatcher"
              data-mode="show terminal sidecar and watcher"
              data-active={this.state.activeView === 'TerminalSidecarWatcher' || undefined}
              onClick={
                this.state.activeView !== 'TerminalSidecarWatcher'
                  ? () => this.show('TerminalSidecarWatcher')
                  : undefined
              }
            />
          )}
        </div>
      )
    }
  }
}
