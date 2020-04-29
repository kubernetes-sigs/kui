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

import * as React from 'react'
import { eventChannelUnsafe, eventBus, Tab as KuiTab, TabState, initializeSession, i18n } from '@kui-shell/core'
import SplitPane from 'react-split-pane'

import Confirm from '../Views/Confirm'
import Loading from '../Content/Loading'
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
  /** Optional: elements to be placed below the Terminal */
  bottom?: React.ReactElement<WithTabUUID & WithTab>
}

type Props = TabContentOptions &
  WithTabUUID & {
    active: boolean
    state: TabState
    onTabReady?: (tab: KuiTab) => void
  }

type State = Partial<WithTab> & {
  sessionInit: 'NotYet' | 'InProgress' | 'Done'
  secondaryWidth: string

  splitPaneImpl?: SplitPane
  splitPaneImplHacked?: boolean
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
      secondaryWidth: '0%'
    }
  }

  public componentDidMount() {
    eventChannelUnsafe.once(`/tab/new/${this.props.uuid}`, () => {
      this.setState({ sessionInit: 'Done' })

      if (this.props.onTabReady) {
        this.props.onTabReady(this.state.tab)
      }
    })

    const onOffline = this.onOffline.bind(this)
    eventBus.onWithTabId('/tab/offline', this.props.uuid, onOffline)
    this.cleaners.push(() => eventBus.offWithTabId('/tab/offline', this.props.uuid, onOffline))
  }

  /* public static getDerivedStateFromProps(props: Props, state: State) {
  } */

  private onOffline() {
    this.setState({
      sessionInit: 'InProgress'
    })

    initializeSession(this.state.tab).then(() => {
      this.setState({
        sessionInit: 'Done'
      })
    })
  }

  /** emit /tab/new event, if we have now a tab, but have not yet
   * emitted the event */
  public static getDerivedStateFromProps(props: Props, state: State) {
    if (state.tab && state.sessionInit === 'NotYet') {
      try {
        state.tab.state = props.state
        initializeSession(state.tab).then(() => {
          eventBus.emit('/tab/new', state.tab)
          eventChannelUnsafe.emit(`/tab/new/${props.uuid}`)
        })

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
  }

  private terminal() {
    if (this.state.sessionInit !== 'Done') {
      return <Loading description={strings('Please wait while we connect to your cloud')} />
    } else {
      return (
        <ScrollableTerminal
          {...this.props}
          tab={this.state.tab}
          secondaryIsVisible={this.state.secondaryWidth !== '0%' && this.state.secondaryWidth !== '2em'}
          closeSecondary={() => this.setState({ secondaryWidth: '0%' })}
          ref={c => {
            // so that we can refocus/blur
            this._terminal = c
          }}
        />
      )
    }
  }

  private onWillChangeSize(secondaryWidth: string) {
    this.setState({
      secondaryWidth
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
            <SplitPane
              ref={c => {
                this.setState({ splitPaneImpl: c })
              }}
              split="vertical"
              resizerStyle={this.state.secondaryWidth === '100%' && { display: 'none' }}
              minSize={0}
              className={
                this.state.secondaryWidth === '0%'
                  ? 'kui--secondary-closed'
                  : this.state.secondaryWidth === '2em'
                  ? 'kui--secondary-minimized'
                  : undefined
              }
              size={this.state.secondaryWidth}
              primary="second"
            >
              {this.terminal()}
              {this.children()}
            </SplitPane>
          </div>

          {this.bottom()}
        </div>
        {this.state.tab && <Confirm tab={this.state.tab} uuid={this.props.uuid} />}
      </div>
    )
  }
}
