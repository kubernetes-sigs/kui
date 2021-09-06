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
import ScrollableTerminal, { TerminalOptions } from '../Views/Terminal/ScrollableTerminal'

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

type SessionInitStatus = 'NotYet' | 'InProgress' | 'Reinit' | 'Done' | 'Error'

type State = Partial<WithTab> & {
  sessionInit: SessionInitStatus
  sessionInitError?: Error
  showSessionInitDone: boolean

  /** grab a ref (below) so that we can maintain focus */
  _terminal: React.RefObject<ScrollableTerminal>
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

  public constructor(props: Props) {
    super(props)

    this.state = {
      tab: React.createRef(),
      sessionInit: 'NotYet',
      showSessionInitDone: true,
      _terminal: React.createRef()
    }
  }

  public componentDidMount() {
    this.oneTimeInit()

    const onTabNew = () => {
      this.setState({ sessionInit: 'Done' })

      setTimeout(() => {
        this.state._terminal.current.doFocusIfNeeded()
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
                tab={this.state.tab.current}
                config={config}
                toggleAttribute={this._toggleAttribute}
                onClear={this._onClear}
                ref={this.state._terminal}
              >
                {this.children()}
              </ScrollableTerminal>
            )}
          </KuiContext.Consumer>
        </React.Fragment>
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

  public render() {
    this.activateHandlers.forEach(handler => handler(this.props.active))

    return (
      <React.Fragment>
        <div ref={this.state.tab} className={this.tabClassName()} data-tab-id={this.props.uuid}>
          <div className="kui--rows">
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
        </div>
      </React.Fragment>
    )
  }
}
