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
import { eventBus, Tab as KuiTab, TabState, initializeSession, i18n } from '@kui-shell/core'
import SplitPane from 'react-split-pane'

import Cleaner from './cleaner'
import Confirm from './Confirm'
import Loading from './Loading'
import ScrollableTerminal, { TerminalOptions } from './Terminal/ScrollableTerminal'

import '../../web/css/static/split-pane.scss'

const strings = i18n('client')

interface WithTabUUID {
  uuid: string
}

interface WithTab {
  tab: KuiTab
}

export type TabContentOptions = TerminalOptions & {
  /** Optional: elements to be placed below the Terminal */
  bottom?: React.ReactElement<WithTabUUID & WithTab>
}

type Props = TabContentOptions &
  WithTabUUID & {
    active: boolean
    state: TabState
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

  /** grab a ref (below) so that we can maintain focus */
  private _terminal: ScrollableTerminal

  public constructor(props: Props) {
    super(props)

    eventBus.once(`/tab/new/${props.uuid}`, () => this.setState({ sessionInit: 'Done' }))

    const onOffline = this.onOffline.bind(this)
    eventBus.on(`/tab/offline/${props.uuid}`, onOffline)
    this.cleaners.push(() => eventBus.off(`/tab/offline/${props.uuid}`, onOffline))

    this.state = {
      tab: undefined,
      sessionInit: 'NotYet',
      secondaryWidth: '0%'
    }
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
          eventBus.emit(`/tab/new/${props.uuid}`)
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

  /** Graft on the REPL focus management */
  private children() {
    if (React.isValidElement(this.props.children)) {
      // ^^^ this check avoids tsc errors
      return React.cloneElement(this.props.children, {
        uuid: this.props.uuid,
        willChangeSize: this.onWillChangeSize.bind(this),
        willLoseFocus: this.onWillLoseFocus.bind(this)
      })
    } else {
      return this.props.children
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

  public render() {
    return (
      <tab
        ref={c => this.setState({ tab: c as KuiTab })}
        className={this.props.active ? 'visible' : ''}
        data-tab-id={this.props.uuid}
      >
        <div className="kui--rows">
          <div className="kui--columns" style={{ position: 'relative' }}>
            <SplitPane
              ref={c => {
                this.setState({ splitPaneImpl: c })
              }}
              split="vertical"
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
      </tab>
    )
  }
}
